const sequelize = require('../../config/database');
const Etablissement = require('./etablissement.model');
const Departement = require('./departement.model');
const Niveau = require('./niveau.model');
const UE = require('./ue.model');
const Annee = require('./annee.model');
const Enseignant = require('./enseignant.model');

module.exports = {
  sequelize,
  Etablissement,
  Departement,
  Niveau,
  UE,
  Annee,
  Enseignant,
};
