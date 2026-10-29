import { ArrowRight } from 'lucide-react';

function VortexLogo() {
  return (
    <svg viewBox="0 0 256 256" fill="white" className="w-14 h-14 md:w-16 md:h-16" aria-hidden="true">
      <path d="M128 128H16V16A112 112 0 0 1 128 128Z" />
      <path d="M128 128H16V16A112 112 0 0 1 128 128Z" transform="rotate(90 128 128)" />
      <path d="M128 128H16V16A112 112 0 0 1 128 128Z" transform="rotate(180 128 128)" />
      <path d="M128 128H16V16A112 112 0 0 1 128 128Z" transform="rotate(270 128 128)" />
    </svg>
  );
}

const socials = [
  { name: 'X (Twitter)', path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.835L0 1.154h7.594l5.243 6.932 6.064-6.933Zm-1.29 19.49h2.039L6.487 3.24H4.3l13.31 17.403Z' },
  { name: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z' },
  { name: 'Facebook', path: 'M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.095 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.49 0-1.956.931-1.956 1.887v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.095 24 18.1 24 12.073Z' },
];

export default function App() {
  return (
    <div className="h-screen w-full bg-black p-3 md:p-4 font-inter">
      <div className="w-full h-full rounded-2xl flex flex-col overflow-hidden relative bg-black">
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260717_120352_eb988725-1351-43b3-8095-16e4a1005e3d.mp4"
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover anim-fade"
          style={{ animationDelay: '0.2s' }}
          aria-hidden="true"
        />

        <nav aria-label="Studio" className="relative z-10 flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8">
          <div className="anim-stagger flex flex-col items-center" style={{ animationDelay: '0.1s' }} aria-label="VortxLab Creations">
            <VortexLogo />
            <span className="text-white text-[10px] md:text-xs tracking-[0.4em] mt-1 font-light">V O R T X</span>
          </div>
          <div className="anim-stagger flex items-center gap-3" style={{ animationDelay: '0.2s' }}>
            <button type="button" className="hidden md:block px-5 py-2.5 text-white text-sm hover:bg-white/10 btn-cut-border"><span>Neural Synergy</span></button>
            <button type="button" className="hidden md:block px-5 py-2.5 bg-white text-black text-sm hover:bg-white/90 btn-cut">Cyber Synthesis</button>
          </div>
        </nav>

        <main className="relative z-10 flex-1 flex flex-col justify-between px-6 md:px-10 pb-8 md:pb-10">
          <div className="flex-1 flex items-center relative">
            <aside className="anim-stagger hidden lg:flex flex-col gap-6 absolute left-0 top-[18%]" style={{ animationDelay: '0.4s' }}>
              <p className="text-white/80 text-base leading-relaxed max-w-[220px]">Come with us<br />exploring the<br />horizon</p>
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center gap-1" aria-hidden="true"><span className="w-4 h-4 rounded-full border border-white/40" /><span className="w-4 h-4 rounded-full border border-white/40" /></div>
                <div className="flex items-center gap-2 mt-2"><span className="text-white/70 text-xs">Perpetual<br />Immersion</span><span className="text-white/50 text-xs">01</span></div>
              </div>
            </aside>
            <div className="anim-stagger w-full text-center" style={{ animationDelay: '0.5s' }}>
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.1] tracking-[-0.04em]" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.25)' }}>Forging Tomorrow<br />Virtual Horizon<br />VortxLab Creations</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mt-8">
            <div className="anim-stagger flex items-center justify-center md:justify-end" style={{ animationDelay: '0.7s' }}>
              <p className="text-white text-sm leading-relaxed max-w-[260px] text-center md:text-left md:ml-auto">We push past conventions, reshaping the virtual terrain with next-level technologies.</p>
            </div>
            <div className="anim-stagger flex flex-col items-center gap-8 md:gap-24" style={{ animationDelay: '0.85s' }}>
              <span className="text-white text-2xl md:text-3xl font-medium">Net Dynamics</span>
              <button type="button" className="w-full max-w-[280px] py-3.5 bg-white flex items-center justify-center gap-2 text-black hover:bg-white/90 transition-colors group btn-cut"><span className="text-sm font-medium">Discover Now</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" /></button>
            </div>
            <div className="anim-stagger flex items-center justify-center md:justify-end gap-3" style={{ animationDelay: '1s' }}>
              {socials.map(({ name, path }) => <button type="button" key={name} aria-label={name} className="w-10 h-10 bg-white flex items-center justify-center text-black hover:bg-white/90 transition-colors btn-cut-sm"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d={path} /></svg></button>)}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
