import { useEffect, useRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function spotlightMaskStyle(size: number, intensity: number): CSSProperties {
  return {
    background: `radial-gradient(${size}px circle at var(--spot-x,-200px) var(--spot-y,-200px), rgba(255,255,255,${intensity}), rgba(255,255,255,0) 60%)`,
    padding: '1px',
    WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
  };
}

type Props = HTMLAttributes<HTMLElement> & {
  type?: 'button' | 'submit' | 'reset';
  as?: 'div' | 'button' | 'section';
  radius?: 'xl' | '2xl' | '3xl' | 'full';
  size?: number;
  intensity?: number;
};
const radii = { xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', full: 'rounded-full' };

export function SpotlightBorder({ as: Tag = 'div', radius = '2xl', size = 280, intensity = 0.3, className, children, ...props }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const move = (event: MouseEvent) => {
      const element = ref.current;
      if (!element) return;
      const bounds = element.getBoundingClientRect();
      element.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
      element.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return <Tag ref={(element: HTMLElement | null) => { ref.current = element; }} className={cn('relative', radii[radius], className)} {...props}>
    <span aria-hidden="true" className={cn('pointer-events-none absolute inset-0', radii[radius])} style={spotlightMaskStyle(size, intensity)} />
    {children}
  </Tag>;
}
