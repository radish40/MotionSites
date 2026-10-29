import type { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';

type FadeUpProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  immediate?: boolean;
};

export function FadeUp({ children, delay = 0, className, immediate = false }: FadeUpProps) {
  const variants: Variants = {
    hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      animate={immediate ? 'visible' : undefined}
      whileInView={immediate ? undefined : 'visible'}
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
}
