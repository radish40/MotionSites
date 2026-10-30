import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const videoSource = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_212252_7d25a6d2-cf7f-465c-9bd1-a1496112806e.mp4';
const noise = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

function DigitalReality() {
  const [scale, setScale] = useState(() => Math.min(1, (window.innerWidth - 24) / 600));
  useEffect(() => {
    const resize = () => setScale(Math.min(1, (window.innerWidth - 24) / 600));
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <main className="min-h-screen bg-[#000000] flex items-center justify-center py-6">
      <div style={{ width: 600 * scale, height: 800 * scale }}>
        <article aria-label="Digital Reality portfolio" className="relative overflow-hidden bg-black shadow-2xl origin-top-left" style={{ width: '600px', height: '800px', transform: `scale(${scale})` }}>
          <video className="absolute inset-0 z-0 h-full w-full object-cover opacity-100" src={videoSource} autoPlay loop muted playsInline aria-hidden="true" />
          <div className="absolute inset-0 z-50 opacity-[0.06] mix-blend-overlay pointer-events-none" style={{ backgroundImage: noise }} />
          <div className="relative z-20 h-full w-full px-12 py-10 flex flex-col">
            <p className="text-[22px] font-serif tracking-normal text-[#f0f0f0] drop-shadow-md">Work fast. Live slow.</p>
            <div className="flex-1" />
            <div className="flex flex-col mb-12">
              <h1 className="text-[38px] leading-tight font-serif text-white mb-2 tracking-normal drop-shadow-md whitespace-nowrap ml-[-0.3px]">Create your digital reality.</h1>
              <p className="text-[15.5px] font-sans text-[#a3a3a3] mb-8 font-extralight tracking-wide">From nothing to everything, let's bring your vision to life.</p>
              <div>
                <button type="button" onClick={() => { window.location.href = 'mailto:hello@your.name'; }} className="group relative px-6 py-[10px] rounded-full font-sans text-[14px] text-[#e0e0e0] font-light transition-all duration-300 overflow-hidden backdrop-blur-md cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff8c46]" style={{ background: 'rgba(255, 255, 255, 0.03)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 140, 70, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 -1px 2px rgba(0, 0, 0, 0.8)' }}>
                  <div className="absolute inset-x-0 top-0 h-[20px] bg-gradient-to-b from-[#ff8c46]/10 to-transparent pointer-events-none z-0 rounded-t-full" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(255, 120, 50, 0.1) 0%, transparent 70%)' }} />
                  <span className="relative z-10 text-[14px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] tracking-wide">Send a message</span>
                </button>
              </div>
            </div>
            <footer className="flex justify-between items-end w-full text-[15px] font-sans text-[#7a7a7a] font-light tracking-wide translate-y-[10px]">
              <a href="mailto:hello@your.name" className="hover:text-white transition-colors cursor-pointer focus-visible:outline-[#ff8c46]">your.name</a>
              <div className="flex items-center gap-3">
                <span className="hover:text-white transition-colors cursor-default">web</span>
                <span aria-hidden="true" className="text-[11px] text-[#555] opacity-80 mt-[-2px]">✦</span>
                <span className="hover:text-white transition-colors cursor-default">product</span>
                <span aria-hidden="true" className="text-[11px] text-[#555] opacity-80 mt-[-2px]">✦</span>
                <span className="hover:text-white transition-colors cursor-default">brand</span>
              </div>
            </footer>
          </div>
        </article>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<DigitalReality />);
