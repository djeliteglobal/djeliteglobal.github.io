import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Convert to WebP if supported
  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc.includes('data:image/svg')) return originalSrc;
    
    // For external images, try WebP first
    const supportsWebP = document.createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') === 0;
    
    if (supportsWebP && !originalSrc.includes('.webp')) {
      // Add WebP conversion for supported services
      if (originalSrc.includes('unsplash.com')) {
        return `${originalSrc}&fm=webp&q=75`;
      }
      if (originalSrc.includes('picsum.photos')) {
        return `${originalSrc}.webp`;
      }
    }
    
    return originalSrc;
  };

  const optimizedSrc = getOptimizedSrc(src);
  
  // Blur placeholder while loading
  const blurDataURL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzMzMzMzIi8+Cjwvc3ZnPgo=';

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && !error && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
      )}
      <img
        src={error ? blurDataURL : optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};