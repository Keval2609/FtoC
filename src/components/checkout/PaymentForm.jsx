export default function PaymentForm({ data, onChange }) {
  const handleChange = (field) => (e) => {
    onChange({ ...data, [field]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">credit_card</span>
        Payment
      </h3>

      {/* Mock payment notice */}
      <div className="flex items-start gap-2 p-3 bg-tertiary-fixed/30 rounded-lg text-sm text-on-tertiary-fixed-variant">
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>info</span>
        <span>This is a demo checkout. No real payment will be processed.</span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Card Number</label>
          <input
            type="text"
            value={data.cardNumber || ''}
            onChange={handleChange('cardNumber')}
            className="td-input font-mono"
            placeholder="4242 4242 4242 4242"
            maxLength={19}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">Expiry</label>
            <input
              type="text"
              value={data.expiry || ''}
              onChange={handleChange('expiry')}
              className="td-input font-mono"
              placeholder="MM/YY"
              maxLength={5}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 tracking-wide uppercase">CVV</label>
            <input
              type="text"
              value={data.cvv || ''}
              onChange={handleChange('cvv')}
              className="td-input font-mono"
              placeholder="123"
              maxLength={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
