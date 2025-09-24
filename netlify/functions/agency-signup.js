import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { name, email, phone, djName, epkUrl, instagramUrl, soundcloudUrl, youtubeUrl, experience, marketingConsent } = JSON.parse(event.body);
    
    if (!name || !email || !phone || !djName || !experience) {
      return { statusCode: 400, body: 'Required fields missing' };
    }

    // Store in Supabase
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );
    
    const { error: dbError } = await supabase
      .from('agency_applications')
      .insert({
        name,
        email,
        phone,
        dj_name: djName,
        epk_url: epkUrl || null,
        instagram_url: instagramUrl || null,
        soundcloud_url: soundcloudUrl || null,
        youtube_url: youtubeUrl || null,
        experience,
        marketing_consent: marketingConsent || false,
        status: 'pending',
        created_at: new Date().toISOString()
      });
    
    if (dbError) {
      console.error('Database error:', dbError);
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Send confirmation to DJ
    await resend.emails.send({
      from: 'DJ Elite Agency <agency@djelite.site>',
      to: [email],
      subject: '🎧 Agency Application Received - DJ Elite',
      html: `<div style="max-width:600px;margin:0 auto;font-family:system-ui,sans-serif;background:#1a1d23;color:#fff;border-radius:8px;overflow:hidden">
<div style="background:linear-gradient(135deg,#00f57a 0%,#00c766 100%);padding:32px;text-align:center">
<h1 style="margin:0;font-size:28px;color:#000;font-weight:700">Application Received! 🎧</h1>
<p style="margin:8px 0 0;color:#000;opacity:0.8">DJ Elite Agency - ${djName}</p>
</div>
<div style="padding:32px">
<h2 style="color:#00f57a;margin:0 0 20px;font-size:20px">🎯 What's Next:</h2>
<div style="background:#2a2d35;padding:20px;border-radius:6px;margin-bottom:24px">
<p style="margin:0 0 12px;color:#fff">✅ We'll review your profile within 48 hours</p>
<p style="margin:0 0 12px;color:#fff">✅ Check your social media and experience</p>
<p style="margin:0;color:#fff">✅ Contact you if you're a good fit</p>
</div>
<div style="border-top:1px solid #3a3d45;padding-top:20px;margin-top:24px">
<p style="margin:0;color:#b8bcc8">Best regards,<br><strong style="color:#00f57a">DJ Elite Agency Team</strong></p>
</div>
</div>
</div>`
    });

    // Send notification to agency team
    await resend.emails.send({
      from: 'DJ Elite Agency <agency@djelite.site>',
      to: ['agency@djelite.site'],
      subject: `🎧 New DJ Application: ${djName}`,
      html: `<div style="max-width:600px;margin:0 auto;font-family:system-ui,sans-serif;background:#fff;padding:32px">
<h1 style="color:#00f57a;margin:0 0 24px">New DJ Application</h1>
<div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px">
<h2 style="margin:0 0 16px;color:#333">${djName}</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone}</p>
${epkUrl ? `<p><strong>EPK:</strong> <a href="${epkUrl}">${epkUrl}</a></p>` : ''}
${instagramUrl ? `<p><strong>Instagram:</strong> <a href="${instagramUrl}">${instagramUrl}</a></p>` : ''}
${soundcloudUrl ? `<p><strong>SoundCloud:</strong> <a href="${soundcloudUrl}">${soundcloudUrl}</a></p>` : ''}
${youtubeUrl ? `<p><strong>YouTube:</strong> <a href="${youtubeUrl}">${youtubeUrl}</a></p>` : ''}
</div>
<div style="background:#f8f9fa;padding:20px;border-radius:8px">
<h3 style="margin:0 0 12px;color:#333">Experience:</h3>
<p style="white-space:pre-wrap">${experience}</p>
</div>
</div>`
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Agency signup error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};