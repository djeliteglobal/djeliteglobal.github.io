import React, { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Logo } from '../constants';
import { Button } from '../components';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
        receipt_email: email,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
        <input 
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full px-4 py-3 rounded-lg bg-[color:var(--bg)] border border-[color:var(--border)] focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none transition-all"
        />
        <PaymentElement id="payment-element" />
        <Button variant="purchase" disabled={isLoading || !stripe || !elements} id="submit" className="w-full">
            <span id="button-text">
                {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
            </span>
        </Button>
        {message && <div id="payment-message" className="text-red-500 text-center mt-2">{message}</div>}
    </form>
  );
};

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("/.netlify/functions/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 497 }), // Amount for the course
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
        theme: 'night',
        variables: {
            colorPrimary: '#00F57A',
            colorBackground: '#111111',
            colorText: '#F5F5F5',
            colorDanger: '#EF4444',
            fontFamily: 'Inter, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
        }
    },
  };

  return (
    <div className="bg-[color:var(--bg)] text-[color:var(--text-primary)] min-h-screen flex flex-col">
        <header className="py-6 border-b border-[color:var(--border)]">
            <div className="container mx-auto px-4">
                <Logo className="text-2xl" />
            </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
            <div className="w-full max-w-md bg-[color:var(--surface)] p-8 rounded-2xl border border-[color:var(--border)]">
                <h1 className="text-3xl font-display font-bold text-center mb-2">Complete Your Enrollment</h1>
                <p className="text-center text-[color:var(--text-secondary)] mb-4">You're one step away from becoming a DJ Elite.</p>
                <div className="text-center mb-8 p-4 bg-[color:var(--surface-alt)] rounded-lg border border-[color:var(--accent)]/20">
                    <p className="text-sm text-[color:var(--muted)]">DJ Elite Complete Course</p>
                    <p className="text-3xl font-bold text-[color:var(--accent)]">$497</p>
                    <p className="text-xs text-[color:var(--muted)]">One-time payment • 90-day guarantee</p>
                </div>
                {clientSecret && (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm />
                    </Elements>
                )}
            </div>
        </main>
    </div>
  );
};

export default CheckoutPage;