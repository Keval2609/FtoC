export default function DeliveryForm({ data, onChange }) {
  const handleChange = (field) => (e) => {
    onChange({ ...data, [field]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">local_shipping</span>
        Delivery Details
      </h3>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Street Address</label>
          <input
            type="text"
            value={data.address || ''}
            onChange={handleChange('address')}
            className="td-input"
            placeholder="123 Farm Road"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">City</label>
            <input
              type="text"
              value={data.city || ''}
              onChange={handleChange('city')}
              className="td-input"
              placeholder="Portland"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">State</label>
            <input
              type="text"
              value={data.state || ''}
              onChange={handleChange('state')}
              className="td-input"
              placeholder="OR"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">ZIP Code</label>
            <input
              type="text"
              value={data.zip || ''}
              onChange={handleChange('zip')}
              className="td-input"
              placeholder="97201"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Delivery Date</label>
            <input
              type="date"
              value={data.deliveryDate || ''}
              onChange={handleChange('deliveryDate')}
              className="td-input"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Delivery Notes</label>
          <textarea
            value={data.notes || ''}
            onChange={handleChange('notes')}
            className="td-input min-h-[80px] resize-y"
            placeholder="Gate code, preferred time, etc."
          />
        </div>
      </div>
    </div>
  );
}
