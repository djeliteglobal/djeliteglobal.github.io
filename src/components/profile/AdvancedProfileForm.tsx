import React, { useState, useEffect } from 'react';
import { hasAdvancedProfile, hasDirectContact } from '../../services/subscriptionService';
import { updateProfile, getCurrentProfile } from '../../services/profileService';
import { DJProfile } from '../../types/profile';

interface AdvancedProfileFormProps {
  profile: DJProfile;
  onUpdate: (profile: DJProfile) => void;
}

export const AdvancedProfileForm: React.FC<AdvancedProfileFormProps> = ({ profile, onUpdate }) => {
  const [hasAdvanced, setHasAdvanced] = useState(false);
  const [hasContact, setHasContact] = useState(false);
  const [formData, setFormData] = useState({
    website: profile.website || '',
    social_links: {
      instagram: profile.social_links?.instagram || '',
      soundcloud: profile.social_links?.soundcloud || '',
      spotify: profile.social_links?.spotify || '',
      youtube: profile.social_links?.youtube || ''
    },
    equipment: profile.equipment || [],
    achievements: profile.achievements || [],
    contact_info: {
      email: profile.contact_info?.email || '',
      phone: profile.contact_info?.phone || ''
    }
  });

  useEffect(() => {
    const checkPermissions = async () => {
      const [advanced, contact] = await Promise.all([
        hasAdvancedProfile(),
        hasDirectContact()
      ]);
      setHasAdvanced(advanced);
      setHasContact(contact);
    };
    checkPermissions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedProfile = await updateProfile({
        ...formData,
        premium_badge: hasAdvanced
      });
      onUpdate(updatedProfile);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const addEquipment = () => {
    setFormData(prev => ({
      ...prev,
      equipment: [...prev.equipment, '']
    }));
  };

  const updateEquipment = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.map((item, i) => i === index ? value : item)
    }));
  };

  const removeEquipment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }));
  };

  if (!hasAdvanced) {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg text-white text-center">
        <h3 className="text-xl font-bold mb-2">🚀 Upgrade to Pro</h3>
        <p className="mb-4">Unlock advanced profile features including social links, equipment showcase, and achievements!</p>
        <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
          Upgrade Now
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg text-white text-center">
        <span className="text-lg font-bold">✨ PRO FEATURES</span>
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-medium mb-2">Website</label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
          className="w-full p-3 border rounded-lg"
          placeholder="https://your-website.com"
        />
      </div>

      {/* Social Links */}
      <div>
        <label className="block text-sm font-medium mb-2">Social Links</label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="url"
            value={formData.social_links.instagram}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              social_links: { ...prev.social_links, instagram: e.target.value }
            }))}
            className="p-3 border rounded-lg"
            placeholder="Instagram URL"
          />
          <input
            type="url"
            value={formData.social_links.soundcloud}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              social_links: { ...prev.social_links, soundcloud: e.target.value }
            }))}
            className="p-3 border rounded-lg"
            placeholder="SoundCloud URL"
          />
          <input
            type="url"
            value={formData.social_links.spotify}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              social_links: { ...prev.social_links, spotify: e.target.value }
            }))}
            className="p-3 border rounded-lg"
            placeholder="Spotify URL"
          />
          <input
            type="url"
            value={formData.social_links.youtube}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              social_links: { ...prev.social_links, youtube: e.target.value }
            }))}
            className="p-3 border rounded-lg"
            placeholder="YouTube URL"
          />
        </div>
      </div>

      {/* Equipment */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Equipment</label>
          <button
            type="button"
            onClick={addEquipment}
            className="text-purple-600 hover:text-purple-800"
          >
            + Add Equipment
          </button>
        </div>
        {formData.equipment.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateEquipment(index, e.target.value)}
              className="flex-1 p-3 border rounded-lg"
              placeholder="e.g., Pioneer CDJ-2000NXS2"
            />
            <button
              type="button"
              onClick={() => removeEquipment(index)}
              className="text-red-500 hover:text-red-700 px-3"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Contact Info (Pro+ only) */}
      {hasContact && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Direct Contact Info 
            <span className="text-xs text-purple-600 ml-2">PRO FEATURE</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="email"
              value={formData.contact_info.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contact_info: { ...prev.contact_info, email: e.target.value }
              }))}
              className="p-3 border rounded-lg"
              placeholder="Contact Email"
            />
            <input
              type="tel"
              value={formData.contact_info.phone}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contact_info: { ...prev.contact_info, phone: e.target.value }
              }))}
              className="p-3 border rounded-lg"
              placeholder="Phone Number"
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90"
      >
        Save Advanced Profile
      </button>
    </form>
  );
};