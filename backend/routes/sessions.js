// backend/routes/sessions.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Récupérer toutes les sessions
router.get('/', async (req, res) => {
  try {
    const { status, station_id, client_id, date_from, date_to } = req.query;
    let query = `
      SELECT s.*, 
             st.name as station_name,
             c.name as client_name,
             c.phone as client_phone
      FROM sessions s
      LEFT JOIN stations st ON s.station_id = st.id
      LEFT JOIN clients c ON s.client_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND s.status = ?';
      params.push(status);
    }

    if (station_id) {
      query += ' AND s.station_id = ?';
      params.push(station_id);
    }

    if (client_id) {
      query += ' AND s.client_id = ?';
      params.push(client_id);
    }

    if (date_from) {
      query += ' AND DATE(s.start_time) >= ?';
      params.push(date_from);
    }

    if (date_to) {
      query += ' AND DATE(s.start_time) <= ?';
      params.push(date_to);
    }

    query += ' ORDER BY s.start_time DESC';

    const sessions = await db.allAsync(query, params);
    res.json({
      success: true,
      data: sessions,
      count: sessions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
      error: error.message
    });
  }
});

// GET - Récupérer une session par ID
router.get('/:id', async (req, res) => {
  try {
    const session = await db.getAsync(
      `SELECT s.*, 
              st.name as station_name,
              st.type as station_type,
              st.hourly_rate as station_rate,
              c.name as client_name,
              c.phone as client_phone,
              c.email as client_email
       FROM sessions s
       LEFT JOIN stations st ON s.station_id = st.id
       LEFT JOIN clients c ON s.client_id = c.id
       WHERE s.id = ?`,
      [req.params.id]
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Récupérer les services de la session
    const services = await db.allAsync(
      `SELECT ss.*, srv.name as service_name
       FROM session_services ss
       LEFT JOIN services srv ON ss.service_id = srv.id
       WHERE ss.session_id = ?`,
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        ...session,
        services: services
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching session',
      error: error.message
    });
  }
});

// POST - Créer une nouvelle session (démarrer un poste)
router.post('/', async (req, res) => {
  try {
    const { station_id, client_id, notes } = req.body;

    if (!station_id) {
      return res.status(400).json({
        success: false,
        message: 'Station ID is required'
      });
    }

    // Vérifier que le poste existe et est disponible
    const station = await db.getAsync(
      'SELECT * FROM stations WHERE id = ?',
      [station_id]
    );

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    // Vérifier qu'il n'y a pas de session active sur ce poste
    const activeSession = await db.getAsync(
      'SELECT id FROM sessions WHERE station_id = ? AND status = "active"',
      [station_id]
    );

    if (activeSession) {
      return res.status(400).json({
        success: false,
        message: 'Station already has an active session'
      });
    }

    // Créer la session
    const result = await db.runAsync(
      `INSERT INTO sessions (station_id, client_id, start_time, status, notes)
       VALUES (?, ?, datetime('now'), 'active', ?)`,
      [station_id, client_id, notes]
    );

    // Mettre à jour le statut du poste
    await db.runAsync(
      'UPDATE stations SET status = "occupé", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [station_id]
    );

    // Récupérer la session créée avec les détails
    const newSession = await db.getAsync(
      `SELECT s.*, 
              st.name as station_name,
              c.name as client_name
       FROM sessions s
       LEFT JOIN stations st ON s.station_id = st.id
       LEFT JOIN clients c ON s.client_id = c.id
       WHERE s.id = ?`,
      [result.id]
    );

    res.status(201).json({
      success: true,
      message: 'Session started successfully',
      data: newSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating session',
      error: error.message
    });
  }
});

// PUT - Mettre à jour une session
router.put('/:id', async (req, res) => {
  try {
    const { client_id, notes, payment_status } = req.body;

    const updates = [];
    const params = [];

    if (client_id !== undefined) {
      updates.push('client_id = ?');
      params.push(client_id);
    }
    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }
    if (payment_status !== undefined) {
      updates.push('payment_status = ?');
      params.push(payment_status);
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
      `UPDATE sessions SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const updatedSession = await db.getAsync(
      `SELECT s.*, 
              st.name as station_name,
              c.name as client_name
       FROM sessions s
       LEFT JOIN stations st ON s.station_id = st.id
       LEFT JOIN clients c ON s.client_id = c.id
       WHERE s.id = ?`,
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Session updated successfully',
      data: updatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating session',
      error: error.message
    });
  }
});

// POST - Clôturer une session
router.post('/:id/close', async (req, res) => {
  try {
    const { payment_status } = req.body;

    // Récupérer la session
    const session = await db.getAsync(
      `SELECT s.*, st.hourly_rate
       FROM sessions s
       LEFT JOIN stations st ON s.station_id = st.id
       WHERE s.id = ?`,
      [req.params.id]
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Session is not active'
      });
    }

    // Calculer la durée en minutes
    const startTime = new Date(session.start_time);
    const endTime = new Date();
    const durationMinutes = Math.ceil((endTime - startTime) / (1000 * 60));

    // Calculer le prix de base (tarif horaire)
    const basePrice = (durationMinutes / 60) * session.hourly_rate;

    // Récupérer le prix total des services
    const servicesResult = await db.getAsync(
      'SELECT COALESCE(SUM(total_price), 0) as services_price FROM session_services WHERE session_id = ?',
      [req.params.id]
    );

    const servicesPrice = servicesResult.services_price;
    const totalPrice = basePrice + servicesPrice;

    // Mettre à jour la session
    await db.runAsync(
      `UPDATE sessions 
       SET end_time = datetime('now'),
           duration_minutes = ?,
           base_price = ?,
           services_price = ?,
           total_price = ?,
           status = 'completed',
           payment_status = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [durationMinutes, basePrice, servicesPrice, totalPrice, payment_status || 'pending', req.params.id]
    );

    // Libérer le poste
    await db.runAsync(
      'UPDATE stations SET status = "disponible", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [session.station_id]
    );

    // Mettre à jour les statistiques du client si présent
    if (session.client_id) {
      await db.runAsync(
        `UPDATE clients 
         SET total_spent = total_spent + ?,
             visit_count = visit_count + 1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [totalPrice, session.client_id]
      );
    }

    // Récupérer la session mise à jour
    const updatedSession = await db.getAsync(
      `SELECT s.*, 
              st.name as station_name,
              c.name as client_name
       FROM sessions s
       LEFT JOIN stations st ON s.station_id = st.id
       LEFT JOIN clients c ON s.client_id = c.id
       WHERE s.id = ?`,
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Session closed successfully',
      data: updatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error closing session',
      error: error.message
    });
  }
});

// POST - Ajouter un service à une session
router.post('/:id/services', async (req, res) => {
  try {
    const { service_id, quantity } = req.body;

    if (!service_id) {
      return res.status(400).json({
        success: false,
        message: 'Service ID is required'
      });
    }

    // Vérifier que la session existe et est active
    const session = await db.getAsync(
      'SELECT * FROM sessions WHERE id = ? AND status = "active"',
      [req.params.id]
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Active session not found'
      });
    }

    // Récupérer le service
    const service = await db.getAsync(
      'SELECT * FROM services WHERE id = ? AND is_active = 1',
      [service_id]
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or inactive'
      });
    }

    const qty = quantity || 1;
    const totalPrice = service.price * qty;

    // Ajouter le service à la session
    const result = await db.runAsync(
      `INSERT INTO session_services (session_id, service_id, quantity, unit_price, total_price)
       VALUES (?, ?, ?, ?, ?)`,
      [req.params.id, service_id, qty, service.price, totalPrice]
    );

    const newService = await db.getAsync(
      `SELECT ss.*, srv.name as service_name
       FROM session_services ss
       LEFT JOIN services srv ON ss.service_id = srv.id
       WHERE ss.id = ?`,
      [result.id]
    );

    res.status(201).json({
      success: true,
      message: 'Service added to session',
      data: newService
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding service to session',
      error: error.message
    });
  }
});

// DELETE - Retirer un service d'une session
router.delete('/:id/services/:service_id', async (req, res) => {
  try {
    const result = await db.runAsync(
      'DELETE FROM session_services WHERE session_id = ? AND id = ?',
      [req.params.id, req.params.service_id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found in session'
      });
    }

    res.json({
      success: true,
      message: 'Service removed from session'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing service from session',
      error: error.message
    });
  }
});

// GET - Sessions actives
router.get('/active/all', async (req, res) => {
  try {
    const sessions = await db.allAsync(
      `SELECT s.*, 
              st.name as station_name,
              st.type as station_type,
              c.name as client_name
       FROM sessions s
       LEFT JOIN stations st ON s.station_id = st.id
       LEFT JOIN clients c ON s.client_id = c.id
       WHERE s.status = 'active'
       ORDER BY s.start_time`
    );

    res.json({
      success: true,
      data: sessions,
      count: sessions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching active sessions',
      error: error.message
    });
  }
});

module.exports = router;