import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Hls from 'hls.js';
import './style.css';

const STREAM = 'https://stream.mux.com/s8pMcOvMQXc4GD6AX4e1o01xFogFxipmuKltNfSYza0200.m3u8';

function BlurIn({ children, delay = 0, className = '' }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className={className}
    initial={reduceMotion ? false : { opacity: 0, filter: 'blur(10px)', y: 20 }}
    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
    {children}
  </motion.div>;
}

function SplitText({ text, offset = 0, className = '' }) {
  const reduceMotion = useReducedMotion();
  return <span className={className} aria-hidden="true">{text.split(' ').map((word, i) =>
    <React.Fragment key={i}>
      {i > 0 && ' '}
      <motion.span className="inline-block" initial={reduceMotion ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: (offset + i) * 0.08, ease: [0.22, 1, 0.36, 1] }}>
        {word}
      </motion.span>
    </React.Fragment>
  )}</span>;
}

function BackgroundVideo() {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    let hls;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = STREAM;
    } else if (Hls.isSupported()) {
      hls = new Hls({ capLevelToPlayerSize: true });
      hls.loadSource(STREAM);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) video.dataset.streamStatus = 'error';
      });
    }
    return () => hls?.destroy();
  }, []);
  return <video ref={ref} autoPlay loop muted playsInline preload="auto" aria-hidden="true"
    className="hero-video absolute inset-0 z-0 h-full w-full object-cover" />;
}

function App() {
  return <main className="hero relative flex h-screen w-full items-center overflow-hidden bg-background text-foreground">
    <BackgroundVideo />
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-background to-transparent" />
    <div className="relative z-20 mx-auto w-full max-w-7xl px-6 lg:px-12">
      <div className="flex flex-col items-start gap-12">
        <div className="flex flex-col items-start gap-6">
          <BlurIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              <span>New AI Automation Ally</span>
            </div>
          </BlurIn>
          <h1 className="text-4xl leading-tight font-medium tracking-[-0.025em] md:text-5xl lg:text-6xl lg:leading-[1.2]" aria-label="Unlock the Power of AI for Your Business.">
            <SplitText text="Unlock the Power of AI" className="block" />
            <SplitText text="for Your" offset={5} />{' '}
            <SplitText text="Business." offset={7} className="font-serif italic" />
          </h1>
          <BlurIn delay={0.4} className="max-w-xl">
            <p id="platform-overview" tabIndex={-1} className="overview text-lg leading-relaxed font-normal text-white/80">
              Our cutting-edge AI platform automates, analyzes, and accelerates your workflows so you can focus on what really matters.
            </p>
          </BlurIn>
        </div>
        <BlurIn delay={0.6} className="flex flex-wrap items-center gap-4">
          <a className="cta inline-flex items-center justify-center gap-3 rounded-full bg-foreground px-5 py-3 font-medium text-background" href="/book-call">
            Book A Free Call <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a className="cta inline-flex items-center justify-center rounded-full bg-white/20 px-8 py-3 font-medium text-white backdrop-blur-sm" href="#platform-overview"
            onClick={() => document.getElementById('platform-overview')?.focus({ preventScroll: true })}>Learn now</a>
        </BlurIn>
      </div>
    </div>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
