const db = require('../config/database');
const { createTables } = require('./schema');
const bcrypt = require('bcryptjs');

const initDatabase = async () => {
  console.log('🔄 Initialisation de la base de données...');
  
  // Créer les tables
  await createTables();
  
  // Attendre que les tables soient créées
  setTimeout(async () => {
    // Vérifier et insérer des postes par défaut
    const stationCount = await db.getAsync('SELECT COUNT(*) as count FROM stations');
    
    if (stationCount.count === 0) {
      const stations = [
        { name: 'Poste 1', type: 'Gaming', hourly_rate: 1000, ip_address: '192.168.1.101' },
        { name: 'Poste 2', type: 'Gaming', hourly_rate: 1000, ip_address: '192.168.1.102' },
        { name: 'Poste 3', type: 'Standard', hourly_rate: 800, ip_address: '192.168.1.103' },
        { name: 'Poste 4', type: 'Standard', hourly_rate: 800, ip_address: '192.168.1.104' },
        { name: 'Poste 5', type: 'Gaming', hourly_rate: 1000, ip_address: '192.168.1.105' },
        { name: 'PS5-1', type: 'Console', hourly_rate: 1500, ip_address: '192.168.1.201' },
        { name: 'PS5-2', type: 'Console', hourly_rate: 1500, ip_address: '192.168.1.202' },
        { name: 'Poste 8', type: 'Standard', hourly_rate: 800, ip_address: '192.168.1.108' },
        { name: 'Poste 9', type: 'Gaming', hourly_rate: 1000, ip_address: '192.168.1.109' },
        { name: 'Poste 10', type: 'Standard', hourly_rate: 800, ip_address: '192.168.1.110' },
      ];

      for (const station of stations) {
        await db.runAsync(
          'INSERT INTO stations (name, type, hourly_rate, ip_address) VALUES (?, ?, ?, ?)',
          [station.name, station.type, station.hourly_rate, station.ip_address]
        );
      }
      console.log('✅ Postes par défaut créés');
    }

    // Vérifier et insérer des services par défaut
    const serviceCount = await db.getAsync('SELECT COUNT(*) as count FROM services');
    
    if (serviceCount.count === 0) {
      const services = [
        { name: 'Impression N&B', price: 100, category: 'impression', description: 'Impression noir et blanc par page' },
        { name: 'Impression Couleur', price: 200, category: 'impression', description: 'Impression couleur par page' },
        { name: 'Scan', price: 150, category: 'scan', description: 'Numérisation de document' },
        { name: 'Clé USB 8GB', price: 5000, category: 'consommable', description: 'Clé USB 8 Go' },
        { name: 'Clé USB 16GB', price: 8000, category: 'consommable', description: 'Clé USB 16 Go' },
        { name: 'CD Vierge', price: 500, category: 'consommable', description: 'CD-R vierge' },
        { name: 'Boisson fraîche', price: 1000, category: 'boisson', description: 'Coca, Fanta, Sprite' },
        { name: 'Eau minérale', price: 500, category: 'boisson', description: 'Eau 50cl' },
        { name: 'Snack', price: 1500, category: 'nourriture', description: 'Chips, biscuits' },
      ];

      for (const service of services) {
        await db.runAsync(
          'INSERT INTO services (name, price, category, description) VALUES (?, ?, ?, ?)',
          [service.name, service.price, service.category, service.description]
        );
      }
      console.log('✅ Services par défaut créés');
    }

    // Créer un utilisateur admin par défaut
    const userCount = await db.getAsync('SELECT COUNT(*) as count FROM users');
    
    if (userCount.count === 0) {
      const password = await bcrypt.hash('admin123', 10);
      await db.runAsync(
        'INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)',
        ['admin', password, 'Administrateur', 'admin']
      );
      console.log('👤 Utilisateur admin créé');
      console.log('   Username: admin');
      console.log('   Password: admin123');
    }

    console.log('✅ Base de données initialisée avec succès !');
  }, 500);
};

// Exécuter si appelé directement
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };