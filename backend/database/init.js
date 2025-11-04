const db = require('../config/database');

const createTables = () => {
  return new Promise((resolve, reject) => {
    const tables = [
      // Table des postes/machines - MISE À JOUR AVEC COLONNES PING
      `CREATE TABLE IF NOT EXISTS stations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50) UNIQUE NOT NULL,
        type VARCHAR(50) DEFAULT 'standard',
        status VARCHAR(20) DEFAULT 'disponible',
        hourly_rate DECIMAL(10,2) DEFAULT 1000.00,
        ip_address VARCHAR(50),
        connection_status VARCHAR(20) DEFAULT 'unknown',
        last_ping_time DATETIME,
        response_time INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Table des clients
      `CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(100),
        address TEXT,
        type VARCHAR(20) DEFAULT 'occasionnel',
        visit_count INTEGER DEFAULT 0,
        total_spent DECIMAL(10,2) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Table des sessions
      `CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        station_id INTEGER NOT NULL,
        client_id INTEGER,
        start_time DATETIME NOT NULL,
        end_time DATETIME,
        duration_minutes INTEGER,
        base_price DECIMAL(10,2) DEFAULT 0,
        services_price DECIMAL(10,2) DEFAULT 0,
        total_price DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active',
        payment_status VARCHAR(20) DEFAULT 'pending',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (station_id) REFERENCES stations(id),
        FOREIGN KEY (client_id) REFERENCES clients(id)
      )`,

      // Table des services additionnels
      `CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(50),
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Table des services par session
      `CREATE TABLE IF NOT EXISTS session_services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id),
        FOREIGN KEY (service_id) REFERENCES services(id)
      )`,

      // Table des utilisateurs
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        role VARCHAR(20) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    db.serialize(() => {
      tables.forEach(tableSQL => {
        db.run(tableSQL, (err) => {
          if (err) {
            console.error('❌ Erreur création table:', err.message);
          }
        });
      });
      console.log('✅ Tables créées avec succès');
      resolve();
    });
  });
};

// Fonction pour ajouter les colonnes de ping aux tables existantes
const addPingColumnsIfNeeded = async () => {
  try {
    const tableInfo = await db.allAsync('PRAGMA table_info(stations)');
    const columnNames = tableInfo.map(col => col.name);

    const columnsToAdd = [
      {
        name: 'connection_status',
        sql: "ALTER TABLE stations ADD COLUMN connection_status VARCHAR(20) DEFAULT 'unknown'"
      },
      {
        name: 'last_ping_time',
        sql: 'ALTER TABLE stations ADD COLUMN last_ping_time DATETIME'
      },
      {
        name: 'response_time',
        sql: 'ALTER TABLE stations ADD COLUMN response_time INTEGER'
      }
    ];

    for (const column of columnsToAdd) {
      if (!columnNames.includes(column.name)) {
        await db.runAsync(column.sql);
        console.log(`✅ Colonne ${column.name} ajoutée avec succès`);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des colonnes de ping:', error.message);
    return false;
  }
};

// Fonction d'initialisation complète
const initDatabase = async () => {
  try {
    await createTables();
    await addPingColumnsIfNeeded();
    console.log('✅ Base de données initialisée avec succès');
  } catch (error) {
    console.error('❌ Erreur initialisation base de données:', error);
  }
};

module.exports = { createTables, addPingColumnsIfNeeded, initDatabase };