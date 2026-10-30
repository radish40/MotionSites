import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Instagram, Youtube, Facebook, X, Plus, Asterisk, Aperture, Layers, MoveUpRight, Command } from 'lucide-react';
import './styles.css';

const panels = {
  About: { title: 'GOOD DESIGN. LASTING IMPACT.', text: 'We’re Brandly, an independent brand design studio. We help ambitious businesses find their voice and turn it into a visual identity that resonates.' },
  Features: { title: 'BUILT TO RESONATE.', text: 'Brand strategy, visual identity, and digital design. From your first idea to your next chapter, we bring every part of your brand together.' },
  Pricing: { title: 'EVERY BRAND IS DIFFERENT.', text: 'We scope each project around your goals, timeline, and deliverables. Start a conversation to find the right fit for your brand.' },
  FAQ: { title: 'A FEW GOOD QUESTIONS.', text: 'What do we create? Brand strategy, identities, and digital experiences. Who do we work with? Ambitious brands of every size. Where do we begin? With a conversation about your vision.' },
  Help: { title: 'LET’S TALK BRAND.', text: 'Have a project in mind or a question about working together? Tell us a little about your brand to start the conversation.' },
};
const brands = [ ['Frame', Command], ['Supa', Asterisk], ['Hype', Aperture], ['Hype', Layers], ['Ultra', Plus], ['Ship', MoveUpRight] ];

function App() {
  const dialog = useRef(null);
  const [panel, setPanel] = useState('About');
  const [sent, setSent] = useState(false);
  const open = (name) => { setPanel(name); setSent(false); dialog.current.showModal(); };
  const form = ['Start today', 'Sign Up', 'Log In', 'Help', 'Pricing'].includes(panel);
  return (
    <div className="page h-screen overflow-hidden flex flex-col bg-[#F5F3EE]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <video className="fixed top-0 left-0 w-full h-full object-cover pointer-events-none" style={{ zIndex: 0 }} autoPlay loop muted playsInline aria-hidden="true" src={`${import.meta.env.BASE_URL}assets/brandly-background.mp4`} />
      <header className="relative px-6 lg:px-12 py-4 lg:py-6 shrink-0 z-10">
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          <a className="text-2xl lg:text-3xl font-bold tracking-tight" href={import.meta.env.BASE_URL} aria-label="Brandly home">Brandly</a>
          <div className="hidden md:flex items-center gap-8 text-base lg:text-lg nav-links">
            {Object.keys(panels).map(name => <button key={name} className="nav-link" onClick={() => open(name)}>{name}</button>)}
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 lg:px-6 py-2 text-base lg:text-lg hover:text-black transition" onClick={() => open('Sign Up')}>Sign Up</button>
            <button className="px-4 lg:px-6 py-2 bg-black text-white text-base lg:text-lg hover:bg-gray-800 transition" onClick={() => open('Log In')}>Log In</button>
          </div>
        </nav>
      </header>
      <main className="relative px-6 lg:px-12 py-6 lg:py-8 flex-1 flex flex-col justify-between z-10 min-h-0">
        <div className="top-row grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <section className="intro">
            <h1 className="display text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-normal leading-[0.80] tracking-tight mb-4 lg:mb-5">BUILDING<br />BRANDS THAT<br />RESONATE</h1>
            <p className="subtitle text-lg lg:text-xl mb-4 lg:mb-5 max-w-md">Thoughtful design that captivates, empowers, and creates lasting impact.</p>
            <button className="start-button flex items-center gap-3 pl-8 pr-1.5 py-1.5 bg-black text-white rounded-full hover:bg-gray-800 transition" onClick={() => open('Start today')}>
              <span>Start today</span><span className="flex items-center justify-center bg-white text-black rounded-full w-10 h-10"><ArrowRight size={22} strokeWidth={1.8} /></span>
            </button>
          </section>
          <section className="stat text-right" aria-label="Brands launched">
            <h2 className="display text-5xl lg:text-6xl xl:text-7xl leading-[0.9] tracking-tight">50+ BRANDS<br />LAUNCHED</h2>
            <p className="stat-description mt-4 lg:mt-5 text-base lg:text-lg max-w-xs ml-auto">From bold beginnings to iconic identities, we build brands that stand out and stay with you.</p>
          </section>
        </div>
        <div className="middle-row grid grid-cols-2 gap-8 lg:gap-12 items-end">
          <section className="bio max-w-sm">
            <p className="text-base lg:text-lg">We’re a team of brand designers turning big ideas into meaningful identities. Creating connections through thoughtful design.</p>
            <div className="socials flex gap-5 mt-5 items-center">
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={21} fill="currentColor" strokeWidth={0} /></a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={22} strokeWidth={1.8} /></a>
              <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={24} strokeWidth={1.8} /></a>
            </div>
          </section>
          <section className="stat text-right">
            <h2 className="display text-5xl lg:text-6xl xl:text-7xl leading-[0.9] tracking-tight">5+ YEARS IN<br />THE INDUSTRY</h2>
            <p className="stat-description mt-4 lg:mt-5 text-base lg:text-lg max-w-xs ml-auto">Five years of shaping bold identities. Experience and fresh thinking that move your brand forward.</p>
          </section>
        </div>
        <section className="brand-bar grid grid-cols-6 gap-3 lg:gap-4" aria-label="Selected brands">
          {brands.map(([name, Icon], i) => <div key={i} className="brand-card bg-white rounded-lg flex items-center justify-center gap-2 lg:gap-3"><Icon className={`brand-symbol symbol-${i}`} strokeWidth={i === 4 ? 5 : 2.6} /><span className="brand-name">{name}<br />Blox</span></div>)}
        </section>
      </main>
      <dialog ref={dialog} className="contact-dialog" onClick={e => { if (e.target === dialog.current) dialog.current.close(); }} onClose={() => setSent(false)}>
        <button className="dialog-close" aria-label="Close dialog" onClick={() => dialog.current.close()}><X size={24} /></button>
        <p className="text-sm mb-5">Brandly / {panel}</p>
        <h2 className="display text-4xl leading-tight mb-4">{panels[panel]?.title || (panel === 'Log In' ? 'WELCOME BACK.' : 'LET’S BUILD YOUR BRAND.')}</h2>
        <p className="mb-6 text-sm leading-relaxed">{panels[panel]?.text || 'This is a portfolio concept. Account access and project enquiries are demonstrated locally.'}</p>
        {form && (sent ? <p className="form-result" role="status">{panel === 'Log In' ? 'Demo complete. No account service is connected.' : 'Thanks for trying Brandly. This demo does not send or save your details.'}</p> : <form onSubmit={e => { e.preventDefault(); setSent(true); }}>
          <label className="block text-sm mb-2" htmlFor="email">Email address</label><input id="email" type="email" required placeholder="you@yourbrand.com" className="w-full border border-black/30 bg-transparent p-3 mb-4" />
          {panel === 'Log In' && <><label className="block text-sm mb-2" htmlFor="password">Password</label><input id="password" type="password" required minLength={6} className="w-full border border-black/30 bg-transparent p-3 mb-4" /></>}
          <button className="bg-black text-white rounded-full px-6 py-3 flex gap-5 items-center">{panel === 'Log In' ? 'Try demo login' : 'Try demo enquiry'}<ArrowRight size={18} /></button>
          <p className="text-xs mt-3 opacity-60">Demo only. No information is sent or stored.</p>
        </form>)}
      </dialog>
    </div>
  );
}
createRoot(document.getElementById('root')).render(<App />);
