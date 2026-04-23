const FILTERS = [
  { key: 'all', label: 'All Farms', icon: 'grid_view' },
  { key: 'verified', label: 'Verified', icon: 'verified' },
  { key: 'nearby', label: 'Nearby', icon: 'near_me' },
  { key: 'organic', label: 'Organic', icon: 'eco' },
];

export default function FilterChips({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
            active === f.key
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            {f.icon}
          </span>
          {f.label}
        </button>
      ))}
    </div>
  );
}
