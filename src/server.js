const http = require('http');
const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');
const { initializeSocketHub } = require('./websocket/socketHub');
const { scheduleExistingJobs } = require('./services/schedulerService');

async function bootstrap() {
  await sequelize.authenticate();
  await sequelize.sync();

  const server = http.createServer(app);
  initializeSocketHub(server);
  if (env.schedulerEnabled) await scheduleExistingJobs();

  server.listen(env.port, () => {
    console.log(`Backup dashboard API listening on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
