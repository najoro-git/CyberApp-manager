import { useState, useEffect } from 'react';
import { Monitor, Users, Clock, DollarSign, TrendingUp, Activity, Zap, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { healthCheck, postesAPI, sessionsAPI, clientsAPI, statsAPI } from '../../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [apiStatus, setApiStatus] = useState('checking');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [postes, setPostes] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [clients, setClients] = useState([]);
  const [globalStats, setGlobalStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAPI();
    loadDashboardData();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const dataRefresh = setInterval(() => {
      loadDashboardData();
    }, 30000); // Rafraîchir toutes les 30 secondes

    return () => {
      clearInterval(timer);
      clearInterval(dataRefresh);
    };
  }, []);

  const checkAPI = async () => {
    try {
      const response = await healthCheck();
      if (response.data.status === 'ok') {
        setApiStatus('online');
      }
    } catch (error) {
      setApiStatus('offline');
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [postesRes, sessionsRes, clientsRes, statsRes] = await Promise.all([
        postesAPI.getAll(),
        sessionsAPI.getActive(),
        clientsAPI.getAll(),
        statsAPI.getGlobal().catch(() => ({ data: { success: false } }))
      ]);

      if (postesRes.data.success) setPostes(postesRes.data.data);
      if (sessionsRes.data.success) setSessions(sessionsRes.data.data);
      if (clientsRes.data.success) setClients(clientsRes.data.data);
      if (statsRes.data.success) setGlobalStats(statsRes.data.data);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = (startTime) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now - start) / 1000 / 60);
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}m`;
  };

  const stats = {
    postesActifs: postes.filter(p => p.status === 'occupé').length,
    postesTotal: postes.length,
    sessionsActives: sessions.length,
    clientsTotal: clients.length,
    revenusEstimes: sessions.reduce((sum, s) => {
      const poste = postes.find(p => p.id === s.station_id);
      if (!poste) return sum;
      const start = new Date(s.start_time);
      const now = new Date();
      const hours = (now - start) / (1000 * 60 * 60);
      return sum + (hours * poste.hourly_rate);
    }, 0)
  };

  const recentActivities = [
    ...sessions.slice(0, 4).map(s => ({
      type: 'session',
      message: `Session démarrée - ${postes.find(p => p.id === s.station_id)?.name || 'Poste'}`,
      time: calculateDuration(s.start_time),
      icon: Clock
    })),
    ...clients.slice(0, 2).map(c => ({
      type: 'client',
      message: `Client enregistré - ${c.name}`,
      time: 'récent',
      icon: Users
    }))
  ].slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-gray-400 text-xl">Chargement du tableau de bord...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6 space-y-6">
        {/* Header with Glassmorphism */}
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Mission Control
              </h1>
              <p className="text-gray-400 mt-2 flex items-center gap-2">
                <Activity className="w-4 h-4 animate-pulse text-cyan-400" />
                Surveillance en temps réel de votre cybercafé
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Time Display */}
              <div className="text-right">
                <div className="text-3xl font-bold text-white tabular-nums">
                  {currentTime.toLocaleTimeString('fr-FR')}
                </div>
                <div className="text-sm text-gray-400">
                  {currentTime.toLocaleDateString('fr-FR')}
                </div>
              </div>

              {/* API Status */}
              <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-3 h-3 rounded-full ${
                      apiStatus === 'online' ? 'bg-green-500' : 
                      apiStatus === 'offline' ? 'bg-red-500' : 
                      'bg-yellow-500'
                    }`}></div>
                    {apiStatus === 'online' && (
                      <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping"></div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Système</div>
                    <div className="text-sm font-semibold text-white">
                      {apiStatus === 'online' ? 'Opérationnel' : 'Hors ligne'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards with Gradient & Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            onClick={() => navigate('/postes')}
            className="group backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                {Math.round((stats.postesActifs / stats.postesTotal) * 100)}%
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-400 text-sm font-medium">Postes Actifs</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{stats.postesActifs}</span>
                <span className="text-xl text-gray-400">/{stats.postesTotal}</span>
              </div>
              
              <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(stats.postesActifs / stats.postesTotal) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate('/sessions')}
            className="group backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-400 text-sm font-medium">Sessions Actives</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{stats.sessionsActives}</span>
              </div>
              
              <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full animate-pulse" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate('/clients')}
            className="group backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-400 text-sm font-medium">Clients Enregistrés</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{stats.clientsTotal}</span>
              </div>
              
              <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate('/reports')}
            className="group backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                +23%
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-400 text-sm font-medium">Revenus Estimés</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-cyan-400">{Math.round(stats.revenusEstimes / 1000)}k</span>
                <span className="text-xl text-gray-400">Ar</span>
              </div>
              
              <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Postes Grid */}
          <div className="lg:col-span-2 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Monitor className="w-6 h-6 text-cyan-400" />
                État des Postes
              </h2>
              <button
                onClick={() => navigate('/postes')}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold flex items-center gap-1 transition-colors"
              >
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {postes.slice(0, 10).map((poste) => {
                const isOccupied = poste.status === 'occupé';
                const session = sessions.find(s => s.station_id === poste.id);
                
                return (
                  <div
                    key={poste.id}
                    onClick={() => navigate('/postes')}
                    className={`relative group cursor-pointer backdrop-blur-xl rounded-xl p-4 transition-all duration-300 hover:scale-105 ${
                      isOccupied
                        ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-2 border-green-500/50 hover:shadow-lg hover:shadow-green-500/50'
                        : 'bg-white/5 border-2 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {isOccupied && (
                      <div className="absolute top-2 right-2">
                        <Zap className="w-4 h-4 text-green-400 animate-pulse" />
                      </div>
                    )}
                    
                    <Monitor className={`w-8 h-8 mx-auto mb-2 ${
                      isOccupied ? 'text-green-400' : 'text-gray-500'
                    }`} />
                    <p className="text-white font-semibold text-center text-sm">{poste.name}</p>
                    {isOccupied && session && (
                      <div className="mt-2 text-xs text-center">
                        <div className="text-green-400 font-semibold">{calculateDuration(session.start_time)}</div>
                        <div className="text-gray-400 truncate">{session.client_name || 'Client'}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-cyan-400" />
              Activités Récentes
            </h2>
            
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={index}
                      className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium">{activity.message}</p>
                          <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 text-center py-8">Aucune activité récente</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/sessions')}
              className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Nouvelle Session
              </span>
            </button>
            <button
              onClick={() => navigate('/clients')}
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                Ajouter Client
              </span>
            </button>
            <button
              onClick={() => navigate('/reports')}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Voir Rapports
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;