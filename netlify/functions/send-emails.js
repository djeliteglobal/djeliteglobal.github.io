import { Resend } from 'resend';

export const handler = async (event, context) => {
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
      html: `<div style="max-width:600px;margin:0 auto;font-family:system-ui,sans-serif;background:#1a1d23;color:#fff;border-radius:8px;overflow:hidden">
<div style="background:linear-gradient(135deg,#00f57a 0%,#00c766 100%);padding:32px;text-align:center">
<h1 style="margin:0;font-size:28px;color:#000;font-weight:700">Welcome ${firstName}! 🎧</h1>
<p style="margin:8px 0 0;color:#000;opacity:0.8">You're now part of the DJ Career Accelerator</p>
</div>
<div style="padding:32px">
<h2 style="color:#00f57a;margin:0 0 20px;font-size:20px">🎯 Your Training Includes:</h2>
<div style="background:#2a2d35;padding:20px;border-radius:6px;margin-bottom:24px">
<p style="margin:0 0 12px;color:#fff">✅ Street to festival success story</p>
<p style="margin:0 0 12px;color:#fff">✅ International networking tactics</p>
<p style="margin:0 0 12px;color:#fff">✅ Club owner decision psychology</p>
<p style="margin:0;color:#fff">✅ Memorable conversation frameworks</p>
</div>
<div style="text-align:center;margin:24px 0">
<a href="https://djelite.site/training-preview" style="display:inline-block;background:#00f57a;color:#000;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px">🚀 Access Training Now</a>
</div>
<div style="border-top:1px solid #3a3d45;padding-top:20px;margin-top:24px">
<p style="margin:0;color:#b8bcc8">Best regards,<br><strong style="color:#00f57a">DJ Elite Team</strong></p>
</div>
</div>
</div>`
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