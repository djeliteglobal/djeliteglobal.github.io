export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { price_amount, price_currency, pay_currency, order_id, order_description } = JSON.parse(event.body);

    const response = await fetch('https://api.nowpayments.io/v1/payment', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount,
        price_currency,
        pay_currency,
        order_id,
        order_description,
        success_url: `${process.env.URL}/crypto-success`,
        cancel_url: `${process.env.URL}/crypto-payment`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('NOWPayments error:', data);
      return {
        statusCode: 400,
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
        payment_id: data.payment_id,
        payment_status: data.payment_status,
        pay_address: data.pay_address,
        price_amount: data.price_amount,
        pay_amount: data.pay_amount,
        pay_currency: data.pay_currency,
        payment_url: data.payment_url || `${process.env.URL}/crypto-payment?id=${data.payment_id}`
      })
    };
  } catch (error) {
    console.error('Crypto payment error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};