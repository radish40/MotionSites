import { useRef, useState } from 'react';

const assets = import.meta.env.BASE_URL + 'assets/';
const gradient = { background: 'linear-gradient(90deg, #FA8453 0%, #F8C9B2 100%)' };
const shieldCopy = 'shielding users info with premier tech, granting them with safety in all place';
const riskCopy = 'Defense platforms constantly observe bandwidth streams, record files, and machine behaviors to uncover unusual patterns or outliers that could signal a defensive failure.';

function LogoMark() {
  return <svg viewBox="0 0 256 256" fill="white" className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true"><path d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z" /></svg>;
}
function Navbar() {
  const links = [{label:'products',target:'products'}, {label:'offerings',target:'offerings'}, {label:'mission',target:'mission'}, {label:'contact',target:'contact'}];
  return <header className="absolute top-0 left-0 right-0 z-20 px-3 sm:px-6 md:px-10 pt-4 sm:pt-6"><nav className="flex items-center justify-between" aria-label="Main navigation">
    <a href="#home" aria-label="guardnet home" className="flex items-center gap-2.5 bg-neutral-900/90 backdrop-blur rounded-full pl-3 pr-4 sm:pl-4 sm:pr-6 py-2.5 sm:py-3"><LogoMark/><span className="text-xs sm:text-sm">guardnet</span></a>
    <div className="hidden md:flex bg-neutral-900/90 backdrop-blur rounded-full px-3 py-2">{links.map(link=><a key={link.label} href={'#'+link.target} className="text-neutral-300 hover:text-white hover:bg-white/5 transition-colors text-sm px-5 py-2 rounded-full">{link.label}</a>)}</div>
    <a href="#mission" className="bg-white text-black text-xs sm:text-sm rounded-full px-4 sm:px-6 py-2.5 sm:py-3 hover:bg-neutral-200 transition-colors">start today</a>
  </nav></header>;
}
function Stat({number,caption,className,dividerFirst=false,positive=false}:{number:string;caption:string;className:string;dividerFirst?:boolean;positive?:boolean}) {
  const divider=<span className={'hidden md:block h-px w-24 bg-white/40 '+(positive?'rotate-[20deg]':'-rotate-[20deg]')} aria-hidden="true"/>;
  return <div className={'absolute flex items-center gap-5 '+className}>{dividerFirst&&divider}<div><div className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight">{number}</div><p className="text-[10px] sm:text-xs md:text-sm text-white/70 mt-1 font-light">{caption}</p></div>{!dividerFirst&&divider}</div>;
}
function Hero() {
  return <section id="home" aria-label="Shelter user info" className="relative min-h-screen h-screen w-full bg-black overflow-hidden">
    <video className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline aria-hidden="true" src={assets+'hero.mp4'}/>
    <Navbar/>
    <div className="relative h-full w-full max-w-[1320px] mx-auto">
      <h1 className="contents" aria-label="shelter user info"><span className="hero-title absolute text-white font-medium text-[24vw] md:text-[18vw] left-3 sm:left-4 md:left-10 top-[20%] sm:top-[18%]">shelter</span><span className="hero-title absolute text-white font-medium text-[24vw] md:text-[18vw] right-3 sm:right-4 md:right-10 top-[36%] sm:top-[38%]">user</span><span className="hero-title absolute text-white font-medium text-[24vw] md:text-[18vw] left-[10%] sm:left-[18%] md:left-[28%] top-[56%] sm:top-[58%]">info</span></h1>
      <p className="absolute left-4 sm:left-6 md:left-10 top-[48%] sm:top-[46%] max-w-[220px] sm:max-w-[300px] text-[13px] sm:text-[18px] leading-relaxed text-white/90 font-light">we are holding each file with supreme care, granting user with safety in all place</p>
      <Stat number="+2.7b" caption="mb info was concealed" className="left-4 sm:left-6 md:left-10 bottom-[12%]"/>
      <Stat number="+90k" caption="ventures run" className="right-4 sm:right-6 md:right-10 top-[15%]" dividerFirst positive/>
      <Stat number="+450k" caption="transfers" className="right-4 sm:right-6 md:right-10 bottom-[12%]" dividerFirst/>
    </div>
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black"/>
  </section>;
}
function SecuritySection() {
  const video = useRef<HTMLVideoElement>(null);
  const [confirmed,setConfirmed] = useState(false);
  const [demo,setDemo] = useState(false);
  function runDemo() { if(video.current){video.current.currentTime=0;void video.current.play().then(()=>setDemo(true)).catch(()=>setDemo(false));} }
  return <section id="mission" aria-label="Our security mission" className="relative min-h-[600px] h-screen w-full overflow-hidden bg-black">
    <video ref={video} className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline aria-hidden="true" src={assets+'security.mp4'}/>
    <div className="pointer-events-none absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent z-10"/>
    <div className="relative h-full w-full max-w-[1100px] mx-auto">
      <div className="absolute top-6 sm:top-10 left-1/2 -translate-x-1/2 z-20 w-max max-w-[95vw] bg-neutral-900/80 backdrop-blur rounded-full p-2 sm:p-3 flex">
        <button type="button" aria-pressed={confirmed} onClick={()=>setConfirmed(!confirmed)} className="text-white/90 text-xs sm:text-sm px-4 sm:px-7 py-2 sm:py-3 rounded-full hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap">{confirmed?'person confirmed ✓':'confirm real person'}</button>
        <button type="button" onClick={runDemo} style={gradient} className="text-black text-xs sm:text-sm px-4 sm:px-7 py-2 sm:py-3 rounded-full hover:brightness-110 transition-colors whitespace-nowrap">{demo?'replay demo':'run demo'}</button>
      </div>
      <p className="absolute left-4 sm:left-6 md:left-16 top-[62%] sm:top-[56%] max-w-[280px] sm:max-w-[440px] text-[13px] sm:text-[18px] leading-relaxed font-light text-white/80">{shieldCopy}</p>
      <p className="absolute right-4 sm:right-6 md:right-16 top-[26%] sm:top-[34%] max-w-[280px] sm:max-w-[500px] text-[13px] sm:text-[18px] leading-relaxed font-light text-white/90">By teaming up with a defender service, a business can dramatically improve the safeguard of its important info. This covers applying strong obfuscation protocols, gateway barriers, and observation engines to shield against unauthorized entries, info escapes, and malicious cyberhacks.</p>
    </div>
  </section>;
}
const logos = [
  {name:'Apex',path:'M12 2l2.39 4.84L20 8l-4 3.9L17.28 18 12 15.27 6.72 18 8 11.9 4 8l5.61-1.16L12 2z',blob:'-top-24 -left-24 bg-[#1e3a8a] opacity-40'},
  {name:'forge',path:'M20.63 8.46l-4.73-2.73-.53.31 5.1 2.94v5.88l-5.1 2.94.53.3 4.73-2.72V8.46zM8.1 6.04l.53.3L3.53 9.28v5.88L8.63 18.1l-.53.3-4.73-2.72V8.46L8.1 6.04zM16.05 14.3v-4.6L12 7.4 7.95 9.7v4.6L12 16.6l4.05-2.3zm-.53-.3L12 16.02l-3.52-2.02v-4.02L12 7.96l3.52 2.02v4.02z',blob:'-top-24 -left-24 bg-[#FA8453] opacity-30'},
  {name:'Eastern Delta',path:'M2 4l3 16h3l2-10 2 10h3l3-16h-3l-1.5 10L12 4h-2L8.5 14 7 4H2z',blob:'-bottom-24 -left-24 bg-[#F5D547] opacity-30'},
  {name:'Skybank',path:'M6 2l6 3.75L6 9.5 0 5.75 6 2zm12 0l6 3.75L18 9.5l-6-3.75L18 2zM0 13.25L6 9.5l6 3.75L6 17l-6-3.75zm18-3.75l6 3.75L18 17l-6-3.75 6-3.75zM6 18.25L12 14.5l6 3.75L12 22l-6-3.75z',blob:'top-1/2 -translate-y-1/2 -right-28 bg-[#1e3a8a] opacity-40 h-48 w-48'}
];
function CompaniesSection() {
  return <section id="offerings" aria-label="Companies we protect" className="relative w-full bg-black px-4 sm:px-6 md:px-10 py-12 sm:py-20">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">{logos.map(logo=><div key={logo.name} className="relative h-24 sm:h-32 md:h-36 rounded-2xl bg-neutral-950 overflow-hidden flex items-center justify-center">
      <div className={'absolute h-40 w-40 rounded-full blur-3xl '+logo.blob}/>{logo.name==='forge'&&<div className="absolute -bottom-24 -right-24 h-40 w-40 rounded-full blur-3xl bg-[#F5D547] opacity-25"/>}
      <div className="relative z-10 flex items-center gap-2 sm:gap-3"><svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-8 sm:w-8 fill-white" aria-hidden="true"><path d={logo.path}/></svg>{logo.name==='Eastern Delta'?<span className="text-white text-lg sm:text-2xl font-semibold leading-tight">Eastern<br/>Delta</span>:<span className="text-white text-xl sm:text-3xl font-semibold tracking-tight">{logo.name}</span>}</div>
    </div>)}</div>
    <div id="contact" className="mt-16 sm:mt-28 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 md:w-[70%] md:ml-auto">
      <p className="max-w-md text-[13px] sm:text-[18px] leading-relaxed text-white/70 font-light">{shieldCopy}</p>
      <a href="#mission" className="relative rounded-full p-[1.5px] group shrink-0" style={gradient}><span className="block rounded-full bg-black px-8 sm:px-10 py-2.5 sm:py-3 text-white text-sm group-hover:bg-neutral-900 transition-colors">Run Demo</span></a>
    </div>
  </section>;
}
function BenefitsSection() {
  return <section id="products" className="relative w-full bg-black px-4 sm:px-6 md:px-10 py-12 sm:py-20">
    <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-light text-center mb-12 sm:mb-24" style={{letterSpacing:'-0.04em'}}>Key Benefits</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
      <article className="relative h-[380px] sm:h-[460px] rounded-2xl bg-neutral-950 overflow-hidden p-6 sm:p-8">
        <div className="absolute top-1/2 -translate-y-1/2 -left-[420px] h-[460px] w-[460px] rounded-full bg-[#1e3a8a] blur-3xl opacity-40"/>
        <h3 className="relative text-xl sm:text-2xl font-light leading-tight">Preemptive Risks<br/>Scouting and Reactions</h3>
        <p className="relative mt-12 sm:mt-20 text-[13px] sm:text-[14px] leading-relaxed text-white/70 font-light max-w-[280px]">{riskCopy}</p>
      </article>
      <article className="relative h-[380px] sm:h-[460px] rounded-2xl bg-neutral-950 overflow-hidden flex flex-col">
        <div className="relative w-full overflow-hidden h-3/4"><video className="w-full h-full object-cover block" autoPlay loop muted playsInline aria-hidden="true" src={assets+'benefit.mp4'}/><div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-neutral-950"/></div>
        <div className="flex-1 flex items-center justify-start p-6 sm:p-8"><h3 className="text-xl sm:text-2xl font-light leading-tight">Know-how and Sectoral<br/>Awareness</h3></div>
      </article>
      <article className="relative h-[380px] sm:h-[460px] rounded-2xl bg-neutral-950 overflow-hidden p-6 sm:p-8 flex flex-col">
        <div className="absolute -top-28 -right-28 h-56 w-56 rounded-full bg-[#1e3a8a] blur-3xl opacity-40"/>
        <h3 className="relative text-xl sm:text-2xl font-light leading-tight">Preemptive Risks<br/>Scouting and Reactions</h3>
        <p className="relative mt-auto text-[13px] sm:text-[14px] leading-relaxed text-white/70 font-light max-w-[320px]">{riskCopy}</p>
      </article>
    </div>
  </section>;
}
export default function App(){return <main className="min-h-screen bg-black text-white flex flex-col items-center overflow-x-hidden w-full"><Hero/><div className="w-full max-w-[1400px]"><SecuritySection/><CompaniesSection/><BenefitsSection/></div></main>;}
