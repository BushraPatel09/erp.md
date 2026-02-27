const { RecoveryJob } = require('../models');
const { startRecovery } = require('../services/recoveryEngine');

async function start(req, res) {
  const recovery = await startRecovery({ ...req.body, actor: req.user.email });
  return res.status(201).json(recovery);
}

async function status(req, res) {
  const jobs = await RecoveryJob.findAll({ order: [['updatedAt', 'DESC']] });
  return res.json(jobs);
}

async function history(req, res) {
  const jobs = await RecoveryJob.findAll({ order: [['createdAt', 'DESC']] });
  return res.json(jobs);
}

module.exports = { start, status, history };
