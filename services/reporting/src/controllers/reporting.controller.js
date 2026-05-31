const reportingService = require('../services/reporting.service');
const { generateTranscriptPDF } = require('../utils/pdfGenerator');

exports.getReport = async (req, res) => {
  try {
    const { id_etudiant } = req.params;
    const { session } = req.query;

    const data = await reportingService.getReportingData(id_etudiant, session);
    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({
      success: false,
      error: err.message
    });
  }
};

exports.downloadTranscriptPDF = async (req, res) => {
  try {
    const { id_etudiant } = req.params;
    const { session } = req.query;

    const data = await reportingService.getReportingData(id_etudiant, session);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=releve_${data.student.matricule || id_etudiant}.pdf`
    );

    const pdfDoc = generateTranscriptPDF(data);
    pdfDoc.pipe(res);

  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({
      success: false,
      error: err.message
    });
  }
};

exports.getBareme = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: reportingService.BAREME
  });
};
