const express = require('express');
const { getDb } = require('../database');

const router = express.Router();

/**
 * GET /
 * List all alerts with optional severity and is_read filters.
 * Ordered by created_at DESC.
 */
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { severity, is_read } = req.query;

    let query = 'SELECT * FROM alerts WHERE 1=1';
    const params = [];

    if (severity) {
      query += ' AND severity = ?';
      params.push(severity);
    }

    if (is_read !== undefined) {
      query += ' AND is_read = ?';
      params.push(parseInt(is_read));
    }

    query += ' ORDER BY created_at DESC';

    const alerts = db.prepare(query).all(...params);
    res.json(alerts);
  } catch (err) {
    console.error('List alerts error:', err);
    res.status(500).json({ error: 'Failed to fetch alerts.' });
  }
});

/**
 * GET /count
 * Return alert counts: total, unread, critical, warning, info.
 */
router.get('/count', (req, res) => {
  try {
    const db = getDb();

    const total = db.prepare('SELECT COUNT(*) as count FROM alerts').get().count;
    const unread = db.prepare('SELECT COUNT(*) as count FROM alerts WHERE is_read = 0').get().count;
    const critical = db.prepare("SELECT COUNT(*) as count FROM alerts WHERE severity = 'critical' AND is_read = 0").get().count;
    const warning = db.prepare("SELECT COUNT(*) as count FROM alerts WHERE severity = 'warning' AND is_read = 0").get().count;
    const info = db.prepare("SELECT COUNT(*) as count FROM alerts WHERE severity = 'info' AND is_read = 0").get().count;

    res.json({ total, unread, critical, warning, info });
  } catch (err) {
    console.error('Alert count error:', err);
    res.status(500).json({ error: 'Failed to fetch alert counts.' });
  }
});

/**
 * PUT /read-all
 * Mark all alerts as read.
 * NOTE: This route MUST be defined before /:id/read to avoid route conflicts.
 */
router.put('/read-all', (req, res) => {
  try {
    const db = getDb();
    const result = db.prepare('UPDATE alerts SET is_read = 1 WHERE is_read = 0').run();

    res.json({
      message: 'All alerts marked as read.',
      updatedCount: result.changes
    });
  } catch (err) {
    console.error('Mark all read error:', err);
    res.status(500).json({ error: 'Failed to mark all alerts as read.' });
  }
});

/**
 * PUT /:id/read
 * Mark a single alert as read.
 */
router.put('/:id/read', (req, res) => {
  try {
    const db = getDb();

    const alert = db.prepare('SELECT * FROM alerts WHERE id = ?').get(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found.' });
    }

    db.prepare('UPDATE alerts SET is_read = 1 WHERE id = ?').run(req.params.id);

    const updatedAlert = db.prepare('SELECT * FROM alerts WHERE id = ?').get(req.params.id);
    res.json(updatedAlert);
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Failed to mark alert as read.' });
  }
});

module.exports = router;
