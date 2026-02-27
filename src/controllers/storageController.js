const { BackupVersion } = require('../models');

async function status(_req, res) {
  const count = await BackupVersion.count();
  const size = await BackupVersion.sum('size');
  const usedGb = Number(((size || 0) / 1024 / 1024 / 1024).toFixed(2));
  const quotaGb = 500;

  return res.json({
    backupVersions: count,
    quotaGb,
    usedGb,
    freeGb: Number((quotaGb - usedGb).toFixed(2)),
    health: usedGb > quotaGb * 0.9 ? 'critical' : 'healthy'
  });
}

async function usage(_req, res) {
  const versions = await BackupVersion.findAll({ order: [['timestamp', 'ASC']] });
  const timeline = versions.map((v) => ({ timestamp: v.timestamp, size: v.size }));
  return res.json(timeline);
}

module.exports = { status, usage };
