const financeService = require('../services/finance.service');

// ─── TRANCHES ───────────────────────────────────────────────────────────────

exports.creerTranche = async (req, res) => {
  try {
    const data = await financeService.creerTranche(req.body);
    return res.status(201).json({ success: true, message: 'Tranche créée', data });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

exports.getAllTranches = async (req, res) => {
  try {
    const data = await financeService.getAllTranches();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getTrancheById = async (req, res) => {
  try {
    const data = await financeService.getTrancheById(req.params.id);
    if (!data) return res.status(404).json({ success: false, error: 'Tranche introuvable' });
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─── PAIEMENT ───────────────────────────────────────────────────────────────

exports.payerTranche = async (req, res) => {
  try {
    const data = await financeService.payerTranche(req.body);
    return res.status(201).json({
      success: true,
      message: 'Paiement enregistré avec succès',
      data
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

exports.getPaiementsParInscription = async (req, res) => {
  try {
    const data = await financeService.getPaiementsParInscription(req.params.id_inscription);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─── CAMPAY STATUS ──────────────────────────────────────────────────────────

exports.verifierStatutCampay = async (req, res) => {
  try {
    const data = await financeService.verifierStatutCampay(req.params.reference);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─── ÉLIGIBILITÉ INTERNE (POUR REPORTING) ───────────────────────────────────

exports.getEligibiliteFinanciere = async (req, res) => {
  try {
    const data = await financeService.getEligibiliteFinanciere(req.params.id_inscription);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
