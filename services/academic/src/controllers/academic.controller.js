const academicService = require('../services/academic.service');

// ─── VALIDATION INTERNE (POUR STUDENT-SERVICE) ──────────────────────────────
exports.internalValidateHierarchy = async (req, res) => {
  try {
    const { filiere, niveau } = req.query;
    if (!filiere || !niveau) {
      return res.status(400).json({
        success: false,
        message: 'filiere et niveau sont requis'
      });
    }

    const result = await academicService.validateHierarchy(filiere, niveau);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Département ou Niveau invalide ou introuvable.'
      });
    }

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.internalSyncStudentToScolarite = async (req, res) => {
  try {
    const data = await academicService.syncStudentToScolarite(req.body);
    return res.status(200).json({
      success: true,
      message: 'Étudiant synchronisé vers le service Scolarité',
      data
    });
  } catch (err) {
    console.error('❌ Erreur synchronisation vers Scolarité :', err.message);
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

exports.creerEtudiant = async (req, res) => {
  try {
    const data = await academicService.syncStudentToScolarite(req.body);
    return res.status(201).json({
      success: true,
      message: 'Étudiant créé dans le service Scolarité via Academic',
      data
    });
  } catch (err) {
    console.error('❌ Erreur création étudiant Academic->Scolarité :', err.message);
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// ─── NOTES D'EXAMENS ────────────────────────────────────────────────────────
exports.creerNote = async (req, res) => {
  try {
    const note = await academicService.creerNote(req.body);
    return res.status(201).json({
      success: true,
      message: 'Note enregistrée avec succès',
      data: note
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

exports.obtenirNotes = async (req, res) => {
  try {
    const data = await academicService.obtenirNotes(req.query);
    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.obtenirNoteParId = async (req, res) => {
  try {
    const data = await academicService.obtenirNoteParId(req.params.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Note introuvable'
      });
    }
    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// ─── INFRASTRUCTURE ADMINISTRATIVE CRUDS ────────────────────────────────────
exports.getEtablissements = async (req, res) => {
  const data = await academicService.getAllEtablissements();
  res.json({ success: true, data });
};

exports.creerEtablissement = async (req, res) => {
  try {
    const data = await academicService.createEtablissement(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getDepartements = async (req, res) => {
  const data = await academicService.getAllDepartements();
  res.json({ success: true, data });
};

exports.creerDepartement = async (req, res) => {
  try {
    const data = await academicService.createDepartement(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getNiveaux = async (req, res) => {
  const data = await academicService.getAllNiveaux();
  res.json({ success: true, data });
};

exports.creerNiveau = async (req, res) => {
  try {
    const data = await academicService.createNiveau(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getUEs = async (req, res) => {
  const data = await academicService.getAllUEs();
  res.json({ success: true, data });
};

exports.creerUE = async (req, res) => {
  try {
    const data = await academicService.createUE(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getEnseignants = async (req, res) => {
  const data = await academicService.getAllEnseignants();
  res.json({ success: true, data });
};

exports.creerEnseignant = async (req, res) => {
  try {
    const data = await academicService.createEnseignant(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
