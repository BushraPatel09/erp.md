const { RecoveryJob, BackupVersion } = require('../models');
const { writeLog } = require('./logService');
const { broadcast } = require('../websocket/socketHub');

const recoveryTracks = new Map();

async function startRecovery({ backupVersionId, targetLocation, restoreType, actor = 'operator' }) {
  const backupVersion = await BackupVersion.findByPk(backupVersionId);
  if (!backupVersion) throw new Error('Backup version not found');

  const recovery = await RecoveryJob.create({ backupVersionId, targetLocation, restoreType, status: 'running', progress: 0 });
  await writeLog('restore', `Recovery job ${recovery.id} started for backup version ${backupVersionId}`, actor, 'dashboard');

  let progress = 0;
  const interval = setInterval(async () => {
    progress = Math.min(100, progress + Math.floor(Math.random() * 18) + 10);
    await recovery.update({ progress });
    broadcast('recovery.progress', { recoveryId: recovery.id, progress });

    if (progress >= 100) {
      clearInterval(interval);
      recoveryTracks.delete(recovery.id);
      await recovery.update({ status: 'completed' });
      await writeLog('restore', `Recovery job ${recovery.id} completed`, actor, 'recovery-engine');
      broadcast('recovery.status', { recoveryId: recovery.id, status: 'completed' });
    }
  }, 1300);

  recoveryTracks.set(recovery.id, { interval });
  return recovery;
}

module.exports = { startRecovery };
