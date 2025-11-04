import { useState, useEffect } from 'react';
import { Wifi, RefreshCw, Activity, AlertCircle } from 'lucide-react';

function BulkPingControl({ onPingComplete }) {
  const [isPinging, setIsPinging] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [stats, setStats] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // secondes

  useEffect(() => {
    let intervalId;

    if (autoRefresh) {
      // Ping initial
      handlePingAll();

      // Puis ping périodique
      intervalId = setInterval(() => {
        handlePingAll();
      }, refreshInterval * 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, refreshInterval]);

  const handlePingAll = async () => {
    setIsPinging(true);
    try {
      const response = await fetch('http://localhost:5000/api/ping/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      
      if (result.success) {
        setStats(result.stats);
        if (onPingComplete) {
          onPingComplete(result.data);
        }
      }
    } catch (error) {
      console.error('Erreur ping groupé:', error);
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-3 rounded-xl border border-cyan-500/30">
            <Activity className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Surveillance Réseau</h3>
            <p className="text-xs text-gray-400">Vérification automatique de connexion</p>
          </div>
        </div>

        {/* Statistiques en temps réel */}
        {stats && (
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-2xl font-bold text-green-400">{stats.online}</span>
              </div>
              <p className="text-xs text-gray-400">En ligne</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-2xl font-bold text-red-400">{stats.offline}</span>
              </div>
              <p className="text-xs text-gray-400">Hors ligne</p>
            </div>
            {stats.averageResponseTime > 0 && (
              <div className="text-center">
                <span className="text-2xl font-bold text-cyan-400">
                  {stats.averageResponseTime}ms
                </span>
                <p className="text-xs text-gray-400">Temps moyen</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Bouton ping manuel */}
        <button
          onClick={handlePingAll}
          disabled={isPinging}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
            isPinging
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 cursor-wait'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold border-transparent shadow-lg hover:shadow-cyan-500/50'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isPinging ? 'animate-spin' : ''}`} />
          <span>{isPinging ? 'Vérification...' : 'Vérifier tous les postes'}</span>
        </button>

        {/* Toggle auto-refresh */}
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="text-sm text-white font-medium">Auto-rafraîchissement</span>
          </label>

          {autoRefresh && (
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50"
            >
              <option value={10}>10s</option>
              <option value={30}>30s</option>
              <option value={60}>1min</option>
              <option value={300}>5min</option>
            </select>
          )}
        </div>

        {/* Indicateur de rafraîchissement */}
        {autoRefresh && (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/50 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400 font-medium">Actif</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default BulkPingControl;