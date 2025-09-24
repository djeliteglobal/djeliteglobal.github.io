import React, { useState, useEffect } from 'react';

export const SwipeTour: React.FC = () => {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Check if user came from agency signup
    const urlParams = new URLSearchParams(window.location.search);
    const fromAgency = urlParams.get('from') === 'agency' || sessionStorage.getItem('showSwipeTour');
    
    if (fromAgency) {
      // Show tour after a short delay
      setTimeout(() => setShowTour(true), 1000);
      sessionStorage.removeItem('showSwipeTour');
    }
  }, []);

  if (!showTour) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--surface-alt)] p-6 rounded-2xl border border-[color:var(--border)]/30 shadow-xl max-w-sm mx-4 text-center">
        <div className="text-4xl mb-4">👋</div>
        <h3 className="text-xl font-bold text-[color:var(--accent)] mb-3">Welcome to DJ Elite!</h3>
        <p className="text-[color:var(--text-secondary)] mb-4">
          Head to the <span className="text-[color:var(--accent)] font-semibold">Swipe</span> section to match with promoters and DJs for amazing opportunities!
        </p>
        <button
          onClick={() => setShowTour(false)}
          className="w-full py-2 bg-gradient-to-r from-[color:var(--accent)] to-green-400 text-black font-semibold rounded-lg hover:from-green-400 hover:to-[color:var(--accent)] transition-all duration-300"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};