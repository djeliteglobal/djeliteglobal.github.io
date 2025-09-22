import React from 'react';
import { Button } from '../platform';

const MasteringServicePage: React.FC = () => {
  const handleStripePayment = async () => {
    try {
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: 'price_mastering',
          amount: 5000,
          successUrl: `${window.location.origin}/audio-services/success`,
          cancelUrl: `${window.location.origin}/mastering-service`,
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
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-6xl font-bold mb-6 font-display bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Final Mastering Service
          </h1>
          <p className="text-xl text-[color:var(--text-secondary)] mb-8">
            Give your tracks the final polish for commercial release
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <div className="rounded-2xl p-8 bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--surface-alt)] border border-[color:var(--border)]/30 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 font-display">What's Included</h3>
              <ul className="space-y-4">
                {[
                  "Corrective and musical EQ",
                  "Multiband compression",
                  "Volume maximization (industry LUFS)",
                  "Complete spectral analysis",
                  "Multiple format delivery",
                  "Before/after comparison files"
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
              <h3 className="text-2xl font-bold mb-6 font-display">Technical Standards</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "LUFS Target", value: "-14 to -6" },
                  { label: "Peak Level", value: "-0.1 dBFS" },
                  { label: "Formats", value: "WAV, MP3, FLAC" },
                  { label: "Sample Rate", value: "Up to 96kHz" }
                ].map((spec, i) => (
                  <div key={i} className="bg-[color:var(--surface-alt)]/50 rounded-lg p-3">
                    <div className="text-sm text-[color:var(--text-secondary)]">{spec.label}</div>
                    <div className="font-semibold text-[color:var(--accent)]">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-2xl p-8 bg-gradient-to-br from-[color:var(--accent)] to-green-400 text-black shadow-2xl">
              <h3 className="text-3xl font-bold mb-4 font-display">Pricing</h3>
              <div className="text-5xl font-black mb-2">$100</div>
              <p className="text-lg mb-6 opacity-90">Professional mastering service</p>
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
              <h3 className="text-2xl font-bold mb-6 font-display">File Requirements</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Preferred Format</h4>
                  <p className="text-[color:var(--text-secondary)] text-sm">24-bit WAV or AIFF, 44.1kHz or higher</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Peak Levels</h4>
                  <p className="text-[color:var(--text-secondary)] text-sm">Leave 3-6dB of headroom for optimal processing</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">File Naming</h4>
                  <p className="text-[color:var(--text-secondary)] text-sm">Artist - Track Title - Version</p>
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

export default MasteringServicePage;