const { Resend } = require('resend');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, firstName } = JSON.parse(event.body);
    
    if (!email || !firstName) {
      return { statusCode: 400, body: 'Email and firstName required' };
    }

    // Send Resend welcome email
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: 'DJ Elite <noreply@djelite.site>',
      to: [email],
      subject: '🎁 Your FREE DJ Training Preview is Here!',
      text: `Hey ${firstName}!

Welcome to the DJ Career Accelerator community! 🎧

🎯 Your Free Training Preview:

✅ How I went from busking to headlining festivals
✅ The networking secrets that actually work  
✅ Club owner psychology revealed
✅ 5 conversation starters that get you remembered

🚀 WATCH FREE TRAINING NOW:
https://djelite.site/training-preview

Talk soon,
DJ Elite Team`
    });

    // Add to ConvertKit (correct endpoint)
    const convertKitResponse = await fetch(`https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: process.env.CONVERTKIT_API_KEY,
        email: email,
        first_name: firstName
      })
    });
    
    console.log('ConvertKit response status:', convertKitResponse.status);
    if (!convertKitResponse.ok) {
      const errorText = await convertKitResponse.text();
      console.error('ConvertKit error:', errorText);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ 
        success: true,
        resend: resendError ? 'failed' : 'sent',
        convertkit: convertKitResponse.ok ? 'added' : 'failed'
      })
    };
  } catch (error) {
    console.error('Email function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};