export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { price_amount, price_currency, receive_currency, order_id, order_description } = JSON.parse(event.body);

    // Create invoice for card-to-crypto payment
    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount,
        price_currency,
        pay_currency: receive_currency, // What you want to receive
        order_id,
        order_description,
        success_url: `${process.env.URL}/crypto-success`,
        cancel_url: `${process.env.URL}/crypto-payment`,
        is_fee_paid_by_user: false,
        is_fixed_rate: true
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('NOWPayments invoice error:', data);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ error: data.message || 'Invoice creation failed' })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        invoice_id: data.id,
        invoice_url: data.invoice_url,
        order_id: data.order_id,
        price_amount: data.price_amount,
        price_currency: data.price_currency,
        pay_currency: data.pay_currency,
        created_at: data.created_at
      })
    };
  } catch (error) {
    console.error('Card-to-crypto payment error:', error);
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