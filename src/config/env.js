require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'backup-dashboard-secret',
  jwtIssuer: process.env.JWT_ISSUER || 'backup-dashboard',
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/backup_dashboard',
  schedulerEnabled: process.env.SCHEDULER_ENABLED !== 'false'
};
