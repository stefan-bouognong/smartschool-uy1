const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const UE = sequelize.define('UE', {
  id_UE: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  code_UE: {
    type: DataTypes.STRING,
    allowNull: false
  },
  libelle_UE: DataTypes.STRING,
  credits_ECTS: DataTypes.INTEGER,
  id_niveau: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'UE',
  timestamps: false
});

module.exports = UE;
