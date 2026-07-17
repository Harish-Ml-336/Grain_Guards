const express = require('express');
const router = express.Router();
const { getDb } = require('../database');

// GET /api/settings
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get();
    
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    
    res.json({
      facilityName: settings.facility_name,
      tempThreshold: settings.temp_threshold,
      humidityThreshold: settings.humidity_threshold,
      moistureThreshold: settings.moisture_threshold,
      weatherKey: settings.weather_key,
      syncInterval: settings.sync_interval
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT /api/settings
router.put('/', (req, res) => {
  try {
    const {
      facilityName,
      tempThreshold,
      humidityThreshold,
      moistureThreshold,
      weatherKey,
      syncInterval
    } = req.body;

    const db = getDb();
    const stmt = db.prepare(`
      UPDATE settings 
      SET facility_name = ?, 
          temp_threshold = ?, 
          humidity_threshold = ?, 
          moisture_threshold = ?, 
          weather_key = ?, 
          sync_interval = ?
      WHERE id = 1
    `);
    
    stmt.run(
      facilityName,
      parseFloat(tempThreshold),
      parseFloat(humidityThreshold),
      parseFloat(moistureThreshold),
      weatherKey || '',
      parseInt(syncInterval)
    );

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
