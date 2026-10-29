import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  immediate?: boolean;
}
const variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};
export default function FadeUp({ children, delay = 0, className, immediate = false }: FadeUpProps) {
  return <motion.div className={className} variants={variants} initial="hidden"
    {...(immediate ? { animate: 'visible' } : { whileInView: 'visible', viewport: { once: true, margin: '-60px' } })}
    transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}>
    {children}
  </motion.div>;
}
