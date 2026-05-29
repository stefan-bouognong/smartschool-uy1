const sequelize = require('../../config/database');
const Etudiant = require('./etudiant.model');
const Inscription = require('./inscription.model');
const Annee = require('./annee.model');

// Relations internes
Inscription.belongsTo(Etudiant, { foreignKey: 'id_etudiant' });
Inscription.belongsTo(Annee, { foreignKey: 'id_annee' });
Etudiant.hasMany(Inscription, { foreignKey: 'id_etudiant' });
Annee.hasMany(Inscription, { foreignKey: 'id_annee' });

module.exports = {
  sequelize,
  Etudiant,
  Inscription,
  Annee
};
