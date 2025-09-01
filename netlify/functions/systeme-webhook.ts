import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  console.log('Webhook received from Systeme.io');
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const webhookData = JSON.parse(event.body || '{}');
    console.log('Webhook data:', webhookData);

    // Process the webhook data here
    // This will be called when events happen in Systeme.io
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Webhook processed' })
    };

  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

export { handler };