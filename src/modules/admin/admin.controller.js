const service = require('./admin.service');

exports.getAll = async (req, res) => {
  try {
    const data = await service.getAllEtablissements();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};