const express = require('express');
const financeController = require('../controllers/finance.controller');

const router = express.Router();

// Tranches
router.post('/tranches', financeController.creerTranche);
router.get('/tranches', financeController.getAllTranches);
router.get('/tranches/:id', financeController.getTrancheById);

// Paiements
router.post('/payer', financeController.payerTranche);
router.get('/paiements/:id_inscription', financeController.getPaiementsParInscription);

// Campay
router.get('/campay/status/:reference', financeController.verifierStatutCampay);

// Endpoint interne (pour Reporting Service)
router.get('/internal/eligibilite/:id_inscription', financeController.getEligibiliteFinanciere);

module.exports = router;
