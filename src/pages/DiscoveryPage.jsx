import { useState, useEffect } from 'react';
import SearchBar from '../components/discovery/SearchBar';
import FilterChips from '../components/discovery/FilterChips';
import FarmerCard from '../components/discovery/FarmerCard';
import { getFarmers } from '../lib/firestore';

export default function DiscoveryPage() {
  const [farmers, setFarmers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getFarmers();
      setFarmers(data);
      setFiltered(data);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    let result = farmers;

    // Apply filter
    if (activeFilter === 'verified') {
      result = result.filter((f) => f.verificationStatus === 'verified');
    } else if (activeFilter === 'nearby') {
      result = [...result].sort((a, b) => parseInt(a.distance) - parseInt(b.distance));
    }

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.ownerName.toLowerCase().includes(q) ||
          f.primaryProducts.some((p) => p.toLowerCase().includes(q)) ||
          f.location.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [activeFilter, searchQuery, farmers]);

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-8 sm:py-12">
        <h1 className="font-display-xl text-display-xl text-on-surface">
          Know Your{' '}
          <span className="text-primary">Farmer</span>
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Connect directly with regenerative farms. Verify their practices.
          Source food you can trust, with full transparency from soil to table.
        </p>
      </section>

      {/* Search & Filters */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <SearchBar onSearch={setSearchQuery} />
        <FilterChips active={activeFilter} onChange={setActiveFilter} />
      </section>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container rounded-xl h-80 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant">search_off</span>
          <p className="text-on-surface-variant text-lg">No farms match your search.</p>
          <button
            onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
            className="text-primary font-medium hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((farmer) => (
            <FarmerCard key={farmer.id} farmer={farmer} />
          ))}
        </div>
      )}

      {/* Stats Bar */}
      <section className="grid grid-cols-3 gap-4 py-8 border-t border-outline-variant/30">
        {[
          { value: '127+', label: 'Verified Farms', icon: 'verified' },
          { value: '94%', label: 'Direct to Farmer', icon: 'handshake' },
          { value: '48hr', label: 'Avg. Delivery', icon: 'local_shipping' },
        ].map((stat) => (
          <div key={stat.label} className="text-center space-y-1">
            <span className="material-symbols-outlined text-primary text-2xl">{stat.icon}</span>
            <p className="text-2xl font-semibold text-on-surface">{stat.value}</p>
            <p className="text-xs text-on-surface-variant">{stat.label}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
