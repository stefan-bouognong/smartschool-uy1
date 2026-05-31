const { Etablissement, Departement, Niveau, UE, Enseignant, Note } = require('../database/models');
const studentClient = require('../clients/studentClient');

// ─── VALIDATION INTERNE DE LA HIÉRARCHIE ───────────────────────────────────
exports.validateHierarchy = async (filiere, niveau) => {
  const dept = await Departement.findOne({
    where: { nom_dept: filiere }
  });
  if (!dept) return null;

  const niv = await Niveau.findOne({
    where: {
      libelle_niveau: niveau,
      id_departement: dept.id_departement
    }
  });
  if (!niv) return null;

  return {
    id_departement: dept.id_departement,
    id_niveau: niv.id_niveau,
    nom_dept: dept.nom_dept,
    libelle_niveau: niv.libelle_niveau
  };
};

exports.syncStudentToScolarite = async (studentData) => {
  try {
    const response = await studentClient.post('/api/scolarite/internal/etudiants', studentData);
    return response.data;
  } catch (err) {
    console.error('❌ Erreur de communication avec le service Scolarité :', err.response?.data || err.message);
    throw new Error(`Échec de la synchronisation vers Scolarité : ${err.response?.data?.error || err.message}`);
  }
};

// ─── CRUDS DES NOTES D'EXAMENS ──────────────────────────────────────────────
exports.creerNote = async (donneesNote) => {
  if (donneesNote.valeur_note === undefined || donneesNote.valeur_note === null) {
    throw new Error('La valeur de la note est requise');
  }

  const valeurNote = Number(donneesNote.valeur_note);
  if (Number.isNaN(valeurNote) || valeurNote < 0 || valeurNote > 20) {
    throw new Error('La note doit être un nombre réel entre 0 et 20');
  }

  if (!donneesNote.id_inscription || !donneesNote.id_UE || !donneesNote.id_enseignant) {
    throw new Error('id_inscription, id_UE et id_enseignant sont requis');
  }

  return Note.create({
    valeur_note: valeurNote,
    session: donneesNote.session || 'Normale',
    date_examen: donneesNote.date_examen || new Date(),
    id_inscription: donneesNote.id_inscription, // Clé logique externe
    id_UE: donneesNote.id_UE,
    id_enseignant: donneesNote.id_enseignant
  });
};

exports.obtenirNotes = async (filtres = {}) => {
  const condition = {};
  if (filtres.id_inscription) condition.id_inscription = filtres.id_inscription;
  if (filtres.id_UE) condition.id_UE = filtres.id_UE;
  if (filtres.id_enseignant) condition.id_enseignant = filtres.id_enseignant;

  return Note.findAll({
    where: condition,
    include: [
      { model: UE, attributes: ['id_UE', 'code_UE', 'libelle_UE', 'credits_ECTS'] },
      { model: Enseignant, attributes: ['id_enseignant', 'nom_ens', 'prenom_ens'] }
    ],
    order: [['date_examen', 'DESC']]
  });
};

exports.obtenirNoteParId = async (id) => {
  return Note.findByPk(id, {
    include: [
      { model: UE, attributes: ['id_UE', 'code_UE', 'libelle_UE', 'credits_ECTS'] },
      { model: Enseignant, attributes: ['id_enseignant', 'nom_ens', 'prenom_ens'] }
    ]
  });
};

exports.obtenirMoyennePourUE = async (id_UE) => {
  const notes = await Note.findAll({ where: { id_UE } });
  if (!notes.length) return null;

  const somme = notes.reduce((acc, note) => acc + Number(note.valeur_note), 0);
  return Number((somme / notes.length).toFixed(2));
};

// ─── CRUDS INFRASTRUCTURE (ADMINISTRATIFS) ──────────────────────────────────
exports.getAllEtablissements = () => Etablissement.findAll();
exports.createEtablissement = (data) => Etablissement.create(data);
exports.updateEtablissement = async (id, data) => {
  const etab = await Etablissement.findByPk(id);
  return etab ? etab.update(data) : null;
};
exports.deleteEtablissement = async (id) => {
  const etab = await Etablissement.findByPk(id);
  if (!etab) return false;
  await etab.destroy();
  return true;
};

exports.getAllDepartements = () => Departement.findAll({ include: [Etablissement] });
exports.createDepartement = async (data) => {
  if (data.id_etablissement) {
    const etab = await Etablissement.findByPk(data.id_etablissement);
    if (!etab) throw new Error('Établissement parent introuvable');
  }
  return Departement.create(data);
};

exports.getAllNiveaux = () => Niveau.findAll({ include: [Departement] });
exports.createNiveau = async (data) => {
  if (data.id_departement) {
    const dept = await Departement.findByPk(data.id_departement);
    if (!dept) throw new Error('Département parent introuvable');
  }
  return Niveau.create(data);
};

exports.getAllUEs = () => UE.findAll({ include: [Niveau] });
exports.createUE = async (data) => {
  if (data.id_niveau) {
    const niv = await Niveau.findByPk(data.id_niveau);
    if (!niv) throw new Error('Niveau parent introuvable');
  }
  return UE.create(data);
};

exports.getAllEnseignants = () => Enseignant.findAll();
exports.createEnseignant = (data) => Enseignant.create(data);
