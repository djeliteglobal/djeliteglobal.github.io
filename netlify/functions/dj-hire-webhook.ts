import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const handler: Handler = async (event: any) => {
  console.log('DJ Hire Webhook received request.');
  
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' }),
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
      };
    }

    const sig = event.headers['stripe-signature'];
    let stripeEvent;

    try {
      stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
      };
    }

    // Handle the event
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent was successful!', paymentIntent.id);
        
        // Check if this is a DJ hire payment
        if (paymentIntent.metadata?.type === 'dj_hire') {
          const hireId = paymentIntent.metadata.hireId;
          
          // Update the hire payment status
          const { error: updateError } = await supabase.rpc('update_hire_payment_status', {
            hire_id: hireId,
            payment_intent_id: paymentIntent.id,
            payment_status: 'paid'
          });

          if (updateError) {
            console.error('Error updating hire payment status:', updateError);
            return {
              statusCode: 500,
              body: JSON.stringify({ error: 'Failed to update hire payment status' }),
              headers: { 
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
              },
            };
          }

          console.log('DJ hire payment status updated successfully:', hireId);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = stripeEvent.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent failed!', failedPayment.id);
        
        // Check if this is a DJ hire payment
        if (failedPayment.metadata?.type === 'dj_hire') {
          const hireId = failedPayment.metadata.hireId;
          
          // Update the hire payment status
          const { error: updateError } = await supabase.rpc('update_hire_payment_status', {
            hire_id: hireId,
            payment_intent_id: failedPayment.id,
            payment_status: 'failed'
          });

          if (updateError) {
            console.error('Error updating hire payment status:', updateError);
            return {
              statusCode: 500,
              body: JSON.stringify({ error: 'Failed to update hire payment status' }),
              headers: { 
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
              },
            };
          }

          console.log('DJ hire payment failure recorded:', hireId);
        }
        break;

      default:
        console.log(`Unhandled event type ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
    };
  } catch (error) {
    console.error('Error in dj-hire-webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
    };
  }
};

export { handler };