const { Log } = require('../models');
const { broadcast } = require('../websocket/socketHub');

async function writeLog(type, message, actor = 'system', device = 'dashboard') {
  const log = await Log.create({ type, message, actor, device });
  broadcast('log.new', log.toJSON());
  return log;
}

module.exports = { writeLog };
