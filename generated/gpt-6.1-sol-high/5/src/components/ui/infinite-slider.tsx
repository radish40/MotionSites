import { useEffect } from 'react';
import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react';
import useMeasure from 'react-use-measure';
import { cn } from '../../lib/utils';
export function InfiniteSlider({ children, className }: { children: React.ReactNode; className?: string }) {
 const [ref, {width}] = useMeasure();
 const x = useMotionValue(0);
 const reduced = useReducedMotion();
 useEffect(() => {
  if (!width || reduced) return;
  const controls = animate(x, [0, -width], { duration: width / 27, ease: 'linear', repeat: Infinity });
  return () => controls.stop();
 }, [width, x, reduced]);
 return <div className={cn('slider-window',className)} aria-label="Teams we power"><motion.div className="slider-track" style={{x}}><div ref={ref} className="logo-set">{children}</div><div className="logo-set" aria-hidden="true">{children}</div></motion.div></div>;
}
