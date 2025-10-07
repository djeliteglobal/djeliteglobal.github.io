import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../contexts/ClerkAuthContext';
import { XIcon } from '../constants/platform';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

interface StripeCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: string;
    features: string[];
  };
}

const CheckoutForm: React.FC<{ plan: any; onSuccess: () => void }> = ({ plan, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const priceAmount = parseInt(plan.price.replace('$', ''));
      
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: priceAmount })
      });

      const { clientSecret } = await response.json();

      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            email: currentUser?.email || 'guest@example.com',
            name: currentUser?.name || 'Guest User'
          }
        }
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[color:var(--surface)] p-4 rounded-lg border border-[color:var(--border)]">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#ffffff',
                '::placeholder': { color: '#6b7280' }
              }
            }
          }}
        />
      </div>
      
      {error && (
        <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-[color:var(--accent)] text-black py-3 px-6 rounded-lg font-semibold hover:bg-[color:var(--accent-muted)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Processing...' : `Pay ${plan.price} - ${plan.name}`}
      </button>
    </form>
  );
};

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({ isOpen, onClose, plan }) => {
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      onClose();
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[color:var(--bg)] border border-[color:var(--border)] rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[color:var(--text-primary)]">
            Upgrade to {plan.name}
          </h2>
          <button
            onClick={onClose}
            className="text-[color:var(--muted)] hover:text-[color:var(--text-primary)] transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-[color:var(--accent)] mb-2">Payment Successful!</h3>
            <p className="text-[color:var(--text-secondary)]">Welcome to {plan.name}! Check your email for details.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="text-2xl font-bold text-[color:var(--text-primary)] mb-2">
                {plan.price}
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center text-sm text-[color:var(--text-secondary)]">
                    <span className="text-[color:var(--accent)] mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Elements stripe={stripePromise}>
              <CheckoutForm plan={plan} onSuccess={handleSuccess} />
            </Elements>
          </>
        )}
      </div>
    </div>
  );
};
