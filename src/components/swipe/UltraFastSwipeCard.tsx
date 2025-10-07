import React, { useState, useCallback, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import { useMatchStore } from '../../stores/matchStore';
import { UpgradeModal } from '../premium/UpgradeModal';
import { DJHirePayment } from '../DJHirePayment';
import type { Opportunity } from '../../types/platform';

interface UltraFastSwipeCardProps {
  opportunity: Opportunity;
  onSwipe: (direction: 'left' | 'right' | 'super') => void;
  onCardLeftScreen: (id: string) => void;
  onOpenProfile?: () => void;
}

export const UltraFastSwipeCard: React.FC<UltraFastSwipeCardProps> = ({ 
  opportunity, 
  onSwipe, 
  onCardLeftScreen,
  onOpenProfile
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const images = opportunity.images || [opportunity.imageUrl];
  const totalImages = images.length;
  const { checkCanConnect } = useMatchStore();

  const [{ x, y, rotate, scale }, api] = useSpring(() => ({ 
    x: 0, 
    y: 0,
    rotate: 0, 
    scale: 1 
  }));

  const bind = useDrag(useCallback(({ 
    down, 
    movement: [mx, my]
  }) => {
    const trigger = Math.abs(mx) > 80;
    const dir = mx > 0 ? 1 : -1;
    
    if (!down && trigger) {
      const direction = dir > 0 ? 'right' : 'left';
      
      // Immediate swipe without waiting for API
      onSwipe(direction);
      api.start({ 
        x: dir * 800, 
        rotate: dir * 20, 
        scale: 0.9,
        config: { tension: 200, friction: 20 }
      });
      setTimeout(() => onCardLeftScreen(opportunity.id), 200);
      
      // Check connection limit in background (non-blocking)
      if (direction === 'right') {
        checkCanConnect().then(canConnect => {
          if (!canConnect) {
            setTimeout(() => {
              setShowUpgradeModal(true);
            }, 500);
          }
        }).catch(() => {});
      }
    } else if (!down && my < -80) {
      // Super like gesture (upward swipe)
      onSwipe('super');
      api.start({ 
        y: -400, 
        x: 0,
        rotate: 0, 
        scale: 0.8,
        config: { tension: 200, friction: 20 }
      });
      setTimeout(() => onCardLeftScreen(opportunity.id), 200);
    } else {
      api.start({ 
        x: down ? mx : 0,
        y: down ? my : 0, 
        rotate: down ? mx / 15 : 0,
        scale: down ? 1.02 : 1,
        config: { tension: 300, friction: 30 }
      });
    }
  }, [api, onSwipe, onCardLeftScreen, opportunity.id, checkCanConnect]));

  const handleImageTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    const cardWidth = rect.width;
    
    if (tapX < cardWidth / 2) {
      setCurrentImageIndex(prev => prev > 0 ? prev - 1 : totalImages - 1);
    } else {
      setCurrentImageIndex(prev => prev < totalImages - 1 ? prev + 1 : 0);
    }
  };

  return (
    <div className="absolute w-full h-full">
      <animated.div
        {...bind()}
        className="absolute w-full h-full select-none overflow-hidden rounded-xl bg-[color:var(--surface)] shadow-2xl border border-[color:var(--border)] cursor-grab active:cursor-grabbing"
        style={{
          x,
          rotate,
          scale,
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      >
        {/* Image with tap navigation */}
        <div className="relative h-full w-full" onClick={handleImageTap}>
          <img 
            src={images[currentImageIndex]} 
            alt={`${opportunity.title} - ${currentImageIndex + 1}`} 
            className="h-full w-full object-cover pointer-events-none select-none"
            draggable={false}
          />
          
          {/* Image indicators */}
          {totalImages > 1 && (
            <div className="absolute top-4 left-4 right-4 flex gap-1 pointer-events-none">
              {images.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-all duration-200 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
        
        {/* Profile info */}
        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <h3 className="font-display text-3xl font-bold">
                {opportunity.title}
              </h3>
              <p className="mt-1 text-lg text-white/90">
                {opportunity.venue} - {opportunity.location}
              </p>
              
              {/* AI Match Insights */}
              {opportunity.matchReasons && opportunity.matchReasons.length > 0 && (
                <div className="mt-3 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg backdrop-blur-sm border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-purple-300">✨ AI MATCH</span>
                    {opportunity.matchScore && (
                      <span className="text-xs bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full">
                        {opportunity.matchScore}% compatible
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {opportunity.matchReasons.slice(0, 2).map((reason, idx) => (
                      <p key={idx} className="text-xs text-purple-100 flex items-center gap-1">
                        <span className="w-1 h-1 bg-purple-300 rounded-full"></span>
                        {reason}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex flex-wrap gap-2">
                {opportunity.genres.map((genre) => (
                  <span 
                    key={genre} 
                    className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm"
                  >
                    {genre}
                  </span>
                ))}
                <span className="rounded-full bg-[#40E0D0]/30 px-3 py-1 text-xs font-semibold text-[#40E0D0] backdrop-blur-sm">
                  {opportunity.fee}
                </span>
              </div>
              
              {/* More Info Section */}
              {showMoreInfo && (
                <div className="mt-4 p-4 bg-black/30 rounded-lg backdrop-blur-sm">
                  <p className="text-white/90 text-sm leading-relaxed">{opportunity.bio}</p>
                  {opportunity.skills && opportunity.skills.length > 0 && (
                    <div className="mt-2">
                      <p className="text-white/70 text-xs font-semibold mb-1">Can help with:</p>
                      <div className="flex flex-wrap gap-1">
                        {opportunity.skills.map(skill => (
                          <span key={skill} className="text-xs bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="ml-4 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMoreInfo(!showMoreInfo);
                }}
                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <span className="text-sm font-bold">{showMoreInfo ? '−' : 'i'}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenProfile?.();
                }}
                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <span className="text-sm font-bold">↗</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHireModal(true);
                }}
                className="w-8 h-8 rounded-full bg-[#40E0D0]/30 backdrop-blur-sm flex items-center justify-center text-[#40E0D0] hover:bg-[#40E0D0]/50 transition-colors"
                title="Hire DJ"
              >
                <span className="text-sm font-bold">$</span>
              </button>
            </div>
          </div>
        </div>

        {/* Swipe indicators */}
        <animated.div 
          className="absolute top-1/2 left-8 transform -translate-y-1/2 text-6xl font-bold text-green-500 opacity-0 pointer-events-none"
          style={{
            opacity: x.to(x => x > 50 ? (x - 50) / 100 : 0)
          }}
        >
          LIKE
        </animated.div>
        <animated.div 
          className="absolute top-1/2 right-8 transform -translate-y-1/2 text-6xl font-bold text-red-500 opacity-0 pointer-events-none"
          style={{
            opacity: x.to(x => x < -50 ? (-x - 50) / 100 : 0)
          }}
        >
          NOPE
        </animated.div>
        <animated.div 
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-yellow-500 opacity-0 pointer-events-none"
          style={{
            opacity: y.to(y => y < -50 ? Math.abs(y - (-50)) / 100 : 0)
          }}
        >
          ⭐ SUPER LIKE
        </animated.div>
      </animated.div>
      
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setShowUpgradeModal(false);
          window.open('/', '_blank');
        }}
      />
      
      <DJHirePayment
        isOpen={showHireModal}
        onClose={() => setShowHireModal(false)}
        djProfile={{
          id: opportunity.id,
          dj_name: opportunity.title,
          bio: opportunity.bio,
          location: opportunity.location,
          rate: opportunity.fee ? parseInt(opportunity.fee.replace(/[^0-9]/g, '')) : undefined
        }}
      />
    </div>
  );
};
