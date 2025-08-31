import React, { useState, useEffect } from 'react';
import type { Testimonial } from './types';

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'purchase';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseClasses = 'px-8 py-4 rounded-lg font-bold text-base transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4';
  const variantClasses = {
    primary: 'bg-[color:var(--accent)] text-black focus:ring-[color:var(--accent-muted)]/50 shadow-[0_5px_20px_-5px_rgba(0,245,122,0.4)]',
    secondary: 'bg-transparent text-[color:var(--text-primary)] border-2 border-[color:var(--border)] hover:bg-[color:var(--surface-alt)] hover:border-[color:var(--muted)] focus:ring-[color:var(--muted)]/50',
    purchase: 'bg-gradient-to-r from-green-400 to-cyan-500 text-black focus:ring-cyan-400/50 shadow-[0_5px_20px_-5px_rgba(0,245,122,0.4)] text-lg',
  };
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Accordion Item Component
export const AccordionItem: React.FC<{ title: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-lg">
            <button
                className="w-full flex justify-between items-center p-6 text-left"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <div className="text-xl font-bold">{title}</div>
                <span className="text-3xl font-light transform transition-transform duration-300 text-[color:var(--accent)]">
                    {isOpen ? '−' : '+'}
                </span>
            </button>
            {isOpen && (
                <div className="p-6 pt-0 text-[color:var(--text-secondary)]">
                    {children}
                </div>
            )}
        </div>
    );
};

// Testimonial Card Component
export const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
    return (
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="aspect-video bg-[color:var(--surface)] rounded-lg overflow-hidden border border-[color:var(--border)]">
                <video controls poster={testimonial.videoPosterUrl} className="w-full h-full object-cover">
                    <source src={testimonial.videoSrcUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div>
                <blockquote className="text-xl md:text-2xl italic text-[color:var(--text-secondary)]">
                    "{testimonial.quote}"
                </blockquote>
                <div className="mt-6 flex items-center gap-4">
                    <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover" />
                    <div>
                        <h4 className="font-bold text-lg text-[color:var(--text-primary)]">{testimonial.name}</h4>
                        <p className="text-[color:var(--muted)]">{testimonial.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Countdown Timer Component
export const CountdownTimer: React.FC = () => {
    const [targetDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 2); // 2 days from now
        date.setHours(23, 59, 59, 999); // End of the day
        return date;
    });

    const calculateTimeLeft = () => {
        const difference = +targetDate - +new Date();
        let timeLeft = {
            days: 0, hours: 0, minutes: 0, seconds: 0,
        };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const formatTime = (time: number) => time.toString().padStart(2, '0');

    return (
         <div className="flex justify-center gap-2 md:gap-4">
             {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="text-center bg-[color:var(--surface)] border border-[color:var(--border)] p-3 md:p-4 rounded-lg w-20 md:w-24">
                    <span className="font-display text-3xl md:text-4xl font-bold">{formatTime(value)}</span>
                    <span className="block text-xs md:text-sm uppercase text-[color:var(--muted)] mt-1">{unit}</span>
                </div>
             ))}
         </div>
    );
};

export const CheckoutButton: React.FC<{ amount: number; productName: string; }> = ({ amount, productName }) => {
  const handleCheckout = async () => {
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, productName })
    });
    
    const { url } = await response.json();
    window.location.href = url;
  };

  return (
    <Button variant="purchase" className="w-full text-xl py-5" onClick={handleCheckout}>
        <div className="flex flex-col">
            <span>🚀 ENROLL IN DJ ELITE NOW</span>
            <span className="text-xs font-normal mt-1 opacity-80">90-Day Money-Back Guarantee</span>
        </div>
    </Button>
  );
};
