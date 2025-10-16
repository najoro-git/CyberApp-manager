import { Monitor, Zap, WifiOff, User, Clock } from 'lucide-react';
import { getPosteStatusColor } from '../../utils/formatters';

function PosteCard({ poste, onClick }) {
  const isOccupied = poste.statut === 'occupé';
  const isOffline = poste.etat_reseau === 'hors_ligne';
  const isMaintenance = poste.statut === 'maintenance';

  const getStatusIcon = () => {
    if (isOffline) return <WifiOff className="w-4 h-4 text-red-400" />;
    if (isMaintenance) return <Clock className="w-4 h-4 text-orange-400" />;
    if (isOccupied) return <Zap className="w-4 h-4 text-green-400 animate-pulse" />;
    return null;
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative group cursor-pointer backdrop-blur-xl rounded-xl p-4 
        transition-all duration-300 hover:scale-105
        ${isOccupied 
          ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-2 border-green-500/50 hover:shadow-lg hover:shadow-green-500/50' 
          : isMaintenance
          ? 'bg-gradient-to-br from-orange-500/20 to-yellow-600/20 border-2 border-orange-500/50'
          : isOffline
          ? 'bg-gradient-to-br from-red-500/20 to-pink-600/20 border-2 border-red-500/50'
          : 'bg-white/5 border-2 border-white/10 hover:border-white/30'
        }
      `}
    >
      {/* Status Icon */}
      <div className="absolute top-2 right-2">
        {getStatusIcon()}
      </div>

      {/* Monitor Icon */}
      <Monitor className={`w-8 h-8 mx-auto mb-2 ${
        isOccupied ? 'text-green-400' : 
        isMaintenance ? 'text-orange-400' :
        isOffline ? 'text-red-400' :
        'text-gray-500'
      }`} />

      {/* Poste Number */}
      <p className="text-white font-semibold text-center text-sm mb-1">
        {poste.nom_poste}
      </p>

      {/* Status Badge */}
      <div className={`text-xs text-center px-2 py-1 rounded-full ${getPosteStatusColor(poste.statut)}`}>
        {poste.statut}
      </div>

      {/* Session Info (if occupied) */}
      {isOccupied && poste.session && (
        <div className="mt-2 pt-2 border-t border-green-500/30 text-xs text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-green-400">
            <User className="w-3 h-3" />
            <span className="font-semibold">{poste.session.client_nom}</span>
          </div>
          <div className="text-gray-400">
            {poste.session.duree}
          </div>
        </div>
      )}

      {/* IP Address */}
      {poste.adresse_ip && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          {poste.adresse_ip}
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>
    </div>
  );
}

export default PosteCard;