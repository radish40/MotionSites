import { useRef, type PropsWithChildren } from 'react'
import { motion, useInView } from 'framer-motion'

export function BlurIn({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ filter: 'blur(20px)', opacity: 0 }}
      animate={inView ? { filter: 'blur(0px)', opacity: 1 } : undefined}
      transition={{ duration: 1.2 }}
    >
      {children}
    </motion.div>
  )
}
