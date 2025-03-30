import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, Play, Store, Settings, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NavLink = memo(({ to, icon: Icon, label, isActive }: { to: string; icon: any; label: string; isActive: boolean }) => (
  <Link
    to={to}
    className={`flex flex-col items-center justify-center ${
      isActive ? 'text-purple-600' : 'text-gray-600'
    }`}
  >
    <Icon className="h-6 w-6" />
    <span className="text-xs mt-1">{label}</span>
  </Link>
));

export const Layout = memo(({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/profile">
              <Settings className="h-5 w-5 text-gray-600" />
            </Link>
            <span className="text-lg font-medium">
              Bienvenida, {user?.email?.split('@')[0] || 'Usuario'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/profile" className="relative">
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
              <User className="h-5 w-5 text-gray-600" />
            </Link>
            <Link to="/marketplace" className="relative">
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
              <Store className="h-5 w-5 text-gray-600" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 pb-16">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto px-6 h-16">
          <div className="grid grid-cols-4 h-full">
            <NavLink to="/" icon={Home} label="UPlay" isActive={location.pathname === '/'} />
            <NavLink to="/analytics" icon={BarChart3} label="UStats" isActive={location.pathname === '/analytics'} />
            <NavLink to="/video/1" icon={Play} label="USocial" isActive={location.pathname.startsWith('/video')} />
            <NavLink to="/marketplace" icon={Store} label="UMarket" isActive={location.pathname === '/marketplace'} />
          </div>
        </div>
      </nav>
    </div>
  );
});

Layout.displayName = 'Layout';