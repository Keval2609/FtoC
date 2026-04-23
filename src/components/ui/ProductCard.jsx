import LazyImage from './LazyImage';
import Button from './Button';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, farmer }) {
  const { addItem, items } = useCart();
  const inCart = items.find((i) => i.id === product.id);

  return (
    <div className="bg-surface-container-low rounded-lg overflow-hidden ambient-shadow ambient-shadow-hover border border-outline-variant/30 group">
      <LazyImage
        src={product.imageUrl}
        alt={product.name}
        className="w-full aspect-square"
      />
      <div className="p-4 space-y-2">
        <h4 className="font-headline-md text-base font-medium text-on-surface">{product.name}</h4>
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-semibold text-primary">${product.price.toFixed(2)}</span>
          <span className="text-xs text-on-surface-variant">{product.unit}</span>
        </div>
        <Button
          variant={inCart ? 'secondary' : 'primary'}
          size="sm"
          className="w-full mt-2"
          onClick={() => addItem(product, farmer)}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            {inCart ? 'check' : 'add_shopping_cart'}
          </span>
          {inCart ? `In Cart (${inCart.qty})` : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}
