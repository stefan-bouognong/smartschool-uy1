const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Note = sequelize.define('Note', {
  id_note: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  valeur_note: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  session: {
    type: DataTypes.STRING,
    defaultValue: 'Normale'
  },
  date_examen: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  id_inscription: {
    type: DataTypes.INTEGER,
    allowNull: false // Clé logique externe
  },
  id_UE: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_enseignant: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Note',
  timestamps: false
});

module.exports = Note;
