import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import type { Opportunity } from '../../types/platform';

interface UltraFastSwipeCardProps {
  opportunity: Opportunity;
  onSwipe: (direction: 'left' | 'right') => void;
  onCardLeftScreen: (id: string) => void;
}

export const UltraFastSwipeCard: React.FC<UltraFastSwipeCardProps> = ({ 
  opportunity, 
  onSwipe, 
  onCardLeftScreen 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const images = opportunity.images || [opportunity.imageUrl];
  const totalImages = images.length;

  const [{ x, rotate, scale }, api] = useSpring(() => ({ 
    x: 0, 
    rotate: 0, 
    scale: 1 
  }));

  const bind = useDrag(({ 
    down, 
    movement: [mx], 
    velocity: [vx], 
    direction: [xDir] 
  }) => {
    const trigger = Math.abs(mx) > 80;
    const dir = mx > 0 ? 1 : -1;
    
    if (!down && trigger) {
      const direction = dir > 0 ? 'right' : 'left';
      onSwipe(direction);
      api.start({ 
        x: dir * 800, 
        rotate: dir * 20, 
        scale: 0.9
      });
      setTimeout(() => onCardLeftScreen(opportunity.id), 200);
    } else {
      api.start({ 
        x: down ? mx : 0, 
        rotate: down ? mx / 15 : 0,
        scale: down ? 1.02 : 1
      });
    }
  });

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
            <animated.h3 
              className="font-display text-3xl font-bold"
              style={{
                transform: useSpring({
                  from: { scale: 0.8, y: 10 },
                  to: { scale: 1, y: 0 },
                  delay: 50,
                  config: { tension: 400, friction: 15 }
                }).scale.to(s => `scale(${s})`)
              }}
            >
              {opportunity.title}
            </animated.h3>
            <animated.p 
              className="mt-1 text-lg text-white/90"
              style={{
                transform: useSpring({
                  from: { scale: 0.8, y: 10 },
                  to: { scale: 1, y: 0 },
                  delay: 100,
                  config: { tension: 400, friction: 15 }
                }).scale.to(s => `scale(${s})`)
              }}
            >
              {opportunity.venue} - {opportunity.location}
            </animated.p>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {opportunity.genres.map((genre, index) => (
                <animated.span 
                  key={genre} 
                  className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm"
                  style={{
                    transform: useSpring({
                      from: { scale: 0, y: 20 },
                      to: { scale: 1, y: 0 },
                      delay: 100 + index * 50,
                      config: { tension: 300, friction: 10 }
                    }).scale.to(s => `scale(${s})`)
                  }}
                >
                  {genre}
                </animated.span>
              ))}
              {opportunity.skills?.map((skill, index) => (
                <animated.span 
                  key={skill} 
                  className="rounded-full bg-blue-500/30 px-3 py-1 text-xs font-semibold text-blue-200 backdrop-blur-sm"
                  style={{
                    transform: useSpring({
                      from: { scale: 0, y: 20 },
                      to: { scale: 1, y: 0 },
                      delay: 200 + index * 50,
                      config: { tension: 300, friction: 10 }
                    }).scale.to(s => `scale(${s})`)
                  }}
                >
                  {skill}
                </animated.span>
              ))}
              <animated.span 
                className="rounded-full bg-[#40E0D0]/30 px-3 py-1 text-xs font-semibold text-[#40E0D0] backdrop-blur-sm"
                style={{
                  transform: useSpring({
                    from: { scale: 0, y: 20 },
                    to: { scale: 1, y: 0 },
                    delay: 300,
                    config: { tension: 300, friction: 10 }
                  }).scale.to(s => `scale(${s})`)
                }}
              >
                {opportunity.fee}
              </animated.span>
            </div>
            
            {/* More Info Section */}
            {showMoreInfo && (
              <animated.div 
                className="mt-4 p-4 bg-black/30 rounded-lg backdrop-blur-sm"
                style={{
                  transform: useSpring({
                    from: { scale: 0.8, opacity: 0 },
                    to: { scale: 1, opacity: 1 },
                    config: { tension: 300, friction: 20 }
                  }).scale.to(s => `scale(${s})`)
                }}
              >
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
              </animated.div>
            )}
          </div>
          
          {/* More Info Button */}
          <button 
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setShowMoreInfo(!showMoreInfo);
            }}
            className="ml-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-50 relative"
            style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
          >
            <span className="text-sm font-bold">{showMoreInfo ? '−' : 'i'}</span>
          </button>
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
    </animated.div>
  );
};