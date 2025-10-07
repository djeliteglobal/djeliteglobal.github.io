import React, { useState } from 'react';
import { Button } from '../platform';

const WisePaymentPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [transferResult, setTransferResult] = useState(null);

  const plans = {
    monthly: { name: 'Monthly Subscription', price: 29.99, description: 'Access to all DJ Elite features' },
    onetime: { name: 'One-Time Purchase', price: 99.99, description: 'Lifetime access to DJ Elite course' }
  };

  const createTransfer = async () => {
    setLoading(true);
    try {
      const plan = plans[selectedPlan];
      const response = await fetch(`${window.location.origin}/.netlify/functions/wise-transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceAmount: plan.price,
          targetCurrency: 'USD',
          order_id: `${selectedPlan}_${Date.now()}`,
          order_description: plan.name
        })
      });
      
      const data = await response.json();
      if (data.result) {
        setTransferResult(data.result);
      } else if (data.error) {
        alert('Transfer error: ' + data.error);
      }
    } catch (error) {
      console.error('Transfer error:', error);
      alert('Transfer failed: ' + error.message);
    }
    setLoading(false);
  };

  if (transferResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[color:var(--bg)] via-gray-900 to-black text-[color:var(--text-primary)] flex items-center justify-center">
        <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--surface-alt)] border border-[color:var(--border)]/30 shadow-xl max-w-md">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[color:var(--accent)] to-green-400 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[color:var(--accent)] mb-4">Transfer Created!</h2>
          <p className="text-[color:var(--text-secondary)] mb-4">Transfer ID: {transferResult.wiseTransactionId}</p>
          <p className="text-[color:var(--text-secondary)] mb-6">Status: {transferResult.status}</p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="w-full py-3 bg-gradient-to-r from-[color:var(--accent)] to-green-400"
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[color:var(--bg)] via-gray-900 to-black text-[color:var(--text-primary)]">
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 font-display bg-gradient-to-r from-[color:var(--accent)] to-green-400 bg-clip-text text-transparent">
            Wise Payment
          </h1>
          <p className="text-[color:var(--text-secondary)]">International bank transfer</p>
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
                  {key === 'monthly' && <div className="text-sm text-[color:var(--text-secondary)]">/month</div>}
                </div>
              </div>
            </div>
          ))}
          
          <Button
            onClick={createTransfer}
            disabled={loading}
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-[color:var(--accent)] to-green-400 hover:from-green-400 hover:to-[color:var(--accent)] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Transfer $${plans[selectedPlan].price} via Wise`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WisePaymentPage;
