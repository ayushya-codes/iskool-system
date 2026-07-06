import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import { Users, GraduationCap, CalendarCheck, DollarSign, ClipboardList, Package } from 'lucide-react';
import SuperAdminDashboard from './SuperAdminDashboard';

const stats = [
  { label: 'Total Students', value: '—', icon: Users, color: 'bg-blue-500' },
  { label: 'Faculty Members', value: '—', icon: GraduationCap, color: 'bg-purple-500' },
  { label: 'Attendance Today', value: '—', icon: CalendarCheck, color: 'bg-green-500' },
  { label: 'Pending Fees', value: '—', icon: DollarSign, color: 'bg-amber-500' },
  { label: 'Upcoming Exams', value: '—', icon: ClipboardList, color: 'bg-red-500' },
  { label: 'Inventory Items', value: '—', icon: Package, color: 'bg-indigo-500' },
];

export default function Dashboard() {
  const { user } = useAuth();

  // Super Admin gets their own platform-level dashboard
  if (user?.role === 'SUPER_ADMIN') {
    return <SuperAdminDashboard />;
  }

  // Parent shouldn't see the admin Dashboard
  if (user?.role === 'PARENT') {
    return <Navigate to="/my-child" replace />;
  }

  // Faculty shouldn't see the admin Dashboard
  if (user?.role === 'FACULTY') {
    return <Navigate to="/students" replace />;
  }

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your school's key metrics" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl p-5 flex items-center gap-4 theme-card">
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shrink-0`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm theme-text-muted">{label}</p>
              <p className="text-2xl font-bold theme-text">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl p-6 theme-card">
        <h2 className="text-lg font-semibold theme-text mb-4">Recent Activity</h2>
        <p className="text-sm theme-text-muted">No recent activity to show. Connect the backend to see live data.</p>
      </div>
    </div>
  );
}
