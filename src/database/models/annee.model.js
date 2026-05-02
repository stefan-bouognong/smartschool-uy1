module.exports=(sequelize, DataTypes)=>{
const Annee = sequelize.define('Annee_Academique', {
  id_annee: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  libelle_annee: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Annee_Academique',
  timestamps: false
});

Annee.associate = (models)=>{
  Annee.hasMany(models.Inscription, {foreignKey:'id_annee'});
}

return Annee;
};