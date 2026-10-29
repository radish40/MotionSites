import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { motion, useInView, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import { ArrowRight, Check, Minus } from 'lucide-react';
import './index.css';

const cream = '#E1E0CC';
const ease = [0.16, 1, 0.3, 1] as const;
const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;

function WordsPullUp({ text, className = '', showAsterisk = false }: { text: string; className?: string; showAsterisk?: boolean }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  return <span ref={ref} className={`inline-flex flex-wrap ${className}`} aria-label={text}>
    {text.split(' ').map((word, i, all) => <motion.span aria-hidden="true" key={i} className="relative inline-block" initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: .85, delay: i * .08, ease }}>
      {word}{i < all.length - 1 && '\u00A0'}{showAsterisk && i === all.length - 1 && <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] leading-none">*</span>}
    </motion.span>)}
  </span>;
}
function WordsPullUpMultiStyle({ segments, className = '' }: { segments: { text: string; className?: string }[]; className?: string }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: '-40px' });
  const reduced = useReducedMotion();
  const words = segments.flatMap(s => s.text.split(' ').map(text => ({ text, className: s.className })));
  return <span ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} aria-label={segments.map(s => s.text).join(' ')}>
    {words.map((w, i) => <motion.span key={i} aria-hidden="true" className={`inline-block ${w.className || ''}`} initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: .65, delay: reduced ? 0 : i * .08, ease }}>{w.text}{i < words.length - 1 && '\u00A0'}</motion.span>)}
  </span>;
}
function AnimatedLetter({ letter, index, total, progress }: { letter: string; index: number; total: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [index / total - .1, index / total + .05], [.2, 1]);
  const reduced = useReducedMotion();
  return <motion.span style={{ opacity: reduced ? 1 : opacity }}>{letter}</motion.span>;
}
const biography = 'Over the last seven years, I have worked with Parallax, a Berlin-based production house that crafts cinema, series, and Noir Studio in Paris. Together, we have created work that has earned international acclaim at several major festivals.';
function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] });
  return <section id="our-story" className="bg-black px-4 py-14 md:px-6 md:py-24">
    <div className="mx-auto max-w-6xl rounded-2xl bg-[#101010] px-5 py-16 text-center sm:px-12 sm:py-20 md:rounded-[2rem] md:py-24">
      <p className="mb-9 text-[10px] text-primary sm:text-xs">Visual arts</p>
      <h2 className="mx-auto max-w-3xl text-3xl leading-[0.95] sm:text-4xl sm:leading-[0.9] md:text-5xl lg:text-6xl xl:text-7xl" style={{ color: cream }}>
        <WordsPullUpMultiStyle segments={[{ text: 'I am Marcus Chen,', className: 'font-normal' }, { text: 'a self-taught director.', className: 'font-serif italic' }, { text: 'I have skills in color grading, visual effects, and narrative design.', className: 'font-normal' }]} />
      </h2>
      <p ref={ref} id="collective" aria-label={biography} className="mx-auto mt-10 max-w-xl scroll-mt-32 text-xs leading-relaxed text-primary sm:mt-12 sm:text-sm md:text-base">
        <span aria-hidden="true">{biography.split(' ').map((word, wordIndex, words) => {
          const start = words.slice(0, wordIndex).join(' ').length + (wordIndex ? 1 : 0);
          return <React.Fragment key={wordIndex}><span className="inline-block">{Array.from(word).map((letter, i) => <AnimatedLetter key={i} letter={letter} index={start + i} total={biography.length} progress={scrollYProgress} />)}</span>{' '}</React.Fragment>;
        })}</span>
      </p>
    </div>
  </section>;
}
const features = [
  { title: 'Project Storyboard.', number: '01', icon: 'storyboard.png', id: 'programs', items: ['Map out every scene', 'Keep your references together', 'Collaborate with your collective', 'Bring your narrative to life'], detail: 'From the first spark to the final frame, give every idea a place. Build a shared visual language for your next production.' },
  { title: 'Smart Critiques.', number: '02', icon: 'critiques.png', id: 'critiques', items: ['AI-powered visual analysis', 'Thoughtful, actionable creative notes', 'Connect the tools you already use'], detail: 'Find a fresh perspective on your work. Refine color, composition, and narrative with feedback that keeps your creative intent in focus.' },
  { title: 'Immersion Capsule.', number: '03', icon: 'capsule.png', id: 'inquiries', items: ['Silence distracting notifications', 'Set the mood with ambient soundscapes', 'Sync with your creative schedule'], detail: 'Make room for deep creative work. Create a dedicated space and a rhythm that lets you stay with the ideas that matter.' },
];
function FeatureCard({ feature, index }: { feature: typeof features[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return <motion.article id={feature.id} className="feature-card flex min-h-[400px] scroll-mt-8 flex-col rounded-2xl bg-[#212121] p-6 sm:p-7 lg:min-h-0 lg:p-6" initial={{ opacity: 0, scale: .95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: .7, delay: (index + 1) * .15, ease: [.22, 1, .36, 1] }}>
    <img src={asset(feature.icon)} alt="" className="mb-auto h-10 w-10 rounded-lg object-cover sm:h-12 sm:w-12" />
    <div className="mt-12 flex min-h-[224px] flex-col">
      <div className="mb-6 flex items-start justify-between gap-2"><h3 className="text-lg tracking-[-0.04em] xl:text-xl" style={{ color: cream }}>{feature.title}</h3><span className="pt-1 text-[10px] text-primary/40">{feature.number}</span></div>
      <ul className="space-y-3">{feature.items.map(item => <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-gray-400"><Check size={13} className="mt-0.5 shrink-0 text-primary" strokeWidth={1.5} /><span>{item}</span></li>)}</ul>
      <div id={`details-${feature.number}`} hidden={!expanded} className="mt-5 text-xs leading-relaxed text-primary/70">{feature.detail}</div>
      <button onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls={`details-${feature.number}`} className="group mt-auto flex items-center gap-2 pt-8 text-xs text-primary transition-colors hover:text-white">{expanded ? 'Show less' : 'Learn more'}{expanded ? <Minus size={15} /> : <ArrowRight size={15} className="-rotate-45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}</button>
    </div>
  </motion.article>;
}
function App() {
  const reduced = useReducedMotion();
  return <main>
    <section className="h-screen min-h-[620px] p-4 md:min-h-[660px] md:p-6" aria-label="Prisma creative studio">
      <div className="relative h-full overflow-hidden rounded-2xl bg-[#22221e] md:rounded-[2rem]">
        <video className="absolute inset-0 h-full w-full object-cover" src={asset('hero.mp4')} autoPlay={!reduced} loop muted playsInline poster={asset('hero-poster.jpg')} aria-hidden="true" />
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        <nav aria-label="Main navigation" className="absolute left-1/2 top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-b-2xl bg-black px-4 py-4 md:rounded-b-3xl md:px-8 md:py-5">
          <div className="flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">{[['Our story', 'our-story'], ['Collective', 'collective'], ['Workshops', 'workshops'], ['Programs', 'programs'], ['Inquiries', 'inquiries']].map(([label, id]) => <a key={id} href={`#${id}`} className="nav-link text-[10px] sm:text-xs md:text-sm" style={{ color: 'rgba(225, 224, 204, 0.8)' }}>{label}</a>)}</div>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 grid grid-cols-12 items-end gap-y-8 px-5 pb-8 sm:px-8 sm:pb-10 md:gap-6 md:px-10 lg:px-12 lg:pb-12">
          <h1 className="col-span-12 mb-1 text-[26vw] font-medium leading-[0.85] tracking-[-0.07em] sm:text-[24vw] md:col-span-8 md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw]" style={{ color: cream }}><WordsPullUp text="Prisma" showAsterisk /></h1>
          <div className="col-span-12 max-w-sm md:col-span-4 md:ml-1 md:max-w-none lg:mb-1 lg:pl-4">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5, duration: 1, ease }} className="mb-6 text-xs leading-[1.2] text-primary/70 sm:text-sm md:text-base">Prisma is a worldwide network of visual artists, filmmakers and storytellers bound not by place, status or labels but by passion and hunger to unlock potential through our unique perspectives.</motion.p>
            <motion.a href="#collective" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .7, duration: 1, ease }} className="group inline-flex items-center gap-7 rounded-full bg-primary py-1.5 pl-5 pr-1.5 text-sm font-medium text-black transition-[gap,background-color] hover:gap-9 hover:bg-[#eeebdc] sm:text-base">Join the lab<span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-primary transition-transform group-hover:scale-110 sm:h-10 sm:w-10"><ArrowRight size={20} strokeWidth={1.5} /></span></motion.a>
          </div>
        </div>
      </div>
    </section>
    <About />
    <section id="workshops" className="relative min-h-screen scroll-mt-8 bg-black px-4 pb-16 pt-5 md:px-6 md:pb-24 md:pt-8">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />
      <div className="relative mx-auto max-w-[1392px]">
        <h2 className="mb-12 text-center text-xl font-normal leading-tight sm:text-2xl md:mb-16 md:text-3xl lg:text-4xl" style={{ color: cream }}><WordsPullUpMultiStyle segments={[{ text: 'Studio-grade workflows for visionary creators.' }]} /><br /><WordsPullUpMultiStyle segments={[{ text: 'Built for pure vision. Powered by art.', className: 'text-gray-500' }]} /></h2>
        <div className="grid grid-cols-1 gap-3 sm:gap-2 md:grid-cols-2 md:gap-1 lg:min-h-[480px] lg:grid-cols-4">
          <motion.article className="relative min-h-[440px] overflow-hidden rounded-2xl bg-[#212121] lg:min-h-[480px]" initial={{ opacity: 0, scale: .95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }}>
            <video src={asset('canvas.mp4')} poster={asset('canvas-poster.jpg')} autoPlay={!reduced} loop muted playsInline className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <h3 className="absolute bottom-7 left-6 text-xl tracking-[-0.04em]" style={{ color: cream }}>Your creative canvas.</h3>
          </motion.article>
          {features.map((feature, i) => <FeatureCard key={feature.number} feature={feature} index={i} />)}
        </div>
      </div>
    </section>
  </main>;
}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
