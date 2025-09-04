import React, { useState } from 'react';
import { TinderSwipe } from '../profile/TinderSwipe';
import { ProfileEditor } from '../profile/ProfileEditor';

const MOCK_DJ_PROFILES = [
  {
    id: '1',
    name: 'Sarah Mix',
    age: 26,
    bio: 'House & Techno DJ from Berlin. Love underground vibes and late-night sets. Looking for collaboration opportunities!',
    photos: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'
    ],
    genres: ['House', 'Techno', 'Deep House'],
    location: 'Berlin, Germany'
  },
  {
    id: '2',
    name: 'Mike Bass',
    age: 29,
    bio: 'Drum & Bass producer and DJ. 10+ years experience. Always down for back-to-back sets and studio sessions.',
    photos: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f'
    ],
    genres: ['Drum & Bass', 'Jungle', 'Breakbeat'],
    location: 'London, UK'
  },
  {
    id: '3',
    name: 'Luna Trance',
    age: 24,
    bio: 'Trance & Progressive DJ. Festival regular. Love connecting with crowds through uplifting melodies.',
    photos: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'
    ],
    genres: ['Trance', 'Progressive', 'Uplifting'],
    location: 'Amsterdam, NL'
  }
];

export const DJMatchingPage: React.FC = () => {
  const [view, setView] = useState<'swipe' | 'profile'>('swipe');
  const [profiles, setProfiles] = useState(MOCK_DJ_PROFILES);

  const handleSwipe = (profileId: string, direction: 'like' | 'pass') => {
    const sanitizedId = profileId.replace(/[\r\n\t]/g, '');
    console.log(`${direction} on ${sanitizedId}`);
    setProfiles(prev => prev.filter(p => p.id !== profileId));
  };

  const getTabButtonClass = (isActive: boolean) => {
    const baseClass = 'px-4 py-2 rounded-lg transition-colors';
    const activeClass = 'bg-[color:var(--accent)] text-black';
    const inactiveClass = 'bg-[color:var(--surface-alt)] text-[color:var(--text-secondary)]';
    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">DJ Connect</h1>
          <p className="text-[color:var(--text-secondary)]">Find DJs to collaborate with</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setView('swipe')}
            className={getTabButtonClass(view === 'swipe')}
          >
            Discover
          </button>
          <button
            onClick={() => setView('profile')}
            className={getTabButtonClass(view === 'profile')}
          >
            My Profile
          </button>
        </div>
      </div>

      {view === 'swipe' ? (
        <div className="flex justify-center">
          <TinderSwipe profiles={profiles} onSwipe={handleSwipe} />
        </div>
      ) : (
        <ProfileEditor />
      )}
    </div>
  );
};