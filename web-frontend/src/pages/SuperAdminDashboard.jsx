import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { schoolApi } from '../api/school';
import PageHeader from '../components/PageHeader';
import { Building2, Users, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { SkeletonCard } from '../components/ui/Skeleton';
import { StatCard, EmptyState } from '../components/ui';

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    schoolApi.getAll()
      .then((res) => setSchools(res.data))
      .catch(() => setSchools([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = schools.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.subdomain?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Super Admin Dashboard"
        subtitle="Manage all schools onboarded on the platform"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 grid-stagger">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard icon={Building2} label="Total Schools" value={schools.length} iconBg="bg-indigo-50" iconColor="text-indigo-600" />
            <StatCard icon={Calendar} label="Active Schools" value={schools.filter((s) => s.isActive !== false).length} iconBg="bg-teal-50" iconColor="text-teal-600" />
            <StatCard icon={Users} label="Platform Users" value="—" iconBg="bg-violet-50" iconColor="text-violet-600" />
          </>
        )}
      </div>

      {/* School List */}
      <div className="rounded-xl p-6 theme-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold theme-text">Onboarded Schools</h2>
          <input
            type="text"
            placeholder="Search schools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg px-3.5 py-2 text-sm theme-input w-48 sm:w-64"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map((i) => (
              <div key={i} className="skeleton skeleton-block" style={{ height: 64 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState message={schools.length === 0 ? 'No schools onboarded yet.' : 'No schools match your search.'} icon={Building2} />
        ) : (
          <div className="space-y-2">
            {filtered.map((school, idx) => (
              <div
                key={school.id}
                className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 animate-fade-in"
                style={{
                  borderColor: 'color-mix(in srgb, var(--text-muted) 20%, transparent)',
                  animationDelay: `${idx * 0.04}s`,
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 accent-tint-bg">
                    <Building2 className="w-5 h-5 text-accent-c" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold theme-text truncate">{school.name}</p>
                    <p className="text-xs theme-text-muted flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {school.subdomain || `school-${school.id}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="theme-badge" style={{
                    background: school.isActive === false ? 'color-mix(in srgb, var(--text-muted) 15%, transparent)' : 'color-mix(in srgb, var(--success) 15%, transparent)',
                    color: school.isActive === false ? 'var(--text-muted)' : 'var(--success)',
                  }}>
                    {school.isActive === false ? 'Inactive' : 'Active'}
                  </span>
                  <button
                    onClick={() => {
                      localStorage.setItem('iskool_selected_school_id', school.id);
                      window.location.reload();
                    }}
                    className="flex items-center gap-1 text-sm font-medium transition-all hover:gap-2 text-accent-c"
                  >
                    View Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
