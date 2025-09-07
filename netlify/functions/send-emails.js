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
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></head><body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #FFFFFF; background-color: #0B0D10; margin: 0; padding: 20px;"><div style="max-width: 600px; margin: 0 auto; background-color: #1A1D23; border-radius: 12px; overflow: hidden;"><div style="background: linear-gradient(135deg, #1A1D23 0%, #2A2D35 100%); padding: 40px 30px; text-align: center;"><h1 style="font-size: 32px; font-weight: 700; margin: 0 0 12px 0; color: #00F57A; letter-spacing: -0.02em;">Welcome ${firstName}! 🎧</h1><p style="font-size: 18px; margin: 0; color: #B8BCC8; font-weight: 400;">Thanks for joining the DJ Career Accelerator community!</p></div><div style="padding: 30px;"><div style="background-color: #2A2D35; padding: 25px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #3A3D45;"><h2 style="color: #00F57A; font-size: 20px; font-weight: 600; margin: 0 0 20px 0; letter-spacing: -0.01em;">🎯 Your Free Training Preview:</h2><ul style="list-style: none; padding: 0; margin: 0;"><li style="padding: 12px 0; color: #FFFFFF; font-weight: 400; border-bottom: 1px solid #3A3D45;">✅ How I went from busking to headlining festivals</li><li style="padding: 12px 0; color: #FFFFFF; font-weight: 400; border-bottom: 1px solid #3A3D45;">✅ The networking secrets that actually work</li><li style="padding: 12px 0; color: #FFFFFF; font-weight: 400; border-bottom: 1px solid #3A3D45;">✅ Club owner psychology revealed</li><li style="padding: 12px 0; color: #FFFFFF; font-weight: 400;">✅ 5 conversation starters that get you remembered</li></ul></div><div style="text-align: center; margin: 30px 0;"><a href="https://djelite.site/training-preview" style="background: #00F57A; color: #000000; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 245, 122, 0.25); transition: all 0.2s ease;">🚀 WATCH FREE TRAINING NOW</a></div><div style="border-top: 1px solid #3A3D45; padding-top: 25px; margin-top: 30px;"><p style="margin: 0 0 8px 0; color: #B8BCC8; font-weight: 400;">Talk soon,</p><p style="margin: 0; font-weight: 600; color: #00F57A;">DJ Elite Team</p></div></div></div></body></html>`
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