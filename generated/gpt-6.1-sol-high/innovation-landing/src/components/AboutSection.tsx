import { motion } from 'framer-motion';
import { useReveal } from './shared';
export default function AboutSection() {
  const {ref, visible} = useReveal();
  return <section id="about" className="relative bg-black pt-32 md:pt-44 pb-10 md:pb-14 px-6 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />
    <div ref={ref} className="relative max-w-6xl mx-auto">
      <motion.p initial={{opacity:0,y:20}} animate={visible?{opacity:1,y:0}:{}} transition={{duration:.6}} className="text-white/40 text-sm tracking-widest uppercase mb-8">About Us</motion.p>
      <motion.h2 initial={{opacity:0,y:40}} animate={visible?{opacity:1,y:0}:{}} transition={{duration:.8,delay:.1}} className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight">Pioneering <em className="serif text-white/60">ideas</em> for<br className="hidden md:block"/> minds that <em className="serif text-white/60">create, build, and inspire.</em></motion.h2>
    </div>
  </section>;
}
