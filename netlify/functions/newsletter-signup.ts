import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  console.log('Newsletter signup request received');
  
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
    const params = new URLSearchParams(event.body || '');
    const email = params.get('email');
    const first_name = params.get('first_name') || '';
    
    console.log('Newsletter signup:', { email, first_name });
    
    if (!email) {
      throw new Error('Email is required');
    }

    // Send notification email via Mailgun
    const mailgunResponse = await fetch(`https://api.mailgun.net/v3/djelite.site/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        from: 'DJ Elite <noreply@djelite.site>',
        to: 'support@djelite.site',
        subject: 'New Newsletter Signup',
        text: `New newsletter signup:\n\nName: ${first_name}\nEmail: ${email}\n\nPlease add to your mailing list.`
      })
    });

    if (!mailgunResponse.ok) {
      throw new Error(`Mailgun error: ${mailgunResponse.status}`);
    }

    console.log('Newsletter signup notification sent');

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Thank you for subscribing!' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    };

  } catch (error) {
    console.error('Error processing newsletter signup:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    };
  }
};

export { handler };