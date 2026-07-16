import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canAccessRoute, getDefaultRoute } from '../utils/roles';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-main">
        <div className="spinner spinner-lg" />
        <div className="theme-text-muted text-sm">Loading...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Role-based check
  const path = location.pathname;
  if (!canAccessRoute(path, user.role)) {
    return <Navigate to={getDefaultRoute(user.role)} replace />;
  }

  return children;
}
