import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type Props = { text: string; className?: string; delay?: number; animateBy?: 'words' | 'letters'; direction?: 'bottom' | 'top'; stepDuration?: number };
export default function BlurText({ text, className = '', delay = 100, animateBy = 'words', direction = 'bottom', stepDuration = .35 }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: .1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <h1 ref={ref} className={`flex flex-wrap ${className}`} aria-label={text}>
    {text.split(animateBy === 'words' ? ' ' : '').map((part, i) => <motion.span key={i} aria-hidden="true" className="inline-block" style={{ marginRight: animateBy === 'words' ? '.2em' : undefined }}
      initial={reduced ? false : { filter: 'blur(10px)', opacity: 0, y: direction === 'bottom' ? 50 : -50 }}
      animate={visible ? { filter: ['blur(10px)', 'blur(5px)', 'blur(0px)'], opacity: [0, .5, 1], y: [direction === 'bottom' ? 50 : -50, direction === 'bottom' ? -5 : 5, 0] } : undefined}
      transition={{ duration: reduced ? 0 : stepDuration * 2, delay: reduced ? 0 : i * delay / 1000, times: [0, .5, 1], ease: 'easeOut' }}>{part}</motion.span>)}
  </h1>;
}
