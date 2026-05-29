const app = require("./app");
const config = require("./config/env");
const { sequelize } = require("./database/models");

const startServer = async () => {
  try {
    // Connexion et synchronisation de la base de données
    await sequelize.authenticate();
    console.log("📦 Connexion à la base de données Student OK");

    await sequelize.sync({});
    console.log("✅ Tables Etudiant, Inscription, Annee synchronisées");

    // Démarrage du serveur
    app.listen(config.port, () => {
      console.log(`🚀 Microservice Student à l'écoute sur le port ${config.port}`);
    });
  } catch (error) {
    console.error("❌ Impossible de démarrer le serveur Student :", error);
  }
};

startServer();
