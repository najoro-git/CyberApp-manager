import { Bell, User, Search, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';

function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: 1, message: 'Nouvelle session sur Poste 5', time: '2 min', unread: true },
    { id: 2, message: 'Paiement reçu - 3,500 Ar', time: '5 min', unread: true },
    { id: 3, message: 'Poste 8 libéré', time: '12 min', unread: false },
  ];

  return (
    <header className="backdrop-blur-xl bg-slate-900/80 border-b border-white/10 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              placeholder="Rechercher un client, poste, session..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4 ml-6">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 group"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                3
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 backdrop-blur-xl bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-white font-semibold">Notifications</h3>
                  <p className="text-xs text-gray-400 mt-1">Vous avez 3 nouvelles notifications</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer ${
                        notif.unread ? 'bg-cyan-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && (
                          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                        )}
                        <div className="flex-1">
                          <p className="text-white text-sm">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">Il y a {notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-white/10">
                  <button className="w-full text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors">
                    Tout marquer comme lu
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300">
            <Settings className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 pl-4 border-l border-white/10 hover:bg-white/5 rounded-xl transition-all duration-300 p-2"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-white">Administrateur</p>
                <p className="text-xs text-gray-400">En ligne</p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 backdrop-blur-xl bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Administrateur</p>
                      <p className="text-xs text-gray-400">admin@cyberapp.com</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Mon Profil</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Paramètres</span>
                  </button>
                </div>
                <div className="p-2 border-t border-white/10">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300">
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;