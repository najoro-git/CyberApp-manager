import { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, Activity, Clock } from 'lucide-react';

function PingStatus({ station, onPingComplete }) {
  const [isPinging, setIsPinging] = useState(false);

  const handlePing = async () => {
    setIsPinging(true);
    try {
      const response = await fetch(`http://localhost:5000/api/ping/station/${station.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      
      if (onPingComplete) {
        onPingComplete(result);
      }
    } catch (error) {
      console.error('Erreur ping:', error);
    } finally {
      setIsPinging(false);
    }
  };

  const getStatusConfig = () => {
    if (!station.connection_status || station.connection_status === 'unknown') {
      return {
        icon: Activity,
        color: 'text-gray-400',
        bg: 'bg-gray-500/20',
        border: 'border-gray-500/50',
        label: 'Inconnu'
      };
    }

    if (station.connection_status === 'online') {
      return {
        icon: Wifi,
        color: 'text-green-400',
        bg: 'bg-green-500/20',
        border: 'border-green-500/50',
        label: 'En ligne'
      };
    }

    return {
      icon: WifiOff,
      color: 'text-red-400',
      bg: 'bg-red-500/20',
      border: 'border-red-500/50',
      label: 'Hors ligne'
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3">
      {/* Statut de connexion */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${config.bg} ${config.border}`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
        <span className={`text-sm font-medium ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Temps de réponse */}
      {station.response_time && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-white">
            {station.response_time}ms
          </span>
        </div>
      )}

      {/* Bouton de ping */}
      <button
        onClick={handlePing}
        disabled={isPinging || !station.ip_address}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
          isPinging
            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 cursor-wait'
            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-cyan-500/50'
        }`}
        title={!station.ip_address ? 'Aucune adresse IP configurée' : 'Vérifier la connexion'}
      >
        <RefreshCw className={`w-4 h-4 ${isPinging ? 'animate-spin' : ''}`} />
        <span className="text-sm font-medium">
          {isPinging ? 'Test...' : 'Ping'}
        </span>
      </button>
    </div>
  );
}

export default PingStatus;