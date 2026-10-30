import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Hls from 'hls.js';
import './styles.css';

const VIDEO = 'https://stream.mux.com/02gzwandixH4J534bd00JsCvlFfw6ha101WQ00C9b3sGibM.m3u8';

function VideoBackground() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current!;
    let hls: Hls | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    const play = () => { void video.play().catch(() => { /* Poster remains visible if autoplay is restricted. */ }); };
    const nativeError = () => {
      if (attempts++ < 3) retryTimer = setTimeout(() => { video.load(); play(); }, 1500 * attempts);
    };
    const nativeHls = video.canPlayType('application/vnd.apple.mpegurl');
    const safari = /^((?!chrome|chromium|android).)*safari/i.test(navigator.userAgent);
    if (nativeHls && (safari || !Hls.isSupported())) {
      video.src = VIDEO;
      video.addEventListener('error', nativeError);
      play();
    } else if (Hls.isSupported()) {
      hls = new Hls({ capLevelToPlayerSize: false, maxMaxBufferLength: 30, maxBufferLength: 20, maxBufferSize: 60 * 1024 * 1024 });
      hls.loadSource(VIDEO);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        // Pick the highest bandwidth rendition, including streams with equal resolutions.
        const highest = data.levels.reduce((best, level, i, levels) => level.bitrate > levels[best].bitrate ? i : best, 0);
        hls!.startLevel = highest;
        hls!.currentLevel = highest;
        video.dataset.requestedLevel = String(highest);
        play();
      });
      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => { video.dataset.activeLevel = String(data.level); });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (!data.fatal || attempts >= 3) return;
        attempts += 1;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          retryTimer = setTimeout(() => {
            if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR || data.details === Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT) hls?.loadSource(VIDEO);
            else hls?.startLoad();
          }, 1500 * attempts);
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls?.recoverMediaError();
        } else hls?.destroy();
      });
    }
    return () => { clearTimeout(retryTimer); video.removeEventListener('error', nativeError); hls?.destroy(); };
  }, []);
  return <video ref={ref} className="absolute inset-0 h-full w-full object-cover" autoPlay loop muted playsInline poster={`${import.meta.env.BASE_URL}video-poster.jpg`} aria-hidden="true" tabIndex={-1} />;
}

function Logo() {
  return <a className="brand flex items-center gap-1.5" href="#" aria-label="closer home">
    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" aria-hidden="true"><defs><radialGradient id="logo" cx="0" cy="0" r="1" gradientTransform="translate(4 5) rotate(44) scale(26)"><stop stopColor="#368CFB"/><stop offset=".3" stopColor="#5CAEFE"/><stop offset="1" stopColor="#FFEB85"/></radialGradient></defs><path d="M11.5 0 14.2 7.1 21.46 2.5 16.9 9.1 23 11.5 15.9 14.2 20.5 21.46 13.9 16.9 11.5 23 8.8 15.9 1.54 20.5 6.1 13.9 0 11.5 7.1 8.8 2.5 1.54 9.1 6.1 11.5 0Z" fill="url(#logo)"/></svg>
    <span>closer</span>
  </a>;
}

function App() {
  return <main className="hero relative isolate h-svh min-h-[640px] w-full overflow-hidden">
    <VideoBackground />
    <nav className="navigation absolute z-20 flex items-center justify-between" aria-label="Main navigation">
      <Logo />
      <div className="nav-links hidden items-center md:flex">
        {['Product', 'How it works', 'Pricing', 'Customers', 'Docs'].map(label => <a key={label} href={`#${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</a>)}
      </div>
      <button className="login transition-colors duration-200" type="button">Login</button>
    </nav>
    <section className="hero-content absolute z-10 flex w-full flex-col items-center px-6 text-center" aria-labelledby="hero-title">
      <h1 id="hero-title">An AI that does your outbound while you <span className="gradient-phrase">close deals.</span></h1>
      <p>AI sales agent that finds leads, personalizes outreach, follows up, and books meetings — automatically.</p>
      <button type="button" className="cta transition-opacity duration-200 hover:opacity-90">Get started</button>
    </section>
  </main>;
}

createRoot(document.getElementById('root')!).render(<App />);
