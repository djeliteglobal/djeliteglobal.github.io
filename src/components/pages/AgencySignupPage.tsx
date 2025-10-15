import React, { useState } from 'react';
import { Button } from '../platform';
import { useAuth } from '../../contexts/ClerkAuthContext';
import { useClerk } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

const AgencySignupPage: React.FC = () => {
  const { currentUser: user, loading: authLoading } = useAuth();
  const { openSignIn } = useClerk();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    djName: '',
    epkUrl: '',
    instagramUrl: '',
    soundcloudUrl: '',
    youtubeUrl: '',
    experience: '',
    ready: false,
    marketingConsent: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authLoading && !user) {
      openSignIn();
      return;
    }
    if (authLoading) return;
    if (!formData.ready || !formData.marketingConsent) return;
    
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/agency-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success('🎧 Application submitted successfully! Redirecting to your profile...');
        setSubmitted(true);
        // Set tour flag and redirect to profile section after 2 seconds
        sessionStorage.setItem('showSwipeTour', 'true');
        setTimeout(() => {
          window.location.href = '/?page=profile';
        }, 2000);
      } else {
        toast.error('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Network error. Please check your connection and try again.');
    }
    setLoading(false);
  };

  const handleInputFocus = () => {
    if (!authLoading && !user) {
      openSignIn();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!authLoading && !user) {
      openSignIn();
      return;
    }
    if (authLoading) return;
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };



  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[color:var(--bg)] via-gray-900 to-black text-[color:var(--text-primary)] flex items-center justify-center">
        <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--surface-alt)] border border-[color:var(--border)]/30 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[color:var(--accent)] to-green-400 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[color:var(--accent)] mb-4">Application Submitted!</h2>
          <p className="text-[color:var(--text-secondary)] text-lg">We'll review your profile and get back to you within 48 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[color:var(--bg)] via-gray-900 to-black text-[color:var(--text-primary)]">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <button
          onClick={() => window.location.href = '/'}
          className="mb-6 flex items-center gap-2 text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back to Platform
        </button>
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 font-display bg-gradient-to-r from-[color:var(--accent)] to-green-400 bg-clip-text text-transparent">
            DJ Elite Agency
          </h1>
          <p className="text-xl text-[color:var(--text-secondary)]">Join our roster of professional DJs</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl p-8 bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--surface-alt)] border border-[color:var(--border)]/30 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-[color:var(--accent)]">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={handleInputFocus}
                required
                className="w-full px-4 py-3 rounded-xl bg-[color:var(--surface-alt)] border border-[color:var(--border)]/50 text-[color:var(--text-primary)] focus:border-[color:var(--accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[color:var(--accent)]">DJ Name *</label>
              <input
                type="text"
                name="djName"
                value={formData.djName}
                onChange={handleChange}
                onFocus={handleInputFocus}
                required
                className="w-full px-4 py-3 rounded-xl bg-[color:var(--surface-alt)] border border-[color:var(--border)]/50 text-[color:var(--text-primary)] focus:border-[color:var(--accent)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-[color:var(--accent)]">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={handleInputFocus}
                required
                className="w-full px-4 py-3 rounded-xl bg-[color:var(--surface-alt)] border border-[color:var(--border)]/50 text-[color:var(--text-primary)] focus:border-[color:var(--accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[color:var(--accent)]">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={handleInputFocus}
                required
                className="w-full px-4 py-3 rounded-xl bg-[color:var(--surface-alt)] border border-[color:var(--border)]/50 text-[color:var(--text-primary)] focus:border-[color:var(--accent)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-[color:var(--accent)]">EPK URL</label>
            <input
              type="url"
              name="epkUrl"
              value={formData.epkUrl}
              onChange={handleChange}
              onFocus={handleInputFocus}
              placeholder="https://your-epk-link.com"
              className="w-full px-4 py-3 rounded-xl bg-[color:var(--surface-alt)] border border-[color:var(--border)]/50 text-[color:var(--text-primary)] focus:border-[color:var(--accent)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-[color:var(--accent)]">Instagram</label>
              <input
                type="url"
                name="instagramUrl"
                value={formData.instagramUrl}
                onChange={handleChange}
                onFocus={handleInputFocus}
                placeholder="https://instagram.com/yourname"
                className="w-full px-4 py-3 rounded-xl bg-[color:var(--surface-alt)] border border-[color:var(--border)]/50 text-[color:var(--text-primary)] focus:border-[color:var(--accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[color:var(--accent)]">SoundCloud</label>
              <input
                type="url"
                name="soundcloudUrl"
                value={formData.soundcloudUrl}
                onChange={handleChange}
                onFocus={handleInputFocus}
                placeholder="https://soundcloud.com/yourname"
                className="w-full px-4 py-3 rounded-xl bg-[color:var(--surface-alt)] border border-[color:var(--border)]/50 text-[color:var(--text-primary)] focus:border-[color:var(--accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[color:var(--accent)]">YouTube</label>
              <input
                type="url"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
                onFocus={handleInputFocus}
                placeholder="https://youtube.com/yourname"
                className="w-full px-4 py-3 rounded-xl bg-[color:var(--surface-alt)] border border-[color:var(--border)]/50 text-[color:var(--text-primary)] focus:border-[color:var(--accent)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-[color:var(--accent)]">Experience *</label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              onFocus={handleInputFocus}
              required
              rows={4}
              placeholder="Tell us about your DJ experience, clubs you've played at, tracks you've released..."
              className="w-full px-4 py-3 rounded-xl bg-[color:var(--surface-alt)] border border-[color:var(--border)]/50 text-[color:var(--text-primary)] focus:border-[color:var(--accent)] focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="rounded-xl p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="marketingConsent"
                  checked={formData.marketingConsent}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  required
                  className="mt-1 w-5 h-5 rounded border-2 border-purple-500 bg-transparent checked:bg-purple-500 focus:outline-none"
                />
                <div>
                  <div className="font-semibold text-purple-400 mb-1">Marketing Communications Consent *</div>
                  <div className="text-sm text-[color:var(--text-secondary)]">
                    I consent to receive marketing communications and promotional materials from DJ Elite and our commercial partners via email for business development and networking opportunities.
                  </div>
                </div>
              </label>
            </div>

            <div className="rounded-xl p-6 bg-gradient-to-br from-[color:var(--accent)]/10 to-green-400/10 border border-[color:var(--accent)]/20">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="ready"
                  checked={formData.ready}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  className="mt-1 w-5 h-5 rounded border-2 border-[color:var(--accent)] bg-transparent checked:bg-[color:var(--accent)] focus:outline-none"
                />
                <div>
                  <div className="font-semibold text-[color:var(--accent)] mb-1">I confirm I'm ready for professional representation</div>
                  <div className="text-sm text-[color:var(--text-secondary)]">
                    I have played in more than 10 clubs OR released 2+ tracks and feel ready for agency representation
                  </div>
                </div>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !formData.ready || !formData.marketingConsent}
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-[color:var(--accent)] to-green-400 hover:from-green-400 hover:to-[color:var(--accent)] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AgencySignupPage;
