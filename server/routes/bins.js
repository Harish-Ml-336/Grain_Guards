const express = require('express');
const { getDb } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /
 * List all bins.
 */
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const bins = db.prepare('SELECT * FROM bins ORDER BY id ASC').all();
    res.json(bins);
  } catch (err) {
    console.error('List bins error:', err);
    res.status(500).json({ error: 'Failed to fetch bins.' });
  }
});

/**
 * GET /:id
 * Get a single bin with its latest sensor readings.
 */
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const bin = db.prepare('SELECT * FROM bins WHERE id = ?').get(req.params.id);

    if (!bin) {
      return res.status(404).json({ error: 'Bin not found.' });
    }

    // Get the latest 10 sensor readings for this bin
    const latestReadings = db.prepare(
      'SELECT * FROM sensor_readings WHERE bin_id = ? ORDER BY recorded_at DESC LIMIT 10'
    ).all(req.params.id);

    // Get active alerts for this bin
    const alerts = db.prepare(
      "SELECT * FROM alerts WHERE bin_id = ? AND is_read = 0 ORDER BY created_at DESC"
    ).all(req.params.id);

    res.json({
      ...bin,
      latestReadings,
      activeAlerts: alerts
    });
  } catch (err) {
    console.error('Get bin error:', err);
    res.status(500).json({ error: 'Failed to fetch bin details.' });
  }
});

/**
 * GET /:id/readings
 * Get sensor readings history for a specific bin.
 */
router.get('/:id/readings', (req, res) => {
  try {
    const db = getDb();

    const bin = db.prepare('SELECT id FROM bins WHERE id = ?').get(req.params.id);
    if (!bin) {
      return res.status(404).json({ error: 'Bin not found.' });
    }

    const limit = parseInt(req.query.limit) || 100;
    const readings = db.prepare(
      'SELECT * FROM sensor_readings WHERE bin_id = ? ORDER BY recorded_at DESC LIMIT ?'
    ).all(req.params.id, limit);

    res.json(readings);
  } catch (err) {
    console.error('Get readings error:', err);
    res.status(500).json({ error: 'Failed to fetch sensor readings.' });
  }
});

/**
 * POST /
 * Create a new bin (admin/worker only).
 */
router.post('/', authenticate, authorize('admin', 'worker'), (req, res) => {
  try {
    const {
      name, grain_type, block, capacity_kg, current_qty_kg,
      health_score, status, temperature, humidity, moisture,
      pest_detected, fan_on, uv_on
    } = req.body;

    if (!name || !grain_type || !block || !capacity_kg) {
      return res.status(400).json({ error: 'Name, grain_type, block, and capacity_kg are required.' });
    }

    const db = getDb();

    const result = db.prepare(`
      INSERT INTO bins (name, grain_type, block, capacity_kg, current_qty_kg,
        health_score, status, temperature, humidity, moisture,
        pest_detected, fan_on, uv_on)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name,
      grain_type,
      block,
      capacity_kg,
      current_qty_kg || 0,
      health_score || 100,
      status || 'normal',
      temperature || null,
      humidity || null,
      moisture || null,
      pest_detected || 0,
      fan_on || 0,
      uv_on || 0
    );

    const newBin = db.prepare('SELECT * FROM bins WHERE id = ?').get(result.lastInsertRowid);

    // Log the activity
    db.prepare(
      "INSERT INTO activity_log (action, description, bin_id, severity) VALUES (?, ?, ?, 'info')"
    ).run('Bin created', `New bin "${name}" created in ${block}`, result.lastInsertRowid);

    res.status(201).json(newBin);
  } catch (err) {
    console.error('Create bin error:', err);
    res.status(500).json({ error: 'Failed to create bin.' });
  }
});

/**
 * PUT /:id
 * Update an existing bin (admin/worker only).
 */
router.put('/:id', authenticate, authorize('admin', 'worker'), (req, res) => {
  try {
    const db = getDb();

    const existingBin = db.prepare('SELECT * FROM bins WHERE id = ?').get(req.params.id);
    if (!existingBin) {
      return res.status(404).json({ error: 'Bin not found.' });
    }

    const {
      name, grain_type, block, capacity_kg, current_qty_kg,
      health_score, status, temperature, humidity, moisture,
      pest_detected, fan_on, uv_on
    } = req.body;

    db.prepare(`
      UPDATE bins SET
        name = COALESCE(?, name),
        grain_type = COALESCE(?, grain_type),
        block = COALESCE(?, block),
        capacity_kg = COALESCE(?, capacity_kg),
        current_qty_kg = COALESCE(?, current_qty_kg),
        health_score = COALESCE(?, health_score),
        status = COALESCE(?, status),
        temperature = COALESCE(?, temperature),
        humidity = COALESCE(?, humidity),
        moisture = COALESCE(?, moisture),
        pest_detected = COALESCE(?, pest_detected),
        fan_on = COALESCE(?, fan_on),
        uv_on = COALESCE(?, uv_on),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name || null,
      grain_type || null,
      block || null,
      capacity_kg !== undefined ? capacity_kg : null,
      current_qty_kg !== undefined ? current_qty_kg : null,
      health_score !== undefined ? health_score : null,
      status || null,
      temperature !== undefined ? temperature : null,
      humidity !== undefined ? humidity : null,
      moisture !== undefined ? moisture : null,
      pest_detected !== undefined ? pest_detected : null,
      fan_on !== undefined ? fan_on : null,
      uv_on !== undefined ? uv_on : null,
      req.params.id
    );

    const updatedBin = db.prepare('SELECT * FROM bins WHERE id = ?').get(req.params.id);

    // Log the activity
    db.prepare(
      "INSERT INTO activity_log (action, description, bin_id, severity) VALUES (?, ?, ?, 'info')"
    ).run('Bin updated', `Bin "${updatedBin.name}" was updated`, parseInt(req.params.id));

    res.json(updatedBin);
  } catch (err) {
    console.error('Update bin error:', err);
    res.status(500).json({ error: 'Failed to update bin.' });
  }
});

/**
 * DELETE /:id
 * Delete a bin (admin only).
 */
router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  try {
    const db = getDb();

    const bin = db.prepare('SELECT * FROM bins WHERE id = ?').get(req.params.id);
    if (!bin) {
      return res.status(404).json({ error: 'Bin not found.' });
    }

    // Delete related records first
    db.prepare('DELETE FROM sensor_readings WHERE bin_id = ?').run(req.params.id);
    db.prepare('DELETE FROM alerts WHERE bin_id = ?').run(req.params.id);
    db.prepare('DELETE FROM activity_log WHERE bin_id = ?').run(req.params.id);

    // Delete the bin
    db.prepare('DELETE FROM bins WHERE id = ?').run(req.params.id);

    // Log the activity
    db.prepare(
      "INSERT INTO activity_log (action, description, severity) VALUES (?, ?, 'warning')"
    ).run('Bin deleted', `Bin "${bin.name}" (${bin.grain_type}) was deleted from ${bin.block}`);

    res.json({ message: `Bin "${bin.name}" has been deleted.` });
  } catch (err) {
    console.error('Delete bin error:', err);
    res.status(500).json({ error: 'Failed to delete bin.' });
  }
});

module.exports = router;
