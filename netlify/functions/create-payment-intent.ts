import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const handler: Handler = async (event) => {
  console.log('Function received request.');
  console.log('STRIPE_SECRET_KEY length:', process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.length : 'undefined');
  try {
    const { amount } = JSON.parse(event.body || '{}');
    console.log('Request body amount:', amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    console.log('PaymentIntent created successfully.');
    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
    };
  } catch (error) {
    console.error('Error in create-payment-intent:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
    };
  }
};

export { handler };