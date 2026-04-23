import ProductCard from '../ui/ProductCard';

export default function ProductGrid({ products, farmer }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-on-surface-variant">
        <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
        <p>No products available yet.</p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Fresh from the Farm</h2>
        <span className="text-sm text-on-surface-variant">{products.length} items</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} farmer={farmer} />
        ))}
      </div>
    </section>
  );
}
