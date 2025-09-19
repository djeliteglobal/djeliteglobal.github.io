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

interface CreateDJHirePaymentBody {
  clientId: string;
  djId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  durationHours: number;
  rate: number;
  specialRequests?: string;
}

const handler: Handler = async (event: any) => {
  console.log('DJ Hire Payment function received request.');
  
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

    const body: CreateDJHirePaymentBody = JSON.parse(event.body || '{}');
    const {
      clientId,
      djId,
      eventName,
      eventDate,
      eventLocation,
      durationHours,
      rate,
      specialRequests
    } = body;

    // Validate required fields
    if (!clientId || !djId || !eventName || !eventDate || !eventLocation || !durationHours || !rate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
      };
    }

    console.log('Creating DJ hire payment for:', { clientId, djId, eventName, rate });

    // Create the hire record in the database
    const { data: hireData, error: hireError } = await supabase.rpc('create_dj_hire_with_payment', {
      client_profile_id: clientId,
      dj_profile_id: djId,
      event_name: eventName,
      event_date: eventDate,
      event_location: eventLocation,
      duration_hours: durationHours,
      rate: rate,
      special_requests: specialRequests || null
    });

    if (hireError) {
      console.error('Error creating DJ hire:', hireError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to create DJ hire record' }),
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
      };
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(rate * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        hireId: hireData.hire_id,
        clientId,
        djId,
        eventName,
        eventDate,
        type: 'dj_hire'
      }
    });

    console.log('PaymentIntent created successfully:', paymentIntent.id);

    // Update the hire record with the payment intent ID
    const { error: updateError } = await supabase.rpc('update_hire_payment_status', {
      hire_id: hireData.hire_id,
      payment_intent_id: paymentIntent.id,
      payment_status: 'pending'
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

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
        hireId: hireData.hire_id,
        paymentIntentId: paymentIntent.id
      }),
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
    };
  } catch (error) {
    console.error('Error in create-dj-hire-payment:', error);
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