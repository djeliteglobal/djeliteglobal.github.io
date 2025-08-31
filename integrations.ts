
import Stripe from 'stripe';

// Stripe Integration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export const getStripeProducts = async () => {
  const products = await stripe.products.list();
  return products;
};

// Buy Me a Coffee Integration
// Note: Buy Me a Coffee doesn't have a public server-side API for fetching data.
// You would typically use their button widget on the client-side.
// We can create a helper function to render the button.

// Systeme.io Integration
// Note: Systeme.io uses an API key for authentication.
// We'll create a placeholder function to demonstrate how to use it.
const SYSTEMEIO_API_URL = 'https://api.systeme.io/api';

export const getSystemeioContacts = async () => {
  const response = await fetch(`${SYSTEMEIO_API_URL}/contacts`, {
    headers: {
      'X-API-Key': process.env.SYSTEMEIO_API_KEY!,
    },
  });
  const data = await response.json();
  return data;
};
