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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1d23 0%, #2a2d35 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 28px; margin: 0 0 10px 0; color: #00F57A;">Welcome ${firstName}! 🎧</h1>
            <p style="font-size: 18px; margin: 0; opacity: 0.9;">Thanks for joining the DJ Career Accelerator community!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #00F57A; font-size: 22px; margin: 0 0 15px 0;">🎯 Your Free Training Preview:</h2>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">✅ How I went from busking to headlining festivals</li>
              <li style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">✅ The networking secrets that actually work</li>
              <li style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">✅ Club owner psychology revealed</li>
              <li style="padding: 8px 0;">✅ 5 conversation starters that get you remembered</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://djelite.site/training-preview" style="background: #00F57A; color: black; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 245, 122, 0.3);">
              🚀 WATCH FREE TRAINING NOW
            </a>
          </div>
          
          <div style="border-top: 2px solid #e9ecef; padding-top: 20px; margin-top: 30px;">
            <p style="margin: 0 0 10px 0;">Talk soon,</p>
            <p style="margin: 0; font-weight: bold; color: #00F57A;">DJ Elite Team</p>
          </div>
        </body>
        </html>
      `
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