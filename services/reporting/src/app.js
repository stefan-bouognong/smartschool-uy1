const express = require('express');
const cors = require('cors');
const reportingRoutes = require('./routes/reporting.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[Reporting Service] ${req.method} ${req.url}`);
  next();
});

app.use('/reporting', reportingRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'reporting-service' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Erreur interne de serveur' });
});

module.exports = app;
