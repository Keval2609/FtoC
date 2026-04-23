import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { completeOnboarding } from '../lib/firestore';
import Button from '../components/ui/Button';

// ─── Farmer Onboarding ──────────────────────────────

function FarmerOnboarding({ onComplete, loading }) {
  const [farmName, setFarmName] = useState('');
  const [bio, setBio] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('bank');

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({ farmName, bio, payoutMethod });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Welcome message */}
      <div className="bg-primary-container/30 border border-primary-container rounded-xl p-4 flex items-start gap-3">
        <span
          className="material-symbols-outlined text-primary mt-0.5"
          style={{ fontVariationSettings: "'FILL' 1", fontSize: 22 }}
        >
          agriculture
        </span>
        <div>
          <p className="text-sm font-semibold text-on-surface">Welcome, Farmer!</p>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Tell us about your farm. This info will appear on your public profile.
          </p>
        </div>
      </div>

      {/* Farm Name */}
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">
          Farm Name
        </label>
        <input
          type="text"
          value={farmName}
          onChange={(e) => setFarmName(e.target.value)}
          className="td-input"
          placeholder="e.g. Green Valley Farm"
          required
        />
      </div>

      {/* Farm Story */}
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">
          Your Farm Story
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="td-input min-h-[120px] resize-none rounded-t"
          placeholder="Tell customers what makes your farm special…"
          rows={4}
        />
        <p className="text-xs text-on-surface-variant mt-1">
          {bio.length}/500 characters
        </p>
      </div>

      {/* Payout Method */}
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">
          Payout Method
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'bank', label: 'Bank Transfer', icon: 'account_balance' },
            { id: 'upi', label: 'UPI / Digital', icon: 'phone_android' },
          ].map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setPayoutMethod(method.id)}
              className={`
                flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left
                ${payoutMethod === method.id
                  ? 'border-primary bg-primary-container/20'
                  : 'border-outline-variant/50 bg-surface-container-low hover:border-outline'
                }
              `}
            >
              <span
                className={`material-symbols-outlined ${payoutMethod === method.id ? 'text-primary' : 'text-on-surface-variant'}`}
                style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}
              >
                {method.icon}
              </span>
              <span className={`text-sm font-medium ${payoutMethod === method.id ? 'text-primary' : 'text-on-surface'}`}>
                {method.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
            Setting up your farm…
          </>
        ) : (
          <>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>storefront</span>
            Launch My Farm Profile
          </>
        )}
      </Button>
    </form>
  );
}

// ─── Customer Onboarding ─────────────────────────────

function CustomerOnboarding({ onComplete, loading }) {
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({ deliveryAddress, phone });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Welcome message */}
      <div className="bg-secondary-container/30 border border-secondary-container rounded-xl p-4 flex items-start gap-3">
        <span
          className="material-symbols-outlined text-secondary mt-0.5"
          style={{ fontVariationSettings: "'FILL' 1", fontSize: 22 }}
        >
          shopping_bag
        </span>
        <div>
          <p className="text-sm font-semibold text-on-surface">Welcome, Foodie!</p>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Add your delivery details so farmers know where to ship your goodies.
          </p>
        </div>
      </div>

      {/* Delivery Address */}
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">
          Delivery Address
        </label>
        <textarea
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          className="td-input min-h-[100px] resize-none rounded-t"
          placeholder="e.g. 123 Oak Street, Apt 4B, Greenfield, CA 93927"
          rows={3}
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">
          Phone Number (optional)
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="td-input"
          placeholder="+1 (555) 123-4567"
        />
        <p className="text-xs text-on-surface-variant mt-1">
          We'll only share this with farmers for delivery coordination.
        </p>
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
            Saving details…
          </>
        ) : (
          <>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>explore</span>
            Start Exploring Farms
          </>
        )}
      </Button>
    </form>
  );
}

// ─── Onboarding Page ─────────────────────────────────

export default function OnboardingPage() {
  const { user, userProfile, isFarmer, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleComplete = async (profileData) => {
    setError('');
    setLoading(true);
    try {
      const role = userProfile?.role || 'customer';
      await completeOnboarding(user.uid, role, profileData);
      await refreshProfile();

      // Conditional routing based on role
      if (role === 'farmer') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
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
            <span className="material-symbols-outlined text-on-tertiary-container text-2xl">
              {isFarmer ? 'agriculture' : 'waving_hand'}
            </span>
          </div>
          <h1 className="font-display-xl text-display-xl text-on-surface text-3xl">
            Complete Your Profile
          </h1>
          <p className="text-on-surface-variant">
            {isFarmer
              ? 'Set up your farm details to start selling'
              : 'Add your details for a seamless shopping experience'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-1 rounded-full bg-primary" />
          <div className="w-8 h-1 rounded-full bg-primary" />
          <div className="w-8 h-1 rounded-full bg-primary opacity-40" />
        </div>

        {error && (
          <div className="p-3 bg-error-container text-on-error-container text-sm rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
            {error}
          </div>
        )}

        {/* Role-specific form */}
        {isFarmer ? (
          <FarmerOnboarding onComplete={handleComplete} loading={loading} />
        ) : (
          <CustomerOnboarding onComplete={handleComplete} loading={loading} />
        )}

        {/* Skip option */}
        <button
          onClick={() => navigate(isFarmer ? '/dashboard' : '/')}
          className="w-full text-center text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer py-2"
        >
          Skip for now →
        </button>
      </div>
    </div>
  );
}
