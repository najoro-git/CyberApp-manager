// backend/routes/clients.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Récupérer tous les clients
router.get('/', async (req, res) => {
  try {
    const { type, search } = req.query;
    let query = 'SELECT * FROM clients WHERE 1=1';
    const params = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (search) {
      query += ' AND (name LIKE ? OR phone LIKE ? OR email LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    query += ' ORDER BY created_at DESC';

    const clients = await db.allAsync(query, params);
    res.json({
      success: true,
      data: clients,
      count: clients.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clients',
      error: error.message
    });
  }
});

// GET - Récupérer un client par ID
router.get('/:id', async (req, res) => {
  try {
    const client = await db.getAsync(
      'SELECT * FROM clients WHERE id = ?',
      [req.params.id]
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Récupérer l'historique des sessions
    const sessions = await db.allAsync(
      `SELECT s.*, st.name as station_name
       FROM sessions s
       LEFT JOIN stations st ON s.station_id = st.id
       WHERE s.client_id = ?
       ORDER BY s.created_at DESC
       LIMIT 10`,
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        ...client,
        recent_sessions: sessions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching client',
      error: error.message
    });
  }
});

// POST - Créer un nouveau client
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, address, type } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Client name is required'
      });
    }

    const result = await db.runAsync(
      `INSERT INTO clients (name, phone, email, address, type)
       VALUES (?, ?, ?, ?, ?)`,
      [name, phone, email, address, type || 'occasionnel']
    );

    const newClient = await db.getAsync(
      'SELECT * FROM clients WHERE id = ?',
      [result.id]
    );

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: newClient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating client',
      error: error.message
    });
  }
});

// PUT - Mettre à jour un client
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, email, address, type } = req.body;

    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(phone);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      params.push(email);
    }
    if (address !== undefined) {
      updates.push('address = ?');
      params.push(address);
    }
    if (type !== undefined) {
      updates.push('type = ?');
      params.push(type);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.params.id);

    const result = await db.runAsync(
      `UPDATE clients SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    const updatedClient = await db.getAsync(
      'SELECT * FROM clients WHERE id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Client updated successfully',
      data: updatedClient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating client',
      error: error.message
    });
  }
});

// DELETE - Supprimer un client
router.delete('/:id', async (req, res) => {
  try {
    const clientId = req.params.id;

    // 🔹 Supprimer toutes les sessions liées à ce client
    await db.runAsync('DELETE FROM sessions WHERE client_id = ?', [clientId]);

    // 🔹 Supprimer le client ensuite
    const result = await db.runAsync('DELETE FROM clients WHERE id = ?', [clientId]);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Client et ses sessions supprimés avec succès'
    });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      console.error('⚠️ Contrainte étrangère : impossible de supprimer ce client lié à d’autres données.');
      return res.status(400).json({
        success: false,
        message: 'Impossible : ce client est encore lié à d’autres données.'
      });
    }

  }
});


// GET - Statistiques d'un client
router.get('/:id/stats', async (req, res) => {
  try {
    const stats = await db.getAsync(
      `SELECT 
        COUNT(*) as total_sessions,
        SUM(duration_minutes) as total_minutes,
        SUM(total_price) as total_spent,
        AVG(total_price) as avg_spent_per_session,
        MAX(created_at) as last_visit
       FROM sessions 
       WHERE client_id = ? AND status = 'completed'`,
      [req.params.id]
    );

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching client stats',
      error: error.message
    });
  }
});

// GET - Recherche de clients (autocomplete)
router.get('/search/autocomplete', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const clients = await db.allAsync(
      `SELECT id, name, phone, email
       FROM clients
       WHERE name LIKE ? OR phone LIKE ?
       ORDER BY visit_count DESC
       LIMIT 10`,
      [`%${q}%`, `%${q}%`]
    );

    res.json({
      success: true,
      data: clients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching clients',
      error: error.message
    });
  }
});

module.exports = router;