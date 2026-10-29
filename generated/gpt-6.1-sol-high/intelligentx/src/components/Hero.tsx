import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
export default function Hero() {
  const [language, setLanguage] = useState<'en' | 'pl'>('en');
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const polish = language === 'pl';
  return <section className="relative min-h-[110vh] sm:min-h-[140vh] w-full flex flex-col items-center justify-start overflow-hidden bg-bg-base">
    <div className="absolute top-[15vh] sm:top-[20vh] left-0 w-full h-[95vh] sm:h-[120vh] z-0 pointer-events-none">
      <video autoPlay loop muted playsInline aria-hidden="true" className="w-full h-full object-cover opacity-100" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260603_132049_036591b8-6e92-4760-b94c-a7ea6eef315c.mp4" />
      <div className="absolute top-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-b from-bg-base to-transparent" />
    </div>
    <div className="hero-content max-w-7xl w-full mx-auto px-8 md:px-16 lg:px-20 relative z-10 grid grid-cols-12 gap-x-4 md:gap-x-8">
      <div className="col-span-12 md:col-span-10 md:col-start-2">
        <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }} className="font-display hero-heading font-normal text-[#8e8e8e]">
          {polish ? <><span className="text-[#1a1a1a]">Remix: Mentality oferuje</span> informacje<br className="hidden lg:block" /> i zasoby, które pomogą Ci zadbać<br className="hidden lg:block" /> o <Eye /> zdrowie psychiczne.</> : <><span className="text-[#1a1a1a]">Remix: Mentality offers</span> information<br className="hidden lg:block" /> and resources to help you manage<br className="hidden lg:block" /> your <Eye /> mental wellbeing.</>}
        </motion.h1>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .15 }} className="mt-8 md:mt-10 w-full max-w-[340px] relative">
          <form onSubmit={event => { event.preventDefault(); if (query.trim()) setSubmitted(true); else input.current?.focus(); }} className="bg-white rounded-[6px] border border-black/[0.05] p-1 pl-4 flex items-center shadow-sm">
            <input ref={input} id="ask" value={query} onChange={event => { setQuery(event.target.value); setSubmitted(false); }} placeholder={polish ? 'Zapytaj o cokolwiek...' : 'Ask me anything...'} aria-label={polish ? 'Twoje pytanie' : 'Ask about mental wellbeing'} className="bg-transparent min-w-0 flex-1 outline-none text-xs placeholder:text-zinc-500 h-9 pr-2" required />
            <button type="submit" aria-label={polish ? 'Wyślij pytanie' : 'Submit question'} className="bg-[#1a1a1a] text-white w-9 h-9 rounded-full relative flex items-center justify-center hover:bg-zinc-700 transition-colors shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          </form>
          <AnimatePresence>{submitted && <motion.p role="status" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 rounded-md bg-white/90 backdrop-blur-md p-4 text-xs leading-relaxed shadow-sm">{polish ? 'To podgląd projektu. Usługa odpowiedzi nie jest jeszcze podłączona.' : 'This is a design preview. The question service is not connected yet.'}</motion.p>}</AnimatePresence>
        </motion.div>
      </div>
    </div>
    <div className="absolute right-6 md:right-12 top-[56%] sm:top-[48%] z-20 rounded-full border border-white/60 bg-white/25 backdrop-blur-xl shadow-[0_2px_12px_#00000005] flex items-center px-3.5 py-2.5 gap-2 text-[11px]">
      <button onClick={() => { setLanguage('pl'); document.documentElement.lang = 'pl'; }} aria-label="Polski" aria-pressed={polish} className={polish ? 'text-black' : 'text-black/45 hover:text-black'}>pl</button><span className="text-black/35">—</span><button onClick={() => { setLanguage('en'); document.documentElement.lang = 'en'; }} aria-label="English" aria-pressed={!polish} className={!polish ? 'text-black' : 'text-black/45 hover:text-black'}>en</button>
    </div>
    <div className="absolute bottom-7 md:bottom-10 left-8 md:left-12 text-[11px] z-10">2024</div>
    <a href="#ask" className="absolute bottom-7 md:bottom-10 right-8 md:right-12 text-[11px] z-10 nav-link">{polish ? 'narzędzia zdrowia psychicznego' : 'mental health tools'}</a>
  </section>;
}
function Eye() { return <span aria-hidden="true" className="eye w-[16px] md:w-[42px] lg:w-[62px] border-[2px] border-[#1a1a1a] rounded-full inline-flex items-center justify-center align-middle"><span className="w-2 h-2 rounded-full bg-[#1a1a1a]" /></span>; }
