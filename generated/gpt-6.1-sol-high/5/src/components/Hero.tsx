import { originalMediaEnabled } from '../lib/hero-media';
import { useHeroMedia } from '../hooks/useHeroMedia';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Zap, Play, Pause } from 'lucide-react';
import { InfiniteSlider } from './ui/infinite-slider';
const logos = ['openai','nvidia','github','vercel','linear'];
export default function Hero() {
 const reduced = useReducedMotion();
 const enabled = originalMediaEnabled();
 const { video, status, playing, togglePlayback } = useHeroMedia(enabled, reduced);
 const unavailable = status !== 'ready';
 return <main>
  <header className="site-header"><a className="wordmark" href={import.meta.env.BASE_URL} aria-label="Digital Reality home"><span className="brand-symbol" aria-hidden="true"><i/><i/></span>digital reality<span className="registered">®</span></a><span className="availability"><span/>Open for the extraordinary</span></header>
  <section className="hero" aria-labelledby="hero-title">
   <motion.div className="hero-content relative z-20" initial={reduced ? false : {opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:0.85,ease:[0.22,1,0.36,1]}}>
    <div className="announcement"><span className="zap-box"><Zap size={14} fill="currentColor" strokeWidth={1.5}/></span><span>Used by founders. Loved by devs.</span><ArrowUpRight size={13} className="badge-arrow"/></div>
    <h1 id="hero-title">Your Vision<br/><span>Our Digital Reality.</span></h1>
    <p className="hero-description">We turn bold ideas into modern designs that don't just<br className="desktop-break"/> look amazing, they grow your business fast.</p>
    <div className="cta-wrap"><a className="cta" href="mailto:?subject=Book%20a%2015-min%20call&body=Hi%2C%20I%E2%80%99d%20love%20to%20discuss%20my%20project.%0A%0AMy%20availability%3A%20"><span>Book a 15-min call</span><span className="cta-arrow"><ArrowUpRight size={19} strokeWidth={1.8}/></span></a></div>
    <span className="cta-note">Big ideas start with a little conversation.</span>
   </motion.div>
   <div className="hero-media relative z-10 -mt-[150px]" data-media-status={unavailable ? 'unavailable' : 'ready'} data-media-mode={enabled ? 'original-opt-in' : 'local-approximation'} data-playback-status={status}>
    <div className="ambient-art" aria-hidden="true"><div className="orbital orbital-one"/><div className="orbital orbital-two"/><div className="orbital orbital-three"/><div className="horizon"/></div>
    {enabled && <video ref={video} className="hero-video w-full mix-blend-screen" autoPlay={!reduced} muted loop playsInline aria-label="Abstract purple and pink flowing light"/>}
    <div className="video-fade"/>
    {!unavailable && <button className="playback" onClick={togglePlayback} aria-label={playing ? 'Pause background video' : 'Play background video'}>{playing ? <Pause size={13}/> : <Play size={13}/>}</button>}
    <div className="media-caption"><span className="small-cross">+</span><span>A LITTLE VISION. INFINITE POSSIBILITIES.</span><span className="small-cross">+</span></div>
   </div>
  </section>
  <section className="logo-cloud" aria-label="Our trusted teams"><div className="logo-inner"><p>Powering the<br/><span>best teams</span></p><div className="logo-divider"/><InfiniteSlider>{logos.map(logo => <img key={logo} src={`${import.meta.env.BASE_URL}logos/${logo}.svg`} className="brightness-0 invert" alt={logo === 'openai' ? 'OpenAI' : logo === 'github' ? 'GitHub' : logo === 'nvidia' ? 'NVIDIA' : logo.charAt(0).toUpperCase()+logo.slice(1)}/>)}</InfiniteSlider></div></section>
 </main>;
}
