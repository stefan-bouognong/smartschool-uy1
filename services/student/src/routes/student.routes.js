const express = require('express');
const studentController = require('../controllers/student.controller');

const router = express.Router();

router.post('/inscrire', studentController.inscrireEtudiant);
router.get('/inscriptions', studentController.getAllInscriptions);
router.get('/inscriptions/:id', studentController.getInscription);
router.delete('/inscriptions/:id', studentController.deleteInscription);

// Endpoint interne (Scolarité/Paiements)
router.put('/internal/inscriptions/:id_inscription/paiement', studentController.updatePaiementStatut);

module.exports = router;
