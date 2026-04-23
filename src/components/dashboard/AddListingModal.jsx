import { useState, useEffect } from 'react';

const EMPTY_FORM = {
  name: '',
  subtitle: '',
  stock: '',
  unit: 'lbs',
  price: '',
  priceUnit: 'lb',
  status: 'in-stock',
};

export default function AddListingModal({ open, onClose, onSave, editItem = null }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editItem) {
      setForm({
        name: editItem.name || '',
        subtitle: editItem.subtitle || '',
        stock: editItem.stock ?? '',
        unit: editItem.unit || 'lbs',
        price: editItem.price ?? '',
        priceUnit: editItem.priceUnit || 'lb',
        status: editItem.status || 'in-stock',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editItem, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate async save
    await new Promise((r) => setTimeout(r, 500));
    onSave({
      ...form,
      stock: Number(form.stock),
      price: parseFloat(form.price),
      id: editItem ? editItem.id : `inv-${Date.now()}`,
      imageUrl: editItem?.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjAdof4jTKLApWENz_MJb0FOurDK7vV6Lu3uLougdUoqRAb7NvhUVwxmC07FD4endRFmYWmYx8Hj74x1B7oB9Ll__m59K2bXhnX1tZf9lDS2hckwuKVQtopOSHhjHS7RPlWzENj_7XTE2_oULrHtDZF_NpvKS7qJoSr_mmLpqq-rNq8YVYrlC7ozueJ9gZJG3Dpqlk5g0TTkiX4MGIeHaSJpKjvOpOUdaOo9z3HreK9_HojAC_XtxBZfQtAQSDqSZT6hAqNxGVU2Vv',
    });
    setSaving(false);
    onClose();
  };

  const inputClass =
    'w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface text-sm placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-on-surface/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-lg pointer-events-auto animate-[slideUp_0.25s_ease-out]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-outline-variant/30">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              {editItem ? 'Edit Listing' : 'Add New Listing'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>close</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Product Name */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5 uppercase tracking-wider">
                Product Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Heirloom Tomatoes"
                className={inputClass}
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5 uppercase tracking-wider">
                Description
              </label>
              <input
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                placeholder="e.g. Vine-ripened, Organic"
                className={inputClass}
              />
            </div>

            {/* Stock & Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5 uppercase tracking-wider">
                  Stock Quantity *
                </label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  placeholder="0"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5 uppercase tracking-wider">
                  Unit
                </label>
                <input
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  placeholder="lbs / bunches / bags"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Price & Price Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5 uppercase tracking-wider">
                  Price ($) *
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5 uppercase tracking-wider">
                  Per
                </label>
                <input
                  name="priceUnit"
                  value={form.priceUnit}
                  onChange={handleChange}
                  placeholder="lb / bunch / bag"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5 uppercase tracking-wider">
                Status
              </label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-surface-container-low border border-outline-variant text-on-surface font-semibold rounded-xl hover:bg-surface-variant transition-colors text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 px-4 bg-primary text-on-primary font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 text-sm cursor-pointer flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm" style={{ fontSize: 16 }}>
                      progress_activity
                    </span>
                    Saving…
                  </>
                ) : (
                  editItem ? 'Save Changes' : 'Add Listing'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
