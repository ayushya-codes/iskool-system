import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, UserCheck, CalendarCheck, BookOpen,
  ClipboardList, DollarSign, Package, Shield, LifeBuoy, BookMarked,
  Megaphone, Bell, Settings, LogOut, GraduationCap, Menu, X, CalendarDays, Calendar,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { getNavItemsForRole } from '../utils/roles';
import SchoolSelector from './SchoolSelector';
import ThemeToggle from './ThemeToggle';

const iconMap = {
  LayoutDashboard, Users, CalendarCheck, BookOpen,
  ClipboardList, DollarSign, Package, Shield, LifeBuoy, BookMarked,
  Megaphone, Bell, Settings, GraduationCap, CalendarDays, Calendar,
};

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = useMemo(() => getNavItemsForRole(user?.role), [user?.role]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-main)' }}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
        }}
      >
        <div className="flex items-center justify-between px-5 h-16" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-primary)' }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>iskool</span>
          </div>
          <div className="flex items-center gap-2">
            {user?.role === 'SUPER_ADMIN' && <SchoolSelector />}
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden" style={{ color: 'var(--sidebar-text)' }}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map(({ path, label, icon }) => {
            const Icon = iconMap[icon];
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: active ? 'var(--sidebar-active-bg)' : 'transparent',
                  color: active ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--sidebar-hover-bg)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <span className="theme-icon-wrapper w-7 h-7 shrink-0">
                  <Icon className="w-[18px] h-[18px]" />
                </span>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ background: 'var(--accent-secondary)' }}>
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-main)' }}>{user?.fullName || 'User'}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.role || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium transition-colors"
            style={{ color: 'var(--sidebar-text)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--sidebar-hover-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut className="w-[18px] h-[18px]" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between h-16 px-4 theme-panel">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden" style={{ color: 'var(--text-main)' }}>
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold lg:hidden theme-text">iskool</span>
          <div className="flex items-center gap-3 ml-auto">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-x-auto" style={{ background: 'var(--bg-main)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
