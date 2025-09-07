import React, { useState, useEffect } from 'react';
import { Button } from '../platform';
import { getCurrentProfile, updateProfile, uploadProfileImage } from '../../services/profileService';
import { DJProfile } from '../../types/profile';

interface ProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState<Partial<DJProfile>>({});
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

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
        setImageUrls(currentProfile.images || ['']);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData = {
        dj_name: profile.dj_name,
        age: profile.age,
        location: profile.location,
        bio: profile.bio
      };
      
      await updateProfile(updateData);
      alert('Profile updated successfully!');
      onClose();
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      alert(`Failed to update profile: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };



  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const updateImageUrl = (index: number, url: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = url;
    setImageUrls(newUrls);
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[color:var(--surface)] rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--text-primary)]">Edit Profile</h2>
          <button onClick={onClose} className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]">
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">DJ Name</label>
              <input
                type="text"
                value={profile.dj_name || ''}
                onChange={(e) => setProfile({...profile, dj_name: e.target.value})}
                className="w-full px-3 py-2 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-lg focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                placeholder="Your DJ name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Age</label>
              <input
                type="number"
                value={profile.age || ''}
                onChange={(e) => setProfile({...profile, age: parseInt(e.target.value)})}
                className="w-full px-3 py-2 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-lg focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                placeholder="25"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Location</label>
            <input
              type="text"
              value={profile.location || ''}
              onChange={(e) => setProfile({...profile, location: e.target.value})}
              className="w-full px-3 py-2 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-lg focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
              placeholder="City, Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Bio</label>
            <textarea
              value={profile.bio || ''}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-lg focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
              placeholder="Tell other DJs about yourself..."
            />
          </div>



          {/* Note: Advanced fields will be added once database schema is updated */}
          <div className="bg-[color:var(--surface-alt)] p-4 rounded-lg">
            <p className="text-sm text-[color:var(--text-secondary)] mb-2">
              <strong>Coming Soon:</strong>
            </p>
            <ul className="text-xs text-[color:var(--muted)] space-y-1">
              <li>• Profile picture upload</li>
              <li>• Music genres</li>
              <li>• Skills & specialties</li>
              <li>• Venues you play at</li>
              <li>• Fee information</li>
            </ul>
            <p className="text-xs text-[color:var(--muted)] mt-2 italic">
              Database schema update required
            </p>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <Button onClick={handleSave} disabled={loading} className="flex-1">
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};