import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  style,
  as = 'div',
}) {
  const Element = useMemo(() => motion.create(as), [as]);
  const reducedMotion = useReducedMotion();

  return (
    <Element
      className={className}
      style={style}
      initial={reducedMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '50px', amount: 0 }}
      variants={{
        hidden: { opacity: 0, x, y },
        visible: { opacity: 1, x: 0, y: 0 },
      }}
      transition={{
        duration: reducedMotion ? 0 : duration,
        delay: reducedMotion ? 0 : delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </Element>
  );
}
