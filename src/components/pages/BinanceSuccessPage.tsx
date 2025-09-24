import React from 'react';
import { Button } from '../platform';

const BinanceSuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[color:var(--bg)] via-gray-900 to-black text-[color:var(--text-primary)] flex items-center justify-center">
      <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--surface-alt)] border border-[color:var(--border)]/30 shadow-xl max-w-md">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-[color:var(--accent)] mb-4">Payment Successful!</h1>
        <p className="text-[color:var(--text-secondary)] mb-6">Your USDT payment via Binance Pay has been confirmed</p>
        <Button 
          onClick={() => window.location.href = '/'}
          className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold"
        >
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default BinanceSuccessPage;