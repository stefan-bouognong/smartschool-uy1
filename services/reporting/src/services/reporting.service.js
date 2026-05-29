const { studentClient, academicClient, financeClient } = require('../clients');

// ─── Barème officiel UY1 (Note/100 → Cote → Qualité points) ─────────────────

const BAREME = [
  { min: 80, max: 100, cote: 'A',  points: 4.0, mention: 'Très bien' },
  { min: 75, max: 79,  cote: 'A-', points: 3.7, mention: 'Bien' },
  { min: 70, max: 74,  cote: 'B+', points: 3.3, mention: 'Bien' },
  { min: 65, max: 69,  cote: 'B',  points: 3.0, mention: 'Assez Bien' },
  { min: 60, max: 64,  cote: 'B-', points: 2.7, mention: 'Assez Bien' },
  { min: 55, max: 59,  cote: 'C+', points: 2.3, mention: 'Passable' },
  { min: 50, max: 54,  cote: 'C',  points: 2.0, mention: 'Passable' },
  { min: 45, max: 49,  cote: 'C-', points: 1.7, mention: 'Crédits capitalisés mais non transférable' },
  { min: 40, max: 44,  cote: 'D+', points: 1.3, mention: 'Crédits capitalisés mais non transférable' },
  { min: 35, max: 39,  cote: 'D',  points: 1.0, mention: 'Crédits capitalisés mais non transférable' },
  { min: 30, max: 34,  cote: 'E',  points: 0.0, mention: 'Échec' },
  { min: 0,  max: 29,  cote: 'F',  points: 0.0, mention: 'Échec' },
];

// ─── Logique métier : barème ─────────────────────────────────────────────────

function getGradeInfo(noteSur100) {
  const grade = BAREME.find(g => noteSur100 >= g.min && noteSur100 <= g.max);
  return grade || { cote: 'F', points: 0.0, mention: 'Échec' };
}

function getDecision(noteSur100) {
  if (noteSur100 >= 50) return 'CA';
  if (noteSur100 >= 35) return 'CANT';
  return 'NC';
}

function computeAverage(mgp) {
  return (mgp * 20) / 4;
}

function normalizeNumber(value) {
  return typeof value === 'number' && !Number.isNaN(value) ? value : 0;
}

function computeSummary(notes) {
  let totalPointsPonderes = 0;
  let totalCredits = 0;
  let creditsCapitalises = 0;

  notes.forEach(note => {
    const ue = note.ue || {};
    const credits = parseFloat(ue.credits_ECTS) || 0;
    const noteSur100 = parseFloat(note.valeur_note);
    const gradeInfo = getGradeInfo(noteSur100);
    const decision = getDecision(noteSur100);

    totalCredits += credits;
    totalPointsPonderes += gradeInfo.points * credits;

    if (decision === 'CA' || decision === 'CANT') {
      creditsCapitalises += credits;
    }
  });

  const mgp = totalCredits > 0 ? totalPointsPonderes / totalCredits : 0;
  const pourcentage = totalCredits > 0 ? (creditsCapitalises / totalCredits) * 100 : 0;
  const estAdmis = mgp >= 2.0;
  const moyenneGenerale = computeAverage(mgp);

  return {
    creditsCapitalises,
    creditsTotaux: totalCredits,
    pourcentage: Number(pourcentage.toFixed(2)),
    mgp: Number(mgp.toFixed(2)),
    moyenneGenerale: Number(moyenneGenerale.toFixed(2)),
    estAdmis
  };
}

// ─── POINT D'ENTRÉE PRINCIPAL : AGRÉGATION DISTRIBUÉE ───────────────────────

async function getReportingData(id_etudiant, selectedSession) {
  // 1. Récupérer l'inscription depuis Student Service
  let inscriptionsResponse;
  try {
    inscriptionsResponse = await studentClient.get('/api/scolarite/inscriptions', {
      params: {}
    });
  } catch (err) {
    throw new Error(`Student Service injoignable : ${err.message}`);
  }

  const allInscriptions = inscriptionsResponse.data.data || [];

  // Trouver l'inscription la plus récente pour cet étudiant
  const inscription = allInscriptions.find(
    ins => ins.Etudiant && ins.Etudiant.id_etudiant === Number(id_etudiant)
  );

  if (!inscription) {
    const error = new Error('Inscription introuvable pour cet étudiant');
    error.status = 404;
    throw error;
  }

  const etudiant = inscription.Etudiant;
  const annee = inscription.Annee_Academique;

  // 2. Récupérer les notes depuis Academic Service
  let notesResponse;
  try {
    const params = { id_inscription: inscription.id_inscription };
    notesResponse = await academicClient.get('/api/academique/notes', { params });
  } catch (err) {
    console.error('⚠️ Academic Service injoignable:', err.message);
    notesResponse = { data: { data: [] } };
  }

  const rawNotes = notesResponse.data.data || [];

  // 3. Récupérer l'éligibilité financière depuis Finance Service
  let paymentsData = null;
  try {
    const finResponse = await financeClient.get(
      `/finance/internal/eligibilite/${inscription.id_inscription}`
    );
    paymentsData = finResponse.data.data;
  } catch (err) {
    console.error('⚠️ Finance Service injoignable:', err.message);
    paymentsData = {
      total_verse: 0,
      total_exigible: 0,
      pourcentage: 0,
      est_eligible: false
    };
  }

  // 4. Résoudre la hiérarchie académique
  let academicHierarchy = { niveau: null, departement: null, etablissement: null };
  try {
    // On récupère les départements et niveaux pour résoudre la hiérarchie
    const [nivResponse, deptResponse, etabResponse] = await Promise.all([
      academicClient.get('/api/academique/niveaux'),
      academicClient.get('/api/academique/departements'),
      academicClient.get('/api/academique/etablissements')
    ]);

    const niveaux = nivResponse.data.data || [];
    const departements = deptResponse.data.data || [];
    const etablissements = etabResponse.data.data || [];

    const niveau = niveaux.find(n => n.id_niveau === inscription.id_niveau);
    const departement = niveau
      ? departements.find(d => d.id_departement === niveau.id_departement)
      : null;
    const etablissement = departement
      ? etablissements.find(e => e.id_etablissement === departement.id_etablissement)
      : null;

    academicHierarchy = {
      niveau: niveau ? niveau.libelle_niveau : null,
      departement: departement ? departement.nom_dept : null,
      etablissement: etablissement ? etablissement.nom_etablissement : null
    };
  } catch (err) {
    console.error('⚠️ Résolution de la hiérarchie académique échouée:', err.message);
  }

  // 5. Calcul des grades et du résumé MGP/GPA
  const noteRows = rawNotes.map(note => ({
    id_note: note.id_note,
    valeur_note: normalizeNumber(note.valeur_note),
    session: note.session,
    date_examen: note.date_examen,
    gradeInfo: getGradeInfo(normalizeNumber(note.valeur_note)),
    decision: getDecision(normalizeNumber(note.valeur_note)),
    ue: note.UE ? {
      id_UE: note.UE.id_UE,
      code_UE: note.UE.code_UE,
      libelle_UE: note.UE.libelle_UE,
      credits_ECTS: note.UE.credits_ECTS
    } : null
  }));

  const summary = computeSummary(noteRows);

  return {
    student: {
      id_etudiant: etudiant.id_etudiant,
      matricule: etudiant.matricule,
      nom: etudiant.nom_etud,
      prenom: etudiant.prenom_etud,
      date_naissance: etudiant.date_naissance,
      sexe: etudiant.sexe,
      adresse: etudiant.adresse,
      email: etudiant.email,
    },
    inscription: {
      id_inscription: inscription.id_inscription,
      date_inscription: inscription.date_inscription,
      id_niveau: inscription.id_niveau,
      id_annee: inscription.id_annee,
      ...academicHierarchy,
      annee_scolaire: annee ? annee.libelle_annee : null,
    },
    payments: paymentsData,
    notes: noteRows,
    summary,
    session: selectedSession || 'tous'
  };
}

module.exports = {
  getReportingData,
  BAREME,
  getGradeInfo,
  getDecision,
  computeSummary,
  computeAverage
};
