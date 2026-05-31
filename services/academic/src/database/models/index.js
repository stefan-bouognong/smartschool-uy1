const sequelize = require('../../config/database');
const Etablissement = require('./etablissement.model');
const Departement = require('./departement.model');
const Niveau = require('./niveau.model');
const UE = require('./ue.model');
const Enseignant = require('./enseignant.model');
const Note = require('./note.model');

// Déclaration des relations académiques internes
Departement.belongsTo(Etablissement, { foreignKey: "id_etablissement" });
Etablissement.hasMany(Departement, { foreignKey: "id_etablissement" });

Niveau.belongsTo(Departement, { foreignKey: "id_departement" });
Departement.hasMany(Niveau, { foreignKey: "id_departement" });

UE.belongsTo(Niveau, { foreignKey: 'id_niveau' });
Niveau.hasMany(UE, { foreignKey: "id_niveau" });

Note.belongsTo(UE, { foreignKey: "id_UE" });
Note.belongsTo(Enseignant, { foreignKey: "id_enseignant" });
UE.hasMany(Note, { foreignKey: "id_UE" });
Enseignant.hasMany(Note, { foreignKey: "id_enseignant" });

module.exports = {
  sequelize,
  Etablissement,
  Departement,
  Niveau,
  UE,
  Enseignant,
  Note
};
