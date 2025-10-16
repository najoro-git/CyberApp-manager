import { useState } from 'react';
import { TrendingUp, DollarSign, Users, Clock, Download, Calendar, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Reports() {
  const [period, setPeriod] = useState('month');

  // Données de démonstration
  const revenueData = [
    { name: 'Lun', revenus: 12000, sessions: 24 },
    { name: 'Mar', revenus: 15000, sessions: 28 },
    { name: 'Mer', revenus: 18000, sessions: 32 },
    { name: 'Jeu', revenus: 14000, sessions: 26 },
    { name: 'Ven', revenus: 22000, sessions: 38 },
    { name: 'Sam', revenus: 28000, sessions: 45 },
    { name: 'Dim', revenus: 25000, sessions: 40 },
  ];

  const postesData = [
    { name: 'Poste 1', utilisation: 85 },
    { name: 'Poste 2', utilisation: 92 },
    { name: 'Poste 3', utilisation: 78 },
    { name: 'Poste 4', utilisation: 88 },
    { name: 'Poste 5', utilisation: 95 },
  ];

  const servicesData = [
    { name: 'Sessions', value: 68, color: '#06b6d4' },
    { name: 'Impression', value: 18, color: '#8b5cf6' },
    { name: 'Scan', value: 8, color: '#f59e0b' },
    { name: 'Ventes', value: 6, color: '#10b981' },
  ];

  const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Rapports & Statistiques
            </h1>
            <p className="text-gray-400 mt-2">Analyse détaillée des performances de votre cybercafé</p>
          </div>
          <div className="flex gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
            >
              <option value="day">Aujourd'hui</option>
              <option value="week">Cette Semaine</option>
              <option value="month">Ce Mois</option>
              <option value="year">Cette Année</option>
            </select>
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +23%
            </span>
          </div>
          <p className="text-gray-400 text-sm">Revenus Totaux</p>
          <p className="text-3xl font-bold text-white mt-2">134,000 Ar</p>
          <p className="text-xs text-gray-500 mt-2">vs. semaine dernière</p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +15%
            </span>
          </div>
          <p className="text-gray-400 text-sm">Sessions Total</p>
          <p className="text-3xl font-bold text-white mt-2">233</p>
          <p className="text-xs text-gray-500 mt-2">vs. semaine dernière</p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +18%
            </span>
          </div>
          <p className="text-gray-400 text-sm">Clients Uniques</p>
          <p className="text-3xl font-bold text-white mt-2">87</p>
          <p className="text-xs text-gray-500 mt-2">vs. semaine dernière</p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12%
            </span>
          </div>
          <p className="text-gray-400 text-sm">Taux Occupation</p>
          <p className="text-3xl font-bold text-white mt-2">82%</p>
          <p className="text-xs text-gray-500 mt-2">vs. semaine dernière</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              Évolution des Revenus
            </h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(12px)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenus"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: '#06b6d4', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Services Distribution */}
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
              Répartition des Services
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={servicesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {servicesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(12px)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Postes Utilization */}
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
              Taux d'Utilisation des Postes
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={postesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(12px)',
                }}
              />
              <Bar dataKey="utilisation" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sessions per Day */}
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-cyan-400" />
              Sessions par Jour
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(12px)',
                }}
              />
              <Bar dataKey="sessions" fill="url(#sessionGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Clients */}
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-cyan-400" />
          Top 5 Clients Fidèles
        </h2>
        <div className="space-y-4">
          {[
            { name: 'Sophie Feno', visits: 30, amount: 62000, rank: 1 },
            { name: 'Jean Rakoto', visits: 24, amount: 45000, rank: 2 },
            { name: 'Marie Rasoa', visits: 18, amount: 32000, rank: 3 },
            { name: 'Paul Andry', visits: 12, amount: 18000, rank: 4 },
            { name: 'Michel Rabe', visits: 8, amount: 12000, rank: 5 },
          ].map((client) => (
            <div
              key={client.rank}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  client.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                  client.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                  client.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                  'bg-gradient-to-br from-cyan-500 to-blue-600'
                }`}>
                  #{client.rank}
                </div>
                <div>
                  <p className="text-white font-semibold">{client.name}</p>
                  <p className="text-gray-400 text-sm">{client.visits} visites</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-cyan-400 font-bold text-lg">{client.amount.toLocaleString()} Ar</p>
                <p className="text-gray-400 text-sm">Total dépensé</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reports;