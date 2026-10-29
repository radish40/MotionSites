import { useRef, type CSSProperties, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '../lib/utils';

export function StaggeredFade({ text, className, style }: { text: string; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true });
  return <motion.h1 ref={ref} aria-label={text} style={style} className={cn('text-xl text-center sm:text-4xl font-bold tracking-tighter md:text-6xl md:leading-[4rem]', className)}>
    {text.split(' ').map((word, wordIndex, words) => {
      const offset = words.slice(0, wordIndex).join(' ').length + (wordIndex ? 1 : 0);
      return <span key={wordIndex} className="inline-block" aria-hidden="true">{word.split('').map((letter, index) => <motion.span key={index} initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ duration: 0.3, delay: (offset + index) * 0.03 }}>{letter}</motion.span>)}{wordIndex < words.length - 1 && <span> </span>}</span>;
    })}
  </motion.h1>;
}

export function FadeDown({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return <motion.div ref={ref} className={className} initial={{ opacity: 0, y: -20 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }} transition={{ duration: 0.6, delay }}>{children}</motion.div>;
}
