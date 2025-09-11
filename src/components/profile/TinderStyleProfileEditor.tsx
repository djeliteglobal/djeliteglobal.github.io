import React, { useState, useEffect } from 'react';
import { Button } from '../platform';
import { getCurrentProfile, updateProfile, uploadProfileImage } from '../../services/profileService';
import { hasAdvancedProfile, hasDirectContact } from '../../services/subscriptionService';
import { DJProfile } from '../../types/profile';

interface TinderStyleProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TinderStyleProfileEditor: React.FC<TinderStyleProfileEditorProps> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState<Partial<DJProfile>>({});
  const [loading, setLoading] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<string[]>(['', '', '']);
  const [hasAdvanced, setHasAdvanced] = useState(false);
  const [hasContact, setHasContact] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProfile();
      checkPremiumFeatures();
    }
  }, [isOpen]);
  
  const checkPremiumFeatures = async () => {
    const [advanced, contact] = await Promise.all([
      hasAdvancedProfile(),
      hasDirectContact()
    ]);
    setHasAdvanced(advanced);
    setHasContact(contact);
  };

  const loadProfile = async () => {
    try {
      const currentProfile = await getCurrentProfile();
      if (currentProfile) {
        setProfile(currentProfile);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number = 0) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadProfileImage(file);
      
      if (index === 0) {
        setProfile({...profile, profile_image_url: imageUrl});
      } else {
        const newImages = [...additionalImages];
        newImages[index - 1] = imageUrl;
        setAdditionalImages(newImages);
      }
    } catch (error: any) {
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        dj_name: profile.dj_name,
        age: profile.age,
        location: profile.location,
        bio: profile.bio,
        profile_image_url: profile.profile_image_url,
        images: [profile.profile_image_url, ...additionalImages].filter(img => img && img.trim()),
        genres: profile.genres || [],
        skills: profile.skills || [],
        venues: profile.venues || [],
        fee: profile.fee,
        website: profile.website,
        social_links: profile.social_links,
        contact_info: profile.contact_info,
        premium_badge: hasAdvanced
      });
      alert('Profile updated successfully!');
      onClose();
    } catch (error: any) {
      alert(`Failed to update profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[color:var(--surface)] rounded-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[color:var(--border)]">
          <button onClick={onClose} className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]">
            ✕
          </button>
          <h2 className="text-xl font-bold text-[color:var(--text-primary)]">Edit Profile</h2>
          <button onClick={handleSave} disabled={loading} className="text-[color:var(--accent)] font-semibold">
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Profile Photos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[color:var(--text-primary)] flex items-center gap-2">
              📸 Profile Photos
            </h3>
            <p className="text-sm text-[color:var(--text-secondary)]">Upload up to 4 photos to get more matches</p>
              
            <div className="grid grid-cols-2 gap-4">
              {/* Main profile picture */}
              <div className="relative aspect-square">
                {profile.profile_image_url ? (
                  <img 
                    src={profile.profile_image_url} 
                    alt="Profile" 
                    className="w-full h-full rounded-xl object-cover border-2 border-[color:var(--accent)]"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-[color:var(--surface-alt)] border-2 border-[color:var(--accent)] flex items-center justify-center">
                    <svg className="w-16 h-16 text-[color:var(--text-secondary)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                )}
                <label className="absolute bottom-2 right-2 w-8 h-8 bg-[color:var(--accent)] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <span className="text-black font-bold text-sm">+</span>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 0)} className="hidden" />
                </label>
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">1</div>
              </div>
              
              {/* Additional 3 pictures */}
              {[1, 2, 3].map((index) => (
                <div key={index} className="relative aspect-square">
                  <img 
                    src={additionalImages[index - 1] || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?blur=20'} 
                    alt={`Photo ${index + 1}`} 
                    className={`w-full h-full rounded-xl object-cover border-2 ${
                      additionalImages[index - 1] ? 'border-[color:var(--accent)]' : 'border-dashed border-[color:var(--border)] opacity-50'
                    }`}
                  />
                  <label className="absolute bottom-2 right-2 w-8 h-8 bg-[color:var(--accent)] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <span className="text-black font-bold text-sm">+</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, index)} className="hidden" />
                  </label>
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">{index + 1}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[color:var(--text-primary)] flex items-center gap-2">
              👤 Basic Info
            </h3>
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">DJ Name</label>
              <input
                type="text"
                value={profile.dj_name || ''}
                onChange={(e) => setProfile({...profile, dj_name: e.target.value})}
                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                placeholder="DJ Awesome"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Age</label>
              <input
                type="number"
                value={profile.age || ''}
                onChange={(e) => setProfile({...profile, age: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                placeholder="25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Location</label>
              <input
                type="text"
                value={profile.location || ''}
                onChange={(e) => setProfile({...profile, location: e.target.value})}
                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                placeholder="New York, NY"
              />
            </div>
          </div>

          {/* Music Style */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[color:var(--text-primary)] flex items-center gap-2">
              🎵 Music Style
            </h3>
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Music Genres</label>
              <input
                type="text"
                value={profile.genres?.join(', ') || ''}
                onChange={(e) => setProfile({...profile, genres: e.target.value.split(',').map(g => g.trim()).filter(g => g)})}
                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                placeholder="House, Techno, Deep House"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Skills</label>
              <input
                type="text"
                value={profile.skills?.join(', ') || ''}
                onChange={(e) => setProfile({...profile, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                placeholder="Mixing, Production, Scratching"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Bio</label>
              <textarea
                value={profile.bio || ''}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none resize-none"
                rows={3}
                placeholder="Tell other DJs about yourself..."
              />
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[color:var(--text-primary)] flex items-center gap-2">
              🎤 Experience
            </h3>
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Venues</label>
              <input
                type="text"
                value={profile.venues?.join(', ') || ''}
                onChange={(e) => setProfile({...profile, venues: e.target.value.split(',').map(v => v.trim()).filter(v => v)})}
                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                placeholder="Club XYZ, Festival ABC"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Typical Fee</label>
              <input
                type="text"
                value={profile.fee || ''}
                onChange={(e) => setProfile({...profile, fee: e.target.value})}
                className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                placeholder="$500-1000 or Negotiable"
              />
            </div>
          </div>

          {/* Premium Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[color:var(--text-primary)] flex items-center gap-2">
              {hasAdvanced ? '✨' : '🔒'} Premium Features
              {hasAdvanced ? (
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  UNLOCKED
                </span>
              ) : (
                <span className="bg-gray-400 text-white px-2 py-1 rounded-full text-xs font-bold">
                  LOCKED
                </span>
              )}
            </h3>
            
            {hasAdvanced ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Website</label>
                  <input
                    type="url"
                    value={profile.website || ''}
                    onChange={(e) => setProfile({...profile, website: e.target.value})}
                    className="w-full px-4 py-3 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                    placeholder="https://your-website.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Social Links</label>
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={profile.social_links?.instagram || ''}
                      onChange={(e) => setProfile({...profile, social_links: {...(profile.social_links || {}), instagram: e.target.value}})}
                      className="w-full px-4 py-2 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-lg focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                      placeholder="Instagram URL"
                    />
                    <input
                      type="url"
                      value={profile.social_links?.soundcloud || ''}
                      onChange={(e) => setProfile({...profile, social_links: {...(profile.social_links || {}), soundcloud: e.target.value}})}
                      className="w-full px-4 py-2 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-lg focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                      placeholder="SoundCloud URL"
                    />
                  </div>
                </div>
                
                {hasContact && (
                  <div>
                    <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">
                      Direct Contact <span className="text-xs text-purple-600">PRO FEATURE</span>
                    </label>
                    <div className="space-y-2">
                      <input
                        type="email"
                        value={profile.contact_info?.email || ''}
                        onChange={(e) => setProfile({...profile, contact_info: {...(profile.contact_info || {}), email: e.target.value}})}
                        className="w-full px-4 py-2 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-lg focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                        placeholder="Contact Email"
                      />
                      <input
                        type="tel"
                        value={profile.contact_info?.phone || ''}
                        onChange={(e) => setProfile({...profile, contact_info: {...(profile.contact_info || {}), phone: e.target.value}})}
                        className="w-full px-4 py-2 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-lg focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <div className="text-4xl mb-2">🔒</div>
                <h4 className="font-bold text-gray-700 mb-2">Premium Features Locked</h4>
                <p className="text-sm text-gray-600 mb-4">Upgrade to Pro to unlock advanced profile features</p>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90">
                  Upgrade to Pro
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};