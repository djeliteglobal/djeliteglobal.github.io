
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export default async function handler(req, res) {
  // Webhook from Stripe for secure notifications
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Add to Systeme.io CRM
      await fetch('https://api.systeme.io/api/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SYSTEMEIO_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: session.customer_details.email,
          name: session.customer_details.name,
          tags: ['paid-customer']
        })
      });
    }
    
    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
