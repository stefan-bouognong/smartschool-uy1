const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Enseignant = sequelize.define(
  "Enseignant",
  {
    id_enseignant: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom_enseignant: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prenom_enseignant: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_enseignant: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Enseignant",
    timestamps: false,
  },
);

module.exports = Enseignant;
