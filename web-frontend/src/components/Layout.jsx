import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, UserCheck, CalendarCheck, BookOpen,
  ClipboardList, DollarSign, Package, Shield, LifeBuoy, BookMarked,
  Megaphone, Bell, Settings, LogOut, GraduationCap, Menu, X, CalendarDays, Calendar,
  ChevronRight, PanelLeftClose, PanelLeftOpen, Search, ChevronDown,
} from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { getGroupedNavItemsForRole } from '../utils/roles';
import SchoolSelector from './SchoolSelector';

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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const userMenuRef = useRef(null);

  const { homeItem, groups: navGroups, footerItems } = useMemo(() => getGroupedNavItemsForRole(user?.role), [user?.role]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => {
      if (prev[section]) return {};
      return { [section]: true };
    });
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const activeGroup = navGroups.find((g) => g.items.some((item) => isActive(item.path)));
    if (activeGroup) {
      setExpandedSections((prev) => ({ ...prev, [activeGroup.section]: true }));
    }
  }, [location.pathname, navGroups]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const allNavItems = [
    ...(homeItem ? [homeItem] : []),
    ...navGroups.flatMap((g) => g.items),
    ...footerItems,
  ];
  const currentNav = allNavItems.find((item) => isActive(item.path));

  return (
    <div className="min-h-screen flex bg-main">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden theme-overlay animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar-container fixed lg:static inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-[68px]' : 'w-64'}`}
      >
        <div className="flex items-center justify-between px-4 h-16 shrink-0 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-indigo-600">
              <GraduationCap className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold text-slate-900 tracking-tight">iskool</span>
            )}
          </Link>
          <div className="flex items-center gap-1.5">
            {!collapsed && user?.role === 'SUPER_ADMIN' && <SchoolSelector />}
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 sidebar-text">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {/* Standalone Home Link */}
          {homeItem && (() => {
            const HomeIcon = iconMap[homeItem.icon];
            const homeActive = isActive(homeItem.path);
            return (
              <Link
                to={homeItem.path}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${collapsed ? 'justify-center' : ''} ${homeActive ? 'bg-indigo-50/80 text-indigo-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                title={collapsed ? homeItem.label : undefined}
              >
                {homeActive && !collapsed && <span className="nav-active-indicator" />}
                <HomeIcon className={`shrink-0 ${collapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]'}`} strokeWidth={1.5} />
                {!collapsed && <span className="truncate">{homeItem.label}</span>}
              </Link>
            );
          })()}

          {/* Divider */}
          {!collapsed && <div className="border-t border-slate-100 my-3" />}

          {/* Collapsible Parent Categories */}
          {navGroups.map((group) => {
            const isExpanded = expandedSections[group.section];
            return (
              <div key={group.section}>
                {!collapsed && (
                  <button
                    onClick={() => toggleSection(group.section)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200"
                  >
                    <span>{group.section}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ease-in-out ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                      strokeWidth={2}
                    />
                  </button>
                )}
                {isExpanded && !collapsed && (
                  <div className="ml-4 mt-1 border-l border-slate-100 pl-2 space-y-0.5">
                    {group.items.map(({ path, label, icon }, idx) => {
                      const Icon = iconMap[icon];
                      const active = isActive(path);
                      return (
                        <Link
                          key={path}
                          to={path}
                          onClick={() => setSidebarOpen(false)}
                          className={`relative flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${active ? 'bg-indigo-50/80 text-indigo-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                          style={{ animationDelay: `${idx * 0.03}s` }}
                        >
                          <Icon className="shrink-0 w-4 h-4" strokeWidth={1.5} />
                          <span className="truncate">{label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Footer Items */}
          {footerItems.length > 0 && (
            <div className="border-t border-slate-100 my-4 pt-2 space-y-0.5">
              {footerItems.map(({ path, label, icon }) => {
                const Icon = iconMap[icon];
                const active = isActive(path);
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setSidebarOpen(false)}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${collapsed ? 'justify-center' : ''} ${active ? 'bg-indigo-50/80 text-indigo-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                    title={collapsed ? label : undefined}
                  >
                    {active && !collapsed && <span className="nav-active-indicator" />}
                    <Icon className={`shrink-0 ${collapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]'}`} strokeWidth={1.5} />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        <div className="shrink-0 p-3 border-t border-slate-200">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-slate-500 hover:text-slate-900 hover:bg-slate-50 ${collapsed ? 'justify-center' : ''}`}
          >
            {collapsed ? <PanelLeftOpen className="w-5 h-5" strokeWidth={1.5} /> : <PanelLeftClose className="w-[18px] h-[18px]" strokeWidth={1.5} />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between h-16 px-4 lg:px-6 bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 text-slate-700">
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-sm">
              {currentNav ? (
                <>
                  <span className="text-slate-400">iskool</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                  <span className="font-semibold text-slate-900">{currentNav.label}</span>
                </>
              ) : (
                <span className="font-bold text-slate-900">iskool</span>
              )}
            </div>
            <span className="font-bold lg:hidden text-slate-900">iskool</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-slate-100/50 border border-slate-200/60 rounded-lg pl-9 pr-3 py-1.5 text-sm w-64 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-300 focus:bg-white transition-all duration-200 ease-in-out"
              />
            </div>
            <Link to="/notifications" className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 ease-in-out">
              <Bell className="w-5 h-5" strokeWidth={1.5} />
            </Link>
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors hover:bg-slate-50"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600 bg-indigo-50 shrink-0">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate" title={user?.fullName || 'User'}>
                    {user?.fullName || user?.email || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user?.role || ''}</p>
                </div>
              </button>
              {userMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 rounded-xl overflow-hidden z-50 bg-white border border-slate-200 shadow-lg animate-scale-in"
                >
                  <div className="px-4 py-4 border-b border-slate-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600 bg-indigo-50">
                        {user?.fullName?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 break-words">{user?.fullName || user?.email || 'User'}</p>
                        <p className="text-xs text-slate-500 break-words">{user?.email || ''}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600">
                      {user?.role || ''}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3.5 w-full text-sm font-medium transition-colors text-left text-slate-700 hover:bg-slate-50"
                  >
                    <LogOut className="w-[18px] h-[18px] text-rose-500" strokeWidth={1.5} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-x-auto bg-slate-50">
          <div key={location.pathname} className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
