// backend/routes/reports.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Rapport journalier
router.get('/daily', async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Revenus du jour
    const revenue = await db.getAsync(
      `SELECT 
        COUNT(*) as total_sessions,
        SUM(duration_minutes) as total_minutes,
        SUM(base_price) as base_revenue,
        SUM(services_price) as services_revenue,
        SUM(total_price) as total_revenue,
        AVG(total_price) as avg_revenue
       FROM sessions
       WHERE DATE(start_time) = ? AND status = 'completed'`,
      [targetDate]
    );

    // Sessions par poste
    const stationStats = await db.allAsync(
      `SELECT 
        st.name as station_name,
        COUNT(s.id) as session_count,
        SUM(s.duration_minutes) as total_minutes,
        SUM(s.total_price) as revenue
       FROM stations st
       LEFT JOIN sessions s ON st.id = s.station_id 
         AND DATE(s.start_time) = ? AND s.status = 'completed'
       GROUP BY st.id, st.name
       ORDER BY revenue DESC`,
      [targetDate]
    );

    // Services les plus vendus
    const topServices = await db.allAsync(
      `SELECT 
        srv.name as service_name,
        SUM(ss.quantity) as total_quantity,
        SUM(ss.total_price) as total_revenue
       FROM session_services ss
       JOIN services srv ON ss.service_id = srv.id
       JOIN sessions s ON ss.session_id = s.id
       WHERE DATE(s.start_time) = ?
       GROUP BY srv.id, srv.name
       ORDER BY total_revenue DESC
       LIMIT 10`,
      [targetDate]
    );

    res.json({
      success: true,
      date: targetDate,
      data: {
        revenue,
        station_stats: stationStats,
        top_services: topServices
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating daily report',
      error: error.message
    });
  }
});

// GET - Rapport mensuel
router.get('/monthly', async (req, res) => {
  try {
    const { year, month } = req.query;
    const targetYear = year || new Date().getFullYear();
    const targetMonth = month || (new Date().getMonth() + 1).toString().padStart(2, '0');

    // Revenus du mois
    const revenue = await db.getAsync(
      `SELECT 
        COUNT(*) as total_sessions,
        SUM(duration_minutes) as total_minutes,
        SUM(base_price) as base_revenue,
        SUM(services_price) as services_revenue,
        SUM(total_price) as total_revenue
       FROM sessions
       WHERE strftime('%Y', start_time) = ? 
         AND strftime('%m', start_time) = ?
         AND status = 'completed'`,
      [targetYear.toString(), targetMonth]
    );

    // Revenus par jour
    const dailyRevenue = await db.allAsync(
      `SELECT 
        DATE(start_time) as date,
        COUNT(*) as session_count,
        SUM(total_price) as revenue
       FROM sessions
       WHERE strftime('%Y', start_time) = ? 
         AND strftime('%m', start_time) = ?
         AND status = 'completed'
       GROUP BY DATE(start_time)
       ORDER BY date`,
      [targetYear.toString(), targetMonth]
    );

    // Top clients du mois
    const topClients = await db.allAsync(
      `SELECT 
        c.name,
        COUNT(s.id) as visit_count,
        SUM(s.total_price) as total_spent
       FROM clients c
       JOIN sessions s ON c.id = s.client_id
       WHERE strftime('%Y', s.start_time) = ? 
         AND strftime('%m', s.start_time) = ?
         AND s.status = 'completed'
       GROUP BY c.id, c.name
       ORDER BY total_spent DESC
       LIMIT 10`,
      [targetYear.toString(), targetMonth]
    );

    res.json({
      success: true,
      period: `${targetYear}-${targetMonth}`,
      data: {
        revenue,
        daily_revenue: dailyRevenue,
        top_clients: topClients
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating monthly report',
      error: error.message
    });
  }
});

// GET - Statistiques globales
router.get('/stats', async (req, res) => {
  try {
    // Stats générales
    const globalStats = await db.getAsync(
      `SELECT 
        (SELECT COUNT(*) FROM stations) as total_stations,
        (SELECT COUNT(*) FROM clients) as total_clients,
        (SELECT COUNT(*) FROM sessions WHERE status = 'active') as active_sessions,
        (SELECT COUNT(*) FROM sessions WHERE status = 'completed') as completed_sessions,
        (SELECT SUM(total_price) FROM sessions WHERE status = 'completed') as total_revenue
      `
    );

    // Taux d'occupation moyen
    const occupancyRate = await db.getAsync(
      `SELECT 
        CAST(COUNT(DISTINCT CASE WHEN status = 'occupé' THEN id END) AS FLOAT) / 
        CAST(COUNT(*) AS FLOAT) * 100 as occupancy_rate
       FROM stations`
    );

    // Durée moyenne des sessions
    const avgDuration = await db.getAsync(
      `SELECT AVG(duration_minutes) as avg_duration
       FROM sessions
       WHERE status = 'completed' AND duration_minutes IS NOT NULL`
    );

    res.json({
      success: true,
      data: {
        ...globalStats,
        occupancy_rate: occupancyRate.occupancy_rate || 0,
        avg_session_duration: avgDuration.avg_duration || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// GET - Rapport personnalisé
router.get('/custom', async (req, res) => {
  try {
    const { start_date, end_date, station_id, client_id } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    let query = `
      SELECT s.*,
             st.name as station_name,
             c.name as client_name
      FROM sessions s
      LEFT JOIN stations st ON s.station_id = st.id
      LEFT JOIN clients c ON s.client_id = c.id
      WHERE DATE(s.start_time) BETWEEN ? AND ?
        AND s.status = 'completed'
    `;
    const params = [start_date, end_date];

    if (station_id) {
      query += ' AND s.station_id = ?';
      params.push(station_id);
    }

    if (client_id) {
      query += ' AND s.client_id = ?';
      params.push(client_id);
    }

    query += ' ORDER BY s.start_time DESC';

    const sessions = await db.allAsync(query, params);

    // Calculer les totaux
    const totals = sessions.reduce((acc, session) => {
      acc.count += 1;
      acc.duration += session.duration_minutes || 0;
      acc.revenue += session.total_price || 0;
      return acc;
    }, { count: 0, duration: 0, revenue: 0 });

    res.json({
      success: true,
      period: { start_date, end_date },
      data: {
        sessions,
        totals
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating custom report',
      error: error.message
    });
  }
});

module.exports = router;