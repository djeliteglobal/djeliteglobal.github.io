import { useEffect } from 'react';
import { preloadImage } from '../components/OptimizedImage';

interface PreloadConfig {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
}

export const useImagePreloader = (images: PreloadConfig[], enabled = true) => {
  useEffect(() => {
    if (!enabled || images.length === 0) return;

    // Preload images in batches to avoid overwhelming the browser
    const batchSize = 3;
    let currentBatch = 0;

    const preloadBatch = async () => {
      const start = currentBatch * batchSize;
      const end = Math.min(start + batchSize, images.length);
      const batch = images.slice(start, end);

      await Promise.all(
        batch.map(({ src, width = 400, height = 400, quality = 0.8 }) => {
          // Block Google images immediately
          if (src.includes('googleusercontent.com')) {
            return Promise.resolve();
          }
          return preloadImage(src, width, height, quality).catch(() => {
            // Ignore errors, continue with other images
          });
        })
      );

      currentBatch++;
      if (currentBatch * batchSize < images.length) {
        // Small delay between batches to prevent blocking
        setTimeout(preloadBatch, 100);
      }
    };

    // Start preloading after a small delay to not block initial render
    const timer = setTimeout(preloadBatch, 500);
    return () => clearTimeout(timer);
  }, [images, enabled]);
};

// Utility hook for preloading profile images
export const useProfileImagePreloader = (profiles: any[], enabled = true) => {
  const images: PreloadConfig[] = profiles.flatMap(profile => {
    const imageConfigs: PreloadConfig[] = [];
    
    // Main profile image
    if (profile.profile_image_url || profile.imageUrl) {
      imageConfigs.push({
        src: profile.profile_image_url || profile.imageUrl,
        width: 400,
        height: 400,
        quality: 0.8
      });
    }
    
    // Additional images
    if (profile.images && Array.isArray(profile.images)) {
      profile.images.forEach((img: string) => {
        if (img && img.trim()) {
          imageConfigs.push({
            src: img,
            width: 400,
            height: 400,
            quality: 0.8
          });
        }
      });
    }
    
    return imageConfigs;
  });

  useImagePreloader(images, enabled);
};

export default useImagePreloader;
