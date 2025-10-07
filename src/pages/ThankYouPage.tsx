import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../constants';
import { Button } from '../components';

const ThankYouPage: React.FC = () => {
  return (
    <div className="bg-[color:var(--bg)] text-[color:var(--text-primary)] min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <Logo className="text-3xl mb-6" />
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
        <p className="text-[color:var(--text-secondary)] mb-8">
          Thanks for subscribing! You'll receive your free DJ training preview soon.
        </p>
        <Link to="/">
          <Button className="px-8 py-3">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;
