import { useState, useEffect } from 'react';
import { Monitor, Users, Clock, DollarSign } from 'lucide-react';
import { healthCheck } from '../../services/api';

function Dashboard() {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    checkAPI();
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
      value: '8/10',
      icon: Monitor,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Sessions en Cours',
      value: '12',
      icon: Clock,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Clients du Jour',
      value: '24',
      icon: Users,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Revenus du Jour',
      value: '45,000 Ar',
      icon: DollarSign,
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de votre cybercafé</p>
        </div>
        
        {/* API Status */}
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            apiStatus === 'online' ? 'bg-green-500' : 
            apiStatus === 'offline' ? 'bg-red-500' : 
            'bg-yellow-500'
          }`}></div>
          <span className="text-sm text-gray-600">
            API {apiStatus === 'online' ? 'Connectée' : apiStatus === 'offline' ? 'Déconnectée' : 'Vérification...'}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgLight} p-4 rounded-lg`}>
                  <Icon className={`w-8 h-8 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            Nouvelle Session
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            Ajouter Client
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            Voir Rapports
          </button>
        </div>
      </div>

      {/* Postes Status Preview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">État des Postes</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <div
              key={num}
              className={`p-4 rounded-lg border-2 text-center ${
                num <= 8 ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
              }`}
            >
              <Monitor className={`w-8 h-8 mx-auto mb-2 ${
                num <= 8 ? 'text-green-600' : 'text-gray-400'
              }`} />
              <p className="font-semibold text-gray-700">Poste {num}</p>
              <p className={`text-sm ${num <= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                {num <= 8 ? 'Occupé' : 'Libre'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;