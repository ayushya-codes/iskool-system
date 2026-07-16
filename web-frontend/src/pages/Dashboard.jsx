import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../api/dashboard';
import PageHeader from '../components/PageHeader';
import { Users, GraduationCap, CalendarCheck, DollarSign, ClipboardList, Package, Activity, TrendingUp, Clock } from 'lucide-react';
import { StatCard, SkeletonCard, EmptyState, Card, CardHeader, CardTitle, CardBody } from '../components/ui';
import SuperAdminDashboard from './SuperAdminDashboard';

const ACTIVITY_ICONS = {
  STUDENT_LEAVE: CalendarCheck,
  FACULTY_LEAVE: CalendarCheck,
  PENDING_FEE: DollarSign,
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'PARENT' || user?.role === 'FACULTY') return;
    dashboardApi.getStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [user]);

  if (user?.role === 'SUPER_ADMIN') {
    return <SuperAdminDashboard />;
  }

  if (user?.role === 'PARENT') {
    return <Navigate to="/my-child" replace />;
  }

  if (user?.role === 'FACULTY') {
    return <Navigate to="/students" replace />;
  }

  const attendanceRate = stats?.attendanceToday?.attendanceRate ?? 0;
  const attendanceLabel = stats?.attendanceToday?.totalRecords > 0
    ? `${attendanceRate}% (${stats.attendanceToday.presentCount}/${stats.attendanceToday.totalRecords})`
    : 'No data';

  const statCards = [
    { label: 'Total Students', value: stats?.totalStudents ?? 0, icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'Faculty Members', value: stats?.facultyMembers ?? 0, icon: GraduationCap, iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
    { label: 'Attendance Today', value: attendanceLabel, icon: CalendarCheck, iconBg: 'bg-teal-50', iconColor: 'text-teal-600' },
    { label: 'Pending Fees', value: stats?.pendingFees ?? 0, icon: DollarSign, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { label: 'Upcoming Exams', value: stats?.upcomingExams ?? 0, icon: ClipboardList, iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
    { label: 'Inventory Items', value: stats?.inventoryItems ?? 0, icon: Package, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your school's key metrics" />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 grid-stagger">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          statCards.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
            <StatCard key={label} icon={Icon} label={label} value={value} iconBg={iconBg} iconColor={iconColor} />
          ))
        )}
      </div>

      {/* Attendance Breakdown + Recent Activity */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        {/* Attendance Breakdown — 2/3 width */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Attendance Breakdown — Today</CardTitle>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="space-y-4">
                <div className="skeleton skeleton-block" style={{ height: 80 }} />
                <div className="skeleton skeleton-block" style={{ height: 80 }} />
              </div>
            ) : !stats?.attendanceToday?.totalRecords ? (
              <EmptyState message="No attendance records for today yet." icon={CalendarCheck} />
            ) : (
              <AttendanceBreakdown data={stats.attendanceToday} />
            )}
          </CardBody>
        </Card>

        {/* Recent Activity — 1/3 width */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton skeleton-block" style={{ height: 56 }} />
                ))}
              </div>
            ) : !stats?.recentActivities?.length ? (
              <EmptyState message="No recent activity." icon={Activity} />
            ) : (
              <div className="space-y-3">
                {stats.recentActivities.map((activity, idx) => {
                  const Icon = ACTIVITY_ICONS[activity.type] || Activity;
                  return (
                    <div key={idx} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 accent-tint-bg">
                        <Icon className="w-4 h-4 text-accent-c" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm theme-text truncate">{activity.description}</p>
                        <p className="text-xs theme-text-muted flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {activity.date}
                        </p>
                      </div>
                      <span className="theme-badge shrink-0">{activity.status}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function AttendanceBreakdown({ data }) {
  const segments = [
    { label: 'Present', count: data.presentCount, color: 'bg-teal-500', textColor: 'text-teal-600' },
    { label: 'Absent', count: data.absentCount, color: 'bg-rose-500', textColor: 'text-rose-600' },
    { label: 'On Leave', count: data.leaveCount, color: 'bg-amber-500', textColor: 'text-amber-600' },
  ];
  const total = data.totalRecords || 1;

  return (
    <div>
      {/* Progress bar */}
      <div className="flex h-3 rounded-full overflow-hidden bg-slate-100 mb-4">
        {segments.map((seg) => seg.count > 0 && (
          <div
            key={seg.label}
            className={seg.color}
            style={{ width: `${(seg.count / total) * 100}%` }}
          />
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {segments.map((seg) => (
          <div key={seg.label} className="text-center">
            <p className={`text-2xl font-bold ${seg.textColor}`}>{seg.count}</p>
            <p className="text-xs theme-text-muted mt-1">{seg.label}</p>
          </div>
        ))}
      </div>

      {/* Overall rate */}
      <div className="mt-4 pt-4 theme-divider flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-teal-600" />
          <span className="text-sm theme-text-muted">Attendance Rate</span>
        </div>
        <span className="text-lg font-bold text-teal-600">{data.attendanceRate}%</span>
      </div>
    </div>
  );
}
