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

    // Send welcome email via Resend
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: 'DJ Elite <noreply@djelite.site>',
      to: [email],
      subject: '🎧 Welcome to DJ Elite Newsletter!',
      html: `<div style="max-width:600px;margin:0 auto;font-family:system-ui,sans-serif;background:#1a1d23;color:#fff;border-radius:8px;overflow:hidden">
<div style="background:linear-gradient(135deg,#00f57a 0%,#00c766 100%);padding:32px;text-align:center">
<h1 style="margin:0;font-size:28px;color:#000;font-weight:700">Welcome ${first_name}! 🎧</h1>
<p style="margin:8px 0 0;color:#000;opacity:0.8">You're now part of the DJ Elite community</p>
</div>
<div style="padding:32px">
<h2 style="color:#00f57a;margin:0 0 20px;font-size:20px">🎯 What's Next:</h2>
<div style="background:#2a2d35;padding:20px;border-radius:6px;margin-bottom:24px">
<p style="margin:0 0 12px;color:#fff">✅ Weekly DJ tips and insights</p>
<p style="margin:0 0 12px;color:#fff">✅ Industry networking opportunities</p>
<p style="margin:0 0 12px;color:#fff">✅ Exclusive event invitations</p>
<p style="margin:0;color:#fff">✅ Career advancement strategies</p>
</div>
<div style="border-top:1px solid #3a3d45;padding-top:20px;margin-top:24px">
<p style="margin:0;color:#b8bcc8">Best regards,<br><strong style="color:#00f57a">DJ Elite Team</strong></p>
</div>
</div>
</div>`
    });

    if (resendError) {
      console.error('Resend error:', resendError);
      // Don't throw - newsletter signup was successful even if email failed
    } else {
      console.log('Newsletter welcome email sent via Resend');
    }

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