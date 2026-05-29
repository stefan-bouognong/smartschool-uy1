const app = require("./app");
const config = require("./config/env");

const port = config.port || 5006;

app.listen(port, () => {
  console.log(`🚀 Admin service en écoute sur le port ${port}`);
});
