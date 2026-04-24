import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'explore', label: 'Discover' },
    { path: '/checkout', icon: 'shopping_cart', label: 'Cart' },
    // Show Messages & Dashboard links only when signed in
    ...(user ? [
      { path: '/messages', icon: 'chat', label: 'Messages' },
      { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    ] : []),
  ];


  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-outline-variant/30">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="material-symbols-outlined text-primary text-2xl transition-transform duration-300 group-hover:rotate-12">
              spa
            </span>
            <span className="font-display-xl text-xl font-semibold text-on-surface tracking-tight">
              TerraDirect
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(item.path)
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  {item.icon}
                </span>
                {item.label}
                {item.icon === 'shopping_cart' && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-tertiary text-on-tertiary text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            ))}

            <div className="w-px h-6 bg-outline-variant/50 mx-2" />
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <span className="text-sm text-on-surface-variant">{user.displayName || user.email}</span>
                <button
                  onClick={logout}
                  className="text-sm text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* ─── MAIN ─── */}
      <main className="flex-1">{children}</main>

      {/* ─── MOBILE NAV ─── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-lg border-t border-outline-variant/30 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${isActive(item.path) ? 'text-primary' : 'text-on-surface-variant'
                }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.icon === 'shopping_cart' && cartCount > 0 && (
                <span className="absolute -top-0.5 right-1 w-4 h-4 bg-tertiary text-on-tertiary text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          ))}

          <ThemeToggle />

          {user ? (
            <button
              onClick={logout}
              className="flex flex-col items-center gap-0.5 px-4 py-1 text-on-surface-variant cursor-pointer"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>logout</span>
              <span className="text-[10px] font-medium">Sign Out</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex flex-col items-center gap-0.5 px-4 py-1 text-on-surface-variant"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>person</span>
              <span className="text-[10px] font-medium">Sign In</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-16" />
    </div>
  );
}
