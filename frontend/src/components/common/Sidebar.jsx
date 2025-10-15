import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Clock, FileText, Monitor, Zap } from 'lucide-react';

function Sidebar() {
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Tableau de Bord' },
    { path: '/sessions', icon: Clock, label: 'Sessions' },
    { path: '/clients', icon: Users, label: 'Clients' },
    { path: '/reports', icon: FileText, label: 'Rapports' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-white/10 relative overflow-hidden flex flex-col h-screen">
      {/* Animated Background Effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl -top-32 -left-32 animate-pulse"></div>
        <div className="absolute w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -bottom-32 -right-32 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Monitor className="w-10 h-10 text-cyan-400" />
              <Zap className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                CyberApp
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Powered by Innovation</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border-2 border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-pulse"></div>
                    )}
                    <Icon className={`w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'text-cyan-400' : ''
                    }`} />
                    <span className={`font-semibold relative z-10 ${
                      isActive ? 'text-white' : ''
                    }`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* System Status */}
        <div className="mt-auto px-4 pb-4 space-y-4">
          <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Système</span>
              <span className="text-xs font-semibold text-green-400">Optimal</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">CPU</span>
                <span className="text-white font-medium">45%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[45%] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Mémoire</span>
                <span className="text-white font-medium">62%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[62%] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 backdrop-blur-xl bg-white/5 rounded-xl">
            <div className="text-xs text-gray-400 text-center">
              <p className="font-semibold text-white">Version 1.0.0</p>
              <p className="mt-1">© 2025 CyberApp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;