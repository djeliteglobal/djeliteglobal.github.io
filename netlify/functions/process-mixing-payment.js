const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { token, email, name } = JSON.parse(event.body);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 12500, // $125 deposit
      currency: 'usd',
      payment_method_data: {
        type: 'card',
        card: { token }
      },
      receipt_email: email,
      description: 'DJ Elite - Professional Mixing Service (50% Deposit)',
      metadata: {
        service: 'mixing',
        customer_name: name,
        full_amount: '25000'
      },
      confirm: true,
      return_url: `${process.env.URL}/audio-services/success`
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        success: true, 
        paymentIntent: paymentIntent.id,
        status: paymentIntent.status 
      })
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};