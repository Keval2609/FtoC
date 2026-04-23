import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const { login, user, userProfile, needsRoleSelection } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // After successful login, route based on role
  useEffect(() => {
    if (!user || !userProfile) return;

    if (needsRoleSelection) {
      navigate('/role-select');
      return;
    }

    // If a redirect was requested, use it
    if (redirect) {
      navigate(redirect);
      return;
    }

    // Otherwise, route based on role
    if (!userProfile.onboardingComplete) {
      navigate('/onboarding');
    } else if (userProfile.role === 'farmer') {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  }, [user, userProfile, needsRoleSelection, redirect, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // Navigation is handled by the useEffect above
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-primary-container rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-on-primary-container text-2xl">spa</span>
          </div>
          <h1 className="font-display-xl text-display-xl text-on-surface text-3xl">Welcome Back</h1>
          <p className="text-on-surface-variant">Sign in to continue to TerraDirect</p>
        </div>

        {/* Google */}
        <GoogleSignInButton />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/50" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-sm text-on-surface-variant">or continue with email</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-error-container text-on-error-container text-sm rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="td-input"
              placeholder="farmer@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="td-input"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-on-surface-variant">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
