import { useCallback, useRef, useMemo } from 'react';

// GENNADY KOROTKEVICH OPTIMIZATION: Ultra-fast swipe hook
export const useOptimizedSwipe = (onSwipe: (direction: 'left' | 'right') => void) => {
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((clientX: number) => {
    isDragging.current = true;
    startX.current = clientX;
    if (cardRef.current) {
      cardRef.current.style.transition = 'none';
      cardRef.current.style.willChange = 'transform';
    }
  }, []);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging.current) return;
    
    currentX.current = clientX - startX.current;
    
    // Use requestAnimationFrame to throttle DOM updates
    requestAnimationFrame(() => {
      if (cardRef.current && isDragging.current) {
        const rotate = currentX.current / 20;
        cardRef.current.style.transform = `translate3d(${currentX.current}px, 0, 0) rotate(${rotate}deg)`;
      }
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const swipeThreshold = 100;
    if (Math.abs(currentX.current) > swipeThreshold) {
      const direction = currentX.current > 0 ? 'right' : 'left';
      if (cardRef.current) {
        cardRef.current.classList.add(direction === 'right' ? 'swipe-out-right' : 'swipe-out-left');
        cardRef.current.addEventListener('animationend', () => {
          cardRef.current!.style.willChange = 'auto';
          onSwipe(direction);
        }, { once: true });
      }
    } else {
      if (cardRef.current) {
        cardRef.current.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        cardRef.current.style.transform = 'translate3d(0, 0, 0)';
        cardRef.current.style.willChange = 'auto';
      }
    }
    currentX.current = 0;
  }, [onSwipe]);

  const eventHandlers = useMemo(() => ({
    onMouseDown: (e: React.MouseEvent) => handleDragStart(e.clientX),
    onMouseMove: (e: React.MouseEvent) => handleDragMove(e.clientX),
    onMouseUp: handleDragEnd,
    onMouseLeave: handleDragEnd,
    onTouchStart: (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX),
    onTouchMove: (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX),
    onTouchEnd: handleDragEnd,
  }), [handleDragStart, handleDragMove, handleDragEnd]);

  return { cardRef, eventHandlers };
};
