const express = require('express');
const cors = require('cors');
const academicRoutes = require('./routes/academic.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger simple de requêtes internes
app.use((req, res, next) => {
  console.log(`[Academic Service] ${req.method} ${req.url}`);
  next();
});

// Enregistrement des routes (Mappe au chemin hérité /api/academique)
app.use('/api/academique', academicRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'academic-service' });
});

// Middleware de gestion d'erreur centralisé
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Erreur interne de serveur' });
});

module.exports = app;
