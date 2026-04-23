export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-button rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary text-on-primary hover:opacity-90 active:scale-[0.98]',
    secondary: 'bg-secondary-container text-on-secondary-container hover:opacity-90 active:scale-[0.98]',
    outline: 'border border-outline text-on-surface hover:bg-surface-container active:scale-[0.98]',
    ghost: 'text-on-surface-variant hover:bg-surface-container-high',
    tertiary: 'bg-tertiary-container text-on-tertiary-container hover:opacity-90 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1',
    md: 'px-5 py-2.5 text-button gap-2',
    lg: 'px-8 py-3.5 text-button gap-2',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
