import React, { useState, useEffect } from 'react';
import { hasDirectContact } from '../../services/subscriptionService';
import { DJProfile } from '../../types/profile';

interface DirectContactProps {
  profile: DJProfile;
}

export const DirectContact: React.FC<DirectContactProps> = ({ profile }) => {
  const [canContact, setCanContact] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const hasAccess = await hasDirectContact();
      setCanContact(hasAccess);
    };
    checkAccess();
  }, []);

  if (!canContact) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-lg text-white text-center">
        <h4 className="font-bold mb-2">🔒 Direct Contact</h4>
        <p className="text-sm mb-3">Upgrade to Pro to get direct contact information</p>
        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100">
          Upgrade to Pro
        </button>
      </div>
    );
  }

  if (!profile.contact_info?.email && !profile.contact_info?.phone) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <p className="text-gray-600 text-sm">No direct contact info available</p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-green-800 flex items-center">
          <span className="text-green-500 mr-2">✨</span>
          Direct Contact
        </h4>
        <button
          onClick={() => setShowContact(!showContact)}
          className="text-green-600 hover:text-green-800 text-sm font-medium"
        >
          {showContact ? 'Hide' : 'Show'} Contact
        </button>
      </div>
      
      {showContact && (
        <div className="space-y-2">
          {profile.contact_info?.email && (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              <a 
                href={`mailto:${profile.contact_info.email}`}
                className="text-green-700 hover:text-green-900 text-sm"
              >
                {profile.contact_info.email}
              </a>
            </div>
          )}
          
          {profile.contact_info?.phone && (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              <a 
                href={`tel:${profile.contact_info.phone}`}
                className="text-green-700 hover:text-green-900 text-sm"
              >
                {profile.contact_info.phone}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};