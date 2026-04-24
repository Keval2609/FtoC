import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContactForm from '../components/checkout/ContactForm';
import DeliveryForm from '../components/checkout/DeliveryForm';
import PaymentForm from '../components/checkout/PaymentForm';
import OrderSummary from '../components/checkout/OrderSummary';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../lib/firestore';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [contact, setContact] = useState({});
  const [delivery, setDelivery] = useState({});
  const [payment, setPayment] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createOrder(
        {
          userId: user?.uid,
          contact,
          delivery,
        },
        items
      );
      clearCart();
      setSuccess(true);
    } catch (err) {
      console.error('Order failed:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-4xl text-on-secondary-container">check_circle</span>
        </div>
        <h1 className="font-display-xl text-display-xl text-on-surface">Order Confirmed!</h1>
        <p className="text-body-lg text-on-surface-variant max-w-lg mx-auto">
          Your order has been placed. The farmer will prepare your items with care.
          You'll receive a confirmation email shortly.
        </p>
        <Button variant="primary" size="lg" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display-xl text-display-xl text-on-surface mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Forms */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-surface-container-lowest rounded-xl p-6 ambient-shadow space-y-8">
            <ContactForm data={contact} onChange={setContact} />
            <div className="border-t border-outline-variant/30" />
            <DeliveryForm data={delivery} onChange={setDelivery} />
            <div className="border-t border-outline-variant/30" />
            <PaymentForm data={payment} onChange={setPayment} />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={submitting || items.length === 0}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>lock</span>
                Place Order — ${(cartTotal + (cartTotal > 35 ? 0 : 5.99)).toFixed(2)}
              </>
            )}
          </Button>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
          <OrderSummary />
        </div>
      </form>
    </div>
  );
}
