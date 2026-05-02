const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
module.exports = (sequelize,DataTypes)=>{
const Note = sequelize.define('Note', {
  id_note: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  valeur_note: DataTypes.FLOAT,
  session: DataTypes.STRING,
  date_examen: DataTypes.DATE,
  id_inscription: DataTypes.INTEGER,
  id_UE: DataTypes.INTEGER,
  id_enseignant: DataTypes.INTEGER
}, {
  tableName: 'Note',
  timestamps: false
});

return Note;};