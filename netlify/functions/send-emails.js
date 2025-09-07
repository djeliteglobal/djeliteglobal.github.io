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
      html: `
        <h1>Welcome ${firstName}!</h1>
        <p>Thanks for joining the DJ Career Accelerator community!</p>
        
        <h2>🎯 Your Free Training Preview:</h2>
        <ul>
          <li>✅ How I went from busking to headlining festivals</li>
          <li>✅ The networking secrets that actually work</li>
          <li>✅ Club owner psychology revealed</li>
          <li>✅ 5 conversation starters that get you remembered</li>
        </ul>
        
        <a href="https://djelite.site/training-preview" style="background: #00F57A; color: black; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          🚀 WATCH FREE TRAINING NOW
        </a>
        
        <p>Talk soon,<br>DJ Elite Team</p>
      `
    });

    // Add to ConvertKit
    const convertKitResponse = await fetch(`https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`, {
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