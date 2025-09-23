export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { price_amount, price_currency, order_id, order_description } = JSON.parse(event.body);

    console.log('Creating payment:', { price_amount, price_currency, order_id });
    console.log('API Key exists:', !!process.env.NOWPAYMENTS_API_KEY);
    console.log('API Key length:', process.env.NOWPAYMENTS_API_KEY?.length);

    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    
    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: parseFloat(price_amount),
        price_currency: 'usd',
        order_id: order_id,
        order_description: order_description || 'DJ Elite Payment'
      })
    });

    const data = await response.json();
    console.log('NOWPayments response:', data);

    if (!response.ok) {
      console.error('NOWPayments error:', data);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ error: data.message || 'Payment creation failed' })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        invoice_url: data.invoice_url,
        invoice_id: data.id,
        order_id: data.order_id
      })
    };
  } catch (error) {
    console.error('Card payment error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};