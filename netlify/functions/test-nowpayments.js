export const handler = async (event, context) => {
  try {
    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No API key found' })
      };
    }

    // Test API key with status endpoint
    const response = await fetch('https://api.nowpayments.io/v1/status', {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      }
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        api_key_length: apiKey.length,
        api_key_prefix: apiKey.substring(0, 10),
        status_response: data,
        response_ok: response.ok
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};