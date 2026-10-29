import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, usePresence } from 'motion/react';
import { ArrowRight, ArrowUpRight, Bone, BookOpen, Dna, Gem, Leaf, Plus, X } from 'lucide-react';

export const originalMedia: Record<string, string> = {
  'chapter-1.png': 'https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624247/01_udnber.png',
  'chapter-2.png': 'https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624374/02_pmvxxl.png',
  'chapter-3.png': 'https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624236/03_hcp3jc.png',
  'chapter-4.png': 'https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624256/04_get63z.png',
  'chapter-5.png': 'https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624251/05_kz1tyu.png',
  'pterodactyl.png': 'https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779625001/ChatGPT_Image_May_23_2026_12_24_44_PM_1_lv1dne.png',
  'hero.mp4': 'https://res.cloudinary.com/dsdxaxkiz/video/upload/v1779624998/magnific_use-img-2-as-the-exact-ba_Piu3X0W42C_wnrc8f.mp4',
};
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
const chaptersData = [
  { name: 'Age of Dinosaurs', image: asset('chapter-1.png') },
  { name: 'Fossils of Ancient Life', image: asset('chapter-2.png') },
  { name: 'Reptiles of the Mesozoic', image: asset('chapter-3.png') },
  { name: 'Marine Fossil Gallery', image: asset('chapter-4.png') },
  { name: 'Prehistoric Giants', image: asset('chapter-5.png') },
];
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const letterBlock = { initial: { y: 120, opacity: 0 }, animate: { y: 0, opacity: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } };
const nav = ['Visit', 'Exhibitions', 'Discover', 'Learn', 'About'];
const navTargets = ['hero', 'collection', 'explore', 'explore', 'about'];

function SandTransitionImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [isPresent, safeToRemove] = usePresence();
  const filterId = useId().replace(/:/g, '');
  const displacement = useRef<SVGFEDisplacementMapElement>(null);
  const offset = useRef<SVGFEOffsetElement>(null);
  const blur = useRef<SVGFEGaussianBlurElement>(null);
  const color = useRef<SVGFEColorMatrixElement>(null);
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / 900, 1);
      const p = isPresent ? Math.pow(1 - t, 4) : Math.pow(t, 3);
      displacement.current?.setAttribute('scale', `${p * 150}`);
      offset.current?.setAttribute('dy', `${p * (isPresent ? -80 : 120)}`);
      offset.current?.setAttribute('dx', `${p * (isPresent ? -30 : 30)}`);
      blur.current?.setAttribute('stdDeviation', `${p * 6}`);
      color.current?.setAttribute('values', `1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${Math.max(0, 1 - p * 1.2)} 0`);
      if (t < 1) frame = requestAnimationFrame(tick);
      else if (!isPresent) safeToRemove?.();
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isPresent, safeToRemove]);
  return <>
    <svg className="filter-defs" aria-hidden="true"><defs><filter id={filterId} x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="4" result="noise"/><feDisplacementMap ref={displacement} in="SourceGraphic" in2="noise" scale="150" xChannelSelector="R" yChannelSelector="G"/><feOffset ref={offset}/><feGaussianBlur ref={blur}/><feColorMatrix ref={color} type="matrix"/></filter></defs></svg>
    <img src={src} alt={alt} className={className} crossOrigin="anonymous" referrerPolicy="no-referrer" style={{ filter: `url(#${filterId})` }}/>
  </>;
}

export default function App() {
  const [showVideo, setShowVideo] = useState(false);
  const [activeChapter, setActiveChapter] = useState(2);
  const [chapterSelection, setChapterSelection] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const closeDetailsRef = useRef<HTMLButtonElement>(null);
  const detailsTriggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { const t = setTimeout(() => setShowVideo(true), 2800); return () => clearTimeout(t); }, []);
  useEffect(() => { const t = setInterval(() => setActiveChapter(prev => (prev + 1) % 5), 3500); return () => clearInterval(t); }, [chapterSelection]);
  useEffect(() => {
    if (showDetails) closeDetailsRef.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setShowDetails(false); setIsMobileMenuOpen(false); }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [showDetails]);
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); };
  const selectChapter = (index: number) => { setActiveChapter(index); setChapterSelection(n => n + 1); };
  const chooseChapter = (index: number) => { selectChapter(index); scrollTo('collection'); };
  const closeDetails = () => { setShowDetails(false); detailsTriggerRef.current?.focus(); };
  return <main>
    <section id="hero" className="hero">
      <AnimatePresence>{showVideo && <motion.div className="hero-video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6 }}><svg className="specimen-grid" viewBox="0 0 1440 1000" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1"><path d="M390 100V930H1370M390 720H1370M390 440H1370M730 160V930M1080 160V930M390 930L1370 160"/><ellipse cx="990" cy="500" rx="360" ry="380"/><circle cx="990" cy="500" r="220"/></g></svg><img className="hero-ghost" src={asset('hero-skeleton.png')} alt=""/><img className="hero-skeleton" data-paused={isPaused} src={asset('hero-skeleton.png')} alt="Photographic Tyrannosaurus rex skeleton recovered from the museum reference" style={{ animationPlayState: isPaused ? 'paused' : 'running' }}/></motion.div>}</AnimatePresence>
      <motion.header className="masthead" initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}>
        <motion.h1 aria-label="Natura History Museum" variants={{ initial: { scale: 1.03 }, animate: { scale: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}>
          <svg viewBox="0 0 840 100" className="wordmark" aria-hidden="true"><g>
            {['0,0 14,0 14,100 0,100', '200,0 214,0 214,100 200,100', '0,0 33,0 214,100 181,100'].map(p => <motion.polygon key={p} points={p} variants={letterBlock}/>)}
          </g><g transform="translate(280,0)">
            {['0,0 14,0 14,100 0,100', '200,0 214,0 214,100 200,100', '14,43 200,43 200,57 14,57'].map(p => <motion.polygon key={p} points={p} variants={letterBlock}/>)}
          </g><g transform="translate(560,0)">
            {['0,0 14,0 14,100 0,100', '266,0 280,0 280,100 266,100', '0,0 26,0 153,100 127,100', '254,0 280,0 153,100 127,100'].map(p => <motion.polygon key={p} points={p} variants={letterBlock}/>)}
          </g></svg>
        </motion.h1>
        <motion.div className="subnav mono" variants={fadeUp} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <div className="museum-name">Natura<br/>History<br/>Museum</div>
          <ArrowRight className="nav-arrow" size={14} strokeWidth={1}/>
          <p className="mission">Exploring the story of life<br className="desktop-break"/> on earth through science,<br className="desktop-break"/> discovery and wonder.</p>
          <ArrowRight className="nav-arrow" size={14} strokeWidth={1}/>
          <nav aria-label="Main navigation">{nav.map((name, i) => <a key={name} href={`#${navTargets[i]}`}>{name}</a>)}</nav>
          <button className={`menu-toggle ${isMobileMenuOpen ? 'open' : ''}`} aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMobileMenuOpen} aria-controls="museum-menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><span/><span/></button>
        </motion.div>
        <AnimatePresence>{isMobileMenuOpen && <motion.nav id="museum-menu" className="menu-overlay mono" aria-label="Expanded navigation" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>{nav.map((name, i) => <a key={name} href={`#${navTargets[i]}`} onClick={() => setIsMobileMenuOpen(false)}>{name}<ArrowUpRight size={16}/></a>)}</motion.nav>}</AnimatePresence>
      </motion.header>
      <div className="hero-content">
        <motion.div className="intro" initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.15, delayChildren: 0.6 } } }}>
          <motion.div className="section-indicator mono" variants={fadeUp}>01<span/></motion.div>
          <motion.h2 variants={fadeUp}>TIMELESS<br/>WONDERS</motion.h2>
          <motion.p variants={fadeUp}>Step into the natural world and<br/>discover the stories written<br/>millions of years ago.</motion.p>
          <motion.button variants={fadeUp} className="explore-button" onClick={() => scrollTo('explore')}><span className="button-panel"/><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 28V14" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M16 20C6 20 4 14 4 7c8 0 12 5 12 13Z"/><path d="M16 16C16 6 21 3 28 3c0 8-4 13-12 13Z"/><path d="M16 27C8 27 6 23 6 18c7 0 10 4 10 9Z"/></svg><span>Explore Now</span></motion.button>
        </motion.div>
        <motion.aside className="specimen" initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.15, delayChildren: 0.9 } } }}>
          <motion.div variants={fadeUp}><h3 className="mono">Tyrannosaurus Rex</h3><p>Late Cretaceous period<br/>68-66 million years ago</p></motion.div>
          <motion.dl variants={fadeUp}><div><dt>Length</dt><dd>12.3 m</dd></div><div><dt>Height</dt><dd>4.0 m</dd></div></motion.dl>
          <motion.button variants={fadeUp} className="details-button mono" ref={detailsTriggerRef} onClick={() => setShowDetails(true)}><span><Plus size={16} strokeWidth={1.5}/></span>View Details</motion.button>
        </motion.aside>
      </div>
      <motion.div className="scroll-cue mono" initial="initial" animate="animate" variants={fadeUp} transition={{ delay: 1.2 }}><button aria-label={isPaused ? 'Play specimen motion' : 'Pause specimen motion'} onClick={() => setIsPaused(!isPaused)}>{isPaused ? <span className="play-icon"/> : <><i/><i/></>}</button><a href="#explore">Scroll to explore</a></motion.div>
    </section>
    <section id="explore" className="explore-section">
      <div className="section-label mono"><span>[ 02 ]</span> Explore Our World</div>
      <motion.h2 initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.9 }}>Unearth the stories of our planet's past<br className="desktop-break"/> through fossils, minerals, and ancient wonders.</motion.h2>
      <motion.div className="action-pills" initial="initial" whileInView="animate" viewport={{ once: true }} variants={{ animate: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}>
        {[{ icon: Bone, name: 'Dinosaurs', chapter: 0 }, { icon: Dna, name: 'Ancient Life', chapter: 1 }, { icon: Gem, name: 'Minerals', chapter: 3 }, { icon: Leaf, name: 'Fossils', chapter: 4 }, { icon: BookOpen, name: 'Learn More', chapter: 2 }].map(({ icon: Icon, name, chapter }) => <motion.button key={name} variants={fadeUp} onClick={() => chooseChapter(chapter)}><Icon size={14} strokeWidth={2}/>{name}</motion.button>)}
      </motion.div>
      <div className="flying-space"/>
      <div className="explore-bottom mono"><span>We don't just tell stories.</span><span>Paleontology (C) 2026</span></div>
    </section>
    <section id="collection" className="collection">
      <motion.img className="pterodactyl" src={asset('pterodactyl.png')} alt="A soaring prehistoric pterodactyl skeleton" initial={{ y: '-65%', opacity: 0 }} whileInView={{ y: '-78%', opacity: 1 }} transition={{ duration: 1.4, ease: 'easeOut' }} viewport={{ once: true, margin: '100px' }}/>
      <div className="collection-heading" id="about"><h2>Curated from millions of<br className="wide-break"/> years of wonder <span className="circle-icons">{[Bone, Dna, Leaf].map((Icon, i) => <span key={i}><Icon size={22} strokeWidth={1.5}/></span>)}</span><br className="wide-break"/> &amp; discovery.</h2><div className="collection-tagline"><p className="mono">We don't just display fossils<br/>We share earth's story</p><div className="value-pills mono">{['Educational', 'Authentic', 'Inspiring'].map(p => <span key={p}>{p}</span>)}</div></div></div>
      <div className="collection-panel">
        <div className="specimen-panel"><span className="asterisks">***</span><AnimatePresence mode="wait"><SandTransitionImage key={activeChapter} src={chaptersData[activeChapter].image} alt={chaptersData[activeChapter].name} className="chapter-image"/></AnimatePresence><div className="chapter-counter mono"><span className="counter-window"><AnimatePresence mode="wait"><motion.span key={activeChapter} initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}>{String(activeChapter + 1).padStart(2, '0')}</motion.span></AnimatePresence></span><span className="counter-divider">/</span>05</div></div>
        <div className="chapters"><div className="chapter-top mono"><span>Explore the past. Understand the present.</span><AnimatePresence mode="wait"><motion.span key={activeChapter} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>Chapter 0{activeChapter + 1}</motion.span></AnimatePresence></div><div className="chapter-list">{chaptersData.map((chapter, index) => <button key={chapter.name} className={activeChapter === index ? 'active' : ''} onClick={() => selectChapter(index)} aria-pressed={activeChapter === index}><span>{chapter.name}</span><AnimatePresence>{activeChapter === index && <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}><ArrowUpRight size={22} strokeWidth={1}/></motion.span>}</AnimatePresence></button>)}</div></div>
      </div>
      <footer className="mono">Digging into our planet's past</footer>
    </section>
    <AnimatePresence>{showDetails && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDetails}><motion.div className="details-modal" role="dialog" aria-modal="true" aria-labelledby="details-title" initial={{ y: 30 }} animate={{ y: 0 }} onClick={e => e.stopPropagation()} onKeyDown={e => { if (e.key === 'Tab') { e.preventDefault(); closeDetailsRef.current?.focus(); } }}><button ref={closeDetailsRef} className="modal-close" aria-label="Close specimen details" onClick={closeDetails}><X size={22}/></button><span className="mono">Specimen 01 / Late Cretaceous</span><h2 id="details-title">Tyrannosaurus<br/>Rex</h2><img src={asset('chapter-1.png')} alt="Tyrannosaurus rex fossil skeleton"/><p>68–66 million years ago</p><dl><div><dt>Length</dt><dd>12.3 m</dd></div><div><dt>Height</dt><dd>4.0 m</dd></div></dl></motion.div></motion.div>}</AnimatePresence>
  </main>;
}
