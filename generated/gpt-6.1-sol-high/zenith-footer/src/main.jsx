import React from 'react';
import { createRoot } from 'react-dom/client';
import { motion, MotionConfig } from 'motion/react';
import { Dumbbell, Rocket } from 'lucide-react';
import './index.css';

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_111347_9cf2a2b0-2c10-475b-a132-147a046b4927.mp4';

export function FitnessButton({ children, icon, variant = 'primary', className = '', onClick }) {
  const variants = {
    primary: 'bg-[#060606] text-white shadow-[inset_0px_4px_8px_rgba(255,255,255,0.25),0px_4px_12px_rgba(255,255,255,0.25)] hover:shadow-[inset_0px_4px_8px_rgba(255,255,255,0.35),0px_8px_24px_rgba(255,255,255,0.35)]',
    secondary: 'bg-[#F5F5F5] text-[#060606] border border-transparent hover:bg-white hover:border-black/10 shadow-sm',
  };
  return (
    <motion.button type="button" whileHover={{ scale: 1.02, translateY: -1 }} whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`px-[18px] py-[12px] rounded-lg flex items-center justify-center gap-[10px] text-base font-geist font-normal cursor-pointer transition-all duration-200 ${variants[variant]} ${className}`}>
      {variant === 'primary' ? <Rocket aria-hidden="true" className="w-5 h-5 text-white" /> : icon}
      {children}
    </motion.button>
  );
}

function FooterMenu({ title, links, className = '' }) {
  return (
    <nav aria-label={title} className={`sm:self-end flex flex-col gap-3 ${className}`}>
      <h3 className="font-medium text-black uppercase tracking-[0.05em] text-[11px]">{title}</h3>
      {links.map(label => <a key={label} href="#" className="text-black/70 hover:text-black transition-colors text-sm font-medium whitespace-nowrap">{label}</a>)}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto pb-8 pt-8" aria-label="Zenith footer">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
        className="bg-[#FFFFF0]/95 backdrop-blur-md rounded-[32px] p-6 sm:py-8 md:px-12 md:py-8 shadow-xl border border-white/20 flex flex-col">
        <div className="grid grid-cols-2 lg:grid-cols-[auto_1fr_auto_auto] gap-x-8 lg:gap-x-16 gap-y-6 sm:gap-y-6">
          <div className="col-span-2 lg:col-span-1 lg:row-start-1"><Dumbbell aria-label="Zenith" className="text-black w-8 h-8" strokeWidth={2.5} /></div>
          <h2 className="col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-1 text-2xl md:text-3xl font-medium tracking-tight text-black">Move, Heal, Bloom</h2>
          <div className="col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-2 flex flex-wrap items-start gap-3">
            <FitnessButton className="!py-2 !px-5 !gap-2 !text-xs">Join Today</FitnessButton>
            <FitnessButton variant="secondary" className="!py-2 !px-5 !gap-2 !text-xs">View Clubs</FitnessButton>
          </div>
          <FooterMenu title="Insights" links={['Vitality Lab', 'Active Armor', 'Social Circles', 'Get In Touch']} className="lg:col-start-3 lg:row-start-1 lg:row-span-2" />
          <FooterMenu title="Connect" links={['Meta Space', 'Pro Network', 'Vlog Stream', 'Visual Feed']} className="lg:col-start-4 lg:row-start-1 lg:row-span-2" />
        </div>
        <div className="mt-6 sm:mt-8 flex flex-wrap gap-x-4 gap-y-1 text-[#060606]/40 text-[10px] font-medium tracking-tight uppercase">
          <span>© Zenith Media Group 2025</span><span>© Zenith Media Group 2025</span>
        </div>
      </motion.div>
    </footer>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-[100dvh] h-full lg:h-[100dvh] bg-black flex flex-col relative overflow-hidden">
        <video autoPlay muted loop playsInline aria-hidden="true" className="absolute inset-0 w-full h-full object-cover pointer-events-none" src={VIDEO_URL}
          onError={event => { const video = event.currentTarget; if (!video.dataset.fallback) { video.dataset.fallback = 'true'; video.src = `${import.meta.env.BASE_URL}assets/zenith-background.mp4`; video.load(); } }} />
        <div className="relative z-10 flex-1 px-4 overflow-y-auto flex flex-col">
          <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col min-h-full"><Footer /></div>
        </div>
      </main>
    </MotionConfig>
  );
}

createRoot(document.getElementById('root')).render(<App />);
