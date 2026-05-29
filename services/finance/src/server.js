const app = require("./app");
const config = require("./config/env");
const { sequelize } = require("./database/models");

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("📦 Connexion à la base de données Finance OK");

    await sequelize.sync({});
    console.log("✅ Tables Tranche, Payer_Tranche synchronisées");

    app.listen(config.port, () => {
      console.log(`🚀 Microservice Finance à l'écoute sur le port ${config.port}`);
    });
  } catch (error) {
    console.error("❌ Impossible de démarrer le serveur Finance :", error);
  }
};

startServer();
