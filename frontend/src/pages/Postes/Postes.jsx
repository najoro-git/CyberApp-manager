import { useState, useEffect } from 'react';
import { Monitor, Plus, Edit, Trash2, X, Wifi, WifiOff, Activity, DollarSign } from 'lucide-react';
import { postesAPI } from '../../services/api';

function Postes() {
  const [postes, setPostes] = useState([]);
  const [filteredPostes, setFilteredPostes] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPoste, setEditingPoste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    type: 'standard',
    hourly_rate: 1000,
    ip_address: '',
    status: 'disponible'
  });

  useEffect(() => {
    loadPostes();
  }, []);

  useEffect(() => {
    filterPostes();
  }, [postes, filterStatus, filterType]);

  const loadPostes = async () => {
    try {
      setLoading(true);
      const response = await postesAPI.getAll();
      if (response.data.success) {
        setPostes(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement postes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPostes = () => {
    let filtered = [...postes];

    if (filterStatus) {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    if (filterType) {
      filtered = filtered.filter(p => p.type === filterType);
    }

    setFilteredPostes(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingPoste) {
        const response = await postesAPI.update(editingPoste.id, formData);
        if (response.data.success) {
          alert('Poste modifié avec succès !');
        }
      } else {
        const response = await postesAPI.create(formData);
        if (response.data.success) {
          alert('Poste créé avec succès !');
        }
      }
      
      loadPostes();
      closeModal();
    } catch (error) {
      alert('Erreur: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce poste ?')) {
      return;
    }

    try {
      const response = await postesAPI.delete(id);
      if (response.data.success) {
        alert('Poste supprimé avec succès !');
        loadPostes();
      }
    } catch (error) {
      alert('Erreur: ' + (error.response?.data?.message || error.message));
    }
  };

  const openModal = (poste = null) => {
    if (poste) {
      setEditingPoste(poste);
      setFormData({
        name: poste.name,
        type: poste.type || 'standard',
        hourly_rate: poste.hourly_rate || 1000,
        ip_address: poste.ip_address || '',
        status: poste.status || 'disponible'
      });
    } else {
      setEditingPoste(null);
      setFormData({
        name: '',
        type: 'standard',
        hourly_rate: 1000,
        ip_address: '',
        status: 'disponible'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPoste(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      'disponible': 'bg-gray-500/20 text-gray-400 border-gray-500/50',
      'occupé': 'bg-green-500/20 text-green-400 border-green-500/50',
      'maintenance': 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      'hors_service': 'bg-red-500/20 text-red-400 border-red-500/50',
    };
    return colors[status] || colors['disponible'];
  };

  const getTypeColor = (type) => {
    const colors = {
      'Gaming': 'from-purple-500 to-pink-600',
      'Standard': 'from-blue-500 to-cyan-600',
      'Console': 'from-orange-500 to-red-600',
      'VIP': 'from-yellow-500 to-orange-600',
    };
    return colors[type] || colors['Standard'];
  };

  // Statistiques
  const stats = {
    total: postes.length,
    disponibles: postes.filter(p => p.status === 'disponible').length,
    occupes: postes.filter(p => p.status === 'occupé').length,
    maintenance: postes.filter(p => p.status === 'maintenance').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Gestion des Postes
            </h1>
            <p className="text-gray-400 mt-2">Gérez tous vos postes de travail et consoles</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50"
          >
            <Plus className="w-5 h-5" />
            Nouveau Poste
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
          >
            <option value="">Tous les statuts</option>
            <option value="disponible">Disponible</option>
            <option value="occupé">Occupé</option>
            <option value="maintenance">Maintenance</option>
            <option value="hors_service">Hors service</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
          >
            <option value="">Tous les types</option>
            <option value="Gaming">Gaming</option>
            <option value="Standard">Standard</option>
            <option value="Console">Console</option>
            <option value="VIP">VIP</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Postes</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl">
              <Monitor className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Disponibles</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.disponibles}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-500 to-gray-600 p-3 rounded-xl">
              <Wifi className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Occupés</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.occupes}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Maintenance</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.maintenance}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl">
              <WifiOff className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Postes Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Chargement...</div>
        </div>
      ) : filteredPostes.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-12 text-center">
          <Monitor className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Aucun poste trouvé</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
            {filteredPostes.map((poste) => (
              <div
                key={poste.id}
                className={`backdrop-blur-xl rounded-xl p-4 border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
                  poste.status === 'occupé'
                    ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/50 hover:shadow-lg hover:shadow-green-500/50'
                    : poste.status === 'maintenance'
                    ? 'bg-gradient-to-br from-orange-500/20 to-yellow-600/20 border-orange-500/50'
                    : poste.status === 'hors_service'
                    ? 'bg-gradient-to-br from-red-500/20 to-pink-600/20 border-red-500/50'
                    : 'bg-white/5 border-white/10 hover:border-white/30'
                }`}
              >
                <div className="text-center space-y-3">
                  <Monitor className={`w-10 h-10 mx-auto ${
                    poste.status === 'occupé' ? 'text-green-400' :
                    poste.status === 'maintenance' ? 'text-orange-400' :
                    poste.status === 'hors_service' ? 'text-red-400' :
                    'text-gray-400'
                  }`} />
                  
                  <div>
                    <p className="text-white font-bold">{poste.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{poste.type}</p>
                  </div>

                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(poste.status)}`}>
                    {poste.status}
                  </span>

                  {poste.ip_address && (
                    <p className="text-xs text-gray-500">{poste.ip_address}</p>
                  )}

                  <div className="flex gap-2 justify-center pt-2">
                    <button
                      onClick={() => openModal(poste)}
                      className="p-2 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 rounded-lg transition-all"
                    >
                      <Edit className="w-3 h-3 text-cyan-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(poste.id)}
                      className="p-2 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table détaillée */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Nom</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">IP</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Tarif/h</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Statut</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredPostes.map((poste) => (
                    <tr key={poste.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`bg-gradient-to-br ${getTypeColor(poste.type)} p-2 rounded-lg`}>
                            <Monitor className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{poste.name}</p>
                            <p className="text-gray-400 text-sm">ID: #{poste.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white capitalize">{poste.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400">{poste.ip_address || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-cyan-400 font-bold">{poste.hourly_rate.toLocaleString()} Ar</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(poste.status)}`}>
                          {poste.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(poste)}
                            className="p-2 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 rounded-lg transition-all"
                          >
                            <Edit className="w-4 h-4 text-cyan-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(poste.id)}
                            className="p-2 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingPoste ? 'Modifier Poste' : 'Nouveau Poste'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nom du poste *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
                  placeholder="Poste 1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="Gaming">Gaming</option>
                    <option value="Standard">Standard</option>
                    <option value="Console">Console</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="occupé">Occupé</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="hors_service">Hors service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tarif horaire (Ar) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="100"
                  value={formData.hourly_rate}
                  onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Adresse IP</label>
                <input
                  type="text"
                  value={formData.ip_address}
                  onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
                  placeholder="192.168.1.100"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                >
                  {editingPoste ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Postes;