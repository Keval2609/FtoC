export default function VerificationGallery({ certifications }) {
  if (!certifications || certifications.length === 0) {
    return (
      <div className="bg-tertiary-fixed/30 rounded-xl p-6 text-center">
        <span className="material-symbols-outlined text-3xl text-on-tertiary-fixed-variant mb-2">hourglass_top</span>
        <p className="text-sm text-on-tertiary-fixed-variant">
          Verification is currently under review. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="font-headline-lg text-headline-lg text-on-surface">Verification & Certifications</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certifications.map((cert) => (
          <div
            key={cert.certId}
            className="relative p-5 bg-secondary-fixed/30 rounded-xl border border-secondary-fixed-dim/50 space-y-3"
          >
            {/* Stamp effect */}
            <div className="absolute top-3 right-3 opacity-10">
              <span className="material-symbols-outlined text-5xl text-secondary">verified</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-secondary-container">
                  {cert.icon}
                </span>
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="font-semibold text-on-surface text-sm">{cert.name}</h3>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span>{cert.issuedDate}</span>
                  <span className="text-outline">•</span>
                  <span className="font-mono">{cert.certId}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              {cert.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
