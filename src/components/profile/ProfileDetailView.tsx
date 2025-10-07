import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Opportunity } from '../../types/platform';

interface ProfileDetailViewProps {
  profile: Opportunity;
  isVisible: boolean;
  onClose: () => void;
  onSwipe: (direction: 'left' | 'right' | 'super') => void;
}

export const ProfileDetailView: React.FC<ProfileDetailViewProps> = ({
  profile,
  isVisible,
  onClose,
  onSwipe
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = profile.images || [profile.imageUrl];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="h-full overflow-y-auto">
            <motion.div
              className="min-h-full bg-[color:var(--bg)] text-[color:var(--text-primary)]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-[color:var(--surface)]/80 backdrop-blur-sm border-b border-[color:var(--border)] p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{profile.title}</h2>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 bg-[color:var(--surface)] rounded-full flex items-center justify-center hover:bg-[color:var(--border)] transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Image Gallery */}
              <div className="relative h-96">
                <img
                  src={images[currentImageIndex]}
                  alt={profile.title}
                  className="w-full h-full object-cover"
                />
                
                {images.length > 1 && (
                  <>
                    <div className="absolute top-4 left-4 right-4 flex gap-1">
                      {images.map((_, index) => (
                        <div
                          key={index}
                          className={`h-1 flex-1 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white"
                    >
                      →
                    </button>
                  </>
                )}
              </div>

              {/* Profile Info */}
              <div className="p-6 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{profile.title}</h1>
                  <p className="text-xl text-[color:var(--text-secondary)]">{profile.venue} • {profile.location}</p>
                </div>

                {/* Genres */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Music Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.genres.map(genre => (
                      <span
                        key={genre}
                        className="bg-[color:var(--accent)]/20 text-[color:var(--accent)] px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">About</h3>
                  <p className="text-[color:var(--text-secondary)] leading-relaxed">{profile.bio}</p>
                </div>

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map(skill => (
                        <span
                          key={skill}
                          className="bg-[color:var(--surface)] border border-[color:var(--border)] px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Match Insights */}
                {profile.matchReasons && profile.matchReasons.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">✨ Why You Match</h3>
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30">
                      {profile.matchScore && (
                        <div className="mb-3">
                          <span className="text-sm font-bold text-purple-300">
                            {profile.matchScore}% Compatible
                          </span>
                        </div>
                      )}
                      <div className="space-y-2">
                        {profile.matchReasons.map((reason, idx) => (
                          <p key={idx} className="text-sm text-purple-100 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-purple-300 rounded-full"></span>
                            {reason}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Fee */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Fee</h3>
                  <p className="text-2xl font-bold text-[color:var(--accent)]">{profile.fee}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-[color:var(--surface)] border-t border-[color:var(--border)] p-4">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => onSwipe('left')}
                    className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white text-xl hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                  <button
                    onClick={() => onSwipe('super')}
                    className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xl hover:bg-yellow-600 transition-colors"
                  >
                    ⭐
                  </button>
                  <button
                    onClick={() => onSwipe('right')}
                    className="w-16 h-16 bg-[color:var(--accent)] rounded-full flex items-center justify-center text-black text-2xl hover:bg-[color:var(--accent-muted)] transition-colors"
                  >
                    ♥
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
