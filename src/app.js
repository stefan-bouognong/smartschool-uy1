const express = require("express");
const cors = require("cors");
const reportingRoutes = require("./modules/reporting/reporting.routes");

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/reporting", reportingRoutes);

// Route test
app.get("/", (req, res) => {
  res.json({ message: "SmartSchool API running" });
});

module.exports = app;
