const express = require('express');
const path = require('path');
const { requireAuth } = require('./middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/auth', require('./routes/authRoutes'));
app.use('/backup', requireAuth, require('./routes/backupRoutes'));
app.use('/recovery', requireAuth, require('./routes/recoveryRoutes'));
app.use('/storage', requireAuth, require('./routes/storageRoutes'));
app.use('/logs', requireAuth, require('./routes/logRoutes'));

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: error.message || 'Unexpected error' });
});

module.exports = app;
