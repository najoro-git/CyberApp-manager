const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { exec } = require('child_process');
const util = require('util');
const os = require('os');

const execPromise = util.promisify(exec);

// Fonction pour valider une adresse IP
function isValidIP(ip) {
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipPattern.test(ip)) return false;

  const parts = ip.split('.');
  return parts.every(part => {
    const num = parseInt(part);
    return num >= 0 && num <= 255;
  });
}

// Fonction pour pinger une adresse IP
async function pingHost(ipAddress) {
  if (!ipAddress) {
    return {
      success: false,
      online: false,
      message: 'Aucune adresse IP fournie',
      responseTime: null
    };
  }

  if (!isValidIP(ipAddress)) {
    return {
      success: false,
      online: false,
      message: 'Adresse IP invalide',
      responseTime: null
    };
  }

  try {
    // Déterminer la commande selon l'OS
    const isWindows = os.platform() === 'win32';
    const pingCommand = isWindows 
      ? `ping -n 1 -w 1000 ${ipAddress}` 
      : `ping -c 1 -W 1 ${ipAddress}`;

    const startTime = Date.now();
    const { stdout } = await execPromise(pingCommand);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Extraire le temps de réponse du ping
    const timeMatch = stdout.match(/time[=<](\d+)/i);
    const extractedTime = timeMatch ? parseInt(timeMatch[1]) : responseTime;

    return {
      success: true,
      online: true,
      message: 'Poste en ligne',
      responseTime: extractedTime,
      lastChecked: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: true,
      online: false,
      message: 'Poste hors ligne',
      responseTime: null,
      lastChecked: new Date().toISOString(),
      error: error.message
    };
  }
}

// POST - Ping un poste spécifique
router.post('/station/:id', async (req, res) => {
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

    if (!station.ip_address) {
      return res.status(400).json({
        success: false,
        message: 'Station has no IP address configured'
      });
    }

    const pingResult = await pingHost(station.ip_address);

    // Mettre à jour le statut de connexion dans la base de données
    const connectionStatus = pingResult.online ? 'online' : 'offline';
    await db.runAsync(
      `UPDATE stations 
       SET connection_status = ?, 
           last_ping_time = CURRENT_TIMESTAMP,
           response_time = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [connectionStatus, pingResult.responseTime, req.params.id]
    );

    res.json({
      success: true,
      data: {
        stationId: station.id,
        stationName: station.name,
        ipAddress: station.ip_address,
        ...pingResult
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error pinging station',
      error: error.message
    });
  }
});

// POST - Ping tous les postes
router.post('/all', async (req, res) => {
  try {
    const stations = await db.allAsync(
      'SELECT id, name, ip_address FROM stations WHERE ip_address IS NOT NULL'
    );

    if (stations.length === 0) {
      return res.json({
        success: true,
        message: 'No stations with IP addresses found',
        data: []
      });
    }

    // Ping tous les postes en parallèle
    const pingPromises = stations.map(async (station) => {
      const result = await pingHost(station.ip_address);
      return {
        stationId: station.id,
        stationName: station.name,
        ipAddress: station.ip_address,
        ...result
      };
    });

    const results = await Promise.all(pingPromises);

    // Mettre à jour le statut de connexion pour tous les postes
    for (const result of results) {
      const connectionStatus = result.online ? 'online' : 'offline';
      await db.runAsync(
        `UPDATE stations 
         SET connection_status = ?, 
             last_ping_time = CURRENT_TIMESTAMP,
             response_time = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [connectionStatus, result.responseTime, result.stationId]
      );
    }

    // Statistiques globales
    const onlineCount = results.filter(r => r.online).length;
    const offlineCount = results.filter(r => !r.online).length;
    const avgResponseTime = results
      .filter(r => r.online && r.responseTime)
      .reduce((sum, r) => sum + r.responseTime, 0) / (onlineCount || 1);

    res.json({
      success: true,
      data: results,
      stats: {
        total: stations.length,
        online: onlineCount,
        offline: offlineCount,
        averageResponseTime: Math.round(avgResponseTime)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error pinging stations',
      error: error.message
    });
  }
});

// GET - Obtenir le statut de connexion de tous les postes
router.get('/status', async (req, res) => {
  try {
    const stations = await db.allAsync(
      `SELECT 
        id, 
        name, 
        ip_address, 
        connection_status, 
        last_ping_time,
        response_time,
        status
       FROM stations 
       ORDER BY name`
    );

    const onlineCount = stations.filter(s => s.connection_status === 'online').length;
    const offlineCount = stations.filter(s => s.connection_status === 'offline').length;
    const unknownCount = stations.filter(s => !s.connection_status || s.connection_status === 'unknown').length;

    res.json({
      success: true,
      data: stations,
      stats: {
        total: stations.length,
        online: onlineCount,
        offline: offlineCount,
        unknown: unknownCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching connection status',
      error: error.message
    });
  }
});

// POST - Scanner le réseau pour trouver des postes actifs
router.post('/scan', async (req, res) => {
  try {
    const { subnet, start, end } = req.body;

    if (!subnet) {
      return res.status(400).json({
        success: false,
        message: 'Subnet is required (e.g., "192.168.1")'
      });
    }

    const startIP = start || 1;
    const endIP = end || 254;
    const ips = [];

    for (let i = startIP; i <= endIP; i++) {
      ips.push(`${subnet}.${i}`);
    }

    // Ping toutes les IPs en parallèle
    const pingPromises = ips.map(async (ip) => {
      const result = await pingHost(ip);
      if (result.online) {
        return {
          ip,
          responseTime: result.responseTime,
          lastChecked: result.lastChecked
        };
      }
      return null;
    });

    const results = await Promise.all(pingPromises);
    const activeHosts = results.filter(result => result !== null);

    res.json({
      success: true,
      message: `Found ${activeHosts.length} active hosts`,
      data: activeHosts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error scanning network',
      error: error.message
    });
  }
});

module.exports = router;