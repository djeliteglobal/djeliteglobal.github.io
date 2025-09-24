import crypto from 'crypto';

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { amount, currency, order_id, description } = JSON.parse(event.body);

    const timestamp = Date.now();
    const nonce = crypto.randomBytes(32).toString('hex');
    
    const requestBody = {
      env: {
        terminalType: 'WEB'
      },
      merchantTradeNo: order_id,
      orderAmount: parseFloat(amount),
      currency: currency || 'USDT',
      goods: {
        goodsType: '01',
        goodsCategory: 'Z000',
        referenceGoodsId: 'DJ_ELITE_SERVICE',
        goodsName: description || 'DJ Elite Service',
        goodsDetail: description || 'DJ Elite Service Payment'
      },
      returnUrl: `${process.env.URL}/binance-success`,
      cancelUrl: `${process.env.URL}/binance-pay`
    };

    const payload = JSON.stringify(requestBody);
    const payloadToSign = timestamp + '\n' + nonce + '\n' + payload + '\n';
    
    const signature = crypto
      .createHmac('sha512', process.env.BINANCE_PAY_SECRET_KEY)
      .update(payloadToSign)
      .digest('hex')
      .toUpperCase();

    const response = await fetch('https://bpay.binanceapi.com/binancepay/openapi/v2/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'BinancePay-Timestamp': timestamp.toString(),
        'BinancePay-Nonce': nonce,
        'BinancePay-Certificate-SN': process.env.BINANCE_PAY_API_KEY,
        'BinancePay-Signature': signature,
      },
      body: payload
    });

    const data = await response.json();

    if (data.status === 'SUCCESS' && data.data) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({
          checkoutUrl: data.data.checkoutUrl,
          prepayId: data.data.prepayId,
          merchantTradeNo: order_id
        })
      };
    } else {
      console.error('Binance Pay error:', data);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ error: data.errorMessage || 'Payment creation failed' })
      };
    }
  } catch (error) {
    console.error('Binance Pay error:', error);
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