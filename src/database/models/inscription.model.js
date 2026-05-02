module.exports = (sequelize, DataTypes)=>{
const Inscription = sequelize.define('Inscription', {
  id_inscription: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  matricule: {
    type: DataTypes.STRING,
    unique: true
  },
  date_inscription: DataTypes.DATE,
  statut_paiement: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  id_etudiant: DataTypes.INTEGER,
  id_annee: DataTypes.INTEGER,
  id_niveau: DataTypes.INTEGER
}, {
  tableName: 'Inscription',
  timestamps: false
});

Inscription.associate = (models)=>{
  Inscription.belongsTo(models.Etudiant, {foreignKey: 'id_etudiant'});
  Inscription.belongsTo(models.Annee_Academique,{foreignKey: 'id_annee'});
  Inscription.belongsTo(models.Niveau, {foreignKey: 'id_niveau'});
}
return Inscription;

};

