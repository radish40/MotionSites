import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

export function FadeUp({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: 0, y: reduced ? 0 : 24 }}
    whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
