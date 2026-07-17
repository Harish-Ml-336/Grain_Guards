const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

let db = null;

/**
 * Initialize the SQLite database, create tables, and seed data.
 * Returns the database instance.
 */
function initializeDatabase() {
  const dbPath = path.join(__dirname, 'grain_guards.db');
  db = new Database(dbPath);

  // Enable WAL mode for better concurrency
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  createTables();
  seedData();

  console.log('Database initialized successfully.');
  return db;
}

/**
 * Create all database tables if they don't exist.
 */
function createTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'public' CHECK(role IN ('admin','worker','public')),
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      grain_type TEXT NOT NULL,
      block TEXT NOT NULL,
      capacity_kg REAL NOT NULL,
      current_qty_kg REAL NOT NULL,
      health_score REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'normal' CHECK(status IN ('normal','warning','critical')),
      temperature REAL,
      humidity REAL,
      moisture REAL,
      pest_detected INTEGER DEFAULT 0,
      fan_on INTEGER DEFAULT 0,
      uv_on INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bin_id INTEGER REFERENCES bins(id),
      type TEXT NOT NULL,
      severity TEXT NOT NULL CHECK(severity IN ('info','warning','critical')),
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sensor_readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bin_id INTEGER REFERENCES bins(id),
      temperature REAL,
      humidity REAL,
      moisture REAL,
      recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      description TEXT,
      bin_id INTEGER REFERENCES bins(id),
      severity TEXT DEFAULT 'info',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ai_recommendations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      severity TEXT NOT NULL CHECK(severity IN ('critical','warning','info','safe')),
      icon TEXT,
      bin_ids TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      facility_name TEXT NOT NULL,
      temp_threshold REAL NOT NULL,
      humidity_threshold REAL NOT NULL,
      moisture_threshold REAL NOT NULL,
      weather_key TEXT,
      sync_interval INTEGER NOT NULL
    );
  `);
}

/**
 * Seed the database with initial data (only if tables are empty).
 */
function seedData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) {
    return; // Already seeded
  }

  console.log('Seeding database with initial data...');

  // ──────────────────────────────────────────────
  // USERS
  // ──────────────────────────────────────────────
  const salt = bcrypt.genSaltSync(10);
  const insertUser = db.prepare(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
  );

  insertUser.run('Admin Farmer', 'admin@grainguards.com', bcrypt.hashSync('admin123', salt), 'admin');
  insertUser.run('Ravi Kumar', 'worker@grainguards.com', bcrypt.hashSync('worker123', salt), 'worker');
  insertUser.run('Anitha S', 'user@grainguards.com', bcrypt.hashSync('user123', salt), 'public');

  // ──────────────────────────────────────────────
  // BINS
  // ──────────────────────────────────────────────
  const insertBin = db.prepare(`
    INSERT INTO bins (name, grain_type, block, capacity_kg, current_qty_kg,
      health_score, status, temperature, humidity, moisture,
      pest_detected, fan_on, uv_on)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const binsData = [
    ['Bin 1', 'Rice',    'Block A', 5000, 3800, 92, 'normal',   28, 58, 12,   0, 0, 0],
    ['Bin 2', 'Wheat',   'Block A', 4000, 3500, 43, 'critical', 36, 72, 16,   1, 1, 1],
    ['Bin 3', 'Ragi',    'Block B', 3000, 2100, 78, 'warning',  30, 64, 13,   0, 0, 0],
    ['Bin 4', 'Maize',   'Block B', 6000, 4200, 85, 'normal',   31, 61, 13.5, 0, 0, 0],
    ['Bin 5', 'Millets', 'Block C', 2500, 1800, 65, 'warning',  33, 68, 14.8, 0, 1, 0],
    ['Bin 6', 'Pulses',  'Block C', 3500, 2900, 95, 'normal',   29, 55, 11,   0, 0, 0],
  ];

  for (const bin of binsData) {
    insertBin.run(...bin);
  }

  // ──────────────────────────────────────────────
  // ALERTS
  // ──────────────────────────────────────────────
  const insertAlert = db.prepare(
    'INSERT INTO alerts (bin_id, type, severity, message) VALUES (?, ?, ?, ?)'
  );

  insertAlert.run(2, 'pest',        'critical', 'Pest activity detected in Bin 2 (Wheat). Immediate fumigation required.');
  insertAlert.run(2, 'humidity',    'critical', 'Humidity at 72% in Bin 2 (Wheat). Exceeds safe threshold of 65%.');
  insertAlert.run(3, 'moisture',    'warning',  'Moisture rising in Bin 3 (Ragi). Currently at 13% - approaching warning level.');
  insertAlert.run(5, 'temperature', 'warning',  'Temperature rising in Bin 5 (Millets). Currently at 33°C.');
  insertAlert.run(2, 'temperature', 'critical', 'Temperature at 36°C in Bin 2 (Wheat). Critical level exceeded.');

  // ──────────────────────────────────────────────
  // ACTIVITY LOG (with specific timestamps for today)
  // ──────────────────────────────────────────────
  const insertActivity = db.prepare(
    'INSERT INTO activity_log (action, description, bin_id, severity, created_at) VALUES (?, ?, ?, ?, ?)'
  );

  // Build timestamps for today
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

  insertActivity.run('Pest detected in Bin 2 – Wheat', 'Critical pest activity detected requiring immediate fumigation', 2, 'critical', `${todayStr}T09:15:00`);
  insertActivity.run('Fan activated in Bin 2', 'Ventilation fan turned on to reduce humidity levels', 2, 'info', `${todayStr}T09:10:00`);
  insertActivity.run('Humidity alert: Bin 2 at 72%', 'Humidity exceeds safe threshold of 65%', 2, 'warning', `${todayStr}T08:50:00`);
  insertActivity.run('Moisture rising in Bin 3', 'Moisture level approaching warning threshold', 3, 'warning', `${todayStr}T08:30:00`);
  insertActivity.run('Bin 1 sensor data updated', 'Routine sensor data collection completed', 1, 'info', `${todayStr}T08:15:00`);
  insertActivity.run('Daily backup completed', 'Automated daily backup completed successfully', null, 'info', `${todayStr}T07:00:00`);

  // ──────────────────────────────────────────────
  // AI RECOMMENDATIONS
  // ──────────────────────────────────────────────
  const insertRecommendation = db.prepare(
    'INSERT INTO ai_recommendations (title, description, severity, icon, bin_ids) VALUES (?, ?, ?, ?, ?)'
  );

  insertRecommendation.run(
    'Immediate Action Required',
    'Bin 2 (Wheat) has pest activity + high humidity. Activate UV treatment and schedule fumigation within 24 hours.',
    'critical', 'alert-triangle', '2'
  );
  insertRecommendation.run(
    'Increase Ventilation',
    'Bin 3 (Ragi) moisture is trending upward. Turn on fan to prevent mold formation.',
    'warning', 'wind', '3'
  );
  insertRecommendation.run(
    'Temperature Watch',
    'Bin 5 (Millets) temperature is rising. Monitor closely and activate cooling if it exceeds 34°C.',
    'warning', 'thermometer', '5'
  );
  insertRecommendation.run(
    'Storage Safe',
    'Bin 1 (Rice) and Bin 6 (Pulses) are in optimal condition. Expected shelf life: 8+ months.',
    'safe', 'check-circle', '1,6'
  );
  insertRecommendation.run(
    'Expected Shelf Life',
    'Overall storage health is 76%. With proper maintenance, average shelf life is 6 months.',
    'info', 'info', 'all'
  );

  // ──────────────────────────────────────────────
  // SENSOR READINGS (24 hourly readings for each bin)
  // ──────────────────────────────────────────────
  const insertReading = db.prepare(
    'INSERT INTO sensor_readings (bin_id, temperature, humidity, moisture, recorded_at) VALUES (?, ?, ?, ?, ?)'
  );

  const binCurrentValues = [
    { id: 1, temp: 28,   humidity: 58, moisture: 12 },
    { id: 2, temp: 36,   humidity: 72, moisture: 16 },
    { id: 3, temp: 30,   humidity: 64, moisture: 13 },
    { id: 4, temp: 31,   humidity: 61, moisture: 13.5 },
    { id: 5, temp: 33,   humidity: 68, moisture: 14.8 },
    { id: 6, temp: 29,   humidity: 55, moisture: 11 },
  ];

  const insertManyReadings = db.transaction(() => {
    const now = new Date();

    for (const bin of binCurrentValues) {
      for (let hoursAgo = 23; hoursAgo >= 0; hoursAgo--) {
        const readingTime = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
        const isoTime = readingTime.toISOString().replace('T', ' ').substring(0, 19);

        // Deterministic variation based on bin id + hoursAgo (simulating gradual change)
        const seed = bin.id * 100 + hoursAgo;
        const r1 = ((seed * 9301 + 49297) % 233280) / 233280;
        const r2 = ((seed * 5912 + 7391) % 233280) / 233280;
        const r3 = ((seed * 3491 + 12347) % 233280) / 233280;
        const tempVariation = (r1 - 0.5) * 2 * (hoursAgo / 24 + 0.5);
        const humidityVariation = (r2 - 0.5) * 4 * (hoursAgo / 24 + 0.5);
        const moistureVariation = (r3 - 0.5) * 1 * (hoursAgo / 24 + 0.5);

        let temp, humidity, moisture;

        if (hoursAgo === 0) {
          // Latest reading matches current bin values exactly
          temp = bin.temp;
          humidity = bin.humidity;
          moisture = bin.moisture;
        } else {
          temp = parseFloat((bin.temp + tempVariation).toFixed(1));
          humidity = parseFloat((bin.humidity + humidityVariation).toFixed(1));
          moisture = parseFloat((bin.moisture + moistureVariation).toFixed(1));
        }

        insertReading.run(bin.id, temp, humidity, moisture, isoTime);
      }
    }
  });

  insertManyReadings();

  // ──────────────────────────────────────────────
  // SETTINGS
  // ──────────────────────────────────────────────
  const insertSettings = db.prepare(
    'INSERT OR IGNORE INTO settings (id, facility_name, temp_threshold, humidity_threshold, moisture_threshold, weather_key, sync_interval) VALUES (1, ?, ?, ?, ?, ?, ?)'
  );
  insertSettings.run('Grain Guards Smart Warehouse', 34, 65, 14.5, '', 10);

  console.log('Database seeding complete.');
}

/**
 * Get the initialized database instance.
 * @returns {Database} The better-sqlite3 database instance.
 */
function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

module.exports = { initializeDatabase, getDb };
