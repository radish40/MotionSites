import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

export default function Typewriter({ text, delay = 0, speed = 0.015, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10px' });

  return (
    <motion.span
      ref={ref}
      className={className}
      aria-label={text}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { staggerChildren: speed, delayChildren: delay } },
      }}
    >
      {text.split('').map((character, index) => (
        <motion.span
          key={index}
          aria-hidden="true"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >{character}</motion.span>
      ))}
    </motion.span>
  );
}
