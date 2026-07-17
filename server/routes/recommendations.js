const express = require('express');
const { getDb } = require('../database');

const router = express.Router();

/**
 * GET /
 * List all AI recommendations ordered by severity priority (critical first).
 */
router.get('/', (req, res) => {
  try {
    const db = getDb();

    const recommendations = db.prepare(`
      SELECT * FROM ai_recommendations
      ORDER BY
        CASE severity
          WHEN 'critical' THEN 1
          WHEN 'warning' THEN 2
          WHEN 'info' THEN 3
          WHEN 'safe' THEN 4
          ELSE 5
        END ASC,
        created_at DESC
    `).all();

    res.json(recommendations);
  } catch (err) {
    console.error('Recommendations error:', err);
    res.status(500).json({ error: 'Failed to fetch AI recommendations.' });
  }
});

module.exports = router;
