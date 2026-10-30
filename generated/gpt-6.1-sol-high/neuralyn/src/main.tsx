import React, { useRef, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import { ChevronDown, ArrowUpRight, X } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from './components/ui/button';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import './styles.css';
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
const quote = 'Neuralyn revolutionized how we handle financial insights using smart analytics. We are now driving better outcomes quicker than we ever imagined! Neuralyn revolutionized how we handle financial insights using smart analytics.';
function Word({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const range = [index / total, (index + 1) / total];
  const opacity = useTransform(progress, range, [0.2, 1]);
  const color = useTransform(progress, range, ['hsl(0 0% 35%)', 'hsl(0 0% 100%)']);
  const reduce = useReducedMotion();
  return <motion.span style={reduce ? {} : { opacity, color }} className="mr-[0.3em]">{word}</motion.span>;
}
function Testimonial() {
 const ref = useRef<HTMLElement>(null);
 const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end center'] });
 const words = quote.split(' ');
 return <section ref={ref} id="reviews" className="testimonial min-h-screen px-8 py-24 md:px-28 md:py-32"><div className="mx-auto flex max-w-3xl flex-col items-start gap-10"><img src={asset('quote-symbol.png')} alt="" className="h-10 w-14 object-contain"/><blockquote aria-label={quote} className="m-0 flex flex-wrap text-4xl font-medium leading-[1.2] md:text-5xl"><span className="contents" aria-hidden="true">{words.map((word, index) => <Word key={index} word={word} index={index} total={words.length} progress={scrollYProgress}/>)}<span className="ml-2 text-muted-foreground">”</span></span></blockquote><div className="flex items-center gap-4"><img className="h-14 w-14 rounded-full border-[3px] border-foreground object-cover" src={asset('testimonial-avatar.png')} alt="Brooklyn Simmons"/><div><p className="text-base font-semibold leading-7">Brooklyn Simmons</p><p className="text-sm font-normal leading-5 text-muted-foreground">Product Manager</p></div></div></div></section>;
}
function App() {
 const sectionRef = useRef<HTMLElement>(null);
 const dialogRef = useRef<HTMLDialogElement>(null);
 const [modal, setModal] = useState<'signin' | 'contact' | null>(null);
 const [submitted, setSubmitted] = useState(false);
 const reduced = useReducedMotion();
 const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
 const contentY = useTransform(scrollYProgress, [0, 1], [0, -200]);
 const contentOpacity = useTransform(scrollYProgress, [0, .5], [1, 0]);
 const dashboardY = useTransform(scrollYProgress, [0, 1], [0, -250]);
 const entrance = (y: number, delay: number, duration = .6) => ({ initial: { opacity: reduced ? 1 : 0, y: reduced ? 0 : y }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : duration, delay: reduced ? 0 : delay } });
 useEffect(() => { if (modal) { setSubmitted(false); dialogRef.current?.showModal(); } else dialogRef.current?.close(); }, [modal]);
 const showDashboard = () => document.getElementById('dashboard')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'center' });
 return <><main><section ref={sectionRef} id="home" className="hero relative h-screen overflow-hidden">
  <nav aria-label="Main navigation" className="relative z-40 flex items-center justify-between px-8 py-4 md:px-28"><div className="flex items-center gap-12 md:gap-20"><a href="#home" className="flex items-center gap-2.5" aria-label="Neuralyn home"><img src={asset('logo.png')} alt="" className="h-8 w-8 object-contain"/><span className="text-xl font-bold tracking-tight">Neuralyn</span></a><div className="hidden items-center gap-1 md:flex"><a href="#home" className="nav-link text-foreground">Home</a><DropdownMenu.Root><DropdownMenu.Trigger className="nav-link inline-flex items-center gap-1">Services <ChevronDown size={14}/></DropdownMenu.Trigger><DropdownMenu.Portal><DropdownMenu.Content sideOffset={12} className="service-menu"><DropdownMenu.Item asChild><button onClick={showDashboard}>Analytics overview <ArrowUpRight size={14}/></button></DropdownMenu.Item><DropdownMenu.Item asChild><a href="#reviews">Customer stories <ArrowUpRight size={14}/></a></DropdownMenu.Item></DropdownMenu.Content></DropdownMenu.Portal></DropdownMenu.Root><a href="#reviews" className="nav-link">Reviews</a><button className="nav-link" onClick={() => setModal('contact')}>Contact us</button></div></div><Button onClick={() => setModal('signin')}>Sign In</Button></nav>
  <motion.div style={reduced ? {} : { y: contentY, opacity: contentOpacity }} className="hero-copy relative z-20 mt-16 flex flex-col items-center px-4 text-center md:mt-20">
   <motion.div {...entrance(10, 0, .5)} className="liquid-glass mb-6 flex items-center gap-2.5 rounded-lg px-3 py-2"><span className="rounded-md bg-white px-2 py-0.5 text-sm font-medium text-black">New</span><span className="text-sm font-medium text-muted-foreground">Say Hello to Corewave v3.2</span></motion.div>
   <motion.h1 {...entrance(20, .1)} className="mb-3 text-5xl font-medium leading-tight tracking-[-2px] md:text-7xl md:leading-[1.15]">Your Insights.<br/>One Clear <em className="font-serif font-normal italic">Overview.</em></motion.h1>
   <motion.p {...entrance(20, .2)} className="hero-subtitle mb-8 text-lg font-normal leading-6 opacity-90">Neuralyn helps teams track metrics, goals,<br/>and progress with precision.</motion.p>
   <motion.div {...entrance(20, .3)} whileHover={reduced ? {} : { scale: 1.03 }} whileTap={reduced ? {} : { scale: .98 }}><Button size="pill" onClick={showDashboard}>Get Started for Free</Button></motion.div>
  </motion.div>
  <motion.div {...entrance(40, .4, .8)} className="dashboard-area relative aspect-video w-screen" style={{ marginLeft: 'calc(-50vw + 50%)' }}><video className="absolute inset-0 h-full w-full object-cover" src={asset('hero-background.mp4')} autoPlay={!reduced} loop muted playsInline preload="auto" aria-hidden="true"/><div className="video-top-fade absolute inset-x-0 top-0 h-20"/><motion.img id="dashboard" className="dashboard-image absolute left-1/2 w-[90%] max-w-5xl rounded-2xl" style={{ x: '-50%', y: reduced ? 0 : dashboardY, mixBlendMode: 'luminosity' }} src={asset('hero-dashboard.png')} alt="Neuralyn analytics dashboard showing revenue, active users, conversions, traffic sources, and recent activity"/></motion.div>
  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-40 bg-gradient-to-t from-background to-transparent"/>
 </section><Testimonial/></main>
 <dialog ref={dialogRef} className="dialog" onCancel={() => setModal(null)} onClick={e => { if (e.target === e.currentTarget) setModal(null); }}><div className="relative"><button className="close-button" aria-label="Close dialog" onClick={() => setModal(null)}><X size={20}/></button><img src={asset('logo.png')} className="mb-6 h-9 w-9" alt=""/><h2 className="mb-3 text-2xl font-medium tracking-tight">{modal === 'signin' ? 'Welcome to Neuralyn' : 'Contact Neuralyn'}</h2><p className="mb-6 text-sm leading-6 text-muted-foreground">{modal === 'signin' ? 'Explore a clearer view of your business.' : 'Tell us how we can help your team.'}</p>{submitted ? <div role="status" className="rounded-lg border border-white/20 p-5 text-sm leading-6">{modal === 'signin' ? 'This is a preview of Neuralyn. Account authentication is not connected.' : 'Your message is shown in this preview only. A contact service is not connected.'}<Button className="mt-4 w-full" onClick={() => { setModal(null); showDashboard(); }}>Explore the overview</Button></div> : <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}><label>Email address<input type="email" required autoComplete="email" placeholder="you@company.com"/></label>{modal === 'signin' ? <label>Password<input type="password" required minLength={8} autoComplete="current-password" placeholder="Enter your password"/></label> : <label>Message<textarea required rows={4} placeholder="How can we help?"/></label>}<Button type="submit" className="mt-2 w-full">{modal === 'signin' ? 'Sign In' : 'Send message'}</Button><p className="mt-4 text-xs text-muted-foreground">Interactive preview · No data is sent or stored.</p></form>}</div></dialog>
 </>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
