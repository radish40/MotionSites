import { type CSSProperties, type ReactNode, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
type Props = { radius?: 'xl' | '2xl' | '3xl' | 'full'; size?: number; intensity?: number; as?: 'div' | 'button' | 'section'; className?: string; children: ReactNode };
const radiusClasses = { xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', full: 'rounded-full' };
export const SpotlightBorder = ({ radius = '3xl', size = 300, intensity = 0.35, as: Tag = 'div', className, children }: Props) => {
  const borderRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const element = borderRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      element.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
      element.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);
  const style: CSSProperties = { padding: 1, borderRadius: 'inherit', background: `radial-gradient(${size}px circle at var(--spot-x,-200px) var(--spot-y,-200px), rgba(255,255,255,${intensity}), rgba(255,255,255,0) 60%)`, mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', maskComposite: 'exclude', WebkitMaskComposite: 'xor' };
  return <Tag className={cn('relative p-px', radiusClasses[radius], className)}><span ref={borderRef} aria-hidden="true" className="pointer-events-none absolute inset-0" style={style} />{children}</Tag>;
};
