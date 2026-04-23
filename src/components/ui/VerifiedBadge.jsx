export default function VerifiedBadge({ status = 'verified', className = '' }) {
  if (status === 'verified') {
    return (
      <span className={`verified-badge ${className}`}>
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span>
        🌿 Verified Organic
      </span>
    );
  }

  return (
    <div className={`badge-placeholder ${className}`}>
      <span className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-medium tracking-wide">
        🌿 Verified Organic — <em className="opacity-70 ml-1">Upload Certification to Activate</em>
      </span>
    </div>
  );
}
