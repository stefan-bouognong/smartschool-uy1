const express = require("express");
const cors = require("cors");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[Admin Service] ${req.method} ${req.url}`);
  next();
});

app.use("/api/admin", adminRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "UP", service: "admin-service" });
});
//test
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Erreur interne de serveur",
  });
});

module.exports = app;
