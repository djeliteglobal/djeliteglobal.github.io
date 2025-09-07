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
        bio: profile.bio,
        genres: profile.genres?.filter(g => g.trim()) || [],
        skills: profile.skills?.filter(s => s.trim()) || [],
        venues: profile.venues?.filter(v => v.trim()) || [],
        fee: profile.fee,
        images: imageUrls.filter(url => url.trim())
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadProfileImage(file);
      setProfile({...profile, profile_image_url: imageUrl});
      // Update first image in array
      const newImageUrls = [...imageUrls];
      newImageUrls[0] = imageUrl;
      setImageUrls(newImageUrls);
      alert('Profile picture uploaded successfully!');
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      alert(`Failed to upload image: ${error.message}`);
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

          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Profile Picture</label>
            <div className="space-y-4">
              {profile.profile_image_url && (
                <div className="flex items-center gap-4">
                  <img 
                    src={profile.profile_image_url} 
                    alt="Current profile" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <span className="text-sm text-[color:var(--text-secondary)]">Current profile picture</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-[color:var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[color:var(--accent)] file:text-black hover:file:bg-[color:var(--accent-muted)]"
              />
              <p className="text-xs text-[color:var(--muted)]">
                Upload a new profile picture (JPG, PNG, GIF up to 2MB)
              </p>
            </div>
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">Additional Images (URLs)</label>
            <div className="space-y-2">
              {imageUrls.slice(1).map((url, index) => (
                <div key={index + 1} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateImageUrl(index + 1, e.target.value)}
                    className="flex-1 px-3 py-2 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-lg focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    onClick={() => removeImageUrl(index + 1)}
                    className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addImageUrl}
                className="text-[color:var(--accent)] hover:text-[color:var(--accent-muted)] text-sm"
              >
                + Add Image URL
              </button>
            </div>
          </div>

          {/* Note: Advanced fields will be added once database schema is updated */}
          <div className="text-sm text-[color:var(--text-secondary)] italic">
            Additional fields (genres, skills, venues, fee) will be available soon.
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