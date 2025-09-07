import React, { useState, useEffect } from 'react';
import { Button } from '../platform';
import { getCurrentProfile, updateProfile, uploadProfileImage } from '../../services/profileService';
import { DJProfile } from '../../types/profile';

interface TinderStyleProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TinderStyleProfileEditor: React.FC<TinderStyleProfileEditorProps> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState<Partial<DJProfile>>({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [additionalImages, setAdditionalImages] = useState<string[]>(['', '', '']);

  const steps = [
    { title: 'Profile Photo', key: 'photo' },
    { title: 'Basic Info', key: 'basic' },
    { title: 'Music Style', key: 'music' },
    { title: 'Experience', key: 'experience' }
  ];

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

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
        fee: profile.fee
      });
      alert('Profile updated successfully!');
      onClose();
    } catch (error: any) {
      alert(`Failed to update profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step.key} className={`w-full h-1 rounded-full mx-1 ${index <= currentStep ? 'bg-[color:var(--accent)]' : 'bg-[color:var(--border)]'}`} />
            ))}
          </div>
          <p className="text-sm text-[color:var(--text-secondary)] text-center">{steps[currentStep].title}</p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[color:var(--text-primary)] text-center mb-2">Add Photos</h3>
                <p className="text-sm text-[color:var(--text-secondary)] text-center mb-6">Upload up to 4 photos to get more matches</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Main profile picture */}
                <div className="relative aspect-square">
                  <img 
                    src={profile.profile_image_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f'} 
                    alt="Profile" 
                    className="w-full h-full rounded-xl object-cover border-2 border-[color:var(--accent)]"
                  />
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
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
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
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
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
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
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
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between p-6 border-t border-[color:var(--border)]">
          <button 
            onClick={prevStep} 
            disabled={currentStep === 0}
            className="px-6 py-2 text-[color:var(--text-secondary)] disabled:opacity-50"
          >
            Back
          </button>
          <button 
            onClick={nextStep} 
            disabled={currentStep === steps.length - 1}
            className="px-6 py-2 bg-[color:var(--accent)] text-black rounded-full font-semibold disabled:opacity-50"
          >
            {currentStep === steps.length - 1 ? 'Done' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};