import { Resend } from 'resend';

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email } = JSON.parse(event.body);
    
    if (!email) {
      return { statusCode: 400, body: 'Email required' };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const { data, error } = await resend.emails.send({
      from: 'DJ Elite Audio <audio@djelite.site>',
      to: [email],
      subject: '🎵 Audio Services Confirmation - DJ Elite',
      html: `<div style="max-width:600px;margin:0 auto;font-family:system-ui,sans-serif;background:#1a1d23;color:#fff;border-radius:8px;overflow:hidden">
<div style="background:linear-gradient(135deg,#00f57a 0%,#00c766 100%);padding:32px;text-align:center">
<h1 style="margin:0;font-size:28px;color:#000;font-weight:700">Audio Services Confirmed! 🎧</h1>
<p style="margin:8px 0 0;color:#000;opacity:0.8">We'll be in touch within 24 hours</p>
</div>
<div style="padding:32px">
<h2 style="color:#00f57a;margin:0 0 20px;font-size:20px">🎯 What's Next:</h2>
<div style="background:#2a2d35;padding:20px;border-radius:6px;margin-bottom:24px">
<p style="margin:0 0 12px;color:#fff">✅ We'll review your project requirements</p>
<p style="margin:0 0 12px;color:#fff">✅ Send you a detailed quote and timeline</p>
<p style="margin:0;color:#fff">✅ Schedule a consultation call if needed</p>
</div>
<div style="text-align:center;margin:24px 0">
<a href="https://djelite.site/audio-services" style="display:inline-block;background:#00f57a;color:#000;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px">🚀 View Services</a>
</div>
<div style="border-top:1px solid #3a3d45;padding-top:20px;margin-top:24px">
<p style="margin:0;color:#b8bcc8">Best regards,<br><strong style="color:#00f57a">DJ Elite Audio Team</strong></p>
</div>
</div>
</div>`
    });

    if (error) {
      console.error('Resend error:', error);
      return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Audio services email error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};