const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Etablissement = sequelize.define(
  "Etablissement",
  {
    id_etablissement: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom_etablissement: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adresse_etablissement: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telephone_etablissement: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    responsable_etablissement: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Etablissement",
    timestamps: false,
  },
);

module.exports = Etablissement;
