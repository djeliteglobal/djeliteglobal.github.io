import React from 'react';
import { Button } from '../platform';

const ConsultingServicePage: React.FC = () => {
  const handleStripePayment = async () => {
    try {
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: 'price_consulting',
          amount: 5000,
          successUrl: `${window.location.origin}/audio-services/success`,
          cancelUrl: `${window.location.origin}/consulting-service`,
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
              <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H15V1h-2v1H9V1H7v1H4.5C3.67 2 3 2.67 3 3.5v15c0 .83.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5v-15c0-.83-.67-1.5-1.5-1.5zM19 18.5H5V8h14v10.5z"/>
            </svg>
          </div>
          <h1 className="text-6xl font-bold mb-6 font-display bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Production Consulting
          </h1>
          <p className="text-xl text-[color:var(--text-secondary)] mb-8">
            Expert guidance to optimize your tracks for DJ performance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <div className="rounded-2xl p-8 bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--surface-alt)] border border-[color:var(--border)]/30 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 font-display">What's Included</h3>
              <ul className="space-y-4">
                {[
                  "Musical arrangement review",
                  "DJ-optimized structure suggestions",
                  "Transition optimization",
                  "Detailed written feedback",
                  "30-minute video consultation",
                  "Follow-up support via email"
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
              <h3 className="text-2xl font-bold mb-6 font-display">Consultation Areas</h3>
              <div className="space-y-4">
                {[
                  { title: "Track Structure", desc: "Optimize intro, breakdown, and outro sections" },
                  { title: "Energy Flow", desc: "Ensure proper build-ups and drops for DJ sets" },
                  { title: "Key & BPM", desc: "Harmonic mixing compatibility analysis" },
                  { title: "Sound Design", desc: "Element placement and frequency balance" }
                ].map((area, i) => (
                  <div key={i} className="bg-[color:var(--surface-alt)]/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-[color:var(--accent)]">{area.title}</h4>
                    <p className="text-[color:var(--text-secondary)] text-sm">{area.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-2xl p-8 bg-gradient-to-br from-[color:var(--accent)] to-green-400 text-black shadow-2xl">
              <h3 className="text-3xl font-bold mb-4 font-display">Pricing</h3>
              <div className="text-5xl font-black mb-2">$100</div>
              <p className="text-lg mb-6 opacity-90">Production consulting service</p>
              <div className="bg-black/20 rounded-xl p-4 mb-6">
                <p className="font-semibold">50% deposit required</p>
                <p className="text-sm opacity-80">Pay $50 now, $50 on completion</p>
              </div>
              <Button 
                onClick={handleStripePayment}
                className="w-full py-4 text-lg font-bold bg-black text-[color:var(--accent)] hover:bg-gray-900"
              >
                Pay $50 Deposit
              </Button>
            </div>

            <div className="rounded-2xl p-8 bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--surface-alt)] border border-[color:var(--border)]/30 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 font-display">Process</h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Track Submission", desc: "Send us your demo or work-in-progress" },
                  { step: "2", title: "Analysis", desc: "Comprehensive review of arrangement and structure" },
                  { step: "3", title: "Video Call", desc: "30-minute consultation to discuss findings" },
                  { step: "4", title: "Written Report", desc: "Detailed feedback document with actionable advice" }
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

export default ConsultingServicePage;