const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const config = require("./config/gateway.config");
const { authorize } = require("./middlewares/auth.middleware");

const app = express();

// 1. Limitation globale des requêtes (Sécurité)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limite à 200 requêtes par IP
  message: {
    success: false,
    message:
      "Trop de requêtes initiées depuis cette IP. Veuillez réessayer dans 15 minutes.",
  },
});
app.use(limiter);

// Ne pas parser le corps JSON dans la gateway :
// Le proxy doit transmettre les flux HTTP bruts aux microservices cibles.
// La gateway n'a pas besoin d'analyser le corps pour l'instant.

app.use((req, res, next) => {
  console.log(
    `[Gateway Log] [${new Date().toISOString()}] ${req.method} ${req.url}`,
  );
  next();
});

// Route d'état de santé de la Gateway
app.get("/gateway/health", (req, res) => {
  res.json({
    success: true,
    message: "API Gateway SmartSchool UY1 opérationnelle",
    timestamp: new Date(),
  });
});

// 2. Déclaration des règles de Proxy et Mappage de Routes
const proxyRoutes = [
  {
    path: "/api/v1/auth",
    target: config.services.auth,
    secure: false,
    rewrite: { "^/api/v1/auth": "/api/auth" },
  },
  {
    path: "/api/v1/scolarite",
    target: config.services.scolarite,
    secure: true,
    roles: ["Admin", "Etudiant", "Scolarite"],
    rewrite: { "^/api/v1/scolarite": "/api/scolarite" },
  },
  {
    path: "/api/v1/academique",
    target: config.services.academique,
    secure: true,
    roles: ["Admin", "Enseignant", "Etudiant"],
    rewrite: { "^/api/v1/academique": "/api/academique" },
  },
  {
    path: "/api/v1/finance",
    target: config.services.finance,
    secure: true,
    roles: ["Admin", "Finance", "Etudiant"],
    rewrite: { "^/api/v1/finance": "/finance" },
  },
  {
    path: "/api/v1/reporting",
    target: config.services.reporting,
    secure: true,
    roles: ["Admin", "Enseignant", "Etudiant"],
    rewrite: { "^/api/v1/reporting": "/reporting" },
  },
  {
    path: "/api/v1/admin",
    target: config.services.admin,
    secure: true,
    roles: ["Admin"],
    rewrite: { "^/api/v1/admin": "/api/admin" },
  },
];

// Helper to forward JSON body through the proxy when express.json() already consumed the request stream
const proxyOptions = (route) => ({
  target: route.target,
  changeOrigin: true,
  pathRewrite: route.rewrite,
  proxyTimeout: 15000,
  timeout: 15000,
  onProxyReq: (proxyReq, req) => {
    // Propagation des en-têtes avec métadonnées de l'utilisateur validé
    if (req.user) {
      proxyReq.setHeader("X-User-Id", req.user.id);
      proxyReq.setHeader("X-User-Role", req.user.role);
      proxyReq.setHeader("X-User-Email", req.user.email);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(
      `[Gateway Proxy] ${req.method} ${req.url} -> ${route.target}${req.url} ${proxyRes.statusCode}`,
    );
  },
  onError: (err, req, res) => {
    console.error(`❌ Erreur Proxy pour ${route.path} -> ${route.target} :`, err.message);
    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        message: "Le microservice cible est temporairement injoignable (Bad Gateway).",
      });
    }
  },
});

// 3. Application dynamique du proxying avec validation de sécurité
proxyRoutes.forEach((route) => {
  const middlewares = [];

  if (route.secure) {
    middlewares.push(authorize(route.roles));
  }

  app.use(route.path, ...middlewares, createProxyMiddleware(proxyOptions(route)));
});

// Middleware fallback 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ressource introuvable sur la Gateway.",
  });
});

// Démarrage du serveur Gateway
app.listen(config.port, () => {
  console.log(`🚀 API Gateway en écoute sur le port ${config.port}`);
  console.log(
    `🔗 Routes configurées vers: ${JSON.stringify(config.services, null, 2)}`,
  );
});
