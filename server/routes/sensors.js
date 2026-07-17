const express = require('express');
const { getDb } = require('../database');

const router = express.Router();

/**
 * POST /:binId/ingest
 * Accept sensor data from ESP32, update the bin, insert a reading,
 * and auto-trigger fan/UV controls + alerts based on thresholds.
 */
router.post('/:binId/ingest', (req, res) => {
  try {
    const db = getDb();
    const { binId } = req.params;
    const { temperature, humidity, moisture, pest_detected } = req.body;

    // Verify the bin exists
    const bin = db.prepare('SELECT * FROM bins WHERE id = ?').get(binId);
    if (!bin) {
      return res.status(404).json({ error: 'Bin not found.' });
    }

    const newAlerts = [];

    // ── Auto-logic: determine control actions ──────────────
    let fan_on = bin.fan_on;
    let uv_on = bin.uv_on;
    let status = bin.status;

    // Temperature > 35 → turn fan on + critical alert
    if (temperature > 35) {
      fan_on = 1;
      status = 'critical';
      const alertMsg = `Temperature at ${temperature}°C in ${bin.name} (${bin.grain_type}). Critical level exceeded.`;
      db.prepare(
        "INSERT INTO alerts (bin_id, type, severity, message) VALUES (?, 'temperature', 'critical', ?)"
      ).run(binId, alertMsg);
      newAlerts.push({ type: 'temperature', severity: 'critical', message: alertMsg });
    }

    // Pest detected → turn UV on + critical alert
    if (pest_detected === 1) {
      uv_on = 1;
      status = 'critical';
      const alertMsg = `Pest activity detected in ${bin.name} (${bin.grain_type}). Immediate action required.`;
      db.prepare(
        "INSERT INTO alerts (bin_id, type, severity, message) VALUES (?, 'pest', 'critical', ?)"
      ).run(binId, alertMsg);
      newAlerts.push({ type: 'pest', severity: 'critical', message: alertMsg });
    }

    // Humidity > 65 → warning alert
    if (humidity > 65) {
      if (status !== 'critical') status = 'warning';
      const alertMsg = `Humidity at ${humidity}% in ${bin.name} (${bin.grain_type}). Exceeds safe threshold of 65%.`;
      db.prepare(
        "INSERT INTO alerts (bin_id, type, severity, message) VALUES (?, 'humidity', 'warning', ?)"
      ).run(binId, alertMsg);
      newAlerts.push({ type: 'humidity', severity: 'warning', message: alertMsg });
    }

    // ── Update the bin with new sensor data + control state ──
    db.prepare(`
      UPDATE bins SET
        temperature = ?,
        humidity = ?,
        moisture = ?,
        pest_detected = ?,
        fan_on = ?,
        uv_on = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(temperature, humidity, moisture, pest_detected || 0, fan_on, uv_on, status, binId);

    // ── Insert sensor reading ────────────────────────────────
    db.prepare(
      'INSERT INTO sensor_readings (bin_id, temperature, humidity, moisture) VALUES (?, ?, ?, ?)'
    ).run(binId, temperature, humidity, moisture);

    // ── Log activity ─────────────────────────────────────────
    db.prepare(
      "INSERT INTO activity_log (action, description, bin_id, severity) VALUES (?, ?, ?, 'info')"
    ).run(
      `Sensor data ingested for ${bin.name}`,
      `Temp: ${temperature}°C, Humidity: ${humidity}%, Moisture: ${moisture}%`,
      parseInt(binId)
    );

    const updatedBin = db.prepare('SELECT * FROM bins WHERE id = ?').get(binId);

    res.json({ success: true, bin: updatedBin, alerts: newAlerts });
  } catch (err) {
    console.error('Sensor ingest error:', err);
    res.status(500).json({ error: 'Failed to ingest sensor data.' });
  }
});

/**
 * POST /:binId/control
 * Manually set fan_on and/or uv_on for a bin.
 */
router.post('/:binId/control', (req, res) => {
  try {
    const db = getDb();
    const { binId } = req.params;
    const { fan_on, uv_on } = req.body;

    const bin = db.prepare('SELECT * FROM bins WHERE id = ?').get(binId);
    if (!bin) {
      return res.status(404).json({ error: 'Bin not found.' });
    }

    db.prepare(`
      UPDATE bins SET
        fan_on = COALESCE(?, fan_on),
        uv_on = COALESCE(?, uv_on),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      fan_on !== undefined ? fan_on : null,
      uv_on !== undefined ? uv_on : null,
      binId
    );

    // Log the control action
    const actions = [];
    if (fan_on !== undefined) actions.push(`Fan ${fan_on ? 'ON' : 'OFF'}`);
    if (uv_on !== undefined) actions.push(`UV ${uv_on ? 'ON' : 'OFF'}`);

    db.prepare(
      "INSERT INTO activity_log (action, description, bin_id, severity) VALUES (?, ?, ?, 'info')"
    ).run(
      `Manual control: ${bin.name}`,
      actions.join(', '),
      parseInt(binId)
    );

    const updatedBin = db.prepare('SELECT * FROM bins WHERE id = ?').get(binId);
    res.json(updatedBin);
  } catch (err) {
    console.error('Sensor control error:', err);
    res.status(500).json({ error: 'Failed to update bin controls.' });
  }
});

/**
 * GET /:binId/readings
 * Return the last 100 sensor readings for a bin, newest first.
 */
router.get('/:binId/readings', (req, res) => {
  try {
    const db = getDb();
    const { binId } = req.params;

    const bin = db.prepare('SELECT id FROM bins WHERE id = ?').get(binId);
    if (!bin) {
      return res.status(404).json({ error: 'Bin not found.' });
    }

    const readings = db.prepare(
      'SELECT * FROM sensor_readings WHERE bin_id = ? ORDER BY recorded_at DESC LIMIT 100'
    ).all(binId);

    res.json(readings);
  } catch (err) {
    console.error('Get sensor readings error:', err);
    res.status(500).json({ error: 'Failed to fetch sensor readings.' });
  }
});

module.exports = router;
