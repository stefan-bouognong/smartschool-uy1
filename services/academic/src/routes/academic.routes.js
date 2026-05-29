const express = require('express');
const academicController = require('../controllers/academic.controller');

const router = express.Router();

// ─── ENDPOINT INTERNE (POUR STUDENT-SERVICE) ──────────────────────────────
router.get('/internal/validate-hierarchy', academicController.internalValidateHierarchy);

// ─── NOTES D'EXAMENS ────────────────────────────────────────────────────────
router.post('/notes', academicController.creerNote);
router.get('/notes', academicController.obtenirNotes);
router.get('/notes/:id', academicController.obtenirNoteParId);

// ─── INFRASTRUCTURE ADMINISTRATIVE CRUDS ────────────────────────────────────
router.get('/etablissements', academicController.getEtablissements);
router.post('/etablissements', academicController.creerEtablissement);

router.get('/departements', academicController.getDepartements);
router.post('/departements', academicController.creerDepartement);

router.get('/niveaux', academicController.getNiveaux);
router.post('/niveaux', academicController.creerNiveau);

router.get('/ues', academicController.getUEs);
router.post('/ues', academicController.creerUE);

router.get('/enseignants', academicController.getEnseignants);
router.post('/enseignants', academicController.creerEnseignant);

module.exports = router;
