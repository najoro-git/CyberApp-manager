const db = require('../config/database');

const createTables = () => {
  return new Promise((resolve, reject) => {
    const tables = [
      // Table des postes/machines
      `CREATE TABLE IF NOT EXISTS postes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero_poste VARCHAR(50) UNIQUE NOT NULL,
        nom VARCHAR(100) NOT NULL,
        type VARCHAR(50) DEFAULT 'PC',
        ip_address VARCHAR(50),
        statut VARCHAR(20) DEFAULT 'disponible',
        dernier_ping DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Table des clients
      `CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100),
        telephone VARCHAR(20),
        email VARCHAR(100),
        type_client VARCHAR(20) DEFAULT 'occasionnel',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Table des tarifs
      `CREATE TABLE IF NOT EXISTS tarifs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        prix DECIMAL(10,2) NOT NULL,
        duree_minutes INTEGER,
        description TEXT,
        actif BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Table des sessions
      `CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        poste_id INTEGER NOT NULL,
        client_id INTEGER,
        heure_debut DATETIME NOT NULL,
        heure_fin DATETIME,
        duree_minutes INTEGER,
        tarif_id INTEGER,
        montant_total DECIMAL(10,2) DEFAULT 0,
        statut VARCHAR(20) DEFAULT 'en_cours',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (poste_id) REFERENCES postes(id),
        FOREIGN KEY (client_id) REFERENCES clients(id),
        FOREIGN KEY (tarif_id) REFERENCES tarifs(id)
      )`,

      // Table des services additionnels
      `CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        prix DECIMAL(10,2) NOT NULL,
        categorie VARCHAR(50),
        description TEXT,
        actif BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Table des services commandés
      `CREATE TABLE IF NOT EXISTS session_services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        quantite INTEGER DEFAULT 1,
        prix_unitaire DECIMAL(10,2) NOT NULL,
        montant_total DECIMAL(10,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id),
        FOREIGN KEY (service_id) REFERENCES services(id)
      )`,

      // Table des utilisateurs
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nom VARCHAR(100),
        role VARCHAR(20) DEFAULT 'admin',
        actif BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    db.serialize(() => {
      tables.forEach(tableSQL => {
        db.run(tableSQL);
      });
      console.log('✅ Tables créées avec succès');
      resolve();
    });
  });
};

module.exports = { createTables };