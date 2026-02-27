const { BackupJob, BackupVersion } = require('../models');
const { startBackupJob, stopBackupJob } = require('../services/backupEngine');
const { scheduleJob } = require('../services/schedulerService');
const { writeLog } = require('../services/logService');

async function create(req, res) {
  const payload = { ...req.body, userId: req.user.sub };
  const job = await BackupJob.create(payload);
  scheduleJob(job);
  await writeLog('backup', `Backup job ${job.name} created`, req.user.email, 'dashboard');
  res.status(201).json(job);
}

async function update(req, res) {
  const job = await BackupJob.findByPk(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  await job.update(req.body);
  scheduleJob(job);
  await writeLog('backup', `Backup job ${job.name} updated`, req.user.email, 'dashboard');
  return res.json(job);
}

async function remove(req, res) {
  const job = await BackupJob.findByPk(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  await job.destroy();
  await writeLog('backup', `Backup job ${job.name} deleted`, req.user.email, 'dashboard');
  return res.status(204).send();
}

async function start(req, res) {
  const job = await BackupJob.findByPk(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  await startBackupJob(job);
  return res.json({ message: 'Backup started', jobId: job.id });
}

async function stop(req, res) {
  const job = await BackupJob.findByPk(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  await stopBackupJob(job);
  return res.json({ message: 'Backup stopped', jobId: job.id });
}

async function status(req, res) {
  const jobs = await BackupJob.findAll({ order: [['updatedAt', 'DESC']] });
  return res.json(jobs);
}

async function history(req, res) {
  const versions = await BackupVersion.findAll({ order: [['timestamp', 'DESC']] });
  return res.json(versions);
}

module.exports = { create, update, remove, start, stop, status, history };
