import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { schoolApi } from '../api/school';
import PageHeader from '../components/PageHeader';
import { Building2, Users, ArrowRight, MapPin, Calendar } from 'lucide-react';

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl p-5 flex items-center gap-4 theme-card">
          <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm theme-text-muted">Total Schools</p>
            <p className="text-2xl font-bold theme-text">{schools.length}</p>
          </div>
        </div>
        <div className="rounded-xl p-5 flex items-center gap-4 theme-card">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm theme-text-muted">Active Schools</p>
            <p className="text-2xl font-bold theme-text">
              {schools.filter((s) => s.isActive !== false).length}
            </p>
          </div>
        </div>
        <div className="rounded-xl p-5 flex items-center gap-4 theme-card">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm theme-text-muted">Platform Users</p>
            <p className="text-2xl font-bold theme-text">—</p>
          </div>
        </div>
      </div>

      {/* School List */}
      <div className="rounded-xl p-6 theme-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold theme-text">Onboarded Schools</h2>
          <input
            type="text"
            placeholder="Search schools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg px-3 py-1.5 text-sm theme-input"
          />
        </div>

        {loading ? (
          <p className="text-sm theme-text-muted py-8 text-center">Loading schools...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm theme-text-muted py-8 text-center">
            {schools.length === 0 ? 'No schools onboarded yet.' : 'No schools match your search.'}
          </p>
        ) : (
          <div className="space-y-2">
            {filtered.map((school) => (
              <div
                key={school.id}
                className="flex items-center justify-between p-4 rounded-lg border transition-colors"
                style={{ borderColor: 'color-mix(in srgb, var(--text-muted) 20%, transparent)' }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'color-mix(in srgb, var(--accent-primary) 15%, transparent)' }}>
                    <Building2 className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
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
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    school.isActive === false
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {school.isActive === false ? 'Inactive' : 'Active'}
                  </span>
                  <button
                    onClick={() => {
                      localStorage.setItem('iskool_selected_school_id', school.id);
                      window.location.reload();
                    }}
                    className="flex items-center gap-1 text-sm font-medium"
                    style={{ color: 'var(--accent-primary)' }}
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
