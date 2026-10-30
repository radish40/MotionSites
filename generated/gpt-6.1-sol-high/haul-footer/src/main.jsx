import React, { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useTransform } from 'motion/react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import './styles.css';

const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;
const groups = [
  { title: 'Company', links: ['Founding', 'Platform', 'Testify'] },
  { title: 'Mobile', links: ['Get Apple App', 'Get Google App'] },
  { title: 'Contracts', links: ['Private Data', 'User Consent'] },
];
const socials = [
  { name: 'Facebook', Icon: Facebook },
  { name: 'Twitter', Icon: Twitter },
  { name: 'Instagram', Icon: Instagram },
  { name: 'LinkedIn', Icon: Linkedin },
];

function App() {
  const scene = useRef(null);
  const { scrollYProgress } = useScroll({ target: scene, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-50, 150]);
  return (
    <main>
      <section aria-label="Introduction" className="flex h-[50vh] items-center justify-center bg-[#FDFDFD] md:h-[30vh] lg:h-[50vh]">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="text-xs font-bold uppercase tracking-[0.5em] text-gray-300">View Below</motion.p>
      </section>
      <section ref={scene} aria-label="HAUL! footer" className="relative h-screen overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url('${asset('landscape.webp')}')` }}>
        <div className="absolute top-0 w-full px-4 pt-12 md:px-8 md:pt-24 lg:pt-12">
          <motion.footer initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-white/95 shadow-xl backdrop-blur-sm md:rounded-3xl">
            <div className="flex flex-col justify-between gap-10 px-6 py-8 md:flex-row md:gap-12 md:px-12 md:py-12">
              <a href="#" aria-label="HAUL! home" className="flex h-fit w-fit items-center gap-3 rounded-lg focus-visible:outline-orange-500">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 p-2 shadow-inner md:h-12 md:w-12">
                  <svg viewBox="0 0 256 256" aria-hidden="true" className="h-full w-full fill-white"><path d="M 228 0 C 172.772 0 128 44.772 128 100 L 128 0 L 0 0 L 0 28 C 0 83.228 44.772 128 100 128 L 0 128 L 0 256 L 28 256 C 83.228 256 128 211.228 128 156 L 128 256 L 256 256 L 256 228 C 256 172.772 211.228 128 156 128 L 256 128 L 256 0 Z" /></svg>
                </span>
                <span className="text-2xl font-bold tracking-tighter text-gray-900 md:text-3xl">HAUL!</span>
              </a>
              <nav aria-label="Footer" className="flex justify-between gap-5 md:gap-12 lg:gap-20">
                {groups.map(({ title, links }) => <div key={title}>
                  <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-gray-900">{title}</h2>
                  <ul className="space-y-3">{links.map((label) => <li key={label}><a href="#" className="text-[13px] font-medium text-gray-500 transition-colors hover:text-orange-600 focus-visible:text-orange-600 sm:text-sm">{label}</a></li>)}</ul>
                </div>)}
              </nav>
            </div>
            <div className="flex flex-col items-start justify-between gap-5 border-t border-gray-100 bg-white px-6 py-6 sm:flex-row sm:items-center md:px-12">
              <p className="text-sm font-medium text-gray-500">© 2026 HAUL! All Rights Reserved</p>
              <div className="flex gap-3">{socials.map(({ name, Icon }) => <a key={name} href="#" aria-label={name} className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 text-gray-500 transition-all duration-300 hover:border-orange-500 hover:bg-orange-500 hover:text-white focus-visible:border-orange-500 focus-visible:bg-orange-500 focus-visible:text-white"><Icon className="h-5 w-5" strokeWidth={1.8} /></a>)}</div>
            </div>
          </motion.footer>
        </div>
        <motion.div data-truck-layer style={{ y }} className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-full">
          <img src={asset('truck.png')} alt="" className="h-full w-full origin-bottom scale-[1.5] object-contain object-bottom sm:scale-110 md:scale-[2.0] lg:scale-105" />
        </motion.div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
