import { Link } from 'react-router-dom';
import LazyImage from '../ui/LazyImage';
import VerifiedBadge from '../ui/VerifiedBadge';
import TransparencyIndicator from '../ui/TransparencyIndicator';

export default function FarmerCard({ farmer }) {
  return (
    <Link
      to={`/farmer/${farmer.id}`}
      className="block bg-surface-container-lowest rounded-xl overflow-hidden ambient-shadow ambient-shadow-hover border border-outline-variant/20 group transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative">
        <LazyImage
          src={farmer.imageUrl || farmer.heroImageUrl || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800'}
          alt={farmer.name}
          className="w-full aspect-[4/3]"
        />
        <div className="absolute top-3 left-3">
          <VerifiedBadge status={farmer.verificationStatus} />
        </div>
        <div className="absolute bottom-3 right-3 bg-surface/80 backdrop-blur-sm text-on-surface text-xs font-medium px-2 py-1 rounded-full">
          <span className="material-symbols-outlined align-middle mr-0.5" style={{ fontSize: 14 }}>location_on</span>
          {farmer.distance}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
            {farmer.name}
          </h3>
          <p className="text-sm text-on-surface-variant mt-0.5">{farmer.ownerName}</p>
        </div>

        {/* Product Tags */}
        <div className="flex flex-wrap gap-1.5">
          {(farmer.primaryProducts || []).map((product) => (
            <span
              key={product}
              className="px-2.5 py-1 bg-surface-container text-on-surface-variant text-xs font-medium rounded-md"
            >
              {product}
            </span>
          ))}
        </div>

        {/* Transparency */}
        <TransparencyIndicator percentage={farmer.directPercentage} />
      </div>
    </Link>
  );
}
