const db = require('../../config/db');

exports.getAllEtablissements = async () => {
  const [rows] = await db.query('SELECT * FROM Etablissement');
  return rows;
};