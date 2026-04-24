import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { completeOnboarding } from '../lib/firestore';
import { uploadToCloudinary } from '../lib/cloudinary';
import Button from '../components/ui/Button';

export default function FarmerSetupPage() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [farmName, setFarmName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('bank');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let imageUrl = '';
      if (file) {
        imageUrl = await uploadToCloudinary(file, 'farmer');
      }
      
      // Complete onboarding to keep farmer collection synced
      await completeOnboarding(user.uid, 'farmer', { farmName, bio, location, payoutMethod, farmPhoto: imageUrl });
      
      await refreshProfile();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-primary-container/30 border border-primary-container rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1", fontSize: 22 }}>
              agriculture
            </span>
          </div>
          <h1 className="font-display-xl text-display-xl text-on-surface text-3xl">
            Welcome, Farmer!
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Tell us about your farm. This info will appear on your public profile.
          </p>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Farm Name</label>
            <input type="text" value={farmName} onChange={(e) => setFarmName(e.target.value)} className="td-input" placeholder="e.g. Green Valley Farm" required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Your Farm Story</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="td-input min-h-[120px] resize-none rounded-t" placeholder="Tell customers what makes your farm special…" rows={4} />
            <p className="text-xs text-on-surface-variant mt-1">{bio.length}/500 characters</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Farm Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="td-input" placeholder="e.g. Salinas Valley, CA" required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Payout Method</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'bank', label: 'Bank Transfer', icon: 'account_balance' },
                { id: 'upi', label: 'UPI / Digital', icon: 'phone_android' },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPayoutMethod(method.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${payoutMethod === method.id ? 'border-primary bg-primary-container/20' : 'border-outline-variant/50 bg-surface-container-low hover:border-outline'}`}
                >
                  <span className={`material-symbols-outlined ${payoutMethod === method.id ? 'text-primary' : 'text-on-surface-variant'}`} style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>
                    {method.icon}
                  </span>
                  <span className={`text-sm font-medium ${payoutMethod === method.id ? 'text-primary' : 'text-on-surface'}`}>
                    {method.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Farm Photo</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])} 
              className="td-input" 
            />
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

        <button onClick={() => navigate('/dashboard')} className="w-full text-center text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer py-2">
          Skip for now →
        </button>
      </div>
    </div>
  );
}
