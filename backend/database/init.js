const db = require('../config/database');
const { createTables } = require('./schema');
const bcrypt = require('bcryptjs');

const initDatabase = async () => {
  console.log('🔄 Initialisation de la base de données...');
  
  // Créer les tables
  createTables();

  // Attendre un peu pour que les tables soient créées
  setTimeout(async () => {
    // Insérer des tarifs par défaut
    const tarifs = [
      { nom: 'Tarif Horaire', type: 'horaire', prix: 1000, duree_minutes: 60, description: '1 heure de jeu' },
      { nom: 'Tarif 30 min', type: 'demi_heure', prix: 500, duree_minutes: 30, description: '30 minutes de jeu' },
      { nom: 'Tarif 2 heures', type: 'forfait', prix: 1800, duree_minutes: 120, description: 'Forfait 2 heures' },
      { nom: 'Tarif Nuit', type: 'nuit', prix: 3000, duree_minutes: 480, description: 'Toute la nuit (8h)' }
    ];

    tarifs.forEach(tarif => {
      db.run(
        `INSERT INTO tarifs (nom, type, prix, duree_minutes, description) VALUES (?, ?, ?, ?, ?)`,
        [tarif.nom, tarif.type, tarif.prix, tarif.duree_minutes, tarif.description],
        (err) => {
          if (err && !err.message.includes('UNIQUE constraint failed')) {
            console.error('Erreur insertion tarif:', err.message);
          }
        }
      );
    });

    // Insérer des postes par défaut
    const postes = [
      { numero_poste: 'PC01', nom: 'Poste Gaming 1', type: 'PC', ip_address: '192.168.1.101' },
      { numero_poste: 'PC02', nom: 'Poste Gaming 2', type: 'PC', ip_address: '192.168.1.102' },
      { numero_poste: 'PC03', nom: 'Poste Gaming 3', type: 'PC', ip_address: '192.168.1.103' },
      { numero_poste: 'PS01', nom: 'PlayStation 5 - 1', type: 'Console', ip_address: '192.168.1.201' },
      { numero_poste: 'PS02', nom: 'PlayStation 5 - 2', type: 'Console', ip_address: '192.168.1.202' }
    ];

    postes.forEach(poste => {
      db.run(
        `INSERT INTO postes (numero_poste, nom, type, ip_address) VALUES (?, ?, ?, ?)`,
        [poste.numero_poste, poste.nom, poste.type, poste.ip_address],
        (err) => {
          if (err && !err.message.includes('UNIQUE constraint failed')) {
            console.error('Erreur insertion poste:', err.message);
          }
        }
      );
    });

    // Insérer des services additionnels
    const services = [
      { nom: 'Boisson fraîche', prix: 500, categorie: 'Boisson', description: 'Coca, Fanta, Sprite' },
      { nom: 'Eau minérale', prix: 300, categorie: 'Boisson', description: 'Eau 50cl' },
      { nom: 'Snack', prix: 800, categorie: 'Nourriture', description: 'Chips, biscuits' },
      { nom: 'Impression N&B', prix: 100, categorie: 'Service', description: 'Impression noir et blanc par page' },
      { nom: 'Impression Couleur', prix: 200, categorie: 'Service', description: 'Impression couleur par page' }
    ];

    services.forEach(service => {
      db.run(
        `INSERT INTO services (name, prix, categorie, description) VALUES (?, ?, ?, ?)`,
        [service.nom, service.prix, service.categorie, service.description],
        (err) => {
          if (err && !err.message.includes('UNIQUE constraint failed')) {
            console.error('Erreur insertion service:', err.message);
          }
        }
      );
    });

    // Créer un utilisateur admin par défaut
    const password = await bcrypt.hash('admin123', 10);
    db.run(
      `INSERT INTO users (username, password, nom, role) VALUES (?, ?, ?, ?)`,
      ['admin', password, 'Administrateur', 'admin'],
      (err) => {
        if (err && !err.message.includes('UNIQUE constraint failed')) {
          console.error('Erreur insertion user:', err.message);
        } else if (!err) {
          console.log('👤 Utilisateur admin créé (username: admin, password: admin123)');
        }
      }
    );

    console.log('✅ Base de données initialisée avec succès !');
  }, 500);
};

// Exécuter l'initialisation
initDatabase();