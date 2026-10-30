import Button from './components/Button';
import TestimonialSection from './components/TestimonialSection';
import PricingSection from './components/PricingSection';
import TestimonialCarousel from './components/TestimonialCarousel';
import ProjectsSection from './components/ProjectsSection';
import PartnerSection from './components/PartnerSection';
import Footer from './components/Footer';
import CopyrightBar from './components/CopyrightBar';
import BottomNav from './components/BottomNav';
import { Reveal } from './components/Reveal';
import { asset, marqueeImages } from './assets';
export default function App() {
 return <><main>
  <section className="max-w-[440px] mx-auto px-6 pt-12 md:pt-16" aria-labelledby="hero-title">
   <Reveal delay={0.1}><div className="font-accent text-[32px] md:text-[40px] lg:text-[44px] font-semibold tracking-tight mb-4">Viktor Oddy</div></Reveal>
   <Reveal delay={0.2}><p className="font-mono text-xs md:text-sm mb-2">The creative studio of Viktor Oddy</p></Reveal>
   <Reveal delay={0.3}><h1 id="hero-title" className="display-heading whitespace-nowrap">Build the <span className="font-accent">next wave,</span><br/>the <span className="font-accent">bold way.</span></h1></Reveal>
   <Reveal delay={0.4}><div className="flex flex-col gap-6 text-sm md:text-base leading-relaxed mt-5 md:mt-6">
    <p>I spent seven years at Apple crafting products used by over a billion people. I founded Vortex Studio to bring that same level of thinking to innovators shaping what comes next.</p>
    <p>The studio is deliberately small. I guide the creative vision on every project, backed by a veteran design crew that moves fast without cutting corners.</p>
    <p>Projects start at $5,000 per month.</p>
   </div></Reveal>
   <Reveal delay={0.5}><div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-5 md:mt-6"><Button>Start a chat</Button><Button href="#projects" variant="secondary">View projects</Button></div></Reveal>
  </section>
  <section className="marquee mt-16 md:mt-20 mb-16" aria-label="Selected design explorations"><div className="marquee-track">{[0,1].map(copy => <div className="marquee-group" key={copy} aria-hidden={copy === 1}>{marqueeImages.map((name,i) => <img key={name} src={asset(name)} alt={copy ? '' : ['Space Voyage website','Cosmic portfolio','Velorah website','ASME website','Data platform','Aethera website','Orbit Web3 website','Nexora website'][i]} className="h-[280px] md:h-[500px] w-auto object-cover mx-3 rounded-2xl shadow-lg" />)}</div>)}</div></section>
  <TestimonialSection/><PricingSection/><TestimonialCarousel/><ProjectsSection/><PartnerSection/>
 </main><Footer/><CopyrightBar/><BottomNav/></>;
}
