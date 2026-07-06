import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import { getDefaultRoute, ROLES } from '../utils/roles';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await login(email, password);
      if (userData.role === ROLES.GATE_KEEPER) {
        setError('Gate Keeper role requires the mobile app. Please use the iskool mobile app to log in.');
        setLoading(false);
        return;
      }
      navigate(getDefaultRoute(userData.role));
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'var(--bg-main)' }}
    >
      {/* Decorative gradient orbs */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-30 blur-[80px] transition-all duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)'
            : 'radial-gradient(circle, #0EA5E9 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-25 blur-[80px] transition-all duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(circle, #F43F5E 0%, transparent 70%)'
            : 'radial-gradient(circle, #6366F1 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full opacity-15 blur-[60px] transition-all duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(circle, #6366F1 0%, transparent 70%)'
            : 'radial-gradient(circle, #F43F5E 0%, transparent 70%)',
        }}
      />

      {/* Theme toggle — top right */}
      <div className="absolute top-5 right-5 z-10">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div
          className="rounded-2xl p-8 theme-panel"
          style={{
            boxShadow: isDark
              ? '0 20px 60px -15px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(255,255,255,0.05)'
              : '0 20px 60px -15px rgba(14, 165, 233, 0.15), 0 0 0 1px rgba(255,255,255,0.6)',
          }}
        >
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, #8B5CF6, #6366F1)'
                  : 'linear-gradient(135deg, #0EA5E9, #6366F1)',
                boxShadow: isDark
                  ? '0 0 30px rgba(139, 92, 246, 0.4)'
                  : '0 8px 20px rgba(14, 165, 233, 0.3)',
              }}
            >
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold theme-text">iskool</h1>
            <p className="text-sm theme-text-muted mt-1">School Management System</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 dark:bg-red-950/40 dark:border-red-900">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium theme-text mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg px-3 py-2.5 text-sm theme-input"
                placeholder="admin@school.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium theme-text mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg px-3 py-2.5 pr-10 text-sm theme-input"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 theme-text-muted hover:opacity-70"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, #8B5CF6, #F43F5E)'
                  : 'linear-gradient(135deg, #0EA5E9, #6366F1)',
                boxShadow: isDark
                  ? '0 4px 20px rgba(139, 92, 246, 0.3)'
                  : '0 4px 20px rgba(14, 165, 233, 0.3)',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs theme-text-muted mt-6">
          Crafted with care by LeanQuitous. &copy; 2026. All rights reserved.
        </p>
      </div>
    </div>
  );
}
