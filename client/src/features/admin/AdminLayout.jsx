import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, to: '/admin' },
    { label: 'Professionals', icon: <Briefcase size={20} />, to: '/admin/professionals' },
    { label: 'Users', icon: <Users size={20} />, to: '/admin/users' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white">JobJiffy Admin</h1>
          <p className="text-xs text-slate-400 mt-1">Management Panel</p>
        </div>

        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-600'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition text-sm font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
