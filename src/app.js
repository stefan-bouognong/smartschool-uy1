const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes du module Admin
const adminRoutes = require('./modules/admin/admin.routes');
app.use('/api/admin', adminRoutes);
// Route test
app.get('/', (req, res) => {
  res.json({ message: 'SmartSchool API running' });
});

module.exports = app;