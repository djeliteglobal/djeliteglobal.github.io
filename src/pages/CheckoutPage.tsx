import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PlanDetails {
  name: string;
  price: number;
  interval: string;
  features: string[];
}

const PLANS: Record<string, PlanDetails> = {
  pro: {
    name: 'DJ Elite Pro',
    price: 19,
    interval: 'month',
    features: [
      'Unlimited DJ connections',
      'Premium swipe features', 
      'Priority gig matching',
      'Enhanced profile visibility',
      'Direct promoter contact'
    ]
  },
  elite: {
    name: 'DJ Elite Premium',
    price: 49,
    interval: 'month',
    features: [
      'Everything in Pro',
      'VIP gig opportunities',
      'Personal booking agent',
      'Advanced performance analytics',
      'Custom DJ brand tools'
    ]
  }
};

export const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cardElement, setCardElement] = useState<any>(null);
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const planType = searchParams.get('plan') || 'pro';
  const plan = PLANS[planType];

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    const loadStripe = async () => {
      const stripeJs = await import('@stripe/stripe-js');
      const stripeInstance = await stripeJs.loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef');
      setStripe(stripeInstance);

      if (stripeInstance) {
        const elementsInstance = stripeInstance.elements();
        setElements(elementsInstance);
        
        const card = elementsInstance.create('card', {
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' },
            },
          },
        });
        
        const cardElement = document.getElementById('card-element');
        if (cardElement) {
          cardElement.innerHTML = '';
          card.mount('#card-element');
        }
        setCardElement(card);
      }
    };

    loadStripe();
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !cardElement || !currentUser) return;

    setLoading(true);
    setError('');

    try {
      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: currentUser.name,
          email: currentUser.email,
        },
      });

      if (pmError) {
        setError(pmError.message);
        setLoading(false);
        return;
      }

      // Create subscription
      const response = await fetch('/.netlify/functions/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          planType,
          userId: currentUser.id,
          customerEmail: currentUser.email,
          customerName: currentUser.name,
        }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Handle 3D Secure if needed
      if (result.status === 'requires_action') {
        const { error: confirmError } = await stripe.confirmCardPayment(result.client_secret);
        if (confirmError) {
          setError(confirmError.message);
          setLoading(false);
          return;
        }
      }

      // Success - redirect to success page
      navigate('/success?subscription=true');
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      setLoading(false);
    }
  };

  if (!plan) {
    return <div>Invalid plan selected</div>;
  }

  return (
    <div className="min-h-screen bg-[color:var(--bg)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[color:var(--surface)] rounded-xl border border-[color:var(--border)] p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[color:var(--text-primary)] mb-2">Complete Your Subscription</h1>
          <p className="text-[color:var(--text-secondary)]">Join thousands of DJs growing their careers</p>
        </div>

        <div className="bg-[color:var(--surface-alt)] rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-[color:var(--text-primary)] mb-2">{plan.name}</h2>
          <div className="text-3xl font-bold text-[color:var(--accent)] mb-4">
            ${plan.price}<span className="text-sm text-[color:var(--text-secondary)]">/{plan.interval}</span>
          </div>
          <ul className="space-y-2">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-center text-sm text-[color:var(--text-secondary)]">
                <span className="text-green-500 mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">
              Card Information
            </label>
            <div 
              id="card-element"
              className="p-3 border border-[color:var(--border)] rounded-lg bg-white"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !stripe}
            className="w-full py-3 bg-[color:var(--accent)] text-black font-semibold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Subscribe for $${plan.price}/${plan.interval}`}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-[color:var(--muted)]">
            Secure payment powered by Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};