const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

// Import modèles
const Utilisateur = require('./utilisateur.model');
const Enseignant = require('./enseignant.model');
const Etudiant = require('./etudiant.model');
const Inscription = require('./inscription.model');
const UE = require('./ue.model');
const Note = require('./note.model');
const Tranche = require('./tranche.model');
const PayerTranche = require('./payerTranche.model');

// ================= RELATIONS =================

// Utilisateur → Enseignant
Utilisateur.belongsTo(Enseignant, { foreignKey: 'id_enseignant' });

// Inscription relations
Inscription.belongsTo(Etudiant, { foreignKey: 'id_etudiant' });

// Note relations
Note.belongsTo(Inscription, { foreignKey: 'id_inscription' });
Note.belongsTo(UE, { foreignKey: 'id_UE' });
Note.belongsTo(Enseignant, { foreignKey: 'id_enseignant' });

// Paiement
PayerTranche.belongsTo(Inscription, { foreignKey: 'id_inscription' });
PayerTranche.belongsTo(Tranche, { foreignKey: 'id_tranche' });

module.exports = {
  sequelize,
  Utilisateur,
  Enseignant,
  Etudiant,
  Inscription,
  UE,
  Note,
  Tranche,
  PayerTranche
};