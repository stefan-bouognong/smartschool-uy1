const express = require("express");
const reportingController = require("./reporting.controller");

const router = express.Router();

router.get("/releve/:etudiantId", reportingController.downloadReleve);
router.get("/certificat/:etudiantId", reportingController.downloadCertificate);
router.get("/summary/:etudiantId", reportingController.getReportingSummary);

module.exports = router;
