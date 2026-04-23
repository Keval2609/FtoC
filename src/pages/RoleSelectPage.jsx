import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const ROLES = [
  {
    id: 'customer',
    label: 'Customer',
    icon: 'shopping_bag',
    desc: 'Discover and buy fresh produce from local farms',
    gradient: 'from-secondary-container/60 to-secondary-container/20',
  },
  {
    id: 'farmer',
    label: 'Farmer',
    icon: 'agriculture',
    desc: 'List your harvest and sell directly to customers',
    gradient: 'from-primary-container/60 to-primary-container/20',
  },
];

export default function RoleSelectPage() {
  const { user, assignRole } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    setError('');
    setLoading(true);
    try {
      await assignRole(selectedRole);
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Failed to set role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-tertiary-container rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-on-tertiary-container text-2xl">group</span>
          </div>
          <h1 className="font-display-xl text-display-xl text-on-surface text-3xl">
            How will you use TerraDirect?
          </h1>
          <p className="text-on-surface-variant">
            Welcome, <span className="font-semibold text-on-surface">{user?.displayName || 'friend'}</span>!
            Choose how you'd like to get started.
          </p>
        </div>

        {/* Role Cards */}
        <div className="space-y-3">
          {ROLES.map((role) => {
            const selected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`
                  w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left group
                  ${selected
                    ? 'border-primary bg-primary-container/15 shadow-sm'
                    : 'border-outline-variant/50 bg-surface-container-low hover:border-outline hover:bg-surface-container'
                  }
                `}
              >
                {/* Icon */}
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors
                  ${selected ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant group-hover:bg-surface-container-highest'}
                `}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: 24 }}>
                    {role.icon}
                  </span>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${selected ? 'text-primary' : 'text-on-surface'}`}>
                    {role.label}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {role.desc}
                  </p>
                </div>

                {/* Radio */}
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                  ${selected ? 'border-primary bg-primary' : 'border-outline-variant'}
                `}>
                  {selected && (
                    <span className="material-symbols-outlined text-on-primary" style={{ fontSize: 14 }}>check</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="p-3 bg-error-container text-on-error-container text-sm rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
            {error}
          </div>
        )}

        {/* Continue Button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleContinue}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
              Setting up…
            </>
          ) : (
            `Continue as ${selectedRole === 'farmer' ? 'Farmer' : 'Customer'}`
          )}
        </Button>
      </div>
    </div>
  );
}
