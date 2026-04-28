import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, getFarmerById, updateFarmerProfile } from '../lib/firestore';
import { uploadToCloudinary } from '../lib/cloudinary';
import Button from '../components/ui/Button';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';

export default function EditFarmerProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [farmName, setFarmName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('bank');
  const [existingPhoto, setExistingPhoto] = useState('');
  const [file, setFile] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const [userProfile, farmerData] = await Promise.all([
          getUserProfile(user.uid),
          getFarmerById(user.uid)
        ]);

        if (userProfile) {
          setFarmName(userProfile.farmName || farmerData?.farmName || '');
          setBio(userProfile.bio || farmerData?.story || '');
          setLocation(userProfile.location || farmerData?.location || '');
          setPayoutMethod(userProfile.payoutMethod || 'bank');
          setExistingPhoto(userProfile.farmPhoto || farmerData?.heroImageUrl || '');
        }
      } catch (err) {
        console.error('Failed to load profile', err);
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      let imageUrl = existingPhoto;

      if (removePhoto && !file) {
        imageUrl = '';
      } else if (file) {
        imageUrl = await uploadToCloudinary(file, 'farmer');
      }

      await updateFarmerProfile(user.uid, {
        farmName,
        bio,
        location,
        payoutMethod,
        farmPhoto: imageUrl
      });

      setExistingPhoto(imageUrl);
      setFile(null);
      setRemovePhoto(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-container">
      <DashboardSidebar farmName={farmName || 'My Farm'} />

      <main className="flex-1 ml-0 md:ml-64 p-6 md:p-8 xl:p-12 max-w-screen-md mx-auto">
        <header className="mb-8">
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
            Settings
          </p>
          <h1 className="font-display-xl text-display-xl text-primary leading-none">Edit Profile</h1>
        </header>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-surface rounded-2xl p-6 md:p-8 border border-outline-variant/40 shadow-sm">
            {error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container text-sm rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>error</span>
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-secondary-container/50 text-secondary text-sm rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 tracking-wide uppercase">Farm Name</label>
                <input type="text" value={farmName} onChange={(e) => setFarmName(e.target.value)} className="td-input w-full" placeholder="e.g. Green Valley Farm" required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 tracking-wide uppercase">Your Farm Story</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="td-input w-full min-h-[120px] resize-none rounded-xl" placeholder="Tell customers what makes your farm special…" rows={4} />
                <p className="text-xs text-on-surface-variant mt-1.5 text-right">{bio.length}/500</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 tracking-wide uppercase">Farm Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="td-input w-full" placeholder="e.g. Salinas Valley, CA" required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-3 tracking-wide uppercase">Payout Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'bank', label: 'Bank Transfer', icon: 'account_balance' },
                    { id: 'upi', label: 'UPI / Digital', icon: 'phone_android' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPayoutMethod(method.id)}
                      className={`flex items-center gap-2 p-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${payoutMethod === method.id ? 'border-primary bg-primary-container/20 text-primary' : 'border-outline-variant/50 bg-surface-container-low hover:border-outline text-on-surface-variant'}`}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>
                        {method.icon}
                      </span>
                      <span className="text-sm font-medium">
                        {method.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/40">
                <label className="block text-xs font-semibold text-on-surface-variant mb-3 tracking-wide uppercase">Farm Cover Photo</label>
                
                {existingPhoto && !removePhoto && !file ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 group border border-outline-variant">
                    <img src={existingPhoto} alt="Farm Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={() => setRemovePhoto(true)}
                        className="bg-error text-on-error px-4 py-2 rounded-lg font-button text-sm hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                        Remove Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    {removePhoto && existingPhoto && !file && (
                      <p className="text-sm text-error mb-3 flex items-center gap-1">
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>info</span>
                        Current photo will be removed upon saving.
                      </p>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        setFile(e.target.files[0]);
                        setRemovePhoto(false);
                      }} 
                      className="td-input w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary-container/80 cursor-pointer" 
                    />
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-outline-variant/40 flex gap-3">
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1" disabled={saving}>
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
