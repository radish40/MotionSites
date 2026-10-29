import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, Bell, Home, Compass, Heart, User, BadgeCheck } from 'lucide-react';
import './index.css';

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
const destinations = [
  { name: 'Ireland', price: 'From $3,200', description: 'Emerald meadows, rugged coastal cliffs, and folk tunes drifting from pubs', curated: true, image: 'ireland.webp' },
  { name: 'Norway', price: 'From $4,100', description: 'Majestic fjords, aurora skies, and peaceful seaside hamlets', curated: false, image: 'norway.webp' },
  { name: 'Japan', price: 'From $3,800', description: 'Sacred shrines, blooming sakura, and neon-lit streets woven into tradition', curated: true, image: 'japan.webp' },
  { name: 'Iceland', price: 'From $4,500', description: 'Vast ice caps, erupting hot springs, and surreal terrain under endless sky', curated: false, image: 'iceland.webp' },
];
const filters = ['Top Picks Now', 'Quick Escapes', 'South America', 'Europe'];

function App() {
  const [screen, setScreen] = useState<'home' | 'explore'>('home');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Top Picks Now');
  const [notice, setNotice] = useState<'notifications' | 'saved' | 'profile' | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const visibleDestinations = destinations.filter(destination => {
    const matchesQuery = `${destination.name} ${destination.description}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'Europe' ? destination.name !== 'Japan' : filter === 'South America' ? false : filter === 'Quick Escapes' ? destination.name === 'Ireland' || destination.name === 'Norway' : true;
    return matchesQuery && matchesFilter;
  });
  function resetExplore() {
    setQuery(''); setFilter('Top Picks Now'); setNotice(null);
    cardsRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  }
  return (
    <main className="stage h-screen w-screen bg-white flex items-center justify-center overflow-hidden">
      <div className="phone-frame relative w-[340px] h-[740px] rounded-[52px] overflow-hidden bg-[#1C1C1C]" aria-label="Roam Beyond Borders travel app">
        <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-full z-50 pointer-events-none" aria-hidden="true" />
        {screen === 'home' ? (
          <section key="home" className="relative h-full flex flex-col" aria-label="Welcome">
            <video className="absolute inset-0 h-full w-full object-cover" src={asset('journey.mp4')} autoPlay muted loop playsInline />
            <div className="relative flex-1 flex flex-col px-7 pt-20 pb-8 z-10">
              <h1 className="animate-stagger stagger-1 font-heading text-[#01080A] text-[52px] leading-[1.05] tracking-tight mb-5">Roam<br />Beyond<br />Borders</h1>
              <p className="animate-stagger stagger-2 text-[#01080A]/70 text-[15px] leading-relaxed max-w-[240px] font-inter">Uncover hidden gems and craft memories that last forever</p>
              <div className="flex-1" />
              <div className="animate-stagger stagger-3 w-full px-2 pb-2">
                <button onClick={() => setScreen('explore')} className="w-full bg-white text-gray-900 font-medium text-base py-4 rounded-full transition-transform active:scale-[0.98] hover:shadow-lg">Begin Your Journey</button>
              </div>
            </div>
          </section>
        ) : (
          <section key="explore" className="h-full flex flex-col overflow-y-auto no-scrollbar bg-[#1C1C1C]" aria-label="Explore destinations">
            <header className="animate-stagger stagger-1 flex items-center justify-between px-6 pt-16 pb-8 shrink-0">
              <div className="flex items-center gap-3">
                <img src={asset('avatar.jpg')} alt="Elena Castillo" className="w-10 h-10 rounded-full object-cover" />
                <div><p className="text-white/60 text-xs font-inter">Welcome back,</p><h1 className="text-white text-[22px] font-heading">Elena Castillo</h1></div>
              </div>
              <button aria-label="Notifications" aria-expanded={notice === 'notifications'} className="text-white p-2 -mr-2" onClick={() => setNotice(notice === 'notifications' ? null : 'notifications')}><Bell size={20} /></button>
            </header>
            <form className="animate-stagger stagger-2 px-6 mb-3 shrink-0" role="search" onSubmit={event => { event.preventDefault(); searchRef.current?.blur(); }}>
              <div className="bg-[#333333] rounded-full pl-4 flex items-center">
                <input ref={searchRef} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search dream destinations" aria-label="Search dream destinations" className="font-inter text-sm text-white placeholder:text-white/40 bg-transparent min-w-0 flex-1 outline-none py-2" />
                <button aria-label="Search" className="w-9 h-9 bg-[#979797] rounded-full flex items-center justify-center shrink-0"><Search size={16} color="#1C1C1C" /></button>
              </div>
            </form>
            <div className="animate-stagger stagger-3 mb-7 overflow-x-auto no-scrollbar shrink-0" aria-label="Destination categories">
              <div className="flex gap-2 px-6 w-max">{filters.map(item => <button key={item} aria-pressed={filter === item} onClick={() => { setFilter(item); cardsRef.current?.scrollTo({ left: 0 }); }} className={`px-4 py-2 bg-[#333333] text-white/80 text-xs font-inter rounded-full whitespace-nowrap transition-colors ${filter === item && item !== 'Top Picks Now' ? 'ring-1 ring-inset ring-white/50' : ''}`}>{item}</button>)}</div>
            </div>
            <div className="animate-stagger stagger-4 flex justify-between items-center px-6 mb-4 shrink-0">
              <h2 className="font-heading text-white text-[22px]">Destinations</h2>
              <button className="text-white/50 text-xs font-inter py-2" onClick={resetExplore}>View all</button>
            </div>
            <div ref={cardsRef} className="animate-stagger stagger-5 flex-1 overflow-x-auto no-scrollbar min-h-[326px]" tabIndex={0} aria-label="Destination cards; scroll horizontally to explore">
              <div className="flex gap-4 px-6 h-full pb-4 w-max">
                {visibleDestinations.map(destination => (
                  <article key={destination.name} className="relative w-[240px] h-[310px] rounded-3xl overflow-hidden shrink-0">
                    <img src={asset(destination.image)} alt={`${destination.name} landscape`} className="w-full h-full object-cover" />
                    <div className="card-gradient absolute bottom-0 left-0 right-0 h-1/2 rounded-b-3xl backdrop-blur-sm bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
                    {destination.curated && <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-lg px-2 py-1.5 flex items-center gap-1 text-gray-800"><BadgeCheck size={12} /><span className="text-[10px] font-inter font-semibold">Curated</span></div>}
                    <div className="absolute bottom-0 p-5 w-full"><div className="flex items-center justify-between mb-2 gap-2"><h3 className="text-white font-heading text-xl">{destination.name}</h3><span className="text-white text-[11px] font-inter font-medium whitespace-nowrap">{destination.price}</span></div><p className="text-white/70 text-[11px] leading-snug font-inter">{destination.description}</p></div>
                  </article>
                ))}
                {!visibleDestinations.length && <p role="status" className="text-white/60 font-inter text-sm w-[292px] py-12 whitespace-normal">No destinations found. Try another search or explore all destinations.</p>}
              </div>
            </div>
            <nav className="animate-stagger stagger-6 flex justify-center pb-8 pt-3 shrink-0" aria-label="Main navigation">
              <div className="bg-[#333333] rounded-full p-2 flex items-center gap-6">
                <button onClick={resetExplore} aria-label="Home" aria-current="page" className="w-9 h-9 bg-white rounded-full flex items-center justify-center"><Home size={18} /></button>
                <button onClick={() => { setNotice(null); searchRef.current?.focus(); }} aria-label="Explore" className="nav-icon"><Compass size={18} /></button>
                <button onClick={() => setNotice(notice === 'saved' ? null : 'saved')} aria-label="Saved destinations" aria-expanded={notice === 'saved'} className="nav-icon"><Heart size={18} /></button>
                <button onClick={() => setNotice(notice === 'profile' ? null : 'profile')} aria-label="Profile" aria-expanded={notice === 'profile'} className="nav-icon"><User size={18} /></button>
              </div>
            </nav>
            {notice && <div className="notice absolute left-6 right-6 bottom-28 z-30 bg-[#333333] border border-white/10 rounded-2xl p-5 text-white shadow-xl" role="status"><button onClick={() => setNotice(null)} aria-label="Close message" className="absolute right-3 top-2 text-white/60 text-lg">×</button><p className="font-heading text-xl mb-1">{notice === 'notifications' ? 'You’re all caught up' : notice === 'saved' ? 'Your next adventure awaits' : 'Elena Castillo'}</p><p className="font-inter text-xs text-white/60">{notice === 'notifications' ? 'No new notifications.' : notice === 'saved' ? 'No saved destinations yet. Explore somewhere new.' : 'Welcome to Roam Beyond Borders.'}</p>{notice === 'profile' && <button className="font-inter text-xs mt-3 underline underline-offset-4" onClick={() => { setNotice(null); setScreen('home'); }}>Back to welcome</button>}</div>}
          </section>
        )}
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
