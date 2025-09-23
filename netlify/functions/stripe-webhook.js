const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const sig = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Webhook signature verification failed' }),
    };
  }

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        const session = stripeEvent.data.object;
        console.log('Payment successful for session:', session.id);
        
        // Send email confirmation for audio services
        if (session.metadata?.service_type && session.customer_details?.email) {
          const resend = new Resend(process.env.RESEND_API_KEY);
          const serviceNames = {
            'price_mixing': 'Professional Mixing',
            'price_mastering': 'Final Mastering', 
            'price_consulting': 'Production Consulting',
            'price_complete_package': 'Complete Audio Package'
          };
          
          await resend.emails.send({
            from: 'DJ Elite Audio <audio@djelite.site>',
            to: [session.customer_details.email],
            subject: '🎵 Payment Confirmed - DJ Elite Audio Services',
            html: `<div style="max-width:600px;margin:0 auto;font-family:system-ui,sans-serif;background:#1a1d23;color:#fff;border-radius:8px;overflow:hidden">
<div style="background:linear-gradient(135deg,#00f57a 0%,#00c766 100%);padding:32px;text-align:center">
<h1 style="margin:0;font-size:28px;color:#000;font-weight:700">Payment Confirmed! 🎧</h1>
<p style="margin:8px 0 0;color:#000;opacity:0.8">${serviceNames[session.metadata.service_type]} - Deposit Received</p>
</div>
<div style="padding:32px">
<h2 style="color:#00f57a;margin:0 0 20px;font-size:20px">🎯 What's Next:</h2>
<div style="background:#2a2d35;padding:20px;border-radius:6px;margin-bottom:24px">
<p style="margin:0 0 12px;color:#fff">✅ We'll contact you within 24 hours</p>
<p style="margin:0 0 12px;color:#fff">✅ Send project requirements form</p>
<p style="margin:0;color:#fff">✅ Begin work on your track</p>
</div>
<div style="border-top:1px solid #3a3d45;padding-top:20px;margin-top:24px">
<p style="margin:0;color:#b8bcc8">Best regards,<br><strong style="color:#00f57a">DJ Elite Audio Team</strong></p>
</div>
</div>
</div>`
          });
        }
        break;
      
      case 'customer.subscription.updated':
        const subscription = stripeEvent.data.object;
        console.log('Subscription updated:', subscription.id);
        // Update user subscription status
        break;
      
      case 'customer.subscription.deleted':
        const deletedSubscription = stripeEvent.data.object;
        console.log('Subscription cancelled:', deletedSubscription.id);
        // Update user subscription status to cancelled
        break;
      
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Webhook handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};