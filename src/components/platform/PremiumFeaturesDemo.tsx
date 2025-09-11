import React, { useState, useEffect } from 'react';
import { useMatchStore } from '../../stores/matchStore';
import { ConnectionLimitWarning } from './ConnectionLimitWarning';
import { AdvancedProfileForm } from '../profile/AdvancedProfileForm';
import { PremiumProfileDisplay } from '../profile/PremiumProfileDisplay';
import { getCurrentProfile } from '../../services/profileService';
import { DJProfile } from '../../types/profile';
import '../../index.css';

export const PremiumFeaturesDemo: React.FC = () => {
  const { connectionLimit, loadMatches } = useMatchStore();
  const [profile, setProfile] = useState<DJProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'connections' | 'profile'>('connections');

  useEffect(() => {
    loadMatches();
    getCurrentProfile().then(setProfile);
  }, [loadMatches]);

  const handleProfileUpdate = (updatedProfile: DJProfile) => {
    setProfile(updatedProfile);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Premium Features Demo</h1>
        <p className="text-gray-600">Experience the power of DJ Elite Pro & Elite plans</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('connections')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'connections'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Unlimited Connections
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Advanced Profile
          </button>
        </div>
      </div>

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Connection Management</h2>
            
            {connectionLimit && (
              <ConnectionLimitWarning 
                remaining={connectionLimit.remaining}
                canConnect={connectionLimit.canConnect}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {connectionLimit?.remaining === -1 ? '∞' : connectionLimit?.remaining || 0}
                </div>
                <div className="text-sm text-gray-600">Connections Remaining</div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {connectionLimit?.remaining === -1 ? 'Unlimited' : 'Limited'}
                </div>
                <div className="text-sm text-gray-600">Plan Type</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {connectionLimit?.canConnect ? 'Yes' : 'No'}
                </div>
                <div className="text-sm text-gray-600">Can Connect</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2">🚀 Pro Benefits</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Unlimited DJ connections</li>
                <li>• No daily or monthly limits</li>
                <li>• Connect with as many DJs as you want</li>
                <li>• Build your network without restrictions</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Advanced Profile Settings</h2>
              {profile && (
                <AdvancedProfileForm 
                  profile={profile}
                  onUpdate={handleProfileUpdate}
                />
              )}
            </div>

            {/* Profile Preview */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Profile Preview</h2>
              {profile && <PremiumProfileDisplay profile={profile} />}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-2">✨ Advanced Profile Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Social media links (Instagram, SoundCloud, etc.)</li>
                <li>• Equipment showcase</li>
                <li>• Achievement highlights</li>
                <li>• Portfolio tracks</li>
              </ul>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Direct contact information</li>
                <li>• Premium badge display</li>
                <li>• Professional website link</li>
                <li>• Enhanced profile visibility</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};