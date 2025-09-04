import { useEffect, useRef, useCallback } from 'react';

export const useScrollAnimation = (animationClass: string = 'animate-fade-in-up') => {
  const ref = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement;
        target.style.opacity = '1';
        target.classList.add(animationClass);
        observerRef.current?.unobserve(target);
      }
    });
  }, [animationClass]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      handleIntersection,
      { threshold: 0.1, rootMargin: '50px' }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [handleIntersection]);

  return ref;
};