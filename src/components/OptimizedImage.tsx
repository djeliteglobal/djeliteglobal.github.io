import React, { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  placeholder?: string;
  lazy?: boolean;
}

// Image cache for compressed images
const imageCache = new Map<string, string>();

// Compress image using Canvas API (no external library needed)
const compressImage = async (
  src: string, 
  maxWidth: number = 400, 
  maxHeight: number = 400, 
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    
    img.onerror = () => resolve(src); // Fallback to original
    img.src = src;
  });
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width = 400,
  height = 400,
  quality = 0.8,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzIyNy42MTQgMTAwIDI1MCA4Ny42MTQyIDI1MCA2MEMyNTAgMzIuMzg1OCAyMjcuNjE0IDEwIDIwMCAxMEMxNzIuMzg2IDEwIDE1MCAzMi4zODU4IDE1MCA2MEMxNTAgODcuNjE0MiAxNzIuMzg2IDEwMCAyMDAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAwIDM5MEgxMDBDMTAwIDMzMC4yIDEzOS44IDI4MCAyMDAgMjgwQzI2MC4yIDI4MCAzMDAgMzMwLjIgMzAwIDM5MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+',
  lazy = true
}) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isInView]);

  // Load and compress image
  useEffect(() => {
    if (!isInView || !src) return;

    const loadImage = async () => {
      try {
        // Check cache first
        const cacheKey = `${src}-${width}-${height}-${quality}`;
        if (imageCache.has(cacheKey)) {
          setImageSrc(imageCache.get(cacheKey)!);
          setIsLoading(false);
          return;
        }

        // Skip compression for SVGs and data URLs
        if (src.startsWith('data:') || src.endsWith('.svg')) {
          setImageSrc(src);
          setIsLoading(false);
          return;
        }

        // Compress image
        const compressedSrc = await compressImage(src, width, height, quality);
        imageCache.set(cacheKey, compressedSrc);
        setImageSrc(compressedSrc);
        setIsLoading(false);
      } catch (error) {
        console.error('Image compression failed:', error);
        setImageSrc(src); // Fallback to original
        setIsLoading(false);
      }
    };

    loadImage();
  }, [src, width, height, quality, isInView]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-50' : 'opacity-100'
        } w-full h-full object-cover`}
        loading={lazy ? 'lazy' : 'eager'}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
        </div>
      )}
    </div>
  );
};

// Utility function to preload and compress images
export const preloadImage = async (src: string, width = 400, height = 400, quality = 0.8) => {
  const cacheKey = `${src}-${width}-${height}-${quality}`;
  if (!imageCache.has(cacheKey) && src && !src.startsWith('data:')) {
    try {
      const compressedSrc = await compressImage(src, width, height, quality);
      imageCache.set(cacheKey, compressedSrc);
    } catch (error) {
      console.error('Preload failed:', error);
    }
  }
};

export default OptimizedImage;
