const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { priceId, amount, successUrl, cancelUrl } = JSON.parse(event.body);

    // Define price mappings for audio services
    const priceMapping = {
      'price_mixing': {
        name: 'Professional Mixing Service',
        description: 'Complete balance and EQ optimization, professional compression, spatial effects, and up to 3 revisions',
        amount: 12500, // $125 deposit (50% of $250)
      },
      'price_mastering': {
        name: 'Final Mastering Service', 
        description: 'Corrective and musical EQ, multiband compression, volume maximization, and multiple format delivery',
        amount: 5000, // $50 deposit (50% of $100)
      },
      'price_consulting': {
        name: 'Production Consulting Service',
        description: 'Musical arrangement review, DJ-optimized structure suggestions, and 30-minute video consultation',
        amount: 5000, // $50 deposit (50% of $100)
      },
      'price_complete_package': {
        name: 'Complete Audio Package',
        description: 'Professional mixing, final mastering, and production consulting - everything you need',
        amount: 22500, // $225 deposit (50% of $450)
      },
    };

    const serviceInfo = priceMapping[priceId];
    if (!serviceInfo) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid price ID' }),
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: serviceInfo.name,
              description: serviceInfo.description,
              images: ['https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&h=300&fit=crop'],
            },
            unit_amount: serviceInfo.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        service_type: priceId,
        deposit_amount: serviceInfo.amount.toString(),
      },
      custom_text: {
        submit: {
          message: 'DJ Elite Audio Services - Professional quality guaranteed'
        }
      }
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create checkout session' }),
    };
  }
};