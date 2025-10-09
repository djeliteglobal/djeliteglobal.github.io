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
    
    // Block Google images immediately to prevent 429 errors
    if (originalSrc.includes('googleusercontent.com')) {
      return `data:image/svg+xml;base64,${btoa(`
        <svg width="${dimensions[size].width}" height="${dimensions[size].height}" viewBox="0 0 ${dimensions[size].width} ${dimensions[size].height}" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="${dimensions[size].width}" height="${dimensions[size].height}" fill="#6366f1"/>
          <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-size="${Math.min(dimensions[size].width, dimensions[size].height) * 0.4}" font-family="Arial, sans-serif">
            ${alt.charAt(0).toUpperCase()}
          </text>
        </svg>
      `)}`;
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
