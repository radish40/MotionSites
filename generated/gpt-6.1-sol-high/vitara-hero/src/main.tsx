import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Send, Zap, Stethoscope, BarChart3, X, ArrowUpRight } from 'lucide-react';
import './styles.css';

const VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_134434_5de46cb4-38e7-42a6-a8bc-6e62b2fd6c7b.mp4';

function AnimatedText({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  return <span className={className} aria-label={text}>{text.split(' ').map((word, index) => <React.Fragment key={index}><span aria-hidden="true" className="animated-word animate-fadeUp" style={{ animationDelay: `${delay + index * .1}s` }}>{word}</span>{' '}</React.Fragment>)}</span>;
}

const actions = [
  { label: 'Start Wellness Check', icon: Zap, prompt: 'I’d like to start a wellness check.' },
  { label: 'Chat with MedAI', icon: Stethoscope, prompt: 'I’d like to chat with MedAI.' },
  { label: 'View Insights', icon: BarChart3, prompt: 'I’d like to explore my health insights.' },
];

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [dialog, setDialog] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!dialog) return;
    previousFocus.current = document.activeElement as HTMLElement;
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDialog(null);
      if (event.key === 'Tab') {
        const controls = [...document.querySelectorAll<HTMLElement>('.modal button, .modal input')];
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); previousFocus.current?.focus(); };
  }, [dialog]);
  const open = (name: string) => { setSubmitted(false); setDialog(name); };
  const send = () => {
    if (!message.trim()) { input.current?.focus(); return; }
    setResponse('Your next step starts here. Vitara’s personalized care experience is coming soon.');
    setMessage('');
  };
  return <>
    <header className="bg-white px-6 md:px-12 lg:px-20">
      <nav className="navigation" aria-label="Main navigation">
        <a className="logo text-2xl font-semibold text-gray-900" href="#home" aria-label="Vitara home">Vitara<span className="logo-dot">.</span></a>
        <div className="hidden md:flex nav-links">
          {['Home', 'Services', 'Team', 'Membership', 'Resources'].map(item => <a key={item} className="text-gray-600 hover:text-gray-900" href={item === 'Home' ? '#home' : '#care'} onClick={item !== 'Home' ? () => open(item) : undefined}>{item}</a>)}
        </div>
        <div className="account-actions"><button onClick={() => open('Login')} className="login text-gray-800">Login</button><button onClick={() => open('Sign up')} className="signup rounded-lg bg-gray-800 text-white">Sign up <ArrowUpRight size={14} aria-hidden="true" /></button></div>
      </nav>
    </header>
    <main>
      <section id="home" className="hero relative px-6 md:px-12 lg:px-20">
        <video className="hero-video" autoPlay loop muted playsInline preload="auto" aria-hidden="true" onError={e => { const video = e.currentTarget; if (!video.src.includes('/assets/vitara-hero.mp4')) video.src = `${import.meta.env.BASE_URL}assets/vitara-hero.mp4`; }} src={VIDEO} />
        <div className="hero-wash" />
        <div className="hero-content relative">
          <div className="eyebrow"><span /> INTELLIGENCE FOR A HEALTHIER YOU</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl"><AnimatedText text="Smart Care Begins with Data + Insight" /></h1>
          <p className="hero-subtitle text-lg md:text-xl"><AnimatedText text="Turn medical insights into personalized wellness plans." delay={.45} /></p>
          <form className="care-box rounded-2xl shadow-2xl" onSubmit={e => { e.preventDefault(); send(); }}>
            <label className="sr-only" htmlFor="care-message">Ask Vitara</label>
            <textarea id="care-message" ref={input} value={message} onChange={e => { setMessage(e.target.value); setResponse(''); }} placeholder="Welcome to Vitara — your care intelligence hub!" onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
            <div className="input-toolbar"><div className="action-viewport"><div className="quick-actions scrollbar-hide">{actions.map(({ label, icon: Icon, prompt }) => <button type="button" key={label} onClick={() => { setMessage(prompt); setResponse(''); input.current?.focus(); }}><Icon size={13} strokeWidth={1.5} />{label}</button>)}</div></div><button type="submit" className="send-button rounded-lg" aria-label="Send message"><Send size={18} strokeWidth={1.6} /></button></div>
            {response && <p className="response" role="status">{response}</p>}
          </form>
        </div>
        <div className="hero-bottom-fade" />
      </section>
      <section id="care" className="care-section bg-vitara px-6 md:px-12 lg:px-20">
        <div className="care-heading"><div className="section-label"><span /> A NEW PERSPECTIVE ON CARE</div><h2 className="text-3xl md:text-5xl lg:text-6xl"><AnimatedText text="Your proactive shield against disease" delay={.2} /></h2></div>
        <div className="care-description"><p><AnimatedText text="We blend smart technology & clinical wisdom to provide tailored, preventive, & insight-rich medicine for tomorrow." delay={.4} /></p><div className="care-rule" /></div>
      </section>
    </main>
    {dialog && <div className="modal-backdrop" onClick={() => setDialog(null)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onClick={e => e.stopPropagation()}><button ref={closeButton} className="close-modal" aria-label="Close dialog" onClick={() => setDialog(null)}><X size={20} /></button><span className="section-label">VITARA</span><h2 id="dialog-title">{dialog === 'Login' ? 'Welcome back.' : dialog === 'Sign up' ? 'Your healthier future starts here.' : dialog}</h2>{dialog === 'Login' || dialog === 'Sign up' ? submitted ? <p role="status">The Vitara member experience is coming soon. Please check back to {dialog === 'Login' ? 'log in' : 'create your account'}.</p> : <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}><p>{dialog === 'Login' ? 'Enter your email to continue to Vitara.' : 'Discover a more personal approach to your health.'}</p><label htmlFor="email">Email address</label><input id="email" type="email" placeholder="you@example.com" required /><button className="modal-primary" type="submit">Continue <ArrowUpRight size={16} /></button></form> : <><p>{{ Services: 'Personalized wellness checks, intelligent health conversations, and insights that help you take a proactive approach to care.', Team: 'Smart technology meets clinical wisdom. Our care experience brings these perspectives together around you.', Membership: 'A more connected approach to your wellbeing. The Vitara membership experience is coming soon.', Resources: 'Start with a wellness check or explore your health questions with the care intelligence hub.' }[dialog]}</p><button className="modal-primary" onClick={() => { setDialog(null); input.current?.focus(); }}>Explore Vitara <ArrowUpRight size={16} /></button></>}</section></div>}
  </>;
}

createRoot(document.getElementById('root')!).render(<App />);
