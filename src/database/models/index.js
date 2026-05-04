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
const Annee_Academique = require('./annee.model');
const Departement = require('./departement.model');
const Etablissement = require('./etablissement.model');
const Niveau = require('./niveau.model');

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

Annee_Academique.hasMany(Inscription, { foreignKey: 'id_annee' });
Departement.belongsTo(Etablissement, { foreignKey: 'id_etablissement' });
Departement.hasMany(Enseignant, { foreignKey: 'id_departement' });
Departement.hasMany(Niveau, { foreignKey: 'id_departement'}); // AJOUT 1
Enseignant.belongsTo(Departement, { foreignKey: 'id_departement' });
Enseignant.hasOne(Utilisateur, { foreignKey: 'id_enseignant' });
Enseignant.hasMany(Note, { foreignKey: 'id_enseignant' });
Etablissement.hasMany(Departement, { foreignKey: 'id_etablissement' });
Etudiant.hasMany(Inscription, { foreignKey: 'id_etudiant' });
Inscription.belongsTo(Etudiant, { foreignKey: 'id_etudiant' });
Inscription.belongsTo(Annee_Academique, { foreignKey: 'id_annee' });
Inscription.belongsTo(Niveau, { foreignKey: 'id_niveau' });
Inscription.hasMany(Note, { foreignKey: 'id_inscription'});
Inscription.hasMany(PayerTranche, { foreignKey: 'id_inscription'});
Niveau.hasMany(Inscription, { foreignKey: 'id_niveau' });
Niveau.hasMany(UE, { foreignKey: 'id_niveau'});
Niveau.belongsTo(Departement, { foreignKey: 'id_departement'}); // AJOUT 2
Note.belongsTo(Inscription, { foreignKey: 'id_inscription' });
Note.belongsTo(UE, { foreignKey: 'id_UE'});
Note.belongsTo(Enseignant, { foreignKey: 'id_enseignant' });
UE.belongsTo(Niveau, { foreignKey: 'id_niveau' });
UE.hasMany(Note, { foreignKey: 'id_UE'});


module.exports = {
  sequelize,
  Utilisateur,
  Enseignant,
  Etudiant,
  Inscription,
  UE,
  Note,
  Tranche,
  PayerTranche,
  Annee_Academique,
  Departement,
  Etablissement,
  Niveau
  };