import { useEffect, useRef, useCallback } from 'react';

export function useInfiniteScroll(callback: () => void, threshold: number = 0.1) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { threshold }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [callback, threshold]);

  return observerTarget;
}
