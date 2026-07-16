import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import { Users, GraduationCap, CalendarCheck, DollarSign, ClipboardList, Package, Activity, Plug, BarChart3 } from 'lucide-react';
import { StatCard } from '../components/ui';
import SuperAdminDashboard from './SuperAdminDashboard';

const stats = [
  { label: 'Total Students', value: '—', icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { label: 'Faculty Members', value: '—', icon: GraduationCap, iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
  { label: 'Attendance Today', value: '—', icon: CalendarCheck, iconBg: 'bg-teal-50', iconColor: 'text-teal-600' },
  { label: 'Pending Fees', value: '—', icon: DollarSign, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
  { label: 'Upcoming Exams', value: '—', icon: ClipboardList, iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
  { label: 'Inventory Items', value: '—', icon: Package, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
];

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'SUPER_ADMIN') {
    return <SuperAdminDashboard />;
  }

  if (user?.role === 'PARENT') {
    return <Navigate to="/my-child" replace />;
  }

  if (user?.role === 'FACULTY') {
    return <Navigate to="/students" replace />;
  }

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your school's key metrics" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 grid-stagger">
        {stats.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
          <StatCard key={label} icon={Icon} label={label} value={value} iconBg={iconBg} iconColor={iconColor} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        {/* Overview Trends — 2/3 width */}
        <div className="lg:col-span-2 rounded-xl bg-white border border-slate-200/80 transition-all duration-200 ease-in-out hover:border-slate-300">
          <div className="px-6 py-4 border-b border-slate-200/80">
            <h2 className="text-base font-semibold text-slate-900">Overview Trends</h2>
          </div>
          <div className="px-6 py-16 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">No analytics data yet</p>
            <p className="text-xs text-slate-500 mb-5">Connect the backend to visualize trends.</p>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 ease-in-out">
              <Plug className="w-4 h-4" strokeWidth={1.5} />
              Connect Source
            </button>
          </div>
        </div>

        {/* Recent Activity — 1/3 width */}
        <div className="lg:col-span-1 rounded-xl bg-white border border-slate-200/80 transition-all duration-200 ease-in-out hover:border-slate-300">
          <div className="px-6 py-4 border-b border-slate-200/80">
            <h2 className="text-base font-semibold text-slate-900">Recent Activity</h2>
          </div>
          <div className="px-6 py-16 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">No recent activity</p>
            <p className="text-xs text-slate-500">Live data will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
