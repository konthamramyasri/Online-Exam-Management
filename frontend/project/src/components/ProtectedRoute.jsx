import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { PageLoader } from '../components/ui/Feedback';

export function ProtectedRoute({ children, role }) {
  const { session, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader label="Loading..." />;

  if (!session) {
    return <Navigate to={`/login?role=${role}`} state={{ from: location }} replace />;
  }

  if (!profile) {
    return <PageLoader label="Loading your profile..." />;
  }

  if (profile.role !== role) {
    return <Navigate to={profile.role === 'admin' ? '/admin' : '/student'} replace />;
  }

  return <>{children}</>;
}
