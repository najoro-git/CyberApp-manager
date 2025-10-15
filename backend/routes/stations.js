// backend/routes/stations.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Récupérer tous les postes
router.get('/', async (req, res) => {
  try {
    const { status, type } = req.query;
    let query = 'SELECT * FROM stations WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY name';

    const stations = await db.allAsync(query, params);
    res.json({
      success: true,
      data: stations,
      count: stations.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stations',
      error: error.message
    });
  }
});

// GET - Récupérer un poste par ID
router.get('/:id', async (req, res) => {
  try {
    const station = await db.getAsync(
      'SELECT * FROM stations WHERE id = ?',
      [req.params.id]
    );

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    // Récupérer la session active si elle existe
    const activeSession = await db.getAsync(
      `SELECT s.*, c.name as client_name 
       FROM sessions s
       LEFT JOIN clients c ON s.client_id = c.id
       WHERE s.station_id = ? AND s.status = 'active'`,
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        ...station,
        active_session: activeSession || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching station',
      error: error.message
    });
  }
});

// POST - Créer un nouveau poste
router.post('/', async (req, res) => {
  try {
    const { name, type, hourly_rate, ip_address } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Station name is required'
      });
    }

    const result = await db.runAsync(
      `INSERT INTO stations (name, type, hourly_rate, ip_address, status)
       VALUES (?, ?, ?, ?, 'disponible')`,
      [name, type || 'standard', hourly_rate || 1500.00, ip_address]
    );

    const newStation = await db.getAsync(
      'SELECT * FROM stations WHERE id = ?',
      [result.id]
    );

    res.status(201).json({
      success: true,
      message: 'Station created successfully',
      data: newStation
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({
        success: false,
        message: 'A station with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating station',
      error: error.message
    });
  }
});

// PUT - Mettre à jour un poste
router.put('/:id', async (req, res) => {
  try {
    const { name, type, hourly_rate, ip_address, status } = req.body;

    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (type !== undefined) {
      updates.push('type = ?');
      params.push(type);
    }
    if (hourly_rate !== undefined) {
      updates.push('hourly_rate = ?');
      params.push(hourly_rate);
    }
    if (ip_address !== undefined) {
      updates.push('ip_address = ?');
      params.push(ip_address);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
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
      `UPDATE stations SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    const updatedStation = await db.getAsync(
      'SELECT * FROM stations WHERE id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Station updated successfully',
      data: updatedStation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating station',
      error: error.message
    });
  }
});

// DELETE - Supprimer un poste
router.delete('/:id', async (req, res) => {
  try {
    // Vérifier s'il y a des sessions actives
    const activeSession = await db.getAsync(
      'SELECT id FROM sessions WHERE station_id = ? AND status = "active"',
      [req.params.id]
    );

    if (activeSession) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete station with active session'
      });
    }

    const result = await db.runAsync(
      'DELETE FROM stations WHERE id = ?',
      [req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    res.json({
      success: true,
      message: 'Station deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting station',
      error: error.message
    });
  }
});

// GET - Statistiques d'un poste
router.get('/:id/stats', async (req, res) => {
  try {
    const stats = await db.getAsync(
      `SELECT 
        COUNT(*) as total_sessions,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_sessions,
        SUM(duration_minutes) as total_minutes,
        SUM(total_price) as total_revenue,
        AVG(duration_minutes) as avg_duration
       FROM sessions 
       WHERE station_id = ?`,
      [req.params.id]
    );

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching station stats',
      error: error.message
    });
  }
});

module.exports = router;