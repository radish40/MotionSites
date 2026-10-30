import { useRef } from 'react';

const videos = [
  'hf_20260505_110052_2e127257-5236-40b1-ba48-4690260f1185.mp4',
  'hf_20260505_105838_084968f2-4415-42a4-971a-3bec54539549.mp4',
];
const source = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/';

function FocusPost({ variant }: { variant: 0 | 1 }) {
  const fallbackUsed = useRef(false);
  return (
    <div className="post-slot">
      <article aria-label={`Velorah Focus — ${variant === 0 ? 'left' : 'right'} post`} className="social-frame shrink-0 border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col bg-black">
        <video autoPlay loop muted playsInline aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-100"
          src={source + videos[variant]}
          onError={(event) => {
            if (!fallbackUsed.current) {
              fallbackUsed.current = true;
              event.currentTarget.src = `${import.meta.env.BASE_URL}assets/${videos[variant]}`;
              event.currentTarget.load();
            }
          }}
        />
        <div className="vhs-scanlines" aria-hidden="true" />
        <div className="vhs-noise" aria-hidden="true" />
        <div className="vhs-glitch-bar" aria-hidden="true" />
        <div className={`relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 ${variant === 0 ? '-mt-[180px]' : '-mt-[358px]'}`}>
          <h1 className="font-serif text-[64px] leading-[0.95] tracking-[-2.46px] max-w-xl text-white animate-fade-rise rgb-text-glitch">
            Focus in a<br />Distracted World
          </h1>
          <p className="font-sans text-[17px] text-white/95 mt-8 leading-relaxed max-w-[480px] animate-fade-rise-delay rgb-text-glitch">
            We're designing tools for deep thinkers, bold creators, and quiet rebels. Amid the chaos, we build digital spaces for sharp focus and inspired work.
          </p>
          <button type="button" className="liquid-glass rounded-full px-14 py-4 text-white text-[15px] font-sans mt-12 hover:scale-[1.03] transition-transform animate-fade-rise-delay-2 tracking-wide">
            Begin Journey
          </button>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="text-3xl tracking-tight text-white font-serif rgb-text-glitch">
            Velorah<sup className="text-[10px] ml-0.5 relative -top-3">®</sup>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function App() {
  return <main className="min-h-screen bg-black flex items-center justify-center p-4">
    <div className="post-grid"><FocusPost variant={0} /><FocusPost variant={1} /></div>
  </main>;
}
