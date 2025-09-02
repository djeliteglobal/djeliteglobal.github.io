import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../constants';
import { Button } from '../components';

const SuccessPage: React.FC = () => {
  return (
    <div className="bg-[color:var(--bg)] text-[color:var(--text-primary)] min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl text-center">
        <Logo className="text-3xl mb-6" />
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-4xl font-bold mb-4">Welcome to DJ Elite!</h1>
        <p className="text-xl text-[color:var(--text-secondary)] mb-6">
          Your payment was successful! You now have access to the complete DJ Elite training program.
        </p>
        <div className="bg-[color:var(--surface)] border border-[color:var(--accent)] rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-[color:var(--accent)] mb-4">What happens next?</h2>
          <ul className="text-left space-y-3 text-[color:var(--text-secondary)]">
            <li className="flex items-start">
              <span className="text-[color:var(--accent)] mr-3 mt-1">✓</span>
              You'll receive an email with your course access within 5 minutes
            </li>
            <li className="flex items-start">
              <span className="text-[color:var(--accent)] mr-3 mt-1">✓</span>
              Check your spam folder if you don't see it in your inbox
            </li>
            <li className="flex items-start">
              <span className="text-[color:var(--accent)] mr-3 mt-1">✓</span>
              Start with Module 1: Elite Mindset to begin your transformation
            </li>
            <li className="flex items-start">
              <span className="text-[color:var(--accent)] mr-3 mt-1">✓</span>
              Join our VIP community for ongoing support and networking
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-[color:var(--muted)]">
            Questions? Email us at support@djelite.site
          </p>
          <Link to="/">
            <Button className="px-8 py-3">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export { SuccessPage };
export default SuccessPage;