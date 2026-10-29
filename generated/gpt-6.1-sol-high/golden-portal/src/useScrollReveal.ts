import { useEffect, useRef } from 'react';
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold, rootMargin: '0px 0px -40px 0px' });
    ref.current?.querySelectorAll('.reveal, .reveal-scale').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}
