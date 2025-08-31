# Arquitectura Segura para APIs - Guía Completa

## 🚨 NUNCA hagas esto (lo que Roo Code te está sugiriendo):
```bash
# ❌ MAL - Estas variables son visibles públicamente
VITE_STRIPE_SECRET_KEY="sk_live_..." 
VITE_SYSTEMEIO_API_KEY="api_key_..."
```

## ✅ Arquitectura Correcta:

### 1. Frontend (Vite/React) - SOLO keys públicas
```bash
# .env.local (Frontend)
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."
VITE_BUY_ME_A_COFFEE_USERNAME="tu_username"
# NO pongas secret keys aquí
```

### 2. Backend Serverless (Vercel Functions)
```bash
# Variables de entorno en Vercel Dashboard
STRIPE_SECRET_KEY="sk_live_..."
SYSTEMEIO_API_KEY="api_key_..."
WEBHOOK_SECRET="whsec_..."
```

## Estructura del Proyecto Seguro:

```
mi-proyecto/
├── src/                          # Frontend (público)
│   ├── components/
│   ├── pages/
│   └── main.tsx
├── api/                          # Backend serverless (privado)
│   ├── stripe-checkout.ts
│   ├── systemeio-webhook.ts
│   └── payments.ts
├── .env.local                    # Solo keys públicas
└── vercel.json                   # Configuración
```

## Código de Ejemplo - Frontend Seguro:

### components/CheckoutButton.tsx
```typescript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function CheckoutButton({ amount, productName }) {
  const handleCheckout = async () => {
    // Llamar a TU endpoint, no directamente a Stripe
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, productName })
    });
    
    const { url } = await response.json();
    window.location.href = url;
  };

  return <button onClick={handleCheckout}>Pagar ${amount}</button>;
}
```

## Backend Serverless Seguro:

### api/create-checkout-session.ts (Vercel Function)
```typescript
import Stripe from 'stripe';

// Secret key solo en el servidor
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, productName } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: productName },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
      metadata: { productName },
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### api/systemeio-webhook.ts (Después del pago)
```typescript
export default async function handler(req, res) {
  // Webhook de Stripe para notificaciones seguras
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.WEBHOOK_SECRET;
  
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Agregar a Systeme.io CRM
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
```

## Deployment Seguro:

### 1. Vercel (Recomendado)
```bash
# 1. Deploy tu código
vercel --prod

# 2. Agregar variables de entorno en dashboard.vercel.com
# Environment Variables:
# STRIPE_SECRET_KEY = sk_live_...
# SYSTEMEIO_API_KEY = tu_api_key
# WEBHOOK_SECRET = whsec_...
```

### 2. Netlify Functions
```bash
# netlify.toml
[build]
  functions = "netlify/functions"

# Agregar variables en app.netlify.com > Site settings > Environment variables
```

## Prompt Correcto para Roo Code:

```
Necesito que crees una aplicación web con esta arquitectura SEGURA:

1. FRONTEND (React/Vite):
   - Solo usar VITE_STRIPE_PUBLISHABLE_KEY (es segura, es pública)
   - Componentes que llamen a MIS endpoints (/api/...), NO directamente a APIs externas
   - Buy Me a Coffee como simple link/botón

2. BACKEND (Vercel Functions en /api/):
   - create-checkout-session.ts: Crear sesiones de Stripe
   - webhook-handler.ts: Manejar pagos exitosos y agregar a Systeme.io
   - Todas las secret keys SOLO en variables de entorno del servidor

3. DEPLOYMENT:
   - Frontend: Vercel/Netlify
   - Variables secretas: En el dashboard de la plataforma, NO en código

4. INTEGRACIÓN:
   - Stripe: Checkout Sessions + Webhooks
   - Systeme.io: API calls desde webhook
   - Buy Me a Coffee: Link simple

NO uses VITE_ para secret keys. NO expongas APIs en el frontend. 
Crea la separación correcta frontend/backend.
```

## ¿Por qué es mejor?
- **Seguridad**: Secret keys nunca tocan el navegador
- **Escalabilidad**: Serverless se escala automáticamente
- **Costo**: Completamente gratis hasta miles de requests
- **Mantenimiento**: No necesitas servidor corriendo 24/7

¿Quieres que te ayude a configurar alguna parte específica?