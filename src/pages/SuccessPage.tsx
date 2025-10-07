import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Logo } from '../constants';
import { Button } from '../components';

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<string>('$497');
  
  useEffect(() => {
    const email = searchParams.get('email') || '';
    const amount = searchParams.get('amount') || '497';
    
    setCustomerEmail(email);
    setPaymentAmount(`$${amount}`);
    
    if (email) {
      fetch('/.netlify/functions/send-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName: 'DJ Elite Student' })
      }).catch(console.error);
    }
  }, [searchParams]);
  
  const shareOnSocial = (platform: string) => {
    const text = "Just enrolled in DJ Elite! 🎧 Ready to transform my DJ career! 🚀";
    const url = "https://djelite.site";
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  return (
    <div className="bg-[color:var(--bg)] text-[color:var(--text-primary)] min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl text-center">
        <Logo className="text-3xl mb-6" />
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-4xl font-bold mb-4">Welcome to DJ Elite!</h1>
        <p className="text-xl text-[color:var(--text-secondary)] mb-6">
          Payment confirmed! You now have lifetime access to the complete DJ Elite training program.
        </p>
        
        <div className="bg-[color:var(--surface)] border border-[color:var(--accent)] rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-[color:var(--accent)] mb-2">📧 Payment Confirmation</h3>
          <p className="text-[color:var(--text-secondary)]">
            Amount: <span className="font-bold text-[color:var(--accent)]">{paymentAmount}</span>
            {customerEmail && (
              <><br />Receipt sent to: <span className="font-bold">{customerEmail}</span></>
            )}
          </p>
        </div>
        
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--accent)] mb-4">🚀 What happens next?</h2>
          <ul className="text-left space-y-3 text-[color:var(--text-secondary)]">
            <li className="flex items-start">
              <span className="text-[color:var(--accent)] mr-3 mt-1">✓</span>
              Course access email sent to your inbox (check within 5 minutes)
            </li>
            <li className="flex items-start">
              <span className="text-[color:var(--accent)] mr-3 mt-1">✓</span>
              Start with Module 1: Elite Mindset Foundation
            </li>
            <li className="flex items-start">
              <span className="text-[color:var(--accent)] mr-3 mt-1">✓</span>
              Join our private Discord community (link in welcome email)
            </li>
            <li className="flex items-start">
              <span className="text-[color:var(--accent)] mr-3 mt-1">✓</span>
              Download the DJ Elite mobile app for offline access
            </li>
          </ul>
        </div>
        
        <div className="bg-[color:var(--surface-alt)] rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">📢 Share your journey!</h3>
          <div className="flex justify-center gap-4">
            <button onClick={() => shareOnSocial('twitter')} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
              Twitter
            </button>
            <button onClick={() => shareOnSocial('facebook')} className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors">
              Facebook
            </button>
            <button onClick={() => shareOnSocial('linkedin')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              LinkedIn
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:support@djelite.site" className="bg-[color:var(--accent)] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[color:var(--accent-muted)] transition-colors">
              📧 Contact Support
            </a>
            <Link to="/">
              <Button className="px-6 py-3">
                🏠 Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SuccessPage };
export default SuccessPage;
