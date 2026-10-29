import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Globe, Instagram, Twitter, X } from 'lucide-react';
import './index.css';

const videoSource = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4';

function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number>(0);
  const restartRef = useRef<ReturnType<typeof setTimeout>>();
  const fadingOutRef = useRef(false);

  function fade(target: number) {
    cancelAnimationFrame(frameRef.current);
    const video = videoRef.current;
    if (!video) return;
    const from = parseFloat(video.style.opacity || '0');
    const start = performance.now();
    function step(now: number) {
      const progress = Math.min((now - start) / 500, 1);
      video!.style.opacity = String(from + (target - from) * progress);
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    }
    frameRef.current = requestAnimationFrame(step);
  }

  useEffect(() => () => {
    cancelAnimationFrame(frameRef.current);
    clearTimeout(restartRef.current);
  }, []);

  return <video
    ref={videoRef}
    className="absolute inset-0 h-full w-full translate-y-[17%] object-cover"
    style={{ opacity: 0 }}
    src={videoSource}
    autoPlay muted playsInline preload="auto" aria-hidden="true"
    onError={(event) => {
      const video = event.currentTarget;
      const fallback = `${import.meta.env.BASE_URL}assets/asme-background.mp4`;
      if (!video.src.endsWith(fallback)) { video.src = fallback; video.load(); }
    }}
    onPlaying={() => { if (!fadingOutRef.current) fade(1); }}
    onTimeUpdate={(event) => {
      const video = event.currentTarget;
      if (video.duration - video.currentTime <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fade(0);
      }
    }}
    onEnded={() => {
      cancelAnimationFrame(frameRef.current);
      if (videoRef.current) videoRef.current.style.opacity = '0';
      restartRef.current = setTimeout(() => {
        const video = videoRef.current;
        if (!video) return;
        fadingOutRef.current = false;
        video.currentTime = 0;
        void video.play().catch(() => {});
        fade(1);
      }, 100);
    }}
  />;
}

const panelCopy: Record<string, string> = {
  Features: 'The latest news, fresh perspectives, and insights for curious minds. Get updates through the Asme newsletter.',
  Pricing: 'Asme pricing details are coming soon. Join the newsletter to stay updated.',
  About: 'Asme is built for the curious. A place to keep exploring ideas and discover fresh perspectives.',
  Manifesto: 'Stay curious. Ask questions. Explore new perspectives. There is always more to discover.',
  Instagram: 'Our Instagram page will be announced soon. Stay connected through the newsletter.',
  Twitter: 'Our Twitter page will be announced soon. Stay connected through the newsletter.',
  Website: 'You’re here. Welcome to Asme — built for the curious.',
};

function App() {
  const emailRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [panel, setPanel] = useState('');
  const [message, setMessage] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  function openPanel(name: string) {
    setPanel(name);
    setLoginMessage('');
    dialogRef.current?.showModal();
  }
  function subscribe(event: FormEvent) {
    event.preventDefault();
    setMessage('Thank you for your interest. Newsletter sign-up is coming soon.');
  }

  return <div className="hero-shell relative flex min-h-screen flex-col overflow-hidden bg-black text-white">
    <BackgroundVideo />
    <nav aria-label="Main navigation" className="relative z-20 px-6 py-6">
      <div className="liquid-glass mx-auto flex max-w-5xl items-center justify-between rounded-full px-6 py-3">
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center gap-2 text-lg font-semibold" aria-label="Asme home"><Globe size={24} strokeWidth={2} />Asme</a>
          <div className="hidden items-center gap-8 md:flex">
            {['Features', 'Pricing', 'About'].map(name => <a key={name} href={`#${name.toLowerCase()}`} onClick={event => { event.preventDefault(); openPanel(name); }} className="text-sm font-medium text-white/80 transition-colors hover:text-white">{name}</a>)}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="whitespace-nowrap text-sm text-white" onClick={() => { emailRef.current?.focus(); }}>Sign Up</button>
          <button onClick={() => openPanel('Login')} className="liquid-glass rounded-full px-6 py-2 text-sm transition-colors hover:bg-white/5">Login</button>
        </div>
      </div>
    </nav>

    <main className="relative z-10 flex flex-1 -translate-y-[20%] flex-col items-center justify-center px-6 py-12 text-center">
      <h1 style={{ fontFamily: "'Instrument Serif', serif" }} className="hero-heading mb-8 whitespace-nowrap text-5xl tracking-tight text-white md:text-6xl lg:text-7xl">Built for the curious</h1>
      <div className="w-full max-w-xl space-y-4">
        <form onSubmit={subscribe} className="liquid-glass flex items-center gap-3 rounded-full py-2 pl-6 pr-2">
          <input ref={emailRef} type="email" name="email" required aria-label="Email address" autoComplete="email" placeholder="Enter your email" className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/40" onChange={() => setMessage('')} />
          <button type="submit" aria-label="Subscribe to newsletter" className="rounded-full bg-white p-3 text-black transition-colors hover:bg-white/80"><ArrowRight size={20} /></button>
        </form>
        <p className="px-4 text-sm leading-relaxed text-white">Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.</p>
        {message && <p role="status" className="px-4 text-sm text-white/80">{message}</p>}
        <button onClick={() => openPanel('Manifesto')} className="liquid-glass rounded-full px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5">Manifesto</button>
      </div>
    </main>

    <footer className="relative z-10 flex justify-center gap-4 pb-12">
      {[{ name: 'Instagram', Icon: Instagram }, { name: 'Twitter', Icon: Twitter }, { name: 'Website', Icon: Globe }].map(({ name, Icon }) => <button key={name} aria-label={name} onClick={() => openPanel(name)} className="liquid-glass rounded-full p-4 text-white/80 transition-all hover:bg-white/5 hover:text-white"><Icon size={20} /></button>)}
    </footer>

    <dialog ref={dialogRef} onClick={event => { if (event.target === event.currentTarget) dialogRef.current?.close(); }} className="w-[calc(100%-3rem)] max-w-md rounded-3xl border border-white/20 bg-neutral-950/95 p-8 text-white" aria-labelledby="dialog-title">
      <button aria-label="Close dialog" onClick={() => dialogRef.current?.close()} className="absolute right-5 top-5 rounded-full p-2 text-white/70 hover:text-white"><X size={20} /></button>
      <h2 id="dialog-title" className="mb-4 text-4xl" style={{ fontFamily: "'Instrument Serif', serif" }}>{panel}</h2>
      {panel === 'Login' ? <form className="space-y-4" onSubmit={event => { event.preventDefault(); setLoginMessage('Login is not connected in this preview.'); }}>
        <label className="block text-sm">Email<input className="mt-2 w-full rounded-xl border border-white/20 bg-white/5 p-3" type="email" autoComplete="username" required /></label>
        <label className="block text-sm">Password<input className="mt-2 w-full rounded-xl border border-white/20 bg-white/5 p-3" type="password" autoComplete="current-password" required /></label>
        <button className="rounded-full bg-white px-6 py-2 text-sm text-black">Login</button>
        {loginMessage && <p role="status" className="text-sm text-white/70">{loginMessage}</p>}
      </form> : <p className="text-sm leading-relaxed text-white/75">{panelCopy[panel]}</p>}
    </dialog>
  </div>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
