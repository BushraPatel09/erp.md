const { Log } = require('../models');

function listByType(type) {
  return async (_req, res) => {
    const rows = await Log.findAll({ where: { type }, order: [['timestamp', 'DESC']] });
    return res.json(rows);
  };
}

module.exports = {
  backup: listByType('backup'),
  recovery: listByType('restore')
};
