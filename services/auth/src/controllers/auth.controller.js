const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json({
      success: true,
      message: 'Utilisateur enregistré avec succès',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Erreur lors de l\'enregistrement'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    if (!email || !mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot_de_passe sont requis'
      });
    }

    const result = await authService.login(email, mot_de_passe);
    return res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: result
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Identifiants invalides'
    });
  }
};
