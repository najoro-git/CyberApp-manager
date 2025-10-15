// backend/config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../database/cyberapp.db');

// Créer une connexion à la base de données
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialiser les tables
function initializeDatabase() {
  db.serialize(() => {
    // Table des postes/machines
    db.run(`
      CREATE TABLE IF NOT EXISTS stations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50) NOT NULL UNIQUE,
        status VARCHAR(20) DEFAULT 'disponible',
        ip_address VARCHAR(15),
        type VARCHAR(20) DEFAULT 'standard',
        hourly_rate DECIMAL(10,2) DEFAULT 1500.00,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating stations table:', err);
      else console.log('✓ Stations table ready');
    });

    // Table des clients
    db.run(`
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(100),
        address TEXT,
        type VARCHAR(20) DEFAULT 'occasionnel',
        total_spent DECIMAL(10,2) DEFAULT 0.00,
        visit_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating clients table:', err);
      else console.log('✓ Clients table ready');
    });

    // Table des sessions
    db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        station_id INTEGER NOT NULL,
        client_id INTEGER,
        start_time DATETIME NOT NULL,
        end_time DATETIME,
        duration_minutes INTEGER,
        base_price DECIMAL(10,2),
        services_price DECIMAL(10,2) DEFAULT 0.00,
        total_price DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'active',
        payment_status VARCHAR(20) DEFAULT 'pending',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
      )
    `, (err) => {
      if (err) console.error('Error creating sessions table:', err);
      else console.log('✓ Sessions table ready');
    });

    // Table des services additionnels
    db.run(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(50),
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating services table:', err);
      else console.log('✓ Services table ready');
    });

    // Table de liaison session-services
    db.run(`
      CREATE TABLE IF NOT EXISTS session_services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) console.error('Error creating session_services table:', err);
      else console.log('✓ Session_services table ready');
    });

    // Insérer des données de test
    insertSampleData();
  });
}

// Insérer des données exemple
function insertSampleData() {
  // Vérifier si des stations existent déjà
  db.get('SELECT COUNT(*) as count FROM stations', (err, row) => {
    if (err || row.count > 0) return;

    // Insérer des postes exemple
    const stationsStmt = db.prepare(`
      INSERT INTO stations (name, status, type, hourly_rate) VALUES (?, ?, ?, ?)
    `);

    for (let i = 1; i <= 10; i++) {
      stationsStmt.run(`Poste ${i}`, 'disponible', 'standard', 1500.00);
    }
    stationsStmt.finalize();

    // Insérer des services exemple
    const servicesStmt = db.prepare(`
      INSERT INTO services (name, description, price, category) VALUES (?, ?, ?, ?)
    `);

    const services = [
      ['Impression N&B', 'Impression noir et blanc par page', 100, 'impression'],
      ['Impression Couleur', 'Impression couleur par page', 250, 'impression'],
      ['Scan', 'Numérisation de document', 200, 'scan'],
      ['Gravure CD', 'Gravure CD/DVD', 500, 'gravure'],
      ['Clé USB', 'Vente clé USB 8GB', 3000, 'vente'],
      ['Casque', 'Location casque audio', 500, 'location']
    ];

    services.forEach(service => {
      servicesStmt.run(...service);
    });
    servicesStmt.finalize();

    console.log('✓ Sample data inserted');
  });
}

// Fonction utilitaire pour exécuter des requêtes
db.runAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

db.getAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.allAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = db;