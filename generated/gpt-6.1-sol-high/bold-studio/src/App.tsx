import { useState } from 'react';
import { ArrowUpRight, Award, Crown, X } from 'lucide-react';

const links = ['Projects', 'Studio', 'Offerings', 'Inquire'];
const stats = [['250+', 'Brands Transformed'], ['95%', 'Client Retention'], ['10+', 'Years in the Game']];
const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const stagger = (i: number) => ({ transitionDelay: menuOpen ? `${i * 80 + 100}ms` : '0ms', opacity: menuOpen ? 1 : 0, transform: menuOpen ? 'translateY(0)' : 'translateY(20px)' });
  return (
    <section id="studio" className="hero relative isolate flex min-h-svh flex-col overflow-hidden bg-neutral-800 font-inter text-white">
      <video className="absolute inset-0 -z-30 h-full w-full object-cover" src={videoUrl} autoPlay muted loop playsInline aria-hidden="true" />
      <div className="absolute inset-0 -z-20 bg-black/20" />
      <div className="hero-shade absolute inset-0 -z-10" />
      <header className="flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16 lg:py-7 animate-fade-in">
        <a href="#studio" aria-label="Vanguard home" className="font-podium text-2xl font-bold uppercase tracking-wider sm:text-3xl">VANGUARD</a>
        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex lg:gap-10">
          {links.map(link => <a key={link} href={`#${link.toLowerCase()}`} className="text-sm uppercase tracking-widest text-white/80 transition-colors hover:text-white">{link}</a>)}
        </nav>
        <a href="mailto:hello@vanguard.studio" className="hidden items-center gap-4 border border-white/30 px-6 py-3 text-xs uppercase tracking-widest transition-colors hover:border-white/60 hover:bg-white/10 md:flex">Get in touch <ArrowUpRight size={16} /></a>
        <button type="button" aria-label="Open menu" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(true)} className="space-y-1.5 p-2 md:hidden"><div className="h-0.5 w-6 bg-white" /><div className="h-0.5 w-6 bg-white" /><div className="h-0.5 w-4 bg-white" /></button>
      </header>

      <main className="hero-content flex flex-1 items-center px-6 pb-10 pt-6 sm:px-10 lg:px-16 lg:pb-14">
        <div>
          <div className="mb-6 flex items-center gap-3 animate-fade-up lg:mb-8"><Crown className="h-4 w-4 shrink-0 text-white/70" /><span className="text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm">World-Class Digital Collective</span></div>
          <h1 id="projects" className="font-podium text-[clamp(2.8rem,8vw,7rem)] uppercase leading-[0.92] tracking-tight animate-fade-up-delay-1"><span className="block">Design.</span><span className="block">Disrupt.</span><span className="block">Conquer.</span></h1>
          <p id="offerings" className="mt-6 max-w-md text-sm leading-relaxed text-white/70 animate-fade-up-delay-2 sm:text-base lg:mt-8">We build fierce brand identities<br />that don't just turn heads — <strong className="font-semibold text-white">they lead.</strong></p>
          <div id="inquire" className="mt-8 flex flex-wrap items-center gap-4 animate-fade-up-delay-3 sm:gap-6 lg:mt-10">
            <a href="#projects" className="group flex items-center gap-6 bg-black px-5 py-3 text-[11px] uppercase tracking-widest transition-colors hover:bg-neutral-900 sm:px-7 sm:py-4 sm:text-xs">See our work <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>
            <div className="hidden items-center gap-3 sm:flex"><Award className="h-8 w-8 text-white/50" /><p className="text-xs uppercase leading-relaxed tracking-wider text-white/60">Top-Rated<br />Brand Studio</p></div>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 animate-fade-up-delay-4 sm:mt-10 sm:gap-12 lg:mt-14 lg:gap-16">{stats.map(([value, label]) => <div key={label}><div className="text-2xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{value}</div><div className="mt-1 text-[9px] uppercase tracking-widest text-white/50 sm:text-xs">{label}</div></div>)}</div>
        </div>
      </main>

      <div id="mobile-menu" role="dialog" aria-label="Mobile navigation" aria-modal={menuOpen ? 'true' : undefined} aria-hidden={!menuOpen} {...(!menuOpen ? { inert: '' } : {})} className={`fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm transition-all duration-500 md:hidden ${menuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`} onKeyDown={event => { if (event.key === 'Escape') setMenuOpen(false); }}>
        <div className="flex items-center justify-between px-6 py-5 sm:px-10"><a href="#studio" onClick={() => setMenuOpen(false)} className="font-podium text-2xl font-bold uppercase tracking-wider sm:text-3xl">VANGUARD</a><button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="p-2"><X className="h-6 w-6" /></button></div>
        <nav aria-label="Mobile navigation links" className="flex flex-1 flex-col items-center justify-center gap-7 pb-20">{links.map((link, i) => <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={stagger(i)} className="font-podium text-4xl uppercase transition-all duration-500 sm:text-5xl">{link}</a>)}<a href="mailto:hello@vanguard.studio" onClick={() => setMenuOpen(false)} style={stagger(4)} className="mt-5 flex items-center gap-4 border border-white/30 px-6 py-3 text-xs uppercase tracking-widest transition-all duration-500 hover:border-white/60 hover:bg-white/10">Get in touch <ArrowUpRight size={16} /></a></nav>
      </div>
    </section>
  );
}
