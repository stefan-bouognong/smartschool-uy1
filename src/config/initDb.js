const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const initDb = async () => {
  try {
    // Connexion SANS base (pour créer la DB si elle n'existe pas)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    console.log("📦 Connexion MySQL OK");

    // Lire le fichier schema.sql
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf-8');

    // Exécuter tout le script
    await connection.query(sql);

    console.log("✅ Base de données + tables créées");

    await connection.end();

  } catch (err) {
    console.error("❌ Erreur init DB:", err.message);
  }
};

module.exports = initDb;