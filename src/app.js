const express = require('express');
const cors = require('cors');

const app = express();
const scolariteRoutes = require('./modules/scolarite/scolarite.routes');
// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/scolarite', scolariteRoutes);
// Route test
app.get('/', (req, res) => {
  res.json({ message: 'SmartSchool API running' });
});

module.exports = app;