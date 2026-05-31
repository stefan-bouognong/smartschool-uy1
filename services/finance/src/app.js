const express = require('express');
const cors = require('cors');
const financeRoutes = require('./routes/finance.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[Finance Service] ${req.method} ${req.url}`);
  next();
});

app.use('/finance', financeRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'finance-service' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Erreur interne de serveur' });
});

module.exports = app;
