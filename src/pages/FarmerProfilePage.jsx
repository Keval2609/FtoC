import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/profile/HeroSection';
import MethodsSection from '../components/profile/MethodsSection';
import ProductGrid from '../components/profile/ProductGrid';
import VerificationGallery from '../components/profile/VerificationGallery';
import { getFarmerById, getProductsByFarmer } from '../lib/firestore';

export default function FarmerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isFarmer: isCurrentUserFarmer } = useAuth();
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [farmerData, productData] = await Promise.all([
        getFarmerById(id),
        getProductsByFarmer(id),
      ]);
      setFarmer(farmerData);
      setProducts(productData);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="w-full h-80 bg-surface-container" />
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="h-8 w-64 bg-surface-container rounded" />
          <div className="h-4 w-96 bg-surface-container rounded" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-surface-container rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant">person_off</span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Farmer Not Found</h2>
        <p className="text-on-surface-variant">This farm profile doesn't exist or has been removed.</p>
        <Link to="/" className="inline-block px-6 py-3 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity">
          Back to Discovery
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Back navigation */}
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
          All Farms
        </Link>
      </div>

      <HeroSection farmer={farmer} />

      {/* Message Farmer Button */}
      {user && !isCurrentUserFarmer && (
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(`/chat/${id}`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-container text-on-primary-container font-button text-sm rounded-xl hover:opacity-90 transition-opacity cursor-pointer ambient-shadow"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
            >
              chat
            </span>
            Message Farmer
          </button>
        </div>
      )}

      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <MethodsSection farmer={farmer} />
        <ProductGrid products={products} farmer={farmer} />
        <VerificationGallery certifications={farmer.certifications} />
      </div>
    </div>
  );
}
