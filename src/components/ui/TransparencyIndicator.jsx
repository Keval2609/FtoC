export default function TransparencyIndicator({ percentage, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">
        {percentage}% Direct
      </span>
    </div>
  );
}
