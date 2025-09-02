exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { first_name, email } = JSON.parse(event.body);
    
    // Log to Netlify functions (visible in deploy logs)
    console.log('New subscription:', { first_name, email, timestamp: new Date().toISOString() });
    
    // Here you would integrate with your email service (Mailchimp, ConvertKit, etc.)
    // For now, we'll just return success
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Successfully subscribed!',
        data: { first_name, email }
      })
    };
  } catch (error) {
    console.error('Subscription error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Failed to subscribe' })
    };
  }
};