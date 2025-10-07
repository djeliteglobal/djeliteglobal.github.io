import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMatchStore } from '../../stores/matchStore';
import { ConnectionLimitWarning } from './ConnectionLimitWarning';
import { AdvancedProfileForm } from '../profile/AdvancedProfileForm';
import { PremiumProfileDisplay } from '../profile/PremiumProfileDisplay';
import { getCurrentProfile } from '../../services/profileService';
import { createCheckoutSession, STRIPE_PRICES } from '../../services/stripeService';
import { useAuth } from '../../contexts/ClerkAuthContext';
import { DJProfile } from '../../types/profile';
import '../../index.css';

export const PremiumFeaturesDemo: React.FC = () => {
  const { connectionLimit, loadMatches } = useMatchStore();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<DJProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'connections' | 'profile'>('connections');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMatches();
    getCurrentProfile().then(setProfile);
  }, [loadMatches]);

  const handleProfileUpdate = (updatedProfile: DJProfile) => {
    setProfile(updatedProfile);
  };

  const handleUpgrade = async (planType: string) => {
    if (!currentUser) {
      alert('Please log in to upgrade');
      return;
    }

    // Redirect to embedded checkout
    window.location.href = `/checkout?plan=${planType}`;
  };

  return (
    <div className="min-h-full bg-[color:var(--bg)] text-[color:var(--text-primary)] p-4 sm:p-6 md:p-8 md:ml-64">
      <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
            <path d="M5 16L3 6l5.5 4L12 4l3.5 6L21 6l-2 10H5z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
          </svg>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-[var(--accent)] to-pink-500 bg-clip-text text-transparent">DJ Elite Premium</h1>
        </div>
        <p className="text-xl text-[color:var(--text-secondary)]">Unlock the full power of professional DJ networking</p>
      </div>

      {/* Premium Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-6 text-center">
          <div className="mb-4 flex justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-blue-500">
              <path d="M18.178 8C19.077 8.55 20 9.43 20 11s-.923 2.45-1.822 3C17.23 14.55 16.077 15 15 15s-2.23-.45-3.178-1C10.923 13.45 10 12.57 10 11s.923-2.45 1.822-3C12.77 7.45 13.923 7 15 7s2.23.45 3.178 1zM9 15c-1.077 0-2.23-.45-3.178-1C4.923 13.45 4 12.57 4 11s.923-2.45 1.822-3C6.77 7.45 7.923 7 9 7s2.23.45 3.178 1C13.077 8.55 14 9.43 14 11s-.923 2.45-1.822 3C11.23 14.55 10.077 15 9 15z" fill="currentColor"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Unlimited Connections</h3>
          <p className="text-[color:var(--text-secondary)] text-sm">Connect with unlimited DJs worldwide</p>
        </div>
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-6 text-center">
          <div className="mb-4 flex justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-purple-500">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Super Likes</h3>
          <p className="text-[color:var(--text-secondary)] text-sm">Stand out with premium super likes</p>
        </div>
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-6 text-center">
          <div className="mb-4 flex justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-orange-500">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" fill="currentColor"/>
              <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" fill="currentColor"/>
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Profile Boost</h3>
          <p className="text-[color:var(--text-secondary)] text-sm">Get 10x more profile visibility</p>
        </div>
      </div>

      {/* Premium Benefits */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-yellow-400">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
          </svg>
          <h2 className="text-2xl font-bold text-center text-purple-300">Premium Benefits</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold mb-3 text-[color:var(--accent)]">Networking Features</h3>
            <ul className="space-y-2 text-[color:var(--text-secondary)]">
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Unlimited connections</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Priority matching</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Advanced filters</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> See who liked you</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3 text-[color:var(--accent)]">Profile Features</h3>
            <ul className="space-y-2 text-[color:var(--text-secondary)]">
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Premium badge</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Profile boost</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Social media links</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Portfolio showcase</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-6 text-center">
          <div className="mb-4">
            <div className="w-full h-24 rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/Premium Tiers Images/elite dj .jpg" 
                alt="Free Tier" 
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Free</h3>
          <div className="text-3xl font-bold mb-4">$0</div>
          <ul className="text-sm text-[color:var(--text-secondary)] space-y-2 mb-6">
            <li>5 connections/day</li>
            <li>Basic profile</li>
            <li>Standard matching</li>
          </ul>
          <button className="w-full py-2 border border-[color:var(--border)] rounded-lg">Current Plan</button>
        </div>
        
        <div className="bg-gradient-to-b from-[color:var(--accent)]/10 to-transparent border-2 border-[color:var(--accent)] rounded-xl p-6 text-center relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[color:var(--accent)] text-black px-4 py-1 rounded-full text-sm font-bold">POPULAR</div>
          <div className="mb-4">
            <div className="w-full h-24 rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/Premium Tiers Images/elite dj tier.jpg" 
                alt="Pro DJ Platform" 
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Pro DJ Pass</h3>
          <div className="text-3xl font-bold mb-4">$19<span className="text-sm">/mo</span></div>
          <ul className="text-sm text-[color:var(--text-secondary)] space-y-2 mb-6">
            <li>Unlimited DJ connections</li>
            <li>Premium swipe features</li>
            <li>Priority gig matching</li>
            <li>Enhanced profile visibility</li>
            <li>Direct promoter contact</li>
          </ul>
          <button 
            onClick={() => handleUpgrade('pro')}
            disabled={loading}
            className="w-full py-2 bg-[color:var(--accent)] text-black rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            Subscribe Now
          </button>
        </div>
        
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-6 text-center">
          <div className="mb-4">
            <div className="w-full h-24 rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/Premium Tiers Images/elite dj tier3.jpg" 
                alt="Elite DJ Platform" 
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Elite DJ Pass</h3>
          <div className="text-3xl font-bold mb-4">$49<span className="text-sm">/mo</span></div>
          <ul className="text-sm text-[color:var(--text-secondary)] space-y-2 mb-6">
            <li>Everything in Pro</li>
            <li>VIP gig opportunities</li>
            <li>Personal booking agent</li>
            <li>Advanced performance analytics</li>
            <li>Custom DJ brand tools</li>
          </ul>
          <button 
            onClick={() => handleUpgrade('elite')}
            disabled={loading}
            className="w-full py-2 border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--surface-alt)] transition-colors disabled:opacity-50"
          >
            Subscribe Now
          </button>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="text-center bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Ready to Go Premium?</h2>
        <p className="text-[color:var(--text-secondary)] mb-6">Join thousands of DJs who've upgraded their networking game</p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => handleUpgrade('pro')}
            disabled={loading}
            className="px-8 py-3 bg-[color:var(--accent)] text-black rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            Start Free Trial
          </button>
          <button 
            onClick={() => window.location.href = '/referrals'}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M20 12v10H4V12" stroke="currentColor" strokeWidth="2" fill="none"/>
                <rect x="2" y="7" width="20" height="5" rx="1" fill="currentColor"/>
                <path d="M12 22V7" stroke="white" strokeWidth="2"/>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" stroke="white" strokeWidth="2" fill="none"/>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
              Get Referral Rewards
            </div>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};
