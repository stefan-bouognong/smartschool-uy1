module.exports=(sequelize, DataTypes)=>{
const Niveau = sequelize.define('Niveau', {
  id_niveau: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  libelle_niveau: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_departement: DataTypes.INTEGER
}, {
  tableName: 'Niveau',
  timestamps: false
});

Niveau.associate = (models)=>{
  Niveau.belongsTo(models.Departement, { foreignKey: 'id_departement'});
  Niveau.hasMany(models.Inscription,{foreignKey:'id_niveau'});
};

return Niveau;

};