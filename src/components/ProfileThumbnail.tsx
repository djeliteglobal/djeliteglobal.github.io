import React from 'react';
import { OptimizedImage } from './OptimizedImage';

interface ProfileThumbnailProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProfileThumbnail: React.FC<ProfileThumbnailProps> = ({
  src,
  alt,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  const dimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 }
  };

  // Generate thumbnail URL for faster loading
  const getThumbnailSrc = (originalSrc: string) => {
    if (originalSrc.includes('data:image/svg')) return originalSrc;
    
    // Optimize external images for thumbnails
    if (originalSrc.includes('googleusercontent.com')) {
      return `${originalSrc}=s${dimensions[size].width}-c`;
    }
    if (originalSrc.includes('unsplash.com')) {
      return `${originalSrc}&w=${dimensions[size].width}&h=${dimensions[size].height}&fit=crop&crop=face`;
    }
    if (originalSrc.includes('picsum.photos')) {
      return `https://picsum.photos/${dimensions[size].width}/${dimensions[size].height}?random=${originalSrc.split('/').pop()}`;
    }
    
    return originalSrc;
  };

  return (
    <OptimizedImage
      src={getThumbnailSrc(src)}
      alt={alt}
      width={dimensions[size].width}
      height={dimensions[size].height}
      quality={0.85}
      className={`${sizeClasses[size]} rounded-full ${className}`}
      lazy={true}
    />
  );
};