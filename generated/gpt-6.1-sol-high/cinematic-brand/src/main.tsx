import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Hexagon, Play, X, ArrowUpRight } from 'lucide-react';
import './index.css';

const VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_170109_f96e01a5-b0db-4274-b24d-8d97e99ec928.mp4';
const ease = [0.25, 0.46, 0.45, 0.94] as const;

function FadeUp({ children, className, delay = 0, duration = 0.6, y = 24 }: { children: ReactNode; className?: string; delay?: number; duration?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  return <motion.div ref={ref} className={className} initial={{ opacity: 0, y: reduced ? 0 : y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease }}>{children}</motion.div>;
}

function TypingEffect({ text, className, charDelay = 0.045 }: { text: string; className?: string; charDelay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  let globalCharIndex = 0;
  return <span ref={ref} className={className} aria-label={text}>{text.split(' ').map((word, wordIndex) => {
    const letters = <span key={wordIndex} className="inline-block" aria-hidden="true">{Array.from(word).map((char, i) => {
      const index = globalCharIndex++;
      return <motion.span key={i} className="inline-block" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: reduced ? 0 : 0.15, delay: reduced ? 0 : index * charDelay }}>{char}</motion.span>;
    })}</span>;
    globalCharIndex++;
    return <React.Fragment key={wordIndex}>{wordIndex > 0 && <span aria-hidden="true">&nbsp;</span>}{letters}</React.Fragment>;
  })}</span>;
}

type Panel = 'contact' | 'signup' | 'story' | null;
function App() {
  const video = useRef<HTMLVideoElement>(null);
  const storyVideo = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [submitted, setSubmitted] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => { video.current?.play().catch(() => { /* Browser autoplay policy may require user interaction. */ }); }, []);
  useEffect(() => {
    if (panel) {
      dialog.current?.showModal();
      document.body.style.overflow = 'hidden';
      if (panel === 'story') { video.current?.pause(); storyVideo.current?.play().catch(() => {}); }
    } else {
      dialog.current?.close();
      document.body.style.overflow = '';
      storyVideo.current?.pause();
      video.current?.play().catch(() => {});
    }
    return () => { document.body.style.overflow = ''; };
  }, [panel]);
  const open = (next: Panel) => { setSubmitted(false); setPanel(next); };
  return <>
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      <video ref={video} className="absolute inset-0 h-full w-full object-cover" src={VIDEO} autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
      <motion.nav aria-label="Main navigation" className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4" initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: reduced ? 0 : 0.6, ease }}>
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <a href="#" aria-label="VERTX home" className="group flex items-center gap-2.5">
            <Hexagon strokeWidth={1.5} size={24} className="text-white transition-transform duration-300 group-hover:rotate-[30deg]" />
            <span className="text-[15px] font-semibold tracking-tight text-white sm:text-base">VERTX</span>
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => open('contact')} className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-[13px] font-medium text-white/80 backdrop-blur-sm transition-all hover:scale-105 hover:border-white/30 hover:text-white active:scale-100">Contact</button>
            <button onClick={() => open('signup')} className="btn-glow rounded-full bg-slate-950 px-5 py-2 text-[13px] font-medium text-white transition-transform hover:scale-105 active:scale-100">Sign Up</button>
          </div>
        </div>
      </motion.nav>
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 pt-20 text-center sm:px-6 sm:pt-24" style={{ marginTop: '-50px' }}>
        <FadeUp className="mb-4 sm:mb-6" delay={0}>
          <p className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-white/60 sm:gap-3 sm:text-xs md:text-sm md:tracking-[0.3em]"><span className="inline-block h-px w-4 bg-white/40 sm:w-6" />The future is unfolding</p>
        </FadeUp>
        <h1 className="max-w-4xl text-[1.75rem] font-medium leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"><TypingEffect text="Innovation that reshapes the fabric of experience" /></h1>
        <FadeUp delay={2.4} className="mt-4 sm:mt-6"><p className="max-w-xs text-xs font-light leading-relaxed text-white/50 sm:max-w-xl sm:text-sm md:text-base lg:text-lg">We craft platforms where insight, power, and design converge — giving rise to something the world hasn't seen.</p></FadeUp>
        <div className="mt-8 flex w-full max-w-sm flex-col items-center gap-3 sm:mt-10 sm:w-auto sm:max-w-none sm:flex-row sm:gap-5">
          <FadeUp delay={2.8} className="w-full sm:w-auto"><button onClick={() => open('signup')} className="btn-glow flex w-full items-center justify-center gap-2.5 rounded-full bg-slate-950 py-2.5 pl-6 pr-3 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-100 sm:w-auto sm:gap-3 sm:py-3.5 sm:pl-10 sm:pr-5 sm:text-lg">Begin Now<span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 sm:h-9 sm:w-9"><Play className="h-3 w-3 fill-current sm:h-4 sm:w-4" /></span></button></FadeUp>
          <FadeUp delay={3} className="w-full sm:w-auto"><button onClick={() => open('story')} className="w-full rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:scale-105 hover:border-white/30 hover:text-white active:scale-100 sm:w-auto sm:px-10 sm:py-3.5 sm:text-lg">Watch the story</button></FadeUp>
        </div>
      </main>
    </section>
    <dialog ref={dialog} onCancel={() => setPanel(null)} onClick={event => { if (event.target === event.currentTarget) setPanel(null); }} aria-labelledby="dialog-title" className={`w-[calc(100%-2rem)] rounded-3xl p-0 shadow-2xl ${panel === 'story' ? 'max-w-5xl' : 'max-w-md'}`}>
      <div className="relative p-7 sm:p-10">
        <button aria-label="Close dialog" onClick={() => setPanel(null)} className="absolute right-4 top-4 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"><X size={20} /></button>
        <p className="mb-5 text-xs tracking-[0.25em] text-white/40">VERTX</p>
        <h2 id="dialog-title" className="mb-4 pr-6 text-3xl tracking-tight">{panel === 'story' ? 'The future is unfolding.' : panel === 'contact' ? 'Start a conversation.' : 'Your next chapter.'}</h2>
        {panel === 'story' ? <video ref={storyVideo} src={VIDEO} className="mt-6 aspect-video w-full rounded-xl bg-black" controls playsInline preload="metadata" /> : <>
          <p className="mb-7 text-sm leading-relaxed text-white/50">{panel === 'contact' ? 'Tell us what you’re imagining. Leave your email to begin a conversation.' : 'Leave your email to express your interest in VERTX.'}</p>
          {submitted ? <p role="status" className="rounded-xl border border-white/15 p-5 text-sm leading-relaxed text-white/80">Thank you for your interest. This preview does not send or store your information.</p> : <form onSubmit={event => { event.preventDefault(); setSubmitted(true); }}>
            <label className="mb-2 block text-sm text-white/70" htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" className="mb-4 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm outline-none" />
            <button type="submit" className="btn-glow flex w-full items-center justify-center gap-3 rounded-full bg-slate-950 px-6 py-3 text-sm">{panel === 'contact' ? 'Get in touch' : 'Sign Up'}<ArrowUpRight size={16} /></button>
            <p className="mt-4 text-xs text-white/35">Interactive preview. No information is sent or saved.</p>
          </form>}
        </>}
      </div>
    </dialog>
  </>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
