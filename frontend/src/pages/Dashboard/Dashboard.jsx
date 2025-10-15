import { useState, useEffect } from 'react';
import { Monitor, Users, Clock, DollarSign, TrendingUp, Activity, Zap, Wifi } from 'lucide-react';
import { healthCheck } from '../../services/api';

function Dashboard() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    checkAPI();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
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

  const stats = [
    {
      title: 'Postes Actifs',
      value: '8',
      total: '/10',
      icon: Monitor,
      color: 'from-cyan-500 to-blue-600',
      percentage: 80,
      trend: '+12%'
    },
    {
      title: 'Sessions Actives',
      value: '12',
      total: '',
      icon: Clock,
      color: 'from-emerald-500 to-teal-600',
      percentage: 65,
      trend: '+8%'
    },
    {
      title: 'Clients Aujourd\'hui',
      value: '24',
      total: '',
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      percentage: 90,
      trend: '+15%'
    },
    {
      title: 'Revenus du Jour',
      value: '45,000',
      total: ' Ar',
      icon: DollarSign,
      color: 'from-orange-500 to-red-600',
      percentage: 75,
      trend: '+23%'
    },
  ];

  const recentActivities = [
    { type: 'session', message: 'Nouvelle session - Poste 3', time: '2 min', icon: Clock },
    { type: 'client', message: 'Nouveau client enregistré', time: '5 min', icon: Users },
    { type: 'payment', message: 'Paiement reçu - 2,500 Ar', time: '8 min', icon: DollarSign },
    { type: 'maintenance', message: 'Poste 7 - Maintenance terminée', time: '15 min', icon: Activity },
  ];

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
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    {stat.trend}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{stat.value}</span>
                    <span className="text-xl text-gray-400">{stat.total}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Postes Grid */}
          <div className="lg:col-span-2 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Wifi className="w-6 h-6 text-cyan-400" />
                État des Postes
              </h2>
              <div className="flex gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-400">Occupé</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-gray-400">Libre</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const isOccupied = num <= 8;
                return (
                  <div
                    key={num}
                    className={`relative group cursor-pointer backdrop-blur-xl rounded-xl p-4 transition-all duration-300 ${
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
                    <p className="text-white font-semibold text-center text-sm">P{num}</p>
                    {isOccupied && (
                      <div className="mt-2 text-xs text-center">
                        <div className="text-green-400 font-semibold">2h 15m</div>
                        <div className="text-gray-400">Client #{num}</div>
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
              {recentActivities.map((activity, index) => {
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
                        <p className="text-gray-400 text-xs mt-1">Il y a {activity.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="w-full mt-4 backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300">
              Voir Tout
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Clock className="w-5 h-5" />
                Nouvelle Session
              </span>
            </button>
            <button className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/50">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                Ajouter Client
              </span>
            </button>
            <button className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
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