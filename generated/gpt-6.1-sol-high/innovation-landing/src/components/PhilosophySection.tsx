import { motion } from 'framer-motion';
import { useReveal, Video } from './shared';
export default function PhilosophySection() {
  const {ref,visible} = useReveal();
  return <section id="philosophy" className="bg-black py-28 md:py-40 px-6 overflow-hidden"><div ref={ref} className="max-w-6xl mx-auto">
    <motion.h2 initial={{opacity:0,y:40}} animate={visible?{opacity:1,y:0}:{}} transition={{duration:.8}} className="text-5xl md:text-7xl lg:text-8xl tracking-tight mb-16 md:mb-24">Innovation <em className="serif text-white/40">x</em> Vision</motion.h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      <motion.div initial={{opacity:0,x:-40}} animate={visible?{opacity:1,x:0}:{}} transition={{duration:.8,delay:.15}} className="rounded-3xl overflow-hidden aspect-[4/3]"><Video name="philosophy"/></motion.div>
      <motion.div initial={{opacity:0,x:40}} animate={visible?{opacity:1,x:0}:{}} transition={{duration:.8,delay:.25}}>
        <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Choose your space</p><p className="text-white/70 text-base md:text-lg leading-relaxed">Every meaningful breakthrough begins at the intersection of disciplined strategy and remarkable creative vision. We operate at that crossroads, turning bold thinking into tangible outcomes that move people and reshape industries.</p>
        <div className="w-full h-px bg-white/10 my-8"/>
        <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Shape the future</p><p className="text-white/70 text-base md:text-lg leading-relaxed">We believe that the best work emerges when curiosity meets conviction. Our process is designed to uncover hidden opportunities and translate them into experiences that resonate long after the first impression.</p>
      </motion.div>
    </div>
  </div></section>;
}
