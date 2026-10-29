import { useEffect, useRef, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../lib/utils';

export const MIcon = ({ name, size = 16, className = '' }: { name: string; size?: number; className?: string }) => (
  <span aria-hidden="true" className={`material-symbols-rounded ${className}`} style={{ fontSize: size, fontVariationSettings: `"FILL" 0, "wght" 400, "GRAD" 0, "opsz" ${size}` }}>{name}</span>
);

export function FadeUp({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: 0, y: reduced ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export function SpotlightBorder({ children, radius, size, intensity, className }: { children: ReactNode; radius: 'xl' | '2xl' | '3xl' | 'full'; size: number; intensity: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      ref.current.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
      ref.current.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);
  const radiusClass = { xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', full: 'rounded-full' }[radius];
  return <div ref={ref} className={cn('relative', radiusClass, className)} data-spotlight>
    {children}
    <span aria-hidden="true" className={cn('pointer-events-none absolute inset-0', radiusClass)} style={{ background: `radial-gradient(${size}px circle at var(--spot-x,-200px) var(--spot-y,-200px), rgba(255,255,255,${intensity}), rgba(255,255,255,0) 60%)`, padding: '1px', WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
  </div>;
}
