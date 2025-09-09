import { Handler } from '@netlify/functions';

const sanitizeForLog = (input: any): string => {
  if (typeof input !== 'string') {
    input = String(input);
  }
  return input.replace(/[\r\n\t]/g, ' ').replace(/[<>]/g, '').substring(0, 500);
};

const API_ENDPOINTS = [
  process.env.SYSTEMEIO_API_ENDPOINT || 'https://api.systeme.io/contacts',
  'https://systeme.io/api/contacts',
  'https://app.systeme.io/api/contacts'
];

const handler: Handler = async (event) => {
  console.log('Systeme.io subscription request received');
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    };
  }

  try {
    // Parse form data instead of JSON
    const params = new URLSearchParams(event.body || '');
    const email = params.get('email');
    const first_name = params.get('first_name') || '';
    
    console.log('Adding contact:', sanitizeForLog(JSON.stringify({ email: email?.substring(0, 20), first_name })));
    
    if (!email) {
      throw new Error('Email is required');
    }

    // Validate API key
    if (!process.env.SYSTEMEIO_API_KEY) {
      throw new Error('SYSTEMEIO_API_KEY not configured');
    }
    
    let response;
    let lastError;
    
    for (const endpoint of API_ENDPOINTS) {
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.SYSTEMEIO_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            first_name,
            tags: ['Newsletter Subscriber']
          })
        });
        
        if (response.ok) break;
        lastError = `${endpoint}: ${response.status}`;
      } catch (err) {
        lastError = `${endpoint}: ${err.message}`;
      }
    }

    if (!response || !response.ok) {
      throw new Error(`All Systeme.io API endpoints failed. Last error: ${lastError}`);
    }

    const result = await response.json();
    console.log('Contact added successfully:', sanitizeForLog(JSON.stringify(result)));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Subscribed successfully!' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error adding contact to Systeme.io:', sanitizeForLog(errorMessage));
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Subscription failed' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    };
  }
};

export { handler };