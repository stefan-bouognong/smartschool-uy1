const app = require('./app');
const config = require('./config/env');
const initDb = require('./config/initDb');

const startServer = async () => {
  await initDb(); // 🔥 création DB automatique

  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
  });
};

startServer();