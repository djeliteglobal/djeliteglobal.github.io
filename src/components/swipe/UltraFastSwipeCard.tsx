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
    const trigger = velocity > 0.2 || Math.abs(mx) > 100;
    const dir = xDir < 0 ? -1 : 1;
    
    if (!down && trigger) {
      const direction = dir > 0 ? 'right' : 'left';
      onSwipe(direction);
      api.start({ 
        x: dir * 1000, 
        rotate: dir * 30, 
        scale: 0.8,
        config: { tension: 200, friction: 20 }
      });
      setTimeout(() => onCardLeftScreen(opportunity.id), 300);
    } else {
      api.start({ 
        x: down ? mx : 0, 
        rotate: down ? mx / 10 : 0,
        scale: down ? 1.05 : 1,
        config: { tension: 500, friction: 50 }
      });
    }
  }, {
    axis: 'x',
    bounds: { left: -300, right: 300 },
    rubberband: true
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
      <div className="absolute bottom-0 left-0 p-6 text-white w-full pointer-events-none">
        <div className="flex items-end justify-between">
          <div className="flex-1">
            <h3 className="font-display text-3xl font-bold">
              {opportunity.title}
            </h3>
            <p className="mt-1 text-lg text-white/90">
              {opportunity.venue} - {opportunity.location}
            </p>
            
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
    </animated.div>
  );
};