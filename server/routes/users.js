const express = require('express');
const { getDb } = require('../database');

const router = express.Router();

// ── Ensure the extra columns exist (safe ALTER TABLE) ────────
function ensureUserColumns() {
  const db = getDb();
  try {
    db.exec('ALTER TABLE users ADD COLUMN is_blocked INTEGER DEFAULT 0');
  } catch (err) {
    // Column already exists – ignore
  }
  try {
    db.exec('ALTER TABLE users ADD COLUMN reports_count INTEGER DEFAULT 0');
  } catch (err) {
    // Column already exists – ignore
  }
}

// Run on first require
ensureUserColumns();

/**
 * GET /
 * Return all users with relevant fields.
 */
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const users = db.prepare(
      'SELECT id, name, email, role, avatar_url, created_at, is_blocked, reports_count FROM users ORDER BY id ASC'
    ).all();
    res.json(users);
  } catch (err) {
    console.error('List users error:', err);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

/**
 * PUT /:id/block
 * Toggle is_blocked between 0 and 1.
 */
router.put('/:id/block', (req, res) => {
  try {
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const newBlockedState = user.is_blocked ? 0 : 1;
    db.prepare('UPDATE users SET is_blocked = ? WHERE id = ?').run(newBlockedState, req.params.id);

    const updatedUser = db.prepare(
      'SELECT id, name, email, role, avatar_url, created_at, is_blocked, reports_count FROM users WHERE id = ?'
    ).get(req.params.id);

    res.json(updatedUser);
  } catch (err) {
    console.error('Block user error:', err);
    res.status(500).json({ error: 'Failed to toggle user block status.' });
  }
});

/**
 * PUT /:id/report
 * Increment reports_count by 1.
 */
router.put('/:id/report', (req, res) => {
  try {
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    db.prepare('UPDATE users SET reports_count = reports_count + 1 WHERE id = ?').run(req.params.id);

    const updatedUser = db.prepare(
      'SELECT id, name, email, role, avatar_url, created_at, is_blocked, reports_count FROM users WHERE id = ?'
    ).get(req.params.id);

    res.json(updatedUser);
  } catch (err) {
    console.error('Report user error:', err);
    res.status(500).json({ error: 'Failed to report user.' });
  }
/**
 * PUT /:id/role
 * Update user role (admin, worker, public).
 */
router.put('/:id/role', (req, res) => {
  const { role } = req.body;
  if (!['admin', 'worker', 'public'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Must be admin, worker, or public.' });
  }

  try {
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);

    const updatedUser = db.prepare(
      'SELECT id, name, email, role, avatar_url, created_at, is_blocked, reports_count FROM users WHERE id = ?'
    ).get(req.params.id);

    res.json(updatedUser);
  } catch (err) {
    console.error('Update user role error:', err);
    res.status(500).json({ error: 'Failed to update user role.' });
  }
});

module.exports = router;
