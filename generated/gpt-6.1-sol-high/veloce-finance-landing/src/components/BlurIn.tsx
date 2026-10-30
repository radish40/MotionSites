import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
export function BlurIn({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  return <motion.div ref={ref} initial={{ filter: 'blur(20px)', opacity: 0 }} animate={visible ? { filter: 'blur(0px)', opacity: 1 } : undefined} transition={{ duration: reduce ? 0 : 1.2 }}>{children}</motion.div>;
}
