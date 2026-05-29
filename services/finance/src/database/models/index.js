const sequelize = require('../../config/database');
const Tranche = require('./tranche.model');
const PayerTranche = require('./payerTranche.model');

// Relations internes
PayerTranche.belongsTo(Tranche, { foreignKey: 'id_tranche' });
Tranche.hasMany(PayerTranche, { foreignKey: 'id_tranche' });

module.exports = {
  sequelize,
  Tranche,
  PayerTranche
};
