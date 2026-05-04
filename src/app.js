const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const authRoutes = require('./modules/auth/auth.routes');
const academiqueRoutes = require('./modules/academique/academique.routes');

// Route test
app.get('/', (req, res) => {
  res.json({ message: 'SmartSchool API running' });
});

// app.use('/api/auth', authRoutes);
app.use('/api/academique', academiqueRoutes);

module.exports = app;
