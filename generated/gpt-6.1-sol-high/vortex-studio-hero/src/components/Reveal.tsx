import type { CSSProperties, ReactNode } from 'react';
import {useInViewAnimation} from '../hooks/useInViewAnimation';
export function Reveal({ children, delay = 0, className = '', style }: {children: ReactNode; delay?: number; className?: string; style?: CSSProperties}) {
  const {ref, inView} = useInViewAnimation();
  return <div ref={ref} className={`${inView ? 'animate-fade-in-up' : 'opacity-0'} ${className}`} style={{...style, animationDelay: `${delay}s`}}>{children}</div>;
}
