import { Handler } from '@netlify/functions';

const sanitizeForLog = (input: any): string => {
  if (typeof input !== 'string') {
    input = String(input);
  }
  return input.replace(/[\r\n\t]/g, ' ').replace(/[<>]/g, '').substring(0, 500);
};

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
    console.log('Webhook data received:', sanitizeForLog(JSON.stringify(webhookData)));

    // Process the webhook data here
    // This will be called when events happen in Systeme.io
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Webhook processed' })
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing webhook:', sanitizeForLog(errorMessage));
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

export { handler };