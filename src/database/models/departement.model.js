module.exports = (sequelize, DataTypes)=>{
const Departement = sequelize.define('Departement', {
  id_departement: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nom_dept: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_etablissement: DataTypes.INTEGER
}, {
  tableName: 'Departement',
  timestamps: false
});
Departement.associate = (models)=>{
  Departement.hasMany(models.Niveau,{foreignKey:'id_departement'});
};
return Departement;
};