const jwt = require('jsonwebtoken');
const config = require('../config/gateway.config');

/**
 * Middleware centralisé d'autorisation et de validation JWT
 * @param {Array<string>} allowedRoles - Liste des rôles autorisés (ex: ['Admin', 'Etudiant'])
 */
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Accès refusé. Token d\'autorisation manquant ou invalide.'
      });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded; // Injecte { id, role, email }

      // Vérification du rôle RBAC (insensible à la casse)
      const userRole = String(decoded.role || '').toLowerCase();
      const authorizedRoles = allowedRoles.map((role) => String(role).toLowerCase());
      if (allowedRoles.length > 0 && !authorizedRoles.includes(userRole)) {
        console.error(`[Gateway Auth] refused role=${decoded.role} normalized=${userRole} allowed=${authorizedRoles.join(',')}`);
        return res.status(403).json({
          success: false,
          message: 'Permissions insuffisantes pour accéder à cette ressource.'
        });
      }

      next();
    } catch (err) {
      console.error('❌ Erreur de validation JWT sur Gateway:', err.message);
      return res.status(401).json({
        success: false,
        message: 'Token d\'autorisation invalide, expiré ou corrompu.'
      });
    }
  };
};

module.exports = {
  authorize
};
