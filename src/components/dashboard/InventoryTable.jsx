const STATUS_CONFIG = {
  'in-stock': {
    label: 'In Stock',
    classes: 'bg-secondary-container text-on-secondary-container',
  },
  'low-stock': {
    label: 'Low Stock',
    classes: 'bg-error-container text-on-error-container',
  },
  'out-of-stock': {
    label: 'Out of Stock',
    classes: 'bg-surface-container-high text-on-surface-variant',
  },
};

export default function InventoryTable({ items, onEdit, onDelete }) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/20 p-12 text-center">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3 block">
          inventory_2
        </span>
        <p className="text-on-surface-variant">No inventory items yet. Add your first listing!</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-outline-variant/30 bg-surface-container-low/60">
        <div className="col-span-5 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          Product
        </div>
        <div className="col-span-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          Stock
        </div>
        <div className="col-span-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          Price
        </div>
        <div className="col-span-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          Status
        </div>
        <div className="col-span-1 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">
          Actions
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-outline-variant/30">
        {items.map((item) => {
          const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG['in-stock'];
          return (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-surface-container-lowest/60 transition-colors group"
            >
              {/* Product */}
              <div className="col-span-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container border border-outline-variant/20 flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="font-body-md text-body-md font-medium text-on-surface leading-snug">
                    {item.name}
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Stock */}
              <div className="col-span-2">
                <p
                  className={`font-body-md text-body-md ${
                    item.status === 'low-stock' ? 'text-error' : 'text-on-surface'
                  }`}
                >
                  {item.stock > 0 ? `${item.stock} ${item.unit}` : '—'}
                </p>
              </div>

              {/* Price */}
              <div className="col-span-2">
                <p className="font-body-md text-body-md text-on-surface">
                  ${item.price.toFixed(2)} / {item.priceUnit}
                </p>
              </div>

              {/* Status Badge */}
              <div className="col-span-2">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-label-sm ${statusCfg.classes}`}
                >
                  {statusCfg.label}
                </span>
              </div>

              {/* Actions — visible on hover */}
              <div className="col-span-1 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(item)}
                  title="Edit listing"
                  className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-secondary-container rounded-lg transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  title="Delete listing"
                  className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
