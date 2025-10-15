import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Clock, FileText, Monitor } from 'lucide-react';

function Sidebar() {
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Tableau de Bord' },
    { path: '/sessions', icon: Clock, label: 'Sessions' },
    { path: '/clients', icon: Users, label: 'Clients' },
    { path: '/reports', icon: FileText, label: 'Rapports' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white">
      {/* Logo */}
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center space-x-3">
          <Monitor className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">PFA CyberApp</h1>
            <p className="text-xs text-blue-300">Gestion de Cybercafé</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-800'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-blue-700">
        <div className="text-xs text-blue-300 text-center">
          <p>Version 1.0.0</p>
          <p className="mt-1">© 2025 PFA CyberApp</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;