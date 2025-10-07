import React from 'react';
import { Button } from '../platform';

const AudioSuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[color:var(--bg)] via-gray-900 to-black text-[color:var(--text-primary)] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[color:var(--accent)] to-green-400 flex items-center justify-center mx-auto mb-8 shadow-2xl">
          <svg className="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
        
        <h1 className="text-5xl font-bold mb-6 font-display bg-gradient-to-r from-[color:var(--accent)] to-green-400 bg-clip-text text-transparent">
          Payment Successful!
        </h1>
        
        <p className="text-xl text-[color:var(--text-secondary)] mb-8 leading-relaxed">
          Thank you for choosing DJ Elite Audio Services. Your deposit has been processed successfully.
        </p>
        
        <div className="rounded-2xl p-8 bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--surface-alt)] border border-[color:var(--border)]/30 shadow-xl mb-8">
          <h3 className="text-2xl font-bold mb-4 font-display">What happens next?</h3>
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[color:var(--accent)] flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-black text-sm font-bold">1</span>
              </div>
              <p>We'll send you a confirmation email with project details within 24 hours</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[color:var(--accent)] flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-black text-sm font-bold">2</span>
              </div>
              <p>Upload your track files through our secure portal</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[color:var(--accent)] flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-black text-sm font-bold">3</span>
              </div>
              <p>Receive your professionally processed track within 5-7 business days</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => window.location.href = '/audio-services'}
            className="px-8 py-4 bg-gradient-to-r from-[color:var(--accent)] to-green-400 text-lg font-semibold"
          >
            Back to Services
          </Button>
          <Button 
            variant="secondary"
            onClick={() => window.open('mailto:audio@djelite.com?subject=Audio Services - Project Details', '_blank')}
            className="px-8 py-4 bg-[color:var(--surface)]/50 backdrop-blur-sm border border-[color:var(--border)]/50"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AudioSuccessPage;
