export default function KpiCard({ label, value, icon, trend, trendLabel, accent = false }) {
  return (
    <div
      className={`rounded-2xl p-6 shadow-sm border border-outline-variant/20 flex flex-col justify-between min-h-[140px] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        accent ? 'bg-primary-container' : 'bg-surface'
      }`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          {label}
        </p>
        <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
          <span
            className="material-symbols-outlined text-on-secondary-container"
            style={{ fontSize: 18 }}
          >
            {icon}
          </span>
        </div>
      </div>

      {/* Value & trend */}
      <div>
        <h3 className="font-headline-lg text-headline-lg text-primary leading-none">{value}</h3>
        {trendLabel && (
          <p className="font-body-md text-body-md text-secondary mt-2 flex items-center gap-1">
            <span
              className="material-symbols-outlined text-secondary"
              style={{ fontSize: 16 }}
            >
              {trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : 'check_circle'}
            </span>
            {trendLabel}
          </p>
        )}
      </div>
    </div>
  );
}
