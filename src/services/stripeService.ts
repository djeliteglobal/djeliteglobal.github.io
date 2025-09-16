export interface StripeCheckoutData {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  userId?: string;
}

export const createCheckoutSession = async (data: StripeCheckoutData) => {
  try {
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Checkout failed: ${errorText}`);
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Stripe checkout error:', error);
    throw error;
  }
};

export const createPortalSession = async (customerId: string) => {
  try {
    const response = await fetch('/.netlify/functions/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Stripe portal error:', error);
    throw error;
  }
};

// Stripe Price IDs for DJ Platform Subscriptions
export const STRIPE_PRICES = {
  PRO_MONTHLY: 'price_pro_monthly',
  PRO_YEARLY: 'price_pro_yearly',
  ELITE_MONTHLY: 'price_elite_monthly', 
  ELITE_YEARLY: 'price_elite_yearly',
};