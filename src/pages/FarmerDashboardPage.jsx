import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import KpiCard from '../components/dashboard/KpiCard';
import InventoryTable from '../components/dashboard/InventoryTable';
import { useAuth } from '../context/AuthContext';
import { getMyProducts, deleteProduct } from '../lib/firestore';

export default function FarmerDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastSynced, setLastSynced] = useState('Just now');

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const products = await getMyProducts(user.uid);
      setInventory(products.map(p => ({
        id: p.id,
        name: p.name,
        subtitle: p.description ? p.description.substring(0, 50) + '...' : '',
        stock: p.stock || 0,
        unit: p.unit,
        price: p.price,
        priceUnit: p.unit,
        status: p.stock > 10 ? 'in-stock' : (p.stock > 0 ? 'low-stock' : 'out-of-stock'), // Simple status logic
        imageUrl: p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls[0] : ''
      })));
      setLastSynced(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Derived stats ───
  const totalSales = 42850;
  const activeListings = inventory.filter((i) => i.status !== 'out-of-stock').length;
  const lowStockCount = inventory.filter((i) => i.status === 'low-stock').length;
  const recentOrders = 12;
  const pendingFulfillment = 3;

  // ─── Filtered inventory ───
  const filtered = inventory.filter((item) => {
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ─── Handlers ───
  const handleAdd = () => {
    navigate('/dashboard/add-product');
  };

  const handleEdit = (item) => {
    navigate(`/dashboard/edit-product/${item.id}`);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setInventory((prev) => prev.filter((i) => i.id !== id));
      } catch (err) {
        console.error('Failed to delete product', err);
      }
    }
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  return (
    <div className="flex min-h-screen bg-surface-container">
      {/* ─── Sidebar ─── */}
      <DashboardSidebar farmName="Green Valley Farm" />

      {/* ─── Main Content ─── */}
      <main className="flex-1 ml-0 md:ml-64 p-6 md:p-8 xl:p-12 max-w-screen-xl">
        {/* Page Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
              Farmer Dashboard
            </p>
            <h1 className="font-display-xl text-display-xl text-primary leading-none">Overview</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Last synced: {lastSynced}
            </span>
            <button
              onClick={handleRefresh}
              className="bg-surface border border-outline-variant text-primary font-button text-button px-4 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors flex items-center gap-2 text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
              Refresh Data
            </button>
          </div>
        </header>

        {/* ─── KPI Cards ─── */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          <KpiCard
            label="Total Sales (YTD)"
            value={`$${totalSales.toLocaleString()}`}
            icon="payments"
            trend="up"
            trendLabel="+12.5% vs last year"
          />
          <KpiCard
            label="Active Listings"
            value={activeListings}
            icon="grass"
            trend="neutral"
            trendLabel={lowStockCount > 0 ? `${lowStockCount} running low` : 'All stock healthy'}
          />
          <KpiCard
            label="Recent Orders"
            value={recentOrders}
            icon="local_shipping"
            trend="neutral"
            trendLabel={`${pendingFulfillment} pending fulfillment`}
          />
        </section>

        {/* ─── Inventory Management ─── */}
        <section>
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <h2 className="font-headline-md text-headline-md text-primary">
              Inventory Management
            </h2>
            <div className="flex gap-3">
              {/* Filter dropdown */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-surface-container-low text-on-surface border border-outline-variant font-button text-button px-4 py-2 rounded-xl hover:bg-surface-variant transition-colors text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="all">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>

              {/* Add button */}
              <button
                onClick={handleAdd}
                className="bg-primary text-on-primary font-button text-button px-4 py-2 rounded-xl hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2 text-sm cursor-pointer"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: 18 }}
                >
                  add
                </span>
                Add New Listing
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4 relative">
            <span
              className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
              style={{ fontSize: 18 }}
            >
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full sm:max-w-sm bg-surface border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <InventoryTable
              items={filtered}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {/* Footer hint */}
          {filtered.length > 0 && (
            <p className="mt-4 text-xs text-on-surface-variant text-center">
              Showing {filtered.length} of {inventory.length} listings · Hover a row to reveal actions
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
