const app = require("./app");
const config = require("./config/env");

const startServer = async () => {
  try {
    // Le Reporting Service n'a pas de base de données propre :
    // il agrège les données des autres microservices via REST
    app.listen(config.port, () => {
      console.log(`🚀 Microservice Reporting à l'écoute sur le port ${config.port}`);
      console.log(`📊 Sources de données configurées :`);
      console.log(`   → Student Service  : ${config.studentServiceUrl}`);
      console.log(`   → Academic Service : ${config.academicServiceUrl}`);
      console.log(`   → Finance Service  : ${config.financeServiceUrl}`);
    });
  } catch (error) {
    console.error("❌ Impossible de démarrer le serveur Reporting :", error);
  }
};

startServer();
