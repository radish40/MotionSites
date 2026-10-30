import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'motion/react';
import { Soup, Shirt, Plus, Minus, Target, ArrowRight, Gift, Zap } from 'lucide-react';
import './styles.css';

const imageUrl = 'https://res.cloudinary.com/dsdhxhhqh/image/upload/v1777202844/%D0%A1%D0%BA%D1%80%D0%B8%D0%BD%D1%88%D0%BE%D1%82_26-04-2026_134245-removebg-preview_jju5ww.png';
const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260426_105815_d66e9c4c-a1f8-4011-9ee5-f0cace24e642.mp4';
const tabs = [
  { id: 'connections', title: 'Connections', content: 'Built to connect — with people, purpose, and the momentum that moves you forward.' },
  { id: 'sport', title: 'Sport Pacakge', content: 'A comprehensive collection of sporting goods, tailored for maximum performance and everyday agility.' },
];
const reveal = delay => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 0.6, delay } });

function Benefits() {
  const [activeTab, setActiveTab] = useState('connections');
  const [countValue, setCountValue] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const started = useRef(false);
  const frame = useRef();
  const handleStartCount = () => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = now => {
      const progress = Math.max(0, Math.min((now - start) / 2000, 1));
      setCountValue(Math.round(86 * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return <main><section className="py-20 lg:py-32 bg-[#F4F6FA] overflow-hidden" aria-labelledby="benefits-title">
    <div className="w-[90%] md:w-[85%] max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-start">
        <div className="lg:col-span-5 min-w-0">
          <motion.div {...reveal(0)} className="flex items-center gap-2.5 mb-8"><span className="w-2 h-2 rounded-full bg-[#3b82f6]"/><span className="text-[15px] font-medium tracking-wide">The benefit</span></motion.div>
          <motion.div {...reveal(0.1)}><h1 id="benefits-title" className="text-[clamp(1.7rem,5.5vw,4.5rem)] leading-[1.05] tracking-tight font-medium mb-8">Explore {' '}{imageFailed ? <span className="inline-fallback" role="img" aria-label="Sports detail illustration"/> : <img src={imageUrl} alt="" onError={() => setImageFailed(true)} className="inline-block w-[1.2em] scale-[1.15] h-[0.8em] object-contain rounded-full align-middle mx-[-0.1em] -translate-y-[0.1em]"/>}{' '}our<br/>flexible of activity.</h1></motion.div>
          <motion.div {...reveal(0.2)} className="flex flex-wrap gap-3 mb-12">
            <div className="rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-5 py-2.5 flex items-center gap-2 text-[13px] font-medium"><Soup className="w-[18px] h-[18px] text-gray-700"/>Eating After the Game</div>
            <div className="rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-5 py-2.5 flex items-center gap-2 text-[13px] font-medium"><Shirt className="w-[18px] h-[18px] text-gray-700"/>Game Jersey</div>
          </motion.div>
          <motion.div {...reveal(0.3)} className="space-y-3">
            {tabs.map(tab => {
              const active = activeTab === tab.id;
              return <div key={tab.id} className={`rounded-[24px] overflow-hidden transition-all duration-300 ${active ? 'bg-white shadow-[0_4px_24px_rgba(0,0,0,0.03)]' : 'hover:bg-black/5 cursor-pointer'}`}>
                <button id={`${tab.id}-trigger`} aria-expanded={active} aria-controls={`${tab.id}-content`} onClick={() => setActiveTab(active ? null : tab.id)} className="p-7 md:p-8 flex items-center justify-between w-full text-left gap-4">
                  <span className="text-[22px] font-medium">{tab.title}</span>
                  <span className="relative w-6 h-6 shrink-0"><AnimatePresence initial={false} mode="wait"><motion.span key={active ? 'minus' : 'plus'} initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.15 }} className="absolute inset-0">{active ? <Minus aria-hidden="true"/> : <Plus aria-hidden="true"/>}</motion.span></AnimatePresence></span>
                </button>
                <AnimatePresence initial={false}>{active && <motion.div id={`${tab.id}-content`} role="region" aria-labelledby={`${tab.id}-trigger`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}><p className="px-7 md:px-8 pb-7 md:pb-8 text-gray-500 text-[16px] leading-[1.65] max-w-[440px]">{tab.content}</p></motion.div>}</AnimatePresence>
              </div>;
            })}
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, delay: 0.2 }} className="lg:col-span-7 h-full min-w-0">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 xl:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col xl:flex-row gap-8 h-full min-h-[560px]">
            <div className="flex flex-col flex-1 justify-between min-w-0 gap-14">
              <div><div className="flex items-center gap-2.5 mb-5"><Target className="w-5 h-5 text-[#ea580c] shrink-0"/><span className="font-bold text-[15px] tracking-wide whitespace-nowrap">EST — 1997</span></div><p className="max-w-[280px] text-gray-500 text-[18px] leading-[1.6]">Smart features designed to move with you — fast, flexible, and built for everyday action.</p></div>
              <div><h2 className="text-[clamp(1.7rem,5vw,46px)] leading-[1.1] font-medium tracking-tight mb-8">Visionary<br/>Precision Play</h2><button type="button" className="w-full rounded-full bg-black text-white px-7 py-4 flex items-center justify-between gap-3 text-[15px] font-medium hover:bg-gray-800 transition-colors">Join Now!<ArrowRight className="w-5 h-5 shrink-0"/></button></div>
            </div>
            <div className="w-full xl:w-[320px] 2xl:w-[410px] h-[360px] md:h-[450px] xl:h-auto rounded-[2.5rem] relative overflow-hidden flex-shrink-0 bg-[#73816b]">
              <video src={videoUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" aria-label="Outdoor tennis in action"/>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.5 }} className="absolute z-10 top-6 right-6 lg:top-8 lg:right-8 bg-white text-[#111] px-5 py-2.5 rounded-full flex items-center shadow-md gap-2.5 text-[15px] font-medium whitespace-nowrap"><Gift className="w-5 h-5 text-gray-700"/>February Sale</motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} onViewportEnter={handleStartCount} transition={{ delay: 0.6, duration: 0.5 }} className="absolute z-10 bottom-6 left-6 lg:bottom-8 lg:left-8 bg-white text-[#111] rounded-[28px] overflow-hidden w-[190px] shadow-lg">
                <div className="pt-6 px-6 pb-4"><p className="text-gray-600 text-[15px] font-medium mb-1.5">Tenis Outdor</p><p className="text-[42px] font-medium tracking-tight leading-none" data-testid="counter">{countValue}%</p></div>
                <div className="bg-[#3585A5] text-white px-6 py-4 flex items-center gap-2.5"><Zap className="w-5 h-5 fill-white text-white"/><span className="font-medium text-[16px]">Boost</span></div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section></main>;
}
createRoot(document.getElementById('root')).render(<Benefits/>);
