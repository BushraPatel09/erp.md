const { BackupJob, BackupVersion } = require('../models');
const { writeLog } = require('./logService');
const { broadcast } = require('../websocket/socketHub');

const runningJobs = new Map();

function calculateNextProgress(progress) {
  return Math.min(100, progress + Math.floor(Math.random() * 22) + 8);
}

async function createBackupVersion(jobId, versionNumber) {
  const size = Math.floor(Math.random() * 400000000) + 50000000;
  return BackupVersion.create({ jobId, versionNumber, size });
}

async function startBackupJob(job) {
  if (runningJobs.has(job.id)) return;

  await job.update({ status: 'running' });
  await writeLog('backup', `Backup job ${job.name} started`, 'system', 'scheduler');

  let progress = 0;
  const interval = setInterval(async () => {
    progress = calculateNextProgress(progress);
    broadcast('backup.progress', { jobId: job.id, progress, speedMbps: Number((Math.random() * 80 + 20).toFixed(1)) });

    if (progress >= 100) {
      clearInterval(interval);
      runningJobs.delete(job.id);
      await job.update({ status: 'completed' });
      const versions = await BackupVersion.count({ where: { jobId: job.id } });
      await createBackupVersion(job.id, versions + 1);
      await writeLog('backup', `Backup job ${job.name} completed successfully`, 'system', 'backup-engine');
      broadcast('backup.status', { jobId: job.id, status: 'completed' });
    }
  }, 1200);

  runningJobs.set(job.id, { interval });
}

async function stopBackupJob(job) {
  const tracked = runningJobs.get(job.id);
  if (tracked) {
    clearInterval(tracked.interval);
    runningJobs.delete(job.id);
  }
  await job.update({ status: 'cancelled' });
  await writeLog('backup', `Backup job ${job.name} cancelled`, 'operator', 'dashboard');
  broadcast('backup.status', { jobId: job.id, status: 'cancelled' });
}

module.exports = { startBackupJob, stopBackupJob, calculateNextProgress };
