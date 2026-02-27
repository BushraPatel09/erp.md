const cron = require('node-cron');
const { BackupJob } = require('../models');
const { startBackupJob } = require('./backupEngine');
const { writeLog } = require('./logService');

const tasks = new Map();

function scheduleJob(job) {
  if (tasks.has(job.id)) tasks.get(job.id).stop();

  if (!cron.validate(job.schedule)) {
    writeLog('error', `Invalid cron schedule for job ${job.name}: ${job.schedule}`);
    return;
  }

  const task = cron.schedule(job.schedule, async () => {
    const latest = await BackupJob.findByPk(job.id);
    if (!latest || latest.status === 'paused') return;
    await startBackupJob(latest);
  });

  tasks.set(job.id, task);
}

async function scheduleExistingJobs() {
  const jobs = await BackupJob.findAll();
  jobs.forEach(scheduleJob);
}

module.exports = { scheduleJob, scheduleExistingJobs };
