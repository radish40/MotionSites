import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
type Props = { delay?: number; duration?: number; y?: number; once?: boolean; amount?: number; className?: string; children: ReactNode };
export const FadeUp = ({ delay = 0, duration = 0.6, y = 24, once = true, amount = 0.3, className, children }: Props) => {
  const reducedMotion = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: 0, y: reducedMotion ? 0 : y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once, amount }} transition={{ duration: reducedMotion ? 0 : duration, delay: reducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
};
