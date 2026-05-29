const { Etudiant, Inscription, Annee, sequelize } = require('../database/models');
const academicClient = require('../clients/academicClient');

/**
 * Génère matricule distribute: 26INFM10001
 */
const genererMatricule = async (filiere, niveau, id_niveau, id_annee) => {
  const annee = new Date().getFullYear().toString().slice(-2); // 26
  const codeDept = filiere.substring(0, 3).toUpperCase(); // INF
  const codeNiveau = niveau; // M1

  // Compte direct sur les inscriptions du même niveau et année académique
  const count = await Inscription.count({
    where: {
      id_niveau,
      id_annee
    }
  });

  const numero = String(count + 1).padStart(4, '0'); // 0001
  return `${annee}${codeDept}${codeNiveau}${numero}`;
};

exports.creerInscription = async ({ nom, prenom, email, filiere, niveau }) => {
  const t = await sequelize.transaction();
  try {
    // 1. Appel synchrone vers Academic Service pour valider et récupérer la hiérarchie
    console.log(`[Student Service] Validation académique pour filiere=${filiere}, niveau=${niveau}`);
    
    let academicData;
    try {
      const response = await academicClient.get('/api/academic/internal/validate-hierarchy', {
        params: { filiere, niveau }
      });
      academicData = response.data.data; // { id_departement, id_niveau, nom_dept, libelle_niveau }
    } catch (apiError) {
      console.error('❌ Erreur de communication académique:', apiError.message);
      throw new Error(`Service Académique injoignable ou validation incorrecte : ${apiError.message}`);
    }

    if (!academicData || !academicData.id_niveau) {
      throw new Error(`Filière ${filiere} ou Niveau ${niveau} introuvable dans le catalogue académique.`);
    }

    // 2. Année académique courante (2025-2026)
    const anneeObj = await Annee.findOne({
      where: { libelle_annee: '2025-2026' }
    });
    if (!anneeObj) {
      throw new Error('Année académique "2025-2026" non configurée dans la base de scolarité.');
    }

    // 3. Trouver ou Créer l'étudiant
    const [etudiantObj] = await Etudiant.findOrCreate({
      where: { email },
      defaults: { nom_etud: nom, prenom_etud: prenom, email },
      transaction: t
    });

    // 4. Générer le matricule UY1
    const matricule = await genererMatricule(
      filiere,
      niveau,
      academicData.id_niveau,
      anneeObj.id_annee
    );

    // 5. Créer l'inscription administrative
    const inscription = await Inscription.create({
      matricule,
      id_etudiant: etudiantObj.id_etudiant,
      id_annee: anneeObj.id_annee,
      id_niveau: academicData.id_niveau
    }, { transaction: t });

    await t.commit();

    return {
      id_inscription: inscription.id_inscription,
      matricule: inscription.matricule,
      date_inscription: inscription.date_inscription,
      statut_paiement: inscription.statut_paiement,
      etudiant: etudiantObj,
      academic: {
        filiere,
        niveau,
        id_niveau: academicData.id_niveau
      },
      annee: anneeObj.libelle_annee
    };

  } catch (err) {
    await t.rollback();
    throw err;
  }
};

exports.getInscriptions = async (filtres = {}) => {
  // Récupération standard filtrée par ID externes
  const where = {};
  if (filtres.id_niveau) where.id_niveau = filtres.id_niveau;
  if (filtres.id_annee) where.id_annee = filtres.id_annee;

  return Inscription.findAll({
    where,
    include: [Etudiant, Annee]
  });
};

exports.getInscriptionById = async (id) => {
  return Inscription.findByPk(id, {
    include: [Etudiant, Annee]
  });
};

exports.supprimerInscription = async (id) => {
  const ins = await Inscription.findByPk(id);
  if (!ins) {
    throw new Error('Inscription introuvable');
  }
  await ins.destroy();
  return { success: true, message: 'Inscription supprimée avec succès' };
};

exports.updateStatutPaiement = async (id_inscription, statut) => {
  const ins = await Inscription.findByPk(id_inscription);
  if (!ins) {
    throw new Error('Inscription introuvable');
  }
  ins.statut_paiement = statut;
  await ins.save();
  return ins;
};
