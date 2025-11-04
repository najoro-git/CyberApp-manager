import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Clock, Download, Calendar, BarChart3, Filter } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { statsAPI } from '../../services/api';

function stats() {
  const [period, setPeriod] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [globalStats, setGlobalStats] = useState(null);
  const [dailyReport, setDailyReport] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGlobalStats();
  }, []);

  useEffect(() => {
    if (period === 'daily') {
      loadDailyReport();
    } else if (period === 'monthly') {
      loadMonthlyReport();
    }
  }, [period, selectedDate, selectedMonth, selectedYear]);

  const loadGlobalStats = async () => {
    try {
      const response = await statsAPI.getGlobal();
      if (response.data.success) {
        setGlobalStats(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const loadDailyReport = async () => {
    try {
      setLoading(true);
      const response = await statsAPI.getDaily(selectedDate);
      if (response.data.success) {
        setDailyReport(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement rapport journalier:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMonthlyReport = async () => {
    try {
      setLoading(true);
      const response = await statsAPI.getMonthly(selectedYear, selectedMonth.toString().padStart(2, '0'));
      if (response.data.success) {
        setMonthlyReport(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement rapport mensuel:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

  const formatCurrency = (value) => {
    return value ? `${Math.round(value).toLocaleString()} Ar` : '0 Ar';
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '0h';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

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
              <option value="daily">Journalier</option>
              <option value="monthly">Mensuel</option>
            </select>

            {period === 'daily' ? (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
              />
            ) : (
              <div className="flex gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2000, i).toLocaleString('fr-FR', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <option key={i} value={new Date().getFullYear() - i}>
                      {new Date().getFullYear() - i}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Global Stats KPI Cards */}
      {globalStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Total
              </span>
            </div>
            <p className="text-gray-400 text-sm">Revenus Totaux</p>
            <p className="text-3xl font-bold text-white mt-2">{formatCurrency(globalStats.total_revenue)}</p>
            <p className="text-xs text-gray-500 mt-2">{globalStats.completed_sessions} sessions complétées</p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-400 text-sm">Durée Moyenne</p>
            <p className="text-3xl font-bold text-white mt-2">{formatDuration(globalStats.avg_session_duration)}</p>
            <p className="text-xs text-gray-500 mt-2">par session</p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-400 text-sm">Clients Totaux</p>
            <p className="text-3xl font-bold text-white mt-2">{globalStats.total_clients}</p>
            <p className="text-xs text-gray-500 mt-2">dans la base</p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-400 text-sm">Taux Occupation</p>
            <p className="text-3xl font-bold text-white mt-2">{Math.round(globalStats.occupancy_rate)}%</p>
            <p className="text-xs text-gray-500 mt-2">{globalStats.active_sessions} sessions actives</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Chargement...</div>
        </div>
      ) : period === 'daily' && dailyReport ? (
        <>
          {/* Daily Revenue Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
              <p className="text-gray-400 text-sm">Sessions du Jour</p>
              <p className="text-4xl font-bold text-white mt-2">{dailyReport.revenue.total_sessions || 0}</p>
              <p className="text-sm text-gray-500 mt-2">Durée totale: {formatDuration(dailyReport.revenue.total_minutes)}</p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
              <p className="text-gray-400 text-sm">Revenus de Base</p>
              <p className="text-4xl font-bold text-cyan-400 mt-2">{formatCurrency(dailyReport.revenue.base_revenue)}</p>
              <p className="text-sm text-gray-500 mt-2">Tarif horaire</p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
              <p className="text-gray-400 text-sm">Services</p>
              <p className="text-4xl font-bold text-purple-400 mt-2">{formatCurrency(dailyReport.revenue.services_revenue)}</p>
              <p className="text-sm text-gray-500 mt-2">Services additionnels</p>
            </div>
          </div>

          {/* Station Performance */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
              Performance des Postes
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyReport.station_stats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="station_name" stroke="#9ca3af" />
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
                <Bar dataKey="revenue" name="Revenus (Ar)" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="session_count" name="Sessions" fill="url(#sessionGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Services */}
          {dailyReport.top_services && dailyReport.top_services.length > 0 && (
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                Services les Plus Vendus
              </h2>
              <div className="space-y-3">
                {dailyReport.top_services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                        index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                        'bg-gradient-to-br from-cyan-500 to-blue-600'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{service.service_name}</p>
                        <p className="text-gray-400 text-sm">{service.total_quantity} vente(s)</p>
                      </div>
                    </div>
                    <p className="text-cyan-400 font-bold text-lg">{formatCurrency(service.total_revenue)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : period === 'monthly' && monthlyReport ? (
        <>
          {/* Monthly Revenue Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
              <p className="text-gray-400 text-sm">Revenus du Mois</p>
              <p className="text-4xl font-bold text-cyan-400 mt-2">{formatCurrency(monthlyReport.revenue.total_revenue)}</p>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-xs text-gray-400">Base</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(monthlyReport.revenue.base_revenue)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Services</p>
                  <p className="text-lg font-bold text-purple-400">{formatCurrency(monthlyReport.revenue.services_revenue)}</p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
              <p className="text-gray-400 text-sm">Sessions du Mois</p>
              <p className="text-4xl font-bold text-white mt-2">{monthlyReport.revenue.total_sessions || 0}</p>
              <p className="text-sm text-gray-500 mt-2">Durée totale: {formatDuration(monthlyReport.revenue.total_minutes)}</p>
            </div>
          </div>

          {/* Daily Revenue Chart */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              Évolution Journalière des Revenus
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyReport.daily_revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af"
                  tickFormatter={(date) => new Date(date).getDate()}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(12px)',
                  }}
                  labelFormatter={(date) => new Date(date).toLocaleDateString('fr-FR')}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenus (Ar)"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Clients */}
          {monthlyReport.top_clients && monthlyReport.top_clients.length > 0 && (
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-cyan-400" />
                Top Clients du Mois
              </h2>
              <div className="space-y-3">
                {monthlyReport.top_clients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                        index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                        'bg-gradient-to-br from-cyan-500 to-blue-600'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{client.name}</p>
                        <p className="text-gray-400 text-sm">{client.visit_count} visite(s)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 font-bold text-lg">{formatCurrency(client.total_spent)}</p>
                      <p className="text-gray-400 text-sm">Total dépensé</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

export default stats;