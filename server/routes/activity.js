const express = require('express');
const { getDb } = require('../database');

const router = express.Router();

/**
 * GET /
 * List recent activity (last 20 entries), ordered by created_at DESC.
 */
router.get('/', (req, res) => {
  try {
    const db = getDb();

    const limit = parseInt(req.query.limit) || 20;

    const activities = db.prepare(
      'SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ?'
    ).all(limit);

    res.json(activities);
  } catch (err) {
    console.error('Activity log error:', err);
    res.status(500).json({ error: 'Failed to fetch activity log.' });
  }
});

module.exports = router;
