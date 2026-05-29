const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Inscription = sequelize.define('Inscription', {
  id_inscription: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  matricule: DataTypes.STRING,
  date_inscription: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  statut_paiement: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  id_etudiant: DataTypes.INTEGER,
  id_annee: DataTypes.INTEGER,
  id_niveau: DataTypes.INTEGER // Stocké de manière logique
}, {
  tableName: 'Inscription',
  timestamps: false
});

module.exports = Inscription;
