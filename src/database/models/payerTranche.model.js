const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
module.exports = (sequelize,DataTypes)=>{
const PayerTranche = sequelize.define('Payer_Tranche', {
  id_inscription: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_tranche: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  date_paiement: DataTypes.DATE,
  montant_verse: DataTypes.FLOAT,
  mode_paiement: DataTypes.STRING
}, {
  tableName: 'Payer_Tranche',
  timestamps: false
});

return PayerTranche;};