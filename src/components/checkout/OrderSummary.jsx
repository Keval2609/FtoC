import { useCart } from '../../context/CartContext';
import LazyImage from '../ui/LazyImage';

export default function OrderSummary() {
  const { items, updateQty, removeItem, cartTotal } = useCart();
  const deliveryFee = cartTotal > 35 ? 0 : 5.99;
  const total = cartTotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="bg-surface-container-low rounded-xl p-6 text-center space-y-3">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant">shopping_cart</span>
        <p className="text-on-surface-variant">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low rounded-xl p-5 space-y-4 sticky top-24">
      <h3 className="font-headline-md text-headline-md text-on-surface">Order Summary</h3>

      {/* Items */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-start">
            <LazyImage
              src={item.imageUrl}
              alt={item.name}
              className="w-14 h-14 rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-on-surface truncate">{item.name}</p>
              <p className="text-xs text-on-surface-variant">{item.farmerName}</p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  className="w-6 h-6 rounded bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  −
                </button>
                <span className="text-sm font-medium text-on-surface w-6 text-center">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  className="w-6 h-6 rounded bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-auto text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                </button>
              </div>
            </div>
            <span className="text-sm font-semibold text-on-surface whitespace-nowrap">
              ${(item.price * item.qty).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-outline-variant/50" />

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-on-surface-variant">
          <span>Subtotal</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-on-surface-variant">
          <span>Delivery</span>
          <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
        </div>
        {deliveryFee === 0 && (
          <p className="text-xs text-secondary">🎉 Free delivery on orders over $35!</p>
        )}
        <div className="border-t border-outline-variant/50 pt-2 flex justify-between text-on-surface font-semibold text-base">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
