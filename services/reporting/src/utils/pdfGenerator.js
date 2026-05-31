const PDFDocument = require('pdfkit');
const { getGradeInfo, getDecision } = require('../services/reporting.service');

/**
 * Génère un relevé de notes PDF en streaming à partir des données distribuées
 * @param {Object} reportData - Données agrégées depuis les microservices
 * @returns {PDFDocument} stream
 */
function generateTranscriptPDF(reportData) {
  const doc = new PDFDocument({ margin: 50 });

  const { student, inscription, notes, summary } = reportData;

  // ─── EN-TÊTE ──────────────────────────────────────────────────────────────
  doc.fontSize(16).font('Helvetica-Bold')
    .text('UNIVERSITÉ DE YAOUNDÉ I', { align: 'center' });
  doc.fontSize(10).font('Helvetica')
    .text(inscription.etablissement || 'Établissement', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(14).font('Helvetica-Bold')
    .text('RELEVÉ DE NOTES', { align: 'center' });
  doc.moveDown();

  // ─── INFOS ÉTUDIANT ───────────────────────────────────────────────────────
  doc.fontSize(10).font('Helvetica-Bold').text('Informations de l\'étudiant');
  doc.fontSize(9).font('Helvetica');
  doc.text(`Matricule : ${student.matricule || 'N/A'}`);
  doc.text(`Nom : ${student.nom || ''} ${student.prenom || ''}`);
  doc.text(`Date de naissance : ${student.date_naissance || 'N/A'}`);
  doc.text(`Filière : ${inscription.departement || 'N/A'}`);
  doc.text(`Niveau : ${inscription.niveau || 'N/A'}`);
  doc.text(`Année académique : ${inscription.annee_scolaire || 'N/A'}`);
  doc.moveDown();

  // ─── TABLEAU DES NOTES ────────────────────────────────────────────────────
  doc.fontSize(10).font('Helvetica-Bold').text('Notes');
  doc.moveDown(0.3);

  // En-tête du tableau
  const tableTop = doc.y;
  const colWidths = [110, 65, 55, 55, 65, 80];
  const headers = ['UE', 'Note', 'Cote', 'Crédits', 'Décision', 'Mention'];

  doc.fontSize(8).font('Helvetica-Bold');
  let xPos = 50;
  headers.forEach((h, i) => {
    doc.text(h, xPos, tableTop, { width: colWidths[i] });
    xPos += colWidths[i];
  });

  doc.moveTo(50, tableTop + 12).lineTo(50 + colWidths.reduce((a, b) => a + b, 0), tableTop + 12).stroke();

  // Lignes du tableau
  let y = tableTop + 16;
  doc.fontSize(8).font('Helvetica');

  if (notes && notes.length > 0) {
    notes.forEach(note => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      const gradeInfo = note.gradeInfo || getGradeInfo(note.valeur_note);
      const decision = note.decision || getDecision(note.valeur_note);
      const ue = note.ue || {};

      xPos = 50;
      doc.text(ue.code_UE || 'N/A', xPos, y, { width: colWidths[0] });
      xPos += colWidths[0];
      doc.text(String(note.valeur_note || 0), xPos, y, { width: colWidths[1] });
      xPos += colWidths[1];
      doc.text(gradeInfo.cote, xPos, y, { width: colWidths[2] });
      xPos += colWidths[2];
      doc.text(String(ue.credits_ECTS || 0), xPos, y, { width: colWidths[3] });
      xPos += colWidths[3];
      doc.text(decision, xPos, y, { width: colWidths[4] });
      xPos += colWidths[4];
      doc.text(gradeInfo.mention, xPos, y, { width: colWidths[5] });

      y += 14;
    });
  } else {
    doc.text('Aucune note disponible.', 50, y);
    y += 14;
  }

  // ─── RÉSUMÉ ───────────────────────────────────────────────────────────────
  doc.moveDown(2);
  doc.fontSize(10).font('Helvetica-Bold').text('Résumé Académique');
  doc.fontSize(9).font('Helvetica');
  doc.text(`MGP (GPA) : ${summary.mgp} / 4.00`);
  doc.text(`Moyenne Générale : ${summary.moyenneGenerale} / 20.00`);
  doc.text(`Crédits Capitalisés : ${summary.creditsCapitalises} / ${summary.creditsTotaux}`);
  doc.text(`Pourcentage de crédits : ${summary.pourcentage} %`);
  doc.text(`Décision finale : ${summary.estAdmis ? '✅ ADMIS' : '❌ AJOURNÉ'}`);

  // ─── PIED DE PAGE ─────────────────────────────────────────────────────────
  doc.moveDown(3);
  doc.fontSize(8).font('Helvetica')
    .text(`Document généré le ${new Date().toLocaleDateString('fr-FR')} par SmartSchool UY1`, {
      align: 'center'
    });

  doc.end();
  return doc;
}

module.exports = { generateTranscriptPDF };
