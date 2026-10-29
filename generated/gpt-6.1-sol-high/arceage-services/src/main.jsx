import React from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'motion/react';
import { Player } from '@lottiefiles/react-lottie-player';
import Typewriter from './Typewriter';
import './style.css';
const asset = name => `${import.meta.env.BASE_URL}assets/${name}`;
const features = [
  { icon: 'crop', title: 'Sustainable Crop Care', description: 'Nurturing your fields with eco-friendly practices to ensure healthy growth and robust yields.' },
  { icon: 'tractor', title: 'Advanced Machinery', description: 'Deploying state-of-the-art tractors and harvesters for maximum efficiency and speed.' },
  { icon: 'beetle', title: 'Smart Pest Management', description: 'Protecting your harvest by monitoring and managing field ecosystems with precision.' },
];
const reveal = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-100px' }, transition: { duration: 0.6, delay: 0.1, ease: 'easeOut' } };
function ScheduleButton() {
  return <button onClick={() => { const target = document.getElementById('contact'); target.scrollIntoView({ behavior: 'smooth' }); target.focus({ preventScroll: true }); }} className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-black hover:text-white transition-colors duration-300 text-sm tracking-wide font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white cursor-pointer">Schedule Service</button>;
}
function Services() {
  return <section id="services" aria-label="Harvesting services" className="w-full relative overflow-hidden flex flex-col justify-center">
    <div className="absolute inset-0 z-0"><img src={asset('field-fallback.jpg')} alt="Agriculture Field" referrerPolicy="no-referrer" className="w-full h-full object-cover"/><div className="absolute inset-0 field-shade"/></div>
    <div className="relative z-10 w-full mx-auto px-6 md:px-12 lg:px-[120px] py-8 md:py-24 flex flex-col h-full justify-between gap-4 md:gap-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 w-full items-end">
        <motion.div {...reveal} transition={{ duration: 0.6, ease: 'easeOut' }} className="md:col-span-2">
          <h2 className="text-[clamp(1.5rem,4vw,3.5rem)] font-medium tracking-tight text-white mb-6 leading-[1.1] max-w-[800px]"><Typewriter text="A Highly Efficient, Precision-Driven Harvesting Process Built For " delay={0} speed={0.012}/><span className="font-dm-serif italic font-normal"><Typewriter text="Maximum Yield" delay={0.8} speed={0.012}/></span></h2>
          <p className="text-lg md:text-[24px] text-white/80 font-light tracking-wide"><Typewriter text="Precision in every pass." delay={0.1} speed={0.012}/></p>
        </motion.div>
        <motion.div {...reveal} className="hidden md:flex justify-end w-full max-w-[421px] pb-1"><ScheduleButton/></motion.div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 w-full md:mt-[200px]">
        {features.map((feature, i) => <motion.div key={feature.title} {...reveal} className={`flex flex-col ${i === 2 ? 'max-w-[421px]' : 'max-w-[420px]'}`}>
          <div aria-hidden="true" className="w-12 h-12 mb-6 flex items-center justify-center overflow-hidden"><Player loop autoplay src={asset(`${feature.icon}-fallback.json`)} style={{ width: '48px', height: '48px', filter: 'brightness(0) invert(1)' }}/></div>
          <div className="w-full h-px bg-white/20 mb-6"/>
          <h3 className="text-2xl font-medium text-white mb-3"><Typewriter text={feature.title}/></h3>
          <p className="text-sm text-white/70 leading-relaxed max-w-[340px]"><Typewriter text={feature.description}/></p>
        </motion.div>)}
      </div>
      <motion.div {...reveal} transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }} className="flex md:hidden justify-start w-full"><ScheduleButton/></motion.div>
    </div>
  </section>;
}
function App() { return <main className="bg-black font-sans text-white"><Services/><footer id="contact" tabIndex={-1} className="px-6 md:px-12 lg:px-[120px] py-12 outline-none"><p className="text-sm text-white/60 mb-3">Precision in every pass.</p><h2 className="font-dm-serif italic text-4xl">Schedule Service</h2></footer></main>; }
createRoot(document.getElementById('root')).render(<App/>);
