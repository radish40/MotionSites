import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { styles } from './styles';

const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064209_0cb7d815-ff61-4caa-a6d5-bbff145ab272.mp4';
const SEEK_INTERVAL_MS = 33;
const STEP_SECONDS = 0.05;

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const directionRef = useRef<1 | -1>(1);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const loop = (now: number) => {
      if (!video.duration || isNaN(video.duration)) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      if (now - lastTickRef.current >= SEEK_INTERVAL_MS && !video.seeking) {
        lastTickRef.current = now;
        let next = video.currentTime + STEP_SECONDS * directionRef.current;
        if (next >= video.duration) {
          next = video.duration;
          directionRef.current = -1;
        } else if (next <= 0) {
          next = 0;
          directionRef.current = 1;
        }
        video.currentTime = next;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    const start = () => {
      video.pause();
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(loop);
    };
    if (video.readyState >= 1) start();
    else video.addEventListener('loadedmetadata', start);
    return () => {
      video.removeEventListener('loadedmetadata', start);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="c4-video-wrap" aria-hidden="true">
        <video ref={videoRef} muted playsInline crossOrigin="anonymous" preload="auto" src={VIDEO_SRC} />
      </div>
      <main className="c4-content">
        <h1 className="c4-title">Power up with Nex Max</h1>
        <p className="c4-subtitle">Access more tools with a single bundle.</p>
        <div className="c4-grid">
          <div className="c4-card">
            <div className="c4-card-header"><span className="c4-tier">Base</span></div>
            <div className="c4-price">$0</div>
            <div className="c4-list-title">Contains</div>
            <ul className="c4-list">
              <li>Talk with your tabs</li>
              <li>Custom Macros</li>
              <li>An elite web-based tool</li>
            </ul>
          </div>
          <div className="c4-card">
            <div className="c4-card-header">
              <span className="c4-badge">MAX</span>
              <span className="c4-trial">14-day sample run</span>
            </div>
            <div className="c4-price">$25<span>a month</span></div>
            <div className="c4-list-title">Has all the tools from Base, plus</div>
            <ul className="c4-list">
              <li>Nex unlocked. Chat as much as you want, without meeting limits.*</li>
            </ul>
          </div>
        </div>
        <button className="c4-btn" type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.65.72 3.4 1.8-3.02 1.93-2.48 5.68.3 6.84-.66 1.76-1.5 3.33-2.35 4.37zm-2.9-15.18c-.46 2.06-2.45 3.48-4.41 3.2.14-2.18 1.93-3.8 3.9-3.95.12 1.54-.36 2.39.51.75z" />
          </svg>
          Download Nex to start
        </button>
        <p className="c4-footer">* if your usage aligns with our <a href="#">Usage Policy</a>, naturally.</p>
      </main>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
