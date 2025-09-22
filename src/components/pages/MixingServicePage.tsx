import React from 'react';
import { Button } from '../platform';

const MixingServicePage: React.FC = () => {
  const handleStripePayment = async () => {
    try {
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: 'price_mixing',
          amount: 12500,
          successUrl: `${window.location.origin}/audio-services/success`,
          cancelUrl: `${window.location.origin}/mixing-service`,
        }),
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[color:var(--bg)] via-gray-900 to-black text-[color:var(--text-primary)]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto bg-gradient-to-br from-[color:var(--accent)] to-green-400 shadow-2xl">
            <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <h1 className="text-6xl font-bold mb-6 font-display bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Professional Mixing Service
          </h1>
          <p className="text-xl text-[color:var(--text-secondary)] mb-8">
            Transform your raw tracks into polished, radio-ready masterpieces
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <div className="rounded-2xl p-8 bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--surface-alt)] border border-[color:var(--border)]/30 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 font-display">What's Included</h3>
              <ul className="space-y-4">
                {[
                  "Complete balance and EQ optimization",
                  "Professional compression and dynamics",
                  "Spatial effects (reverb, delay, chorus)",
                  "Volume and pan automation",
                  "Up to 3 revisions included",
                  "Detailed mixing notes and feedback"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[color:var(--accent)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[color:var(--accent)] text-sm">✓</span>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl p-8 bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--surface-alt)] border border-[color:var(--border)]/30 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 font-display">Process</h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Upload Your Stems", desc: "Send us your individual track stems" },
                  { step: "2", title: "Initial Mix", desc: "We create the first professional mix" },
                  { step: "3", title: "Revisions", desc: "Up to 3 rounds of feedback and adjustments" },
                  { step: "4", title: "Final Delivery", desc: "Receive your polished, radio-ready mix" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[color:var(--accent)] flex items-center justify-center flex-shrink-0">
                      <span className="text-black font-bold text-sm">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-[color:var(--text-secondary)] text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-2xl p-8 bg-gradient-to-br from-[color:var(--accent)] to-green-400 text-black shadow-2xl">
              <h3 className="text-3xl font-bold mb-4 font-display">Pricing</h3>
              <div className="text-5xl font-black mb-2">$250</div>
              <p className="text-lg mb-6 opacity-90">Professional mixing service</p>
              <div className="bg-black/20 rounded-xl p-4 mb-6">
                <p className="font-semibold">50% deposit required</p>
                <p className="text-sm opacity-80">Pay $125 now, $125 on completion</p>
              </div>
              <Button 
                onClick={handleStripePayment}
                className="w-full py-4 text-lg font-bold bg-black text-[color:var(--accent)] hover:bg-gray-900"
              >
                Pay $125 Deposit
              </Button>
            </div>

            <div className="rounded-2xl p-8 bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--surface-alt)] border border-[color:var(--border)]/30 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 font-display">Delivery Timeline</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Initial mix</span>
                  <span className="text-[color:var(--accent)] font-semibold">3-4 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Revisions (each)</span>
                  <span className="text-[color:var(--accent)] font-semibold">1-2 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Final delivery</span>
                  <span className="text-[color:var(--accent)] font-semibold">5-7 days total</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button 
            variant="secondary"
            onClick={() => window.location.href = '/audio-services'}
            className="px-8 py-4 bg-[color:var(--surface)]/50 backdrop-blur-sm border border-[color:var(--border)]/50"
          >
            ← Back to All Services
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MixingServicePage;