const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'operator' }
});

const Device = sequelize.define('Device', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false }
});

const BackupJob = sequelize.define('BackupJob', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('full', 'incremental', 'differential'), allowNull: false },
  schedule: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'running', 'completed', 'failed', 'cancelled', 'paused'), defaultValue: 'pending' },
  storageTarget: { type: DataTypes.ENUM('local', 'cloud', 'hybrid'), allowNull: false },
  retentionPolicy: { type: DataTypes.JSONB, allowNull: false },
  encrypted: { type: DataTypes.BOOLEAN, defaultValue: true },
  compressed: { type: DataTypes.BOOLEAN, defaultValue: true },
  deduplication: { type: DataTypes.BOOLEAN, defaultValue: true }
});

const BackupVersion = sequelize.define('BackupVersion', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  versionNumber: { type: DataTypes.INTEGER, allowNull: false },
  size: { type: DataTypes.BIGINT, allowNull: false },
  timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  status: { type: DataTypes.STRING, defaultValue: 'available' }
});

const RecoveryJob = sequelize.define('RecoveryJob', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  status: { type: DataTypes.ENUM('pending', 'running', 'completed', 'failed', 'cancelled'), defaultValue: 'pending' },
  targetLocation: { type: DataTypes.STRING, allowNull: false },
  restoreType: { type: DataTypes.ENUM('full', 'file', 'folder', 'version'), allowNull: false },
  progress: { type: DataTypes.INTEGER, defaultValue: 0 }
});

const Log = sequelize.define('Log', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  type: { type: DataTypes.ENUM('backup', 'restore', 'error', 'system'), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  actor: { type: DataTypes.STRING, allowNull: false },
  device: { type: DataTypes.STRING, allowNull: false },
  timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
});

User.hasMany(Device, { foreignKey: 'userId' });
Device.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(BackupJob, { foreignKey: 'userId' });
BackupJob.belongsTo(User, { foreignKey: 'userId' });
BackupJob.hasMany(BackupVersion, { foreignKey: 'jobId' });
BackupVersion.belongsTo(BackupJob, { foreignKey: 'jobId' });
BackupVersion.hasMany(RecoveryJob, { foreignKey: 'backupVersionId' });
RecoveryJob.belongsTo(BackupVersion, { foreignKey: 'backupVersionId' });

module.exports = { sequelize, User, Device, BackupJob, BackupVersion, RecoveryJob, Log };
