const express = require('express');
const { getDb } = require('../database');

const router = express.Router();

/**
 * GET /
 * Server-Sent Events endpoint.
 * Sends a 'connected' event on initial connection, then sends 'sensor-update'
 * events every 10 seconds with slightly randomized sensor data for a random bin.
 */
router.get('/', (req, res) => {
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Send initial connected event
  res.write('event: connected\n');
  res.write(`data: ${JSON.stringify({ message: 'Connected to Grain Guards SSE', timestamp: new Date().toISOString() })}\n\n`);

  // Send sensor updates every 10 seconds
  const intervalId = setInterval(() => {
    try {
      const db = getDb();

      // Pick a random bin
      const bins = db.prepare('SELECT * FROM bins').all();
      if (bins.length === 0) return;

      const randomBin = bins[Math.floor(Math.random() * bins.length)];

      // Generate slightly randomized sensor data
      const tempVariation = (Math.random() - 0.5) * 2; // ±1
      const humidityVariation = (Math.random() - 0.5) * 4; // ±2
      const moistureVariation = (Math.random() - 0.5) * 1; // ±0.5

      const sensorData = {
        binId: randomBin.id,
        binName: randomBin.name,
        grainType: randomBin.grain_type,
        temperature: parseFloat((randomBin.temperature + tempVariation).toFixed(1)),
        humidity: parseFloat((randomBin.humidity + humidityVariation).toFixed(1)),
        moisture: parseFloat((randomBin.moisture + moistureVariation).toFixed(1)),
        healthScore: randomBin.health_score,
        status: randomBin.status,
        timestamp: new Date().toISOString()
      };

      res.write('event: sensor-update\n');
      res.write(`data: ${JSON.stringify(sensorData)}\n\n`);
    } catch (err) {
      console.error('SSE sensor update error:', err);
    }
  }, 10000);

  // Cleanup on client disconnect
  req.on('close', () => {
    clearInterval(intervalId);
  });
});

module.exports = router;
