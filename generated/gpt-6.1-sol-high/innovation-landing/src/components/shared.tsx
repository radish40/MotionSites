import { useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
export const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}.mp4`;
export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const reduce = useReducedMotion();
  return { ref, visible: inView || !!reduce };
}
export function Video({name, className = ''}: {name: string; className?: string}) {
  return <video className={`w-full h-full object-cover ${className}`} src={asset(name)} muted autoPlay loop playsInline preload="auto" aria-hidden="true" />;
}
