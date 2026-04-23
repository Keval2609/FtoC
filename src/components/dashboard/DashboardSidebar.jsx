import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/dashboard', icon: 'dashboard', label: 'Overview' },
  { path: '/dashboard/inventory', icon: 'inventory_2', label: 'Inventory' },
  { path: '/dashboard/orders', icon: 'shopping_basket', label: 'Orders' },
  { path: '/farmer/sunrise-valley', icon: 'person', label: 'My Profile' },
];

export default function DashboardSidebar({ farmName = 'Green Valley Farm' }) {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden md:flex flex-col bg-surface text-on-surface h-screen w-64 border-r border-outline-variant/40 fixed left-0 top-0 z-40 py-6">
      {/* Farm Identity */}
      <div className="px-6 mb-8">
        <Link to="/" className="block">
          <h1 className="text-xl font-semibold font-display-xl text-on-surface mb-1 leading-tight">
            {farmName}
          </h1>
        </Link>
        <div className="flex items-center gap-1.5">
          <span
            className="material-symbols-outlined text-secondary text-xs"
            style={{ fontVariationSettings: "'FILL' 1", fontSize: 14 }}
          >
            verified
          </span>
          <p className="text-on-surface-variant text-xs font-label-sm">Verified Producer</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-l-xl transition-all duration-200 group ${
                active
                  ? 'bg-secondary-container text-on-secondary-container font-semibold border-r-4 border-primary'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 22 }}
              >
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* CTA & Footer */}
      <div className="px-3 mt-auto space-y-4">
        <Link
          to="/dashboard/inventory"
          className="w-full py-3 px-4 bg-primary text-on-primary font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm"
        >
          <span
            className="material-symbols-outlined text-sm"
            style={{ fontVariationSettings: "'FILL' 1", fontSize: 18 }}
          >
            add
          </span>
          New Listing
        </Link>

        <div className="pt-4 border-t border-outline-variant/40 space-y-0.5">
          <Link
            to="#"
            className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors rounded-xl text-sm"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>settings</span>
            <span>Settings</span>
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors rounded-xl text-sm"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>contact_support</span>
            <span>Support</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors rounded-xl text-sm cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
