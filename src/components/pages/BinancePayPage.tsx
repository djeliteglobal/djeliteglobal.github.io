import React, { useState } from 'react';
import { Button } from '../platform';

const BinancePayPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  const plans = {
    monthly: { name: 'Monthly Subscription', price: 29.99, description: 'Access to all DJ Elite features' },
    onetime: { name: 'One-Time Purchase', price: 99.99, description: 'Lifetime access to DJ Elite course' }
  };

  const createBinancePayment = async () => {
    setLoading(true);
    try {
      const plan = plans[selectedPlan];
      const response = await fetch(`${window.location.origin}/.netlify/functions/binance-pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: plan.price,
          currency: 'USDT',
          order_id: `${selectedPlan}_${Date.now()}`,
          description: plan.name
        })
      });
      
      const data = await response.json();
      if (data.checkoutUrl) {
        setPaymentUrl(data.checkoutUrl);
      } else if (data.error) {
        alert('Payment error: ' + data.error);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message);
    }
    setLoading(false);
  };

  if (paymentUrl) {
    window.location.href = paymentUrl;
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[color:var(--bg)] via-gray-900 to-black text-[color:var(--text-primary)]">
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 font-display bg-gradient-to-r from-[color:var(--accent)] to-green-400 bg-clip-text text-transparent">
            Binance Pay
          </h1>
          <p className="text-[color:var(--text-secondary)]">Pay with USDT via Binance</p>
        </div>

        <div className="space-y-6">
          {Object.entries(plans).map(([key, plan]) => (
            <div 
              key={key}
              onClick={() => setSelectedPlan(key)}
              className={`rounded-2xl p-6 border cursor-pointer transition-all duration-300 ${
                selectedPlan === key 
                  ? 'bg-gradient-to-br from-[color:var(--accent)]/20 to-green-400/20 border-[color:var(--accent)] shadow-xl' 
                  : 'bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--surface-alt)] border-[color:var(--border)]/30 hover:border-[color:var(--accent)]/50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-[color:var(--text-primary)] mb-1">{plan.name}</h3>
                  <p className="text-[color:var(--text-secondary)]">{plan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[color:var(--accent)]">${plan.price}</div>
                  <div className="text-sm text-[color:var(--text-secondary)]">≈ {plan.price} USDT</div>
                  {key === 'monthly' && <div className="text-sm text-[color:var(--text-secondary)]">/month</div>}
                </div>
              </div>
            </div>
          ))}
          
          <Button
            onClick={createBinancePayment}
            disabled={loading}
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 text-black"
          >
            {loading ? 'Creating Payment...' : `Pay ${plans[selectedPlan].price} USDT with Binance`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BinancePayPage;
