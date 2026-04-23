import { createContext, useContext, useEffect, useReducer } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'td-cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function cartReducer(state, action) {
  let next;
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find((i) => i.id === action.payload.id);
      if (existing) {
        next = state.map((i) =>
          i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        next = [...state, { ...action.payload, qty: 1 }];
      }
      break;
    }
    case 'REMOVE_ITEM':
      next = state.filter((i) => i.id !== action.payload);
      break;
    case 'UPDATE_QTY':
      next = state.map((i) =>
        i.id === action.payload.id ? { ...i, qty: Math.max(0, action.payload.qty) } : i
      ).filter((i) => i.qty > 0);
      break;
    case 'CLEAR':
      next = [];
      break;
    default:
      return state;
  }
  saveCart(next);
  return next;
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);

  const addItem = (product, farmer) =>
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        imageUrl: product.imageUrl,
        farmerId: farmer.id,
        farmerName: farmer.name,
      },
    });

  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
