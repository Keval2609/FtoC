export default function MethodsSection({ farmer }) {
  if (!farmer || !farmer.methods || farmer.methods.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      {/* Story */}
      <div className="space-y-3">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Our Story</h2>
        <p className="text-body-lg text-on-surface-variant leading-relaxed max-w-3xl">
          {farmer.story}
        </p>
      </div>

      {/* Methods */}
      <div className="space-y-4">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Our Practices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {farmer.methods.map((method) => (
            <div
              key={method.title}
              className="p-5 bg-surface-container-low rounded-xl border border-outline-variant/20 ambient-shadow space-y-3 group hover:bg-surface-container transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="material-symbols-outlined text-on-secondary-container">
                  {method.icon}
                </span>
              </div>
              <h3 className="font-headline-md text-base font-semibold text-on-surface">
                {method.title}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {method.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
