const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { priceId, successUrl, cancelUrl, userId } = JSON.parse(event.body);

    // Create price on-the-fly based on plan
    const priceData = {
      'price_pro_monthly': {
        unit_amount: 1900, // $19.00
        currency: 'usd',
        recurring: { interval: 'month' },
        product_data: {
          name: 'DJ Elite Pro Platform',
          description: 'Monthly subscription to DJ Elite networking platform'
        }
      },
      'price_elite_monthly': {
        unit_amount: 4900, // $49.00
        currency: 'usd', 
        recurring: { interval: 'month' },
        product_data: {
          name: 'DJ Elite Premium Platform',
          description: 'Premium monthly subscription to DJ Elite platform'
        }
      }
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: priceData[priceId] || priceData['price_pro_monthly'],
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: { userId: userId || '' },
      allow_promotion_codes: true,
      billing_address_collection: 'required'
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url })
    };
  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};