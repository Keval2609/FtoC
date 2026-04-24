import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import Button from '../components/ui/Button';

const ROLES = [
  {
    id: 'customer',
    label: 'Customer',
    icon: 'shopping_bag',
    desc: 'Discover and buy fresh produce from local farms',
  },
  {
    id: 'farmer',
    label: 'Farmer',
    icon: 'agriculture',
    desc: 'List your harvest and sell directly to customers',
  },
];

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(email, password, name, role);
      if (role === 'farmer') {
        navigate('/dashboard');
      } else {
        navigate('/'); // customer route
      }
    } catch (err) {
      setError(err.message || 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-secondary-container rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-on-secondary-container text-2xl">person_add</span>
          </div>
          <h1 className="font-display-xl text-display-xl text-on-surface text-3xl">Join TerraDirect</h1>
          <p className="text-on-surface-variant">Create your account and start sourcing from real farms</p>
        </div>

        {/* ═══ Role Toggle ═══ */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-on-surface-variant tracking-wide uppercase">
            I want to join as
          </label>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => {
              const selected = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`
                    relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group
                    ${selected
                      ? 'border-primary bg-primary-container/30 shadow-sm'
                      : 'border-outline-variant/50 bg-surface-container-low hover:border-outline hover:bg-surface-container'
                    }
                  `}
                >
                  {/* Selection indicator */}
                  <div className={`
                    absolute top-2.5 right-2.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${selected ? 'border-primary bg-primary' : 'border-outline-variant'}
                  `}>
                    {selected && (
                      <span className="material-symbols-outlined text-on-primary" style={{ fontSize: 14 }}>
                        check
                      </span>
                    )}
                  </div>

                  <span
                    className={`material-symbols-outlined text-2xl transition-colors ${selected ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {r.icon}
                  </span>
                  <span className={`font-button text-sm ${selected ? 'text-primary' : 'text-on-surface'}`}>
                    {r.label}
                  </span>
                  <span className="text-xs text-on-surface-variant text-center leading-tight">
                    {r.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Google */}
        <GoogleSignInButton />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/50" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-sm text-on-surface-variant">or sign up with email</span>
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
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="td-input"
              placeholder="Sarah Jenkins"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="td-input"
              placeholder="sarah@example.com"
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
              placeholder="Min 6 characters"
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
                Creating account…
              </>
            ) : (
              `Create ${role === 'farmer' ? 'Farmer' : 'Customer'} Account`
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
