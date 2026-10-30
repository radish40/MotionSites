import { useRef, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, MotionConfig, useReducedMotion } from 'motion/react';
import { ChevronRight, X, ArrowUpRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import './index.css';

const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4';
const logos = [
  { src: 'https://svgl.app/library/procure.svg', alt: 'Procure', gradient: { from: '#66c7ff', to: '#3b55ec' } },
  { src: 'https://svgl.app/library/shopify.svg', alt: 'Shopify', gradient: { from: '#f9e699', to: '#edb440' } },
  { src: 'https://svgl.app/library/blender.svg', alt: 'Blender', gradient: { from: '#7ac7ff', to: '#4765df' } },
  { src: 'https://svgl.app/library/figma.svg', alt: 'Figma', gradient: { from: '#cea1ff', to: '#8053dc' } },
  { src: 'https://svgl.app/library/spotify.svg', alt: 'Spotify', gradient: { from: '#ff9dbb', to: '#e94c6e' } },
  { src: 'https://svgl.app/library/lottielab.svg', alt: 'Lottielab', gradient: { from: '#f1e783', to: '#9ac958' } },
  { src: 'https://svgl.app/library/google-cloud.svg', alt: 'Google Cloud', gradient: { from: '#b9e6ff', to: '#66aaf0' } },
  { src: 'https://svgl.app/library/bing.svg', alt: 'Bing', gradient: { from: '#7ce8e5', to: '#22aaa7' } },
];
const cn = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(inputs));

function Marquee() {
  return <section id="products" aria-label="Ecosystem" className="marquee mt-10 w-full overflow-hidden py-2">
    <div className="marquee-track flex">
      {[0, 1].map(copy => <div key={copy} className="flex gap-4 pr-4" aria-hidden={copy === 1 ? true : undefined}>
        {logos.map(logo => <div key={logo.alt} className="group relative h-24 w-40 shrink-0 flex items-center justify-center rounded-full bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all overflow-hidden">
          <div className="absolute inset-0 scale-150 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" style={{ background: `linear-gradient(135deg, ${logo.gradient.from}, ${logo.gradient.to})` }} />
          <img src={logo.src} alt={copy === 0 ? logo.alt : ''} className="relative z-10 max-h-10 max-w-24 object-contain transition-all duration-300 group-hover:brightness-0 group-hover:invert" width="96" height="40" />
        </div>)}
      </div>)}
    </div>
  </section>;
}

function App() {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [panel, setPanel] = useState<'contact' | 'docs'>('contact');
  useEffect(() => { if (reduceMotion) video.current?.pause(); }, [reduceMotion]);
  function openPanel(type: 'contact' | 'docs') { setPanel(type); dialog.current?.showModal(); }
  return <MotionConfig reducedMotion="user">
    <main className="mx-auto flex min-h-svh w-full max-w-[1480px] flex-col justify-center px-5 py-10 md:px-10 md:py-16">
      <section aria-labelledby="hero-heading" className="hero relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-white border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col">
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          <video ref={video} src={videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover scale-105 transition-transform duration-1000" aria-hidden="true" />
        </div>
        <div className="relative z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <h1 id="hero-heading" className="font-display text-[42px] md:text-[56px] font-medium tracking-[-0.045em] leading-[1.08] text-[#0a1b33]">Foundation of the<br />new digital epoch</h1>
            <p className="mt-6 max-w-[390px] font-sans text-[14px] md:text-[15px] leading-[1.8] text-[#64748b]">Designing products, powering ecosystems and laying the foundation of a decentralized web for enterprises, builders and communities alike.</p>
            <motion.button onClick={() => openPanel('contact')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="mt-7 rounded-full bg-[#0a152d] px-7 py-3.5 text-[13px] font-semibold text-white shadow-sm">Contact Us</motion.button>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
          <motion.nav aria-label="Main navigation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }} className="flex items-center bg-white/90 backdrop-blur-2xl px-1.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-200/40">
            <a href="#" aria-label="Digital Epoch home" className="flex w-9 h-9 shrink-0 items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm text-[24px]">✦</a>
            <button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'center' })} className="px-4 text-[12px] font-semibold text-slate-500 hover:text-[#0a1b33] transition-colors">Products</button>
            <button onClick={() => openPanel('docs')} className="px-3 mr-2 text-[12px] font-semibold text-slate-500 hover:text-[#0a1b33] transition-colors">Docs</button>
            <button onClick={() => openPanel('contact')} className="flex shrink-0 items-center gap-2 whitespace-nowrap bg-white px-5 py-2 rounded-full text-[12px] font-semibold text-[#0a1b33] border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all">Get in touch<ChevronRight size={14} strokeWidth={1.8} /></button>
          </motion.nav>
        </div>
      </section>
      <Marquee />
    </main>
    <dialog ref={dialog} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <button onClick={() => dialog.current?.close()} aria-label="Close dialog" className="absolute top-5 right-5 rounded-full p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
      <p className="mb-4 text-xs font-semibold tracking-widest uppercase text-slate-500">Digital Epoch</p>
      <h2 className="font-display text-3xl tracking-tight">{panel === 'contact' ? 'Let’s build the next epoch.' : 'A foundation for what’s next.'}</h2>
      {panel === 'contact' ? <form className="mt-6 flex flex-col gap-4" onSubmit={event => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        window.location.href = `mailto:?subject=${encodeURIComponent('Digital Epoch — ' + data.get('name'))}&body=${encodeURIComponent(String(data.get('message')) + '\n\nFrom: ' + data.get('email'))}`;
      }}>
        <label className="text-sm">Name<input name="name" autoComplete="name" required className="mt-1 block w-full rounded-xl border border-slate-200 p-3" /></label>
        <label className="text-sm">Email<input name="email" type="email" autoComplete="email" required className="mt-1 block w-full rounded-xl border border-slate-200 p-3" /></label>
        <label className="text-sm">What are you building?<textarea name="message" required rows={3} className="mt-1 block w-full rounded-xl border border-slate-200 p-3" /></label>
        <p className="text-xs leading-relaxed text-slate-500">Prepare an inquiry in your email app. Add your Digital Epoch contact as the recipient before sending.</p>
        <button type="submit" className={cn('flex items-center justify-center gap-2 rounded-full bg-[#0a152d] px-6 py-3 text-sm font-semibold text-white', 'hover:bg-slate-800')}>Open email app<ArrowUpRight size={16} /></button>
      </form> : <div className="mt-5 space-y-4 text-sm leading-7 text-slate-500"><p>Designing products, powering ecosystems and laying the foundation of a decentralized web for enterprises, builders and communities alike.</p><p>Detailed product documentation is not published in this preview.</p><button onClick={() => setPanel('contact')} className="font-semibold text-[#0a1b33] underline underline-offset-4">Get in touch</button></div>}
    </dialog>
  </MotionConfig>;
}
createRoot(document.getElementById('root')!).render(<App />);
