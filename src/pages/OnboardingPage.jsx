import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { completeOnboarding } from '../lib/firestore';
import { uploadToCloudinary } from '../lib/cloudinary';
import Button from '../components/ui/Button';

export default function OnboardingPage() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let imageUrl = '';
      if (file) {
        imageUrl = await uploadToCloudinary(file, 'customer');
      }

      await completeOnboarding(user.uid, 'customer', { deliveryAddress, phone, profileImage: imageUrl });
      
      await refreshProfile();
      navigate('/');
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
          <div className="w-14 h-14 bg-secondary-container/30 border border-secondary-container rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-secondary mt-0.5" style={{ fontVariationSettings: "'FILL' 1", fontSize: 22 }}>
              waving_hand
            </span>
          </div>
          <h1 className="font-display-xl text-display-xl text-on-surface text-3xl">
            Complete Your Profile
          </h1>
          <p className="text-on-surface-variant">
            Add your details for a seamless shopping experience
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
          <div className="bg-secondary-container/30 border border-secondary-container rounded-xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary mt-0.5" style={{ fontVariationSettings: "'FILL' 1", fontSize: 22 }}>
              shopping_bag
            </span>
            <div>
              <p className="text-sm font-semibold text-on-surface">Welcome, Foodie!</p>
              <p className="text-sm text-on-surface-variant mt-0.5">
                Add your delivery details so farmers know where to ship your goodies.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Delivery Address</label>
            <textarea value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="td-input min-h-[100px] resize-none rounded-t" placeholder="e.g. 123 Oak Street, Apt 4B, Greenfield, CA 93927" rows={3} required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Phone Number (optional)</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="td-input" placeholder="+1 (555) 123-4567" />
            <p className="text-xs text-on-surface-variant mt-1">We'll only share this with farmers for delivery coordination.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Profile Photo</label>
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

        <button onClick={() => navigate('/')} className="w-full text-center text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer py-2">
          Skip for now →
        </button>
      </div>
    </div>
  );
}
