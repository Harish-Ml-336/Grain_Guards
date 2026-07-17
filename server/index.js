require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { initializeDatabase } = require('./database');

// Initialize the database (creates tables + seeds data)
initializeDatabase();

// Import route handlers
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const binsRoutes = require('./routes/bins');
const alertsRoutes = require('./routes/alerts');
const recommendationsRoutes = require('./routes/recommendations');
const activityRoutes = require('./routes/activity');
const eventsRoutes = require('./routes/events');
const settingsRoutes = require('./routes/settings');
const sensorsRoutes = require('./routes/sensors');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = 5000;

// ── Middleware ────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());     // Parse JSON request bodies

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/auth', authLimiter);

// ── API Routes ───────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/bins', binsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/sensors', sensorsRoutes);
app.use('/api/users', usersRoutes);

// ── Health check ─────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Grain Guards API',
    timestamp: new Date().toISOString()
  });
});

// ── 404 handler ──────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// ── Global error handler ─────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ── Process-level error handlers ─────────────────────
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

// ── Start server ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Grain Guards API running on port ${PORT}`);
});

module.exports = app;
