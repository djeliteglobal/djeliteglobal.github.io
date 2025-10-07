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
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentProfile = profiles[currentIndex];
  if (!currentProfile || !currentProfile.photos?.length) return <div className="text-center text-[color:var(--text-secondary)]">No more profiles</div>;

  const handleSwipe = (direction: 'like' | 'pass') => {
    onSwipe(currentProfile.id, direction);
    setCurrentIndex(prev => prev + 1);
    setPhotoIndex(0);
    setImageError(false);
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
          {imageError ? (
            <div className="w-full h-full bg-[color:var(--surface-alt)] flex items-center justify-center text-[color:var(--text-secondary)]">
              Image unavailable
            </div>
          ) : (
            <img 
              src={currentProfile.photos[photoIndex]} 
              alt={currentProfile.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
          )}
          
          {/* Photo navigation */}
          <div className="absolute inset-0 flex">
            <button 
              onClick={prevPhoto} 
              className="flex-1 hover:bg-black/10 transition-colors"
              aria-label="Previous photo"
            />
            <button 
              onClick={nextPhoto} 
              className="flex-1 hover:bg-black/10 transition-colors"
              aria-label="Next photo"
            />
          </div>
          
          {/* Navigation arrows */}
          {currentProfile.photos.length > 1 && (
            <>
              <button 
                onClick={prevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                aria-label="Previous photo"
              >
                ←
              </button>
              <button 
                onClick={nextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                aria-label="Next photo"
              >
                →
              </button>
            </>
          )}
          
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
          className="w-14 h-14 bg-[#40E0D0] rounded-full flex items-center justify-center text-black hover:bg-[#20B2AA] transition-colors"
        >
          <HeartIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
