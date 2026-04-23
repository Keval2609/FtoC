export default function VerifiedBadge({ status = 'verified', className = '' }) {
  if (status === 'verified') {
    return (
      <span className={`verified-badge ${className}`}>
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span>
        Verified
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide ${className}`}>
      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>pending</span>
      Pending
    </span>
  );
}
