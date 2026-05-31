const app = require("./app");
const config = require("./config/env");
const { sequelize } = require("./database/models");

const startServer = async () => {
  try {
    // Connexion et synchronisation de la base de données
    await sequelize.authenticate();
    console.log("📦 Connexion à la base de données Academic OK");

    await sequelize.sync({});
    console.log("✅ Tables Etablissement, Departement, Niveau, UE, Enseignant, Note synchronisées");

    // Démarrage de l'écoute du serveur
    app.listen(config.port, () => {
      console.log(`🚀 Microservice Academic à l'écoute sur le port ${config.port}`);
    });
  } catch (error) {
    console.error("❌ Impossible de démarrer le serveur Academic :", error);
  }
};

startServer();
