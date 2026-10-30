import { motion, useReducedMotion } from 'framer-motion'

export function ShinyText({ text }: { text: string }) {
  const reduceMotion = useReducedMotion()
  return <motion.span
    className="shiny-text"
    style={{ backgroundImage: 'linear-gradient(100deg, #64CEFB 0%, #64CEFB 40%, #ffffff 50%, #64CEFB 60%, #64CEFB 100%)', backgroundSize: '250% 100%', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: '#64CEFB' }}
    initial={{ backgroundPosition: '100% 50%' }}
    animate={{ backgroundPosition: reduceMotion ? '100% 50%' : ['100% 50%', '0% 50%'] }}
    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
  >{text}</motion.span>
}
