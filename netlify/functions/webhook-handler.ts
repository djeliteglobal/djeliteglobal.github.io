
import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export const handler: Handler = async (event, context) => {
  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);

    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;

      await fetch('https://api.systeme.io/api/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SYSTEMEIO_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.customer_details.email,
          tags: ['paid-customer'],
        }),
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
      headers: { 'Access-Control-Allow-Origin': '*' },
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
      headers: { 'Access-control-Allow-Origin': '*' },
    };
  }
};
