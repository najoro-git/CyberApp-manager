import { useState, useEffect } from 'react';
import { Clock, Play, Pause, DollarSign, User, Monitor, Plus, X, Package } from 'lucide-react';
import { sessionsAPI, postesAPI, clientsAPI, servicesAPI } from '../../services/api';

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [postes, setPostes] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    station_id: '',
    client_id: '',
    notes: ''
  });
  const [serviceFormData, setServiceFormData] = useState({
    service_id: '',
    quantity: 1
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsRes, postesRes, clientsRes, servicesRes] = await Promise.all([
        sessionsAPI.getActive(),
        postesAPI.getAll(),
        clientsAPI.getAll(),
        servicesAPI.getAll()
      ]);
      
      if (sessionsRes.data.success) setSessions(sessionsRes.data.data);
      if (postesRes.data.success) setPostes(postesRes.data.data);
      if (clientsRes.data.success) setClients(clientsRes.data.data);
      if (servicesRes.data.success) setServices(servicesRes.data.data);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = (startTime) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now - start) / 1000 / 60); // minutes
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}m`;
  };

  const calculateCost = (startTime, hourlyRate) => {
    const start = new Date(startTime);
    const now = new Date();
    const hours = (now - start) / (1000 * 60 * 60);
    return Math.round(hours * hourlyRate);
  };

  const handleStartSession = async (e) => {
    e.preventDefault();
    
    try {
      const response = await sessionsAPI.create(formData);
      if (response.data.success) {
        alert('Session démarrée avec succès !');
        loadData();
        closeNewSessionModal();
      }
    } catch (error) {
      alert('Erreur: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCloseSession = async (sessionId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir clôturer cette session ?')) {
      return;
    }

    try {
      const response = await sessionsAPI.close(sessionId, { payment_status: 'paid' });
      if (response.data.success) {
        alert(`Session clôturée avec succès !\nMontant total: ${response.data.data.total_price} Ar`);
        loadData();
      }
    } catch (error) {
      alert('Erreur: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    
    try {
      const response = await servicesAPI.addVente(selectedSession.id, serviceFormData);
      if (response.data.success) {
        alert('Service ajouté avec succès !');
        loadData();
        closeServicesModal();
      }
    } catch (error) {
      alert('Erreur: ' + (error.response?.data?.message || error.message));
    }
  };

  const closeNewSessionModal = () => {
    setShowNewSessionModal(false);
    setFormData({
      station_id: '',
      client_id: '',
      notes: ''
    });
  };

  const closeServicesModal = () => {
    setShowServicesModal(false);
    setSelectedSession(null);
    setServiceFormData({
      service_id: '',
      quantity: 1
    });
  };

  const openServicesModal = (session) => {
    setSelectedSession(session);
    setShowServicesModal(true);
  };

  const SessionCard = ({ session }) => {
    const poste = postes.find(p => p.id === session.station_id);
    const estimatedCost = poste ? calculateCost(session.start_time, poste.hourly_rate) : 0;

    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{session.station_name}</h3>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <User className="w-4 h-4" />
                {session.client_name || 'Client anonyme'}
              </p>
            </div>
          </div>
          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold border border-green-500/50 animate-pulse">
            En cours
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Durée
            </span>
            <span className="text-white font-semibold">{calculateDuration(session.start_time)}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Estimation
            </span>
            <span className="text-cyan-400 font-bold">{estimatedCost.toLocaleString()} Ar</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Début</span>
            <span className="text-white">{new Date(session.start_time).toLocaleTimeString('fr-FR')}</span>
          </div>

          {session.notes && (
            <div className="text-xs text-gray-400 pt-2 border-t border-white/10">
              <span className="font-semibold">Note:</span> {session.notes}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => openServicesModal(session)}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            Services
          </button>
          <button
            onClick={() => handleCloseSession(session.id)}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            Terminer
          </button>
        </div>
      </div>
    );
  };

  const NewSessionModal = () => {
    const availablePostes = postes.filter(p => p.status === 'disponible');

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="backdrop-blur-xl bg-slate-900/95 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Nouvelle Session</h2>
            <button
              onClick={closeNewSessionModal}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleStartSession} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Poste *</label>
              <select
                required
                value={formData.station_id}
                onChange={(e) => setFormData({ ...formData, station_id: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="">Sélectionner un poste</option>
                {availablePostes.map(poste => (
                  <option key={poste.id} value={poste.id}>
                    {poste.name} ({poste.type}) - {poste.hourly_rate} Ar/h
                  </option>
                ))}
              </select>
              {availablePostes.length === 0 && (
                <p className="text-orange-400 text-xs mt-2">Aucun poste disponible</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Client (Optionnel)</label>
              <select
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="">Client anonyme</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} {client.phone && `- ${client.phone}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
                placeholder="Notes optionnelles"
                rows="2"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={closeNewSessionModal}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={availablePostes.length === 0}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Démarrer
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const ServicesModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-xl bg-slate-900/95 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Ajouter un Service</h2>
          <button
            onClick={closeServicesModal}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4 p-4 bg-white/5 rounded-xl">
          <p className="text-gray-400 text-sm">Session actuelle:</p>
          <p className="text-white font-semibold">{selectedSession?.station_name}</p>
          <p className="text-gray-400 text-xs">{selectedSession?.client_name || 'Client anonyme'}</p>
        </div>

        <form onSubmit={handleAddService} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Service *</label>
            <select
              required
              value={serviceFormData.service_id}
              onChange={(e) => setServiceFormData({ ...serviceFormData, service_id: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
            >
              <option value="">Sélectionner un service</option>
              {services.filter(s => s.is_active).map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - {service.price} Ar
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Quantité *</label>
            <input
              type="number"
              required
              min="1"
              value={serviceFormData.quantity}
              onChange={(e) => setServiceFormData({ ...serviceFormData, quantity: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={closeServicesModal}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Gestion des Sessions
            </h1>
            <p className="text-gray-400 mt-2">Suivi en temps réel de toutes les sessions actives</p>
          </div>
          <button
            onClick={() => setShowNewSessionModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50"
          >
            <Plus className="w-5 h-5" />
            Nouvelle Session
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Sessions Actives</p>
              <p className="text-3xl font-bold text-white mt-2">{sessions.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
              <Play className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Postes Disponibles</p>
              <p className="text-3xl font-bold text-white mt-2">
                {postes.filter(p => p.status === 'disponible').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl">
              <Monitor className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Estimé</p>
              <p className="text-3xl font-bold text-cyan-400 mt-2">
                {sessions.reduce((sum, s) => {
                  const poste = postes.find(p => p.id === s.station_id);
                  return sum + (poste ? calculateCost(s.start_time, poste.hourly_rate) : 0);
                }, 0).toLocaleString()} Ar
              </p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Chargement...</div>
        </div>
      ) : sessions.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-12 text-center">
          <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Aucune session active</p>
          <button
            onClick={() => setShowNewSessionModal(true)}
            className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-2 px-6 rounded-xl"
          >
            Démarrer une session
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}

      {/* Modals */}
      {showNewSessionModal && <NewSessionModal />}
      {showServicesModal && <ServicesModal />}
    </div>
  );
}

export default Sessions;