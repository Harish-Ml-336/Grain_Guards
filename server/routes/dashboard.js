const express = require('express');
const { getDb } = require('../database');

const router = express.Router();

/**
 * GET /stats
 * Returns aggregated dashboard statistics computed from the database.
 */
router.get('/stats', (req, res) => {
  try {
    const db = getDb();

    const totalBins = db.prepare('SELECT COUNT(*) as count FROM bins').get().count;
    const healthyBins = db.prepare("SELECT COUNT(*) as count FROM bins WHERE status = 'normal'").get().count;
    const warningBins = db.prepare("SELECT COUNT(*) as count FROM bins WHERE status = 'warning'").get().count;
    const criticalBins = db.prepare("SELECT COUNT(*) as count FROM bins WHERE status = 'critical'").get().count;

    const totalGrainStored = db.prepare('SELECT COALESCE(SUM(current_qty_kg), 0) as total FROM bins').get().total;
    const activeAlerts = db.prepare("SELECT COUNT(*) as count FROM alerts WHERE is_read = 0").get().count;

    const avgTemperature = db.prepare('SELECT ROUND(AVG(temperature), 1) as avg FROM bins').get().avg || 0;
    const avgHumidity = db.prepare('SELECT ROUND(AVG(humidity), 1) as avg FROM bins').get().avg || 0;

    res.json({
      totalBins,
      healthyBins,
      warningBins,
      criticalBins,
      totalGrainStored,
      activeAlerts,
      avgTemperature,
      avgHumidity
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics.' });
  }
});

/**
 * GET /weather
 * Returns hardcoded weather data for Thanjavur, Tamil Nadu.
 */
router.get('/weather', async (req, res) => {
  try {
    const db = getDb();
    const settings = db.prepare('SELECT weather_key FROM settings WHERE id = 1').get();
    const apiKey = settings && settings.weather_key ? settings.weather_key : null;

    if (apiKey) {
      const cityId = '1263243'; // Thanjavur, Tamil Nadu city ID
      const url = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${apiKey}&units=metric&cnt=40`;
      const currentUrl = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=metric`;

      const [currentRes, forecastRes] = await Promise.all([
        fetch(currentUrl),
        fetch(url)
      ]);

      if (currentRes.ok && forecastRes.ok) {
        const current = await currentRes.json();
        const forecast = await forecastRes.json();

        // Extract next 5 unique days for forecast
        const seen = new Set();
        const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const forecastData = [];
        for (const item of forecast.list) {
          const d = new Date(item.dt * 1000);
          const dayName = days[d.getDay()];
          if (!seen.has(dayName) && forecastData.length < 5) {
            seen.add(dayName);
            const wid = item.weather[0].id;
            const icon = wid >= 800 && wid < 803 ? 'sun' : wid === 803 || wid === 804 ? 'cloud' : 'cloud-sun';
            forecastData.push({ day: dayName, temp: Math.round(item.main.temp), icon });
          }
        }

        const wid = current.weather[0].id;
        const condition = current.weather[0].main;

        return res.json({
          location: `${current.name}, Tamil Nadu`,
          temperature: Math.round(current.main.temp),
          condition,
          humidity: current.main.humidity,
          wind: Math.round(current.wind.speed * 3.6), // m/s to km/h
          visibility: current.visibility ? Math.round(current.visibility / 1000) : 10,
          forecast: forecastData
        });
      }
    }

    // Fallback to hardcoded data
    res.json({
      location: 'Thanjavur, Tamil Nadu',
      temperature: 32,
      condition: 'Partly Sunny',
      humidity: 62,
      wind: 14,
      visibility: 8,
      forecast: [
        { day: 'Mon', temp: 29, icon: 'cloud-sun' },
        { day: 'Tue', temp: 30, icon: 'cloud' },
        { day: 'Wed', temp: 31, icon: 'sun' },
        { day: 'Thu', temp: 32, icon: 'cloud-sun' },
        { day: 'Fri', temp: 33, icon: 'sun' }
      ]
    });
  } catch (err) {
    console.error('Weather error:', err);
    res.status(500).json({ error: 'Failed to fetch weather data.' });
  }
});

/**
 * GET /trends
 * Returns temperature and humidity trend data from sensor_readings
 * (last 24 entries averaged across all bins).
 */
router.get('/trends', (req, res) => {
  try {
    const db = getDb();

    // Get hourly averages for the last 24 hours across all bins
    const readings = db.prepare(`
      SELECT
        strftime('%H:00', recorded_at) as hour_label,
        ROUND(AVG(temperature), 1) as avg_temp,
        ROUND(AVG(humidity), 1) as avg_humidity
      FROM sensor_readings
      GROUP BY strftime('%Y-%m-%d %H', recorded_at)
      ORDER BY recorded_at DESC
      LIMIT 24
    `).all();

    // Reverse so oldest is first (chronological order)
    readings.reverse();

    const labels = readings.map(r => r.hour_label);
    const tempData = readings.map(r => r.avg_temp);
    const humidityData = readings.map(r => r.avg_humidity);

    const latestTemp = tempData.length > 0 ? tempData[tempData.length - 1] : 0;
    const latestHumidity = humidityData.length > 0 ? humidityData[humidityData.length - 1] : 0;

    res.json({
      temperature: {
        labels,
        data: tempData,
        current: latestTemp
      },
      humidity: {
        labels,
        data: humidityData,
        current: latestHumidity
      }
    });
  } catch (err) {
    console.error('Trends error:', err);
    res.status(500).json({ error: 'Failed to fetch trend data.' });
  }
});

/**
 * GET /storage-health
 * Returns array of bin health information.
 */
router.get('/storage-health', (req, res) => {
  try {
    const db = getDb();
    const bins = db.prepare(
      'SELECT id as binId, name, grain_type as grainType, health_score as healthScore, status FROM bins'
    ).all();

    res.json(bins);
  } catch (err) {
    console.error('Storage health error:', err);
    res.status(500).json({ error: 'Failed to fetch storage health data.' });
  }
});

module.exports = router;
