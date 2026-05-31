const express = require('express');
const reportingController = require('../controllers/reporting.controller');

const router = express.Router();

// Rapport JSON complet
router.get('/etudiant/:id_etudiant', reportingController.getReport);

// Téléchargement du relevé de notes PDF
router.get('/etudiant/:id_etudiant/pdf', reportingController.downloadTranscriptPDF);

// Barème officiel UY1
router.get('/bareme', reportingController.getBareme);

module.exports = router;
