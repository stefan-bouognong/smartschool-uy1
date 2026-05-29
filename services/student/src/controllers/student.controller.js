const studentService = require('../services/student.service');

exports.inscrireEtudiant = async (req, res) => {
  try {
    const data = await studentService.creerInscription(req.body);
    return res.status(201).json({
      success: true,
      message: 'Inscription administrative réussie',
      data
    });
  } catch (err) {
    console.error('❌ Erreur inscription:', err.message);
    const code = err.message.includes('introuvable') || err.message.includes('invalide') ? 404 : 400;
    return res.status(code).json({
      success: false,
      error: err.message
    });
  }
};

exports.getAllInscriptions = async (req, res) => {
  try {
    const data = await studentService.getInscriptions(req.query);
    return res.status(200).json({
      success: true,
      total: data.length,
      data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.getInscription = async (req, res) => {
  try {
    const data = await studentService.getInscriptionById(req.params.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Inscription introuvable'
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

exports.deleteInscription = async (req, res) => {
  try {
    const data = await studentService.supprimerInscription(req.params.id);
    return res.status(200).json({
      success: true,
      ...data
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      error: err.message
    });
  }
};

// Endpoint à usage interne pour mettre à jour le statut du versement de pension
exports.updatePaiementStatut = async (req, res) => {
  try {
    const { id_inscription } = req.params;
    const { statut } = req.body;
    const data = await studentService.updateStatutPaiement(id_inscription, statut);
    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
};
