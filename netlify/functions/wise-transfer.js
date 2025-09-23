export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { sourceAmount, targetCurrency, order_id, order_description } = JSON.parse(event.body);

    // Step 1: Create Quote
    const quoteResponse = await fetch(`${process.env.WISE_API_ENDPOINT}/v1/quotes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WISE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profile: parseInt(process.env.WISE_PROFILE_ID),
        sourceCurrency: 'USD',
        targetCurrency: targetCurrency || 'USD',
        sourceAmount: parseFloat(sourceAmount),
        payOut: 'BANK_TRANSFER',
        preferredPayIn: 'BALANCE'
      })
    });

    const quoteData = await quoteResponse.json();
    
    if (!quoteResponse.ok) {
      console.error('Quote error:', quoteData);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ error: quoteData.errors?.[0]?.message || 'Quote creation failed' })
      };
    }

    // Step 2: Create Transfer
    const transferResponse = await fetch(`${process.env.WISE_API_ENDPOINT}/v1/transfers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WISE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targetAccount: parseInt(process.env.WISE_TARGET_ACCOUNT_ID),
        quoteUuid: quoteData.id,
        customerTransactionId: order_id,
        details: {
          reference: order_description || 'DJ Elite Payment'
        }
      })
    });

    const transferData = await transferResponse.json();

    if (!transferResponse.ok) {
      console.error('Transfer error:', transferData);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ error: transferData.errors?.[0]?.message || 'Transfer creation failed' })
      };
    }

    // Step 3: Fund Transfer
    const fundResponse = await fetch(`${process.env.WISE_API_ENDPOINT}/v1/transfers/${transferData.id}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WISE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'BALANCE'
      })
    });

    const fundData = await fundResponse.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        result: {
          wiseTransactionId: transferData.id,
          status: fundData.status || 'CREATED',
          estimatedDelivery: quoteData.paymentOptions?.[0]?.estimatedDelivery,
          paymentGatewayData: {
            transferId: transferData.id,
            quoteId: quoteData.id,
            balanceTransactionId: fundData.balanceTransactionId
          }
        }
      })
    };
  } catch (error) {
    console.error('Wise transfer error:', error);
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