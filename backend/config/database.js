const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const util = require('util');

const dbPath = path.join(__dirname, '../cyberapp.db'); // définit le chemin vers la base de données sqlite.

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur connexion base de données:', err.message);
  } else {
    console.log('✅ Connecté à la base de données SQLite');
  }
});

// Promisify database methods pour async/await
db.runAsync = util.promisify(db.run.bind(db));
db.getAsync = util.promisify(db.get.bind(db));
db.allAsync = util.promisify(db.all.bind(db));

// Activer les clés étrangères
db.run('PRAGMA foreign_keys = ON');

module.exports = db;