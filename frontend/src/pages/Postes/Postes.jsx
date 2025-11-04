import { useState, useEffect } from 'react';
import { Monitor, Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import PingStatus from '../../components/PingStatus';
import BulkPingControl from '../../components/BulkPingControl';
import StatCard from '../../components/common/StatCard';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';

function Postes() {
  const [postes, setPostes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
    active: 0
  });

  useEffect(() => {
    fetchPostes();
  }, []);

  const fetchPostes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/postes');
      const data = await response.json();
      
      if (data.success) {
        setPostes(data.data);
        calculateStats(data.data);
      }
    } catch (error) {
      console.error('Erreur chargement postes:', error);
      showToast('error', 'Erreur lors du chargement des postes');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (postesData) => {
    setStats({
      total: postesData.length,
      online: postesData.filter(p => p.connection_status === 'online').length,
      offline: postesData.filter(p => p.connection_status === 'offline').length,
      active: postesData.filter(p => p.status === 'occupé').length
    });
  };

  const handleBulkPingComplete = (results) => {
    // Mettre à jour les postes avec les nouveaux statuts
    setPostes(prevPostes => 
      prevPostes.map(poste => {
        const pingResult = results.find(r => r.stationId === poste.id);
        if (pingResult) {
          return {
            ...poste,
            connection_status: pingResult.online ? 'online' : 'offline',
            response_time: pingResult.responseTime,
            last_ping_time: pingResult.lastChecked
          };
        }
        return poste;
      })
    );

    // Recalculer les statistiques
    const updatedPostes = postes.map(poste => {
      const pingResult = results.find(r => r.stationId === poste.id);
      if (pingResult) {
        return {
          ...poste,
          connection_status: pingResult.online ? 'online' : 'offline'
        };
      }
      return poste;
    });
    calculateStats(updatedPostes);

    showToast('success', 'Vérification de connexion terminée');
  };

  const handleSinglePingComplete = (result) => {
    if (result.success) {
      // Mettre à jour le poste spécifique
      setPostes(prevPostes =>
        prevPostes.map(poste =>
          poste.id === result.data.stationId
            ? {
                ...poste,
                connection_status: result.data.online ? 'online' : 'offline',
                response_time: result.data.responseTime,
                last_ping_time: result.data.lastChecked
              }
            : poste
        )
      );

      const message = result.data.online 
        ? `${result.data.stationName} est en ligne (${result.data.responseTime}ms)`
        : `${result.data.stationName} est hors ligne`;
      
      showToast(result.data.online ? 'success' : 'error', message);
      
      // Recalculer les stats
      fetchPostes();
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponible':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      case 'occupé':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'maintenance':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'hors_service':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  if (loading) {
    return <Loading message="Chargement des postes..." />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestion des Postes</h1>
          <p className="text-gray-400">Gérez vos postes informatiques et leur connectivité</p>
        </div>
        <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nouveau Poste
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Postes"
          value={stats.total}
          icon={Monitor}
          gradient="from-cyan-500 to-blue-600"
        />
        <StatCard
          title="En Ligne"
          value={stats.online}
          icon={TrendingUp}
          gradient="from-green-500 to-emerald-600"
          trend="up"
          trendValue={`${Math.round((stats.online / stats.total) * 100)}%`}
        />
        <StatCard
          title="Hors Ligne"
          value={stats.offline}
          icon={Monitor}
          gradient="from-red-500 to-pink-600"
        />
        <StatCard
          title="Actifs"
          value={stats.active}
          icon={Monitor}
          gradient="from-purple-500 to-indigo-600"
        />
      </div>

      {/* Bulk Ping Control */}
      <BulkPingControl onPingComplete={handleBulkPingComplete} />

      {/* Liste des postes */}
      {postes.length === 0 ? (
        <EmptyState
          icon={Monitor}
          title="Aucun poste enregistré"
          message="Commencez par ajouter votre premier poste"
          actionText="Ajouter un poste"
        />
      ) : (
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Nom</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Adresse IP</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Connexion</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Tarif/h</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {postes.map((poste) => (
                  <tr
                    key={poste.id}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-2 rounded-lg border border-cyan-500/30">
                          <Monitor className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="text-white font-semibold">{poste.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 capitalize">{poste.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 font-mono text-sm">
                        {poste.ip_address || 'Non configurée'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg border text-sm font-medium ${getStatusColor(poste.status)}`}>
                        {poste.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <PingStatus 
                        station={poste} 
                        onPingComplete={handleSinglePingComplete}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-semibold">
                        {poste.hourly_rate?.toLocaleString()} Ar
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all duration-300">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Postes;