// src/pages/RoleSelectPage.jsx
// Shown after Google Sign-In for NEW users who haven't picked a role yet.
// Also reachable directly from the signup flow.

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
      // Route based on chosen role:
      // Farmers go to farm setup, customers to onboarding (delivery prefs)
      if (selectedRole === 'farmer') {
        navigate('/farmer-setup');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.message || 'Failed to set role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">

        {/* ── Header ── */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-tertiary-container rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-on-tertiary-container text-2xl">
              group
            </span>
          </div>
          <h1 className="font-display-xl text-display-xl text-on-surface text-3xl">
            How will you use TerraDirect?
          </h1>
          <p className="text-on-surface-variant">
            Welcome,{' '}
            <span className="font-semibold text-on-surface">
              {user?.displayName || 'friend'}
            </span>
            ! Choose how you'd like to get started.
          </p>
        </div>

        {/* ── Google Sign-In context banner ── */}
        {user?.providerData?.[0]?.providerId === 'google.com' && (
          <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl border border-outline-variant/40">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate">
                {user.displayName}
              </p>
              <p className="text-xs text-on-surface-variant truncate">
                {user.email}
              </p>
            </div>
            {/* Google logo pill */}
            <span className="ml-auto shrink-0 flex items-center gap-1 text-xs text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-full">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </span>
          </div>
        )}

        {/* ── Role Cards ── */}
        <div className="space-y-3">
          {ROLES.map((role) => {
            const selected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`
                  w-full flex items-center gap-4 p-5 rounded-xl border-2
                  transition-all duration-200 cursor-pointer text-left group
                  ${selected
                    ? 'border-primary bg-primary-container/15 shadow-sm'
                    : 'border-outline-variant/50 bg-surface-container-low hover:border-outline hover:bg-surface-container'
                  }
                `}
              >
                {/* Icon */}
                <div
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors
                    ${selected
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-high text-on-surface-variant group-hover:bg-surface-container-highest'
                    }
                  `}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1", fontSize: 24 }}
                  >
                    {role.icon}
                  </span>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <p
                    className={`font-semibold text-sm ${
                      selected ? 'text-primary' : 'text-on-surface'
                    }`}
                  >
                    {role.label}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {role.desc}
                  </p>
                </div>

                {/* Radio indicator */}
                <div
                  className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                    transition-all
                    ${selected ? 'border-primary bg-primary' : 'border-outline-variant'}
                  `}
                >
                  {selected && (
                    <span
                      className="material-symbols-outlined text-on-primary"
                      style={{ fontSize: 14 }}
                    >
                      check
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="p-3 bg-error-container text-on-error-container text-sm rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              error
            </span>
            {error}
          </div>
        )}

        {/* ── Continue Button ── */}
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

        {/* ── Fine print ── */}
        <p className="text-center text-xs text-on-surface-variant">
          You can't change your role after this step. Choose carefully!
        </p>
      </div>
    </div>
  );
}
