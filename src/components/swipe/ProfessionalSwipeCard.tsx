import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import type { Opportunity } from '../../types/platform';

interface ProfessionalSwipeCardProps {
  opportunity: Opportunity;
  onSwipe: (direction: 'left' | 'right') => void;
  onCardLeftScreen: (id: string) => void;
}

export const ProfessionalSwipeCard: React.FC<ProfessionalSwipeCardProps> = ({ 
  opportunity, 
  onSwipe, 
  onCardLeftScreen 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = opportunity.images || [opportunity.imageUrl];
  const totalImages = images.length;

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

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 30;
    if (Math.abs(info.offset.x) > threshold) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      onSwipe(direction);
      onCardLeftScreen(opportunity.id);
    }
  };

  return (
      <motion.div
        className="absolute w-full h-full select-none overflow-hidden rounded-xl bg-[color:var(--surface)] shadow-2xl border border-[color:var(--border)] cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -200, right: 200 }}
        dragElastic={0}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.01, rotate: 2 }}
        style={{ touchAction: 'none' }}
      >
        <div className="relative h-full w-full" onClick={handleImageTap}>
          <img 
            src={images[currentImageIndex]} 
            alt={`${opportunity.title} - ${currentImageIndex + 1}`} 
            className="h-full w-full object-cover pointer-events-none select-none"
            draggable={false}
          />
          
          {totalImages > 1 && (
            <div className="absolute top-4 left-4 right-4 flex gap-1 pointer-events-none">
              {images.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1 flex-1 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
        
        <div 
          className="absolute bottom-0 left-0 p-6 text-white w-full pointer-events-none"
        >
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <h3 
                className="font-display text-3xl font-bold"
              >
                {opportunity.title}
              </h3>
              <p 
                className="mt-1 text-lg text-white/90"
              >
                {opportunity.venue} - {opportunity.location}
              </p>
              
              <div 
                className="mt-4 flex flex-wrap gap-2"
              >
                {opportunity.genres.map((genre, index) => (
                  <span 
                    key={genre} 
                    className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm"
                  >
                    {genre}
                  </span>
                ))}
                <span 
                  className="rounded-full bg-[#40E0D0]/30 px-3 py-1 text-xs font-semibold text-[#40E0D0] backdrop-blur-sm"
                >
                  {opportunity.fee}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
};