const express = require('express');
const cors = require('cors');
const studentRoutes = require('./routes/student.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger simple de requêtes internes
app.use((req, res, next) => {
  console.log(`[Student Service] ${req.method} ${req.url}`);
  next();
});

// Enregistrement des routes (Mappe au chemin hérité /api/scolarite)
app.use('/api/scolarite', studentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'student-service' });
});

// Middleware de gestion d'erreur centralisé
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Erreur interne de serveur' });
});

module.exports = app;
