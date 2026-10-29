import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronLeft, ChevronRight, User, Search, ShoppingBag, ChevronDown, Pause, Play, Menu, X } from 'lucide-react';
import './index.css';

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
const links = [{ name: 'shop', href: '#shop' }, { name: 'learn', href: '#about' }, { name: 'journal', href: '#categories' }, { name: 'theme', href: '#categories' }];
const products = [
  { category: 'ILLUMINATE', name: 'Illuminating cleansing gel', price: '€36,00', image: 'cleanser.webp' },
  { category: 'UNIFY', subcategory: 'TIGHTEN PORES', name: 'Unifying serum spray', price: '€34,00', image: 'serum.webp' },
  { category: 'NATURAL GLOW', name: 'Super glow set', price: '€92,00', oldPrice: '€99,00', image: 'set.webp' },
  { category: 'PROTECT', subcategory: 'ILLUMINATE', name: 'Radiance day oil', price: '€59,00', image: 'oil.webp' },
  { category: 'HYDRATE', subcategory: 'NOURISH', name: 'Deep moisture cream', price: '€48,00', image: 'cleanser.webp' },
  { category: 'RENEW', name: 'Night repair elixir', price: '€72,00', oldPrice: '€79,00', image: 'serum.webp' },
  { category: 'SMOOTH', subcategory: 'REFINE', name: 'Gentle exfoliating toner', price: '€42,00', image: 'set.webp' },
];
function useInView<T extends HTMLElement>(threshold = .15) {
  const ref = useRef<T>(null);
  const [isVisible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.unobserve(entry.target); }
    }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [panel, setPanel] = useState<'search' | 'bag' | 'account' | 'locale' | null>(null);
  const [query, setQuery] = useState('');
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tab, setTab] = useState('best sellers');
  const [progress, setProgress] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const carousel = useRef<HTMLDivElement>(null);
  const hero = useInView<HTMLDivElement>();
  const shop = useInView<HTMLDivElement>(.1);
  const categories = useInView<HTMLElement>(.08);
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setSlide(value => (value + 1) % 3), 5000);
    return () => clearInterval(timer);
  }, [paused]);
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (paused || index !== slide) video.pause();
      else void video.play().catch(() => {});
    });
  }, [slide, paused]);
  useEffect(() => {
    document.body.style.overflow = menuOpen || panel ? 'hidden' : '';
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenuOpen(false); setPanel(null); } };
    window.addEventListener('keydown', escape);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', escape); };
  }, [menuOpen, panel]);
  useEffect(() => {
    const el = carousel.current;
    if (!el) return;
    const wheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      if ((event.deltaY > 0 && el.scrollLeft < max - 1) || (event.deltaY < 0 && el.scrollLeft > 1)) {
        event.preventDefault(); el.scrollLeft += event.deltaY;
      }
    };
    el.addEventListener('wheel', wheel, { passive: false });
    return () => el.removeEventListener('wheel', wheel);
  }, []);
  const changeTab = (value: string) => { setTab(value); setProgress(0); carousel.current?.scrollTo({ left: 0 }); };
  return <main>
    <section className="hero relative flex min-h-screen flex-col bg-[#33372d] text-white lg:h-screen lg:min-h-[720px] lg:flex-row" aria-label="STRETCH skincare">
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-center gap-7 bg-[#F9F4F0] py-2.5 text-xs text-black sm:py-3">
        <ChevronLeft size={16} aria-hidden="true"/><span>free shipping for orders over 50€</span><ChevronRight size={16} aria-hidden="true"/>
      </div>
      <nav className="absolute inset-x-0 top-[38px] z-30 flex items-center justify-between px-5 py-7 sm:top-[42px] sm:px-8 lg:px-10" aria-label="Main navigation">
        <a href="#" className="text-lg font-bold uppercase tracking-[.2em] sm:text-xl" aria-label="STRETCH home">STRETCH</a>
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex">{links.map(link => <a key={link.name} href={link.href} className="group relative py-2 text-sm">{link.name}<span className="absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full"/></a>)}</div>
        <div className="flex items-center gap-5">
          <button onClick={() => setPanel('locale')} className="hidden items-center gap-2 text-xs md:flex" aria-label="Country and currency"><span className="flex h-4 w-6 overflow-hidden"><span className="w-1/3 bg-blue-700"/><span className="w-1/3 bg-white"/><span className="w-1/3 bg-red-600"/></span><span>eur €</span><ChevronDown size={12}/></button>
          <span className="mx-2 hidden h-5 w-px bg-white/30 md:block"/>
          <button onClick={() => setPanel('account')} className="hidden sm:block" aria-label="Account"><User size={20} strokeWidth={1.5}/></button>
          <button onClick={() => setPanel('search')} aria-label="Search"><Search size={20} strokeWidth={1.5}/></button>
          <button onClick={() => setPanel('bag')} aria-label="Shopping bag"><ShoppingBag size={20} strokeWidth={1.5}/></button>
          <button onClick={() => setMenuOpen(true)} className="md:hidden" aria-label="Open menu" aria-expanded={menuOpen}><Menu size={22}/></button>
        </div>
      </nav>
      <div className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-black/95 backdrop-blur-sm transition-opacity duration-500 ${menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} aria-hidden={!menuOpen} {...(!menuOpen ? { inert: '' } : {})}>
        <button className="absolute right-5 top-16 p-2" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={25}/></button>
        {links.map(link => <a key={link.name} href={link.href} onClick={() => setMenuOpen(false)} className="text-3xl font-light">{link.name}</a>)}
      </div>
      <div id="about" className="relative flex min-h-[60vh] w-full items-center px-6 pb-14 pt-40 sm:px-10 lg:min-h-0 lg:w-1/2 lg:pb-12 lg:pt-24">
        <img src={asset('hero.webp')} alt="Sunlit face with a fresh lemon slice" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high"/>
        <div className="absolute inset-0 bg-black/15"/>
        <div ref={hero.ref} className={`relative z-10 w-full transition-all duration-1000 ${hero.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h1 className="mb-6 text-4xl font-light leading-[1.05] tracking-[-.035em] sm:text-5xl md:text-6xl lg:text-[clamp(3.5rem,5vw,6rem)]">ethical beauty,<br/>sustainable <span className="relative inline-block">impact.<svg className="absolute -bottom-2 left-0 h-4 w-full" viewBox="0 0 210 16" fill="none" preserveAspectRatio="none" aria-hidden="true"><path d="M2 7C48 1 66 13 108 7S167 2 208 7" stroke="#C8A45C" strokeWidth="2"/><path d="M2 11C48 5 66 17 108 11S167 6 208 11" stroke="#C8A45C" strokeWidth="1.5"/><path d="M8 14C48 8 66 20 108 14S167 9 202 14" stroke="#C8A45C"/></svg></span></h1>
          <p className="mb-10 max-w-md text-sm leading-relaxed text-white/80 md:text-base">Committed to sustainable beauty and minimize our impact on the planet.</p>
          <a href="#categories" className="btn-primary inline-block rounded-full bg-white px-10 py-4 text-sm text-black">about us</a>
        </div>
      </div>
      <div className="relative min-h-[40vh] w-full overflow-hidden bg-[#bdaca0] lg:min-h-0 lg:w-1/2" aria-label="Skincare film slideshow" data-slide={slide}>
        {[1, 2, 3].map((n, i) => <video key={n} ref={el => {videoRefs.current[i] = el;}} src={asset(`hero-${n}.mp4`)} autoPlay loop muted playsInline preload={i === 0 ? 'auto' : 'metadata'} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${slide === i ? 'opacity-100' : 'opacity-0'}`} aria-hidden={slide !== i}/>) }
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
          {[0, 1, 2].map(i => <button key={i} aria-label={`Show slide ${i + 1}`} aria-current={i === slide ? 'true' : undefined} onClick={() => setSlide(i)} className="flex h-7 w-5 items-center justify-center"><span className={`h-2 w-2 rounded-full transition-all ${slide === i ? 'scale-125 bg-white' : 'bg-white/50'}`}/></button>)}
          <button aria-label={paused ? 'Play slideshow' : 'Pause slideshow'} onClick={() => setPaused(!paused)} className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/50">{paused ? <Play size={14}/> : <Pause size={14}/>}</button>
        </div>
      </div>
    </section>
    <section id="shop" className="bg-[#F9F4F0] px-4 py-12 text-[#1a1a1a] sm:px-6 sm:py-16 lg:px-10" aria-label="Shop skincare">
      <div ref={shop.ref}>
        <div role="tablist" aria-label="Product collections" className={`mb-9 flex gap-7 transition-all duration-[800ms] sm:mb-12 sm:gap-12 ${shop.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          {['best sellers', 'sets'].map(value => <button key={value} role="tab" aria-selected={tab === value} onClick={() => changeTab(value)} className={`flex items-center gap-3 text-2xl font-medium tracking-[-.035em] sm:gap-4 sm:text-4xl md:text-5xl ${tab === value ? 'text-[#1a1a1a]' : 'text-gray-400 hover:text-gray-600'}`}>{tab === value && <span key={value} className="animate-scale-in h-5 w-5 rounded-full bg-[#1a1a1a] sm:h-6 sm:w-6"/>}{value}</button>)}
        </div>
        <div ref={carousel} role="tabpanel" aria-label={tab} className="scrollbar-hide flex overflow-x-auto pb-px" onScroll={event => {const el = event.currentTarget; setProgress(el.scrollLeft / (el.scrollWidth - el.clientWidth || 1));}}>
          {(tab === 'sets' ? products.filter(p => p.name.includes('set')) : products).map((p, index) => <article key={p.name} className={`product-card group -ml-px w-[260px] shrink-0 border border-gray-200 pb-6 pt-5 transition-all duration-500 first:ml-0 sm:w-[280px] md:w-[300px] lg:w-[calc(25%+0.75px)] ${shop.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: `${200 + index * 80}ms` }}>
            <div className="h-12 px-4"><p className="text-xs font-medium uppercase tracking-wider">{p.category}</p>{p.subcategory && <p className="mt-0.5 text-xs uppercase text-gray-500">{p.subcategory}</p>}</div>
            <div className="mx-4 aspect-[3/4] overflow-hidden rounded-lg bg-[#F9F4F0]"><img src={asset(p.image)} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/></div>
            <div className="px-3 pt-6 text-center text-sm"><h2>{p.name}</h2><p className="mt-2 flex justify-center gap-2">{p.oldPrice && <span className="text-gray-400 line-through">{p.oldPrice}</span>}<span>{p.price}</span></p></div>
          </article>)}
        </div>
        <div className="mx-auto mt-8 h-[2px] max-w-[280px] rounded-full bg-gray-300 sm:mt-10" aria-hidden="true"><div className="h-full w-[30%] rounded-full bg-[#1a1a1a]" style={{ transform: `translateX(${progress * (70 / .3)}%)` }}/></div>
      </div>
    </section>
    <section id="categories" ref={categories.ref} className={`grid grid-cols-1 bg-black text-white transition-all duration-1000 md:grid-cols-3 ${categories.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`} aria-label="Shop by category">
      {[{ name: 'face', file: 'face.mp4' }, { name: 'beauty tools', file: 'beauty-tools.mp4' }, { name: 'body', file: 'body.mp4' }].map(c => <article key={c.name} className="group relative flex min-h-[400px] flex-col items-start justify-between overflow-hidden p-6 sm:min-h-[500px] sm:p-8 md:min-h-[750px] md:p-12">
        <video src={asset(c.file)} autoPlay loop muted playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" aria-hidden="true"/>
        <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/20"/>
        <h2 className="category-title relative text-5xl font-medium leading-none tracking-[-.04em] transition-transform duration-500 sm:text-6xl md:text-7xl lg:text-8xl">{c.name}</h2>
        <a href="#shop" onClick={() => changeTab('best sellers')} className="btn-primary relative rounded-full bg-white px-8 py-3 text-sm text-black">shop {c.name}</a>
      </article>)}
    </section>
    {panel && <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm" onClick={() => setPanel(null)}><aside role="dialog" aria-modal="true" aria-label={panel} className="h-full w-full max-w-md overflow-auto bg-[#F9F4F0] px-7 py-10 text-[#1a1a1a]" onClick={e => e.stopPropagation()}><button autoFocus onClick={() => setPanel(null)} className="float-right p-1" aria-label="Close panel"><X size={22}/></button><h2 className="mb-10 text-3xl font-light">{panel === 'search' ? 'find your ritual.' : panel === 'bag' ? 'your bag.' : panel === 'locale' ? 'your location.' : 'hello, you.'}</h2>{panel === 'search' ? <><label htmlFor="search" className="text-sm">Search skincare</label><input id="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products…" className="mb-6 mt-2 w-full border-b border-black/30 bg-transparent py-3 outline-none focus:border-black"/>{products.filter(p => query && p.name.toLowerCase().includes(query.toLowerCase())).map(p => <a key={p.name} href="#shop" onClick={() => {setPanel(null); changeTab('best sellers');}} className="flex items-center gap-4 border-b border-black/10 py-4 text-sm"><img src={asset(p.image)} alt="" className="h-20 w-16 rounded object-cover"/><span>{p.name}<br/>{p.price}</span></a>)}{query && !products.some(p => p.name.toLowerCase().includes(query.toLowerCase())) && <p className="text-sm">No products found. Try “serum” or “glow”.</p>}</> : <><p className="mb-8 text-sm leading-relaxed">{panel === 'bag' ? 'Your bag is currently empty.' : panel === 'locale' ? 'France · EUR €' : 'Our account experience is coming soon. Explore your next skincare ritual.'}</p><a href="#shop" onClick={() => setPanel(null)} className="btn-primary inline-block rounded-full bg-[#1a1a1a] px-8 py-3 text-sm text-white">{panel === 'locale' ? 'continue in eur €' : 'explore skincare'}</a></>}</aside></div>}
  </main>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
