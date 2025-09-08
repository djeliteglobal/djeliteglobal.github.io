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
  const [showDetails, setShowDetails] = useState(false);

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
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      onSwipe(direction);
      onCardLeftScreen(opportunity.id);
    }
  };

  return (
      <motion.div
        className="absolute w-full h-full select-none overflow-hidden rounded-xl bg-[color:var(--surface)] shadow-2xl border border-[color:var(--border)] cursor-grab active:cursor-grabbing"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.05, rotate: 5 }}
      >
        <div className="relative h-full w-full" onClick={handleImageTap}>
          <motion.img 
            key={currentImageIndex}
            src={images[currentImageIndex]} 
            alt={`${opportunity.title} - ${currentImageIndex + 1}`} 
            className="h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          
          {totalImages > 1 && (
            <div className="absolute top-4 left-4 right-4 flex gap-1">
              {images.map((_, index) => (
                <motion.div 
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
        
        <motion.div 
          className="absolute bottom-0 left-0 p-6 text-white w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <motion.h3 
                className="font-display text-3xl font-bold"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {opportunity.title}
              </motion.h3>
              <motion.p 
                className="mt-1 text-lg text-white/90"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.4 }}
              >
                {opportunity.venue} - {opportunity.location}
              </motion.p>
              
              <motion.div 
                className="mt-4 flex flex-wrap gap-2"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {opportunity.genres.map((genre, index) => (
                  <motion.span 
                    key={genre} 
                    className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    {genre}
                  </motion.span>
                ))}
                <motion.span 
                  className="rounded-full bg-[#40E0D0]/30 px-3 py-1 text-xs font-semibold text-[#40E0D0] backdrop-blur-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  {opportunity.fee}
                </motion.span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
};