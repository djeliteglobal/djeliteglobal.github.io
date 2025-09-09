
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

    if (stripeEvent.type === 'payment_intent.succeeded') {
      const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
      const email = paymentIntent.receipt_email;

      // Add to Systeme.io CRM
      await fetch('https://api.systeme.io/api/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SYSTEMEIO_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
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
      body: JSON.stringify({ error: 'Webhook processing failed' }),
      headers: { 'Access-Control-Allow-Origin': '*' },
    };
  }
};
