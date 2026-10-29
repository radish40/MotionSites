import React, { useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, X } from 'lucide-react';
import './index.css';

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
function LogoIcon({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z"/></svg>;
}
type Brand = { name: string; style: React.CSSProperties };
const brands: Brand[] = [
  { name: 'Stripe', style: { fontFamily: 'Georgia, serif', fontWeight: 700, letterSpacing: '-0.02em', fontSize: 15 } },
  { name: 'Coinbase', style: { fontFamily: 'Arial, sans-serif', fontWeight: 900, letterSpacing: '0.08em', fontSize: 13, textTransform: 'uppercase' } },
  { name: 'Uniswap', style: { fontFamily: 'Trebuchet MS, sans-serif', fontWeight: 600, letterSpacing: '0.01em', fontSize: 15, fontStyle: 'italic' } },
  { name: 'Aave', style: { fontFamily: 'Courier New, monospace', fontWeight: 700, letterSpacing: '0.12em', fontSize: 13, textTransform: 'uppercase' } },
  { name: 'Compound', style: { fontFamily: 'Palatino, Book Antiqua, serif', fontWeight: 400, letterSpacing: '-0.01em', fontSize: 16 } },
  { name: 'MakerDAO', style: { fontFamily: 'Impact, Arial Narrow, sans-serif', fontWeight: 400, letterSpacing: '0.04em', fontSize: 14 } },
  { name: 'Chainlink', style: { fontFamily: 'Verdana, sans-serif', fontWeight: 700, letterSpacing: '-0.03em', fontSize: 13 } },
];
const backers: Brand[] = [
  {name:'Fundamental Labs',style:{fontFamily:'Times New Roman, serif',fontWeight:400,letterSpacing:'0.02em',fontSize:14}},
  {name:'KUCOIN',style:{fontFamily:'Arial Black, sans-serif',fontWeight:900,letterSpacing:'0.08em',fontSize:16}},
  {name:'NGC',style:{fontFamily:'Impact, sans-serif',fontWeight:700,letterSpacing:'0.05em',fontSize:18}},
  {name:'NxGen',style:{fontFamily:'Georgia, serif',fontWeight:600,letterSpacing:'-0.02em',fontSize:17}},
  {name:'Matter Labs',style:{fontFamily:'Helvetica, sans-serif',fontWeight:700,letterSpacing:'-0.01em',fontSize:15}},
  {name:'DEXTools',style:{fontFamily:'Verdana, sans-serif',fontWeight:700,letterSpacing:'0.06em',fontSize:14,textTransform:'uppercase'}},
  {name:'NGRAVE',style:{fontFamily:'Courier New, monospace',fontWeight:700,letterSpacing:'0.18em',fontSize:14}},
  {name:'Polychain',style:{fontFamily:'Palatino, serif',fontWeight:500,letterSpacing:'0.03em',fontSize:15}},
];
function Marquee({ backed = false }: { backed?: boolean }) {
  const list = backed ? backers : brands;
  return <div className={`marquee-window overflow-hidden ${backed ? 'md:col-span-3' : 'hero-marquee mt-24 w-full max-w-md'}`} aria-label={list.map(b => b.name).join(', ')}>
    <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}.marquee-track{display:flex;width:max-content;animation:marquee 22s linear infinite}@keyframes backers-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}.backers-track{display:flex;width:max-content;animation:backers-marquee 30s linear infinite}`}</style>
    <div className={backed ? 'backers-track' : 'marquee-track'} aria-hidden="true">{[0,1].map(copy => <div key={copy} className="flex items-center">{list.map(brand => <span key={brand.name} className={`shrink-0 whitespace-nowrap ${backed ? 'mx-10 text-black/50' : 'mx-7 text-black/60'}`} style={brand.style}>{brand.name}</span>)}</div>)}</div>
  </div>;
}
function Pill({ children, href, large = false }: {children: React.ReactNode; href: string; large?: boolean}) {
  return <a href={href} className={`inline-flex w-fit items-center gap-3 rounded-full bg-black py-2 pl-8 pr-2 font-medium text-white transition-colors duration-200 hover:bg-gray-800 ${large ? 'text-base md:text-lg' : 'text-base'}`}>{children}<span className="rounded-full bg-white p-2"><ArrowRight className="h-5 w-5 text-black"/></span></a>;
}
function Video({ name, className = '' }: {name: string; className?: string}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => { const media = matchMedia('(prefers-reduced-motion: reduce)'); const update = () => { if (media.matches) ref.current?.pause(); else ref.current?.play().catch(() => {}); }; update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update); }, []);
  return <video ref={ref} autoPlay muted loop playsInline preload="auto" className={`absolute inset-0 h-full w-full object-cover ${className}`} aria-hidden="true"><source src={asset(name)} type="video/mp4"/></video>;
}
function App() {
  const wallet = useRef<HTMLDialogElement>(null);
  return <main className="flex flex-col bg-[#F5F5F5]">
    <div className="hero-shell relative flex h-screen flex-col overflow-hidden" id="home">
      <nav aria-label="Main navigation" className="absolute left-0 right-0 top-0 z-20 px-6 py-5">
        <div className="mx-auto flex max-w-[88rem] items-center justify-between">
          <a href="#home" aria-label="Halo home" className="flex items-center gap-2.5 text-black"><LogoIcon className="h-7 w-7"/><span className="text-2xl font-medium tracking-tight">Halo</span></a>
          <div className="hidden items-center gap-8 md:flex">{[['Network','#usd-halo'],['Ecosystem','#use-modes'],['Rewards','#savings'],['Help','#commerce'],['News','#backers']].map(([name, href]) => <a key={name} href={href} className="text-base font-medium text-gray-700 transition-colors duration-200 hover:text-black">{name}</a>)}</div>
          <button onClick={() => wallet.current?.showModal()} className="rounded-full bg-black px-7 py-2.5 text-base font-medium text-white transition-colors duration-200 hover:bg-gray-800">Open Wallet</button>
        </div>
      </nav>
      <section aria-labelledby="hero-title" className="flex flex-1 items-end px-6 pb-6 pt-20">
        <div className="hero-card relative mx-auto w-full max-w-[88rem] overflow-hidden rounded-2xl" style={{height:'calc(100vh - 96px)'}}>
          <Video name="hero.mp4" className="hero-video"/>
          <div className="hero-content relative z-10 flex h-full flex-col items-start justify-start p-12 pt-36">
            <h1 id="hero-title" className="hero-title mb-4 max-w-xl text-5xl font-medium leading-tight text-black md:text-6xl" style={{letterSpacing:'-0.04em'}}>Your Wealth<br/>Works</h1>
            <p className="mb-8 max-w-md text-base leading-relaxed text-black/70 md:text-lg" style={{fontFamily:"'Inter', ui-sans-serif, system-ui, sans-serif"}}>An automated, reward-powered digital dollar built for native passive earnings and effortless connection into DeFi.</p>
            <Pill href="#usd-halo" large>Join us</Pill>
            <Marquee/>
          </div>
        </div>
      </section>
    </div>
    <section id="usd-halo" aria-labelledby="meet-title" className="bg-[#F5F5F5] px-6 py-24">
      <div className="mx-auto max-w-[88rem]">
        <div className="mb-16 grid grid-cols-1 items-start gap-12 md:grid-cols-2">
          <div><h2 id="meet-title" className="mb-8 text-4xl font-medium leading-tight tracking-[-0.03em] text-black md:text-5xl">Meet USD Halo.</h2><Pill href="#savings">Discover it</Pill></div>
          <p className="text-2xl leading-relaxed text-black/70 md:text-3xl">USD Halo is a reward-earning dollar coin that lets your savings grow while remaining tied to the U.S. dollar.</p>
        </div>
        <div id="savings" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="flex min-h-80 flex-col justify-between rounded-2xl bg-cover bg-center p-7 lg:col-span-2" style={{backgroundImage:`url(${asset('savings.webp')})`}}><h3 className="text-2xl font-medium leading-snug tracking-[-0.02em] text-black">Savings that bloom</h3><p className="max-w-xs text-base text-black/70">Gain steady returns as your dollar tokens are routed into top-performing DeFi strategies.</p></article>
          <article className="flex min-h-80 flex-col justify-between rounded-2xl bg-[#2B2644] p-7"><h3 className="text-2xl font-medium leading-snug tracking-[-0.02em] text-white">Always fluid,<br/>always pegged.</h3><p className="text-base text-white/60">Keep fully dollar-anchored with on-demand access to funds — no lockups or waits.</p></article>
          <article className="flex min-h-80 flex-col justify-between rounded-2xl bg-[#2B2644] p-7"><h3 className="text-2xl font-medium leading-snug tracking-[-0.02em] text-white">Fully<br/>automated</h3><p className="text-base text-white/60">Skip the task of tuning positions yourself. USD Halo runs in the background for you.</p></article>
        </div>
      </div>
    </section>
    <section id="backers" aria-label="Our backers" className="bg-[#F5F5F5] px-6"><div className="mx-auto grid max-w-[88rem] grid-cols-1 items-center gap-8 md:grid-cols-4"><p className="text-base leading-relaxed text-black/70">Funded by premier partners<br/>and forward-thinking leaders.</p><Marquee backed/></div></section>
    <section id="use-modes" aria-labelledby="use-title" className="bg-[#F5F5F5] px-6 py-24">
      <div className="mx-auto grid max-w-[88rem] grid-cols-1 items-start gap-8 md:grid-cols-2">
        <div className="md:pr-12 md:pt-2"><p className="mb-2 text-sm text-black/60">USD Halo in Practice</p><h2 id="use-title" className="mb-6 text-5xl font-medium leading-none tracking-[-0.04em] md:text-6xl">Use modes</h2><p className="max-w-sm text-base leading-relaxed text-black/60">USD Halo powers a wide range of modes for builders, companies and treasuries wanting safe and rewarding stablecoin integrations plus more</p></div>
        <article id="commerce" className="relative min-h-[720px] overflow-hidden rounded-3xl"><Video name="commerce.mp4"/><div className="relative z-10 p-10 md:p-12"><h3 className="mb-5 text-4xl font-medium leading-tight tracking-[-0.03em] md:text-5xl">Commerce</h3><p className="mb-8 max-w-md text-base text-black/70">Lift customer retention by offering USD Halo, a trusted dollar-backed stablecoin with strong yields, letting your patrons earn with zero effort on your platform.</p><a href="#usd-halo" className="group inline-flex items-center gap-3 text-base font-medium"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur transition-colors duration-200 group-hover:bg-white"><ArrowRight className="h-4 w-4 text-black"/></span>Know more</a></div></article>
      </div>
    </section>
    <dialog ref={wallet} aria-labelledby="wallet-title" onClick={e => {if(e.target === e.currentTarget) wallet.current?.close();}} className="w-[calc(100%_-_48px)] max-w-sm rounded-3xl bg-[#F5F5F5] p-8 text-black shadow-xl">
      <div className="mb-6 flex items-center justify-between"><LogoIcon className="h-7 w-7"/><button aria-label="Close wallet" onClick={() => wallet.current?.close()} className="rounded-full p-2 transition-colors hover:bg-black/10"><X className="h-5 w-5"/></button></div><h2 id="wallet-title" className="mb-3 text-2xl font-medium tracking-tight">Open Wallet</h2><p className="leading-relaxed text-black/60">Wallet connection is not available in this preview.</p>
    </dialog>
  </main>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
