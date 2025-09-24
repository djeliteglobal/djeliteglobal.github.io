import React, { useState } from 'react';
import { Button } from '../platform';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from '../auth/AuthModal';

const AgencySignupPage: React.FC = () => {
  const { user, signInWithGoogle } = useAuth();
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
    ready: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (!formData.ready) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${window.location.origin}/.netlify/functions/agency-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
    setLoading(false);
  };

  const handleInputFocus = () => {
    if (!user) {
      setShowLoginModal(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
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

          <div className="rounded-xl p-6 bg-gradient-to-br from-[color:var(--accent)]/10 to-green-400/10 border border-[color:var(--accent)]/20">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="ready"
                checked={formData.ready}
                onChange={handleChange}
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

          <Button
            type="submit"
            disabled={loading || !formData.ready}
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-[color:var(--accent)] to-green-400 hover:from-green-400 hover:to-[color:var(--accent)] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      </div>
    </div>
  );
};

export default AgencySignupPage;