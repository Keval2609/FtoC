import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Guards a route so only authenticated users with a specific role can access it.
 * 
 * @param {string} [requiredRole] — "farmer" or "customer". Omit to allow any authenticated user.
 * @param {boolean} [requireOnboarding] — If true, redirects un-onboarded users to /onboarding.
 */
export default function ProtectedRoute({ children, requiredRole, requireOnboarding = false }) {
  const { user, userProfile, loading, needsRoleSelection } = useAuth();
  const location = useLocation();

  // Still loading auth state — show spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in — redirect to login
  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Google user who hasn't picked a role yet
  if (needsRoleSelection) {
    return <Navigate to="/role-select" replace />;
  }

  // User logged in but no Firestore profile yet (race condition fallback)
  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Role gate — e.g. farmer-only routes
  if (requiredRole && userProfile.role !== requiredRole) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 bg-error-container rounded-2xl flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-on-error-container text-3xl">block</span>
        </div>
        <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Access Restricted</h2>
        <p className="text-on-surface-variant max-w-sm">
          This area is only available to <span className="font-semibold capitalize">{requiredRole}</span> accounts.
          {userProfile.role === 'customer' && (
            <> You're currently signed in as a customer.</>
          )}
          {userProfile.role === 'farmer' && (
            <> You're currently signed in as a farmer.</>
          )}
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 text-primary font-medium hover:underline cursor-pointer"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  // Onboarding gate — redirect to onboarding if not completed
  if (requireOnboarding && !userProfile.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
