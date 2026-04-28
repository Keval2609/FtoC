import LazyImage from '../ui/LazyImage';
import VerifiedBadge from '../ui/VerifiedBadge';
import TransparencyIndicator from '../ui/TransparencyIndicator';

export default function HeroSection({ farmer }) {
  return (
    <section className="relative">
      {/* Hero Image */}
      <LazyImage
        src={farmer.heroImageUrl || farmer.imageUrl || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200'}
        alt={`${farmer.name} landscape`}
        className="w-full h-64 sm:h-80 md:h-96"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
        <div className="max-w-container mx-auto">
          <div className="flex items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <LazyImage
              src={farmer.imageUrl || farmer.heroImageUrl || 'https://images.unsplash.com/photo-1595856306509-0c6d7a421b8b?auto=format&fit=crop&q=80&w=200'}
              alt={farmer.ownerName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-surface flex-shrink-0"
            />

            {/* Info */}
            <div className="space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display-xl text-display-xl text-on-surface truncate">
                  {farmer.name}
                </h1>
                <VerifiedBadge status={farmer.verificationStatus} />
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>location_on</span>
                  {farmer.location}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>calendar_today</span>
                  Est. {farmer.established}
                </span>
              </div>

              <div className="max-w-md">
                <TransparencyIndicator percentage={farmer.directPercentage} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
