import { motion } from 'framer-motion';
import { useReveal, Video } from './shared';
export default function FeaturedVideoSection() {
  const {ref,visible} = useReveal();
  return <section className="bg-black pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden">
    <motion.div ref={ref} initial={{opacity:0,y:60}} animate={visible?{opacity:1,y:0}:{}} transition={{duration:.9}} className="feature-frame relative max-w-6xl mx-auto rounded-3xl overflow-hidden aspect-video">
      <Video name="featured"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-0 inset-x-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md"><p className="text-white/50 text-xs tracking-widest uppercase mb-3">Our Approach</p><p className="text-white text-sm md:text-base leading-relaxed">We believe in the power of curiosity-driven exploration. Every project starts with a question, and every answer opens a new door to innovation.</p></div>
        <motion.a href="#philosophy" whileHover={{scale:1.05}} whileTap={{scale:.95}} className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium self-start md:self-auto">Explore more</motion.a>
      </div>
    </motion.div>
  </section>;
}
