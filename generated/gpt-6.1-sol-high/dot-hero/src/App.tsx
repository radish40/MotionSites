import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const messages = ['Are you here?', 'Yes, I am.', 'Speak soon.'];
const ease = [0.16, 1, 0.3, 1] as const;

function TypingMessages() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const message = messages[messageIndex];
    const complete = text === message;
    const timer = window.setTimeout(() => {
      if (!deleting && complete) {
        setDeleting(true);
      } else if (deleting && text.length === 0) {
        setDeleting(false);
        setMessageIndex((index) => (index + 1) % messages.length);
      } else {
        setText(deleting ? text.slice(0, -1) : message.slice(0, text.length + 1));
      }
    }, deleting ? 50 : complete ? 2000 : 100);
    return () => window.clearTimeout(timer);
  }, [text, deleting, messageIndex]);

  return (
    <div id="access" className="pointer-events-none absolute left-[48.5%] bottom-[32%] z-30 flex w-[110px] -translate-x-1/2 justify-start text-left sm:w-[130px] md:left-[47.5%] lg:left-[48.5%]">
      <span className="sr-only">A daily conversation: Are you here? Yes, I am. Speak soon.</span>
      <div aria-hidden="true" data-typing className="font-nokia min-h-[1.5em] text-[10px] leading-tight break-words text-[#2A3616] sm:text-[14px]">
        {text}<motion.span className="ml-1 inline-block h-3 w-1.5 bg-[#2A3616] align-middle" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <header className="pointer-events-none fixed top-6 left-1/2 z-50 w-[95%] max-w-5xl -translate-x-1/2">
      <nav aria-label="Main navigation" className="pointer-events-auto flex items-center justify-between rounded-full border border-black/10 bg-transparent py-2 pr-2 pl-6 backdrop-blur-md">
        <a href="#home" aria-label="dot. home" className="font-instrument text-[28px] tracking-tight text-[#1a1a1a]">dot.</a>
        <div className="hidden items-center gap-10 md:flex">
          {['Philosophy', 'Trust', 'Access', 'Tribe'].map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="font-sans text-[14px] text-[#1a1a1a] transition-opacity duration-200 hover:opacity-50">{link}</a>
          ))}
        </div>
        <a href="#access" className="group relative isolate overflow-hidden rounded-full bg-[#0871E7] px-6 py-3 font-sans text-[14px] text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] outline-1 -outline-offset-1 outline-[#0871E7] transition-transform duration-200 active:scale-95">
          <span aria-hidden="true" className="pointer-events-none absolute top-[1px] left-[10%] -z-10 h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#DEF0FC] to-transparent transition-transform group-hover:scale-x-105" />
          Link up
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <main id="home" className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#F3F4ED] px-6 pt-24 md:pt-32">
      <div className="absolute inset-0 z-0" id="tribe">
        <video aria-hidden="true" autoPlay loop muted playsInline preload="auto" className="h-full w-full object-cover">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260427_054418_a6d194f0-ac86-4df9-abe5-ded73e596d7c.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-white/5" />
      </div>
      <div className="pointer-events-none relative z-20 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease }}>
          <h1 id="philosophy" className="font-instrument mb-6 text-[38px] leading-[0.85] tracking-tight text-[#1a1a1a] md:text-[56px] lg:text-[72px]">Short notes.<br />Daily calm.</h1>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.3, ease }}>
          <p id="trust" className="mx-auto max-w-xl font-sans text-[16px] leading-relaxed font-normal text-[#1a1a1a]/70 md:text-[18px]">Linked with a single anonymous peer. One message every day. A quiet rhythm in the digital noise.</p>
        </motion.div>
      </div>
      <TypingMessages />
    </main>
  );
}

export default function App() {
  return <><Navbar /><Hero /></>;
}
