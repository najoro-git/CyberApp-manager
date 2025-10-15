// backend/routes/services.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Récupérer tous les services
router.get('/', async (req, res) => {
  try {
    const { category, is_active } = req.query;
    let query = 'SELECT * FROM services WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(is_active === 'true' ? 1 : 0);
    }

    query += ' ORDER BY category, name';

    const services = await db.allAsync(query, params);
    res.json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
});

// GET - Récupérer un service par ID
router.get('/:id', async (req, res) => {
  try {
    const service = await db.getAsync(
      'SELECT * FROM services WHERE id = ?',
      [req.params.id]
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
});

// POST - Créer un nouveau service
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }

    const result = await db.runAsync(
      `INSERT INTO services (name, description, price, category, is_active)
       VALUES (?, ?, ?, ?, 1)`,
      [name, description, price, category]
    );

    const newService = await db.getAsync(
      'SELECT * FROM services WHERE id = ?',
      [result.id]
    );

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: newService
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
});

// PUT - Mettre à jour un service
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, category, is_active } = req.body;

    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (price !== undefined) {
      updates.push('price = ?');
      params.push(price);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      params.push(category);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      params.push(is_active ? 1 : 0);
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
      `UPDATE services SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const updatedService = await db.getAsync(
      'SELECT * FROM services WHERE id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: updatedService
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
});

// DELETE - Supprimer un service
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.runAsync(
      'DELETE FROM services WHERE id = ?',
      [req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message
    });
  }
});

// GET - Catégories de services
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await db.allAsync(
      'SELECT DISTINCT category FROM services WHERE category IS NOT NULL ORDER BY category'
    );

    res.json({
      success: true,
      data: categories.map(c => c.category)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

module.exports = router;