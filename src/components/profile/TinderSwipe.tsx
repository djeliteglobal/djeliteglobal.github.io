import React, { useState, useRef } from 'react';
import { HeartIcon, XIcon } from '../../constants/platform';

interface DJProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  genres: string[];
  location: string;
}

interface TinderSwipeProps {
  profiles: DJProfile[];
  onSwipe: (profileId: string, direction: 'like' | 'pass') => void;
}

export const TinderSwipe: React.FC<TinderSwipeProps> = ({ profiles, onSwipe }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentProfile = profiles[currentIndex];
  if (!currentProfile) return <div className="text-center text-[color:var(--text-secondary)]">No more profiles</div>;

  const handleSwipe = (direction: 'like' | 'pass') => {
    onSwipe(currentProfile.id, direction);
    setCurrentIndex(prev => prev + 1);
    setPhotoIndex(0);
  };

  const nextPhoto = () => {
    setPhotoIndex(prev => (prev + 1) % currentProfile.photos.length);
  };

  const prevPhoto = () => {
    setPhotoIndex(prev => prev === 0 ? currentProfile.photos.length - 1 : prev - 1);
  };

  return (
    <div className="max-w-sm mx-auto">
      <div ref={cardRef} className="relative h-[600px] bg-[color:var(--surface)] rounded-xl overflow-hidden shadow-lg">
        <div className="relative h-2/3">
          <img 
            src={currentProfile.photos[photoIndex]} 
            alt={currentProfile.name}
            className="w-full h-full object-cover"
          />
          
          {/* Photo navigation */}
          <div className="absolute inset-0 flex">
            <button onClick={prevPhoto} className="flex-1" />
            <button onClick={nextPhoto} className="flex-1" />
          </div>
          
          {/* Photo indicators */}
          <div className="absolute top-4 left-4 right-4 flex gap-1">
            {currentProfile.photos.map((_, i) => (
              <div key={i} className={`flex-1 h-1 rounded ${i === photoIndex ? 'bg-white' : 'bg-white/30'}`} />
            ))}
          </div>
        </div>

        <div className="p-4 h-1/3">
          <h3 className="text-xl font-bold text-[color:var(--text-primary)]">
            {currentProfile.name}, {currentProfile.age}
          </h3>
          <p className="text-sm text-[color:var(--text-secondary)] mb-2">{currentProfile.location}</p>
          <p className="text-sm text-[color:var(--text-secondary)] mb-3 line-clamp-2">{currentProfile.bio}</p>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {currentProfile.genres.slice(0, 3).map(genre => (
              <span key={genre} className="px-2 py-1 bg-[color:var(--accent)] text-black text-xs rounded-full">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={() => handleSwipe('pass')}
          className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleSwipe('like')}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors"
        >
          <HeartIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};