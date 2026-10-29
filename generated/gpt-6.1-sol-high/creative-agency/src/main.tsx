import React from 'react';
import ReactDOM from 'react-dom/client';
import { Instagram, Send } from 'lucide-react';
import './index.css';

function LogoWhite() {
  return <svg width="30" height="22" viewBox="0 0 30 22" fill="none" aria-hidden="true">
    <path d="M2 4C2 4 8 1 15 6C22 11 28 8 28 8" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M2 16C2 16 8 13 15 18C22 23 28 20 28 20" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
  </svg>;
}

function LogoRed() {
  return <svg width="26" height="20" viewBox="0 0 30 22" fill="none" aria-hidden="true">
    <path d="M2 4C2 4 8 1 15 6C22 11 28 8 28 8" stroke="#e02b10" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M2 16C2 16 8 13 15 18C22 23 28 20 28 20" stroke="#e02b10" strokeWidth="3.5" strokeLinecap="round" />
  </svg>;
}

const inter = { fontFamily: 'Inter, sans-serif' };

function App() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden" style={{ backgroundColor: '#e02b10' }}>
      <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_213626_db1bde2b-521c-4b22-91f3-35c072eb8771.mp4" />
      <nav className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 md:py-5 gap-2" aria-label="Main navigation">
        <div className="flex items-center gap-3 sm:gap-6">
          <LogoWhite />
          <div className="hidden sm:flex items-center gap-2">
            <button className="bg-white text-black text-xs px-5 py-2 rounded-full" style={{ ...inter, fontWeight: 700 }} aria-current="page">HOME</button>
            {['RITUALS', 'RATES'].map(label => <button key={label} className="text-white text-xs px-5 py-2 rounded-full border border-white/60 hover:border-white transition-all" style={{ ...inter, fontWeight: 400 }}>{label}</button>)}
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <button className="text-white hover:opacity-70 transition-opacity" aria-label="Instagram"><Instagram size={18} strokeWidth={1.5} /></button>
          <button className="text-white hover:opacity-70 transition-opacity hidden sm:block" aria-label="Send"><Send size={16} strokeWidth={1.5} /></button>
          <button className="border border-white text-white text-xs px-3 sm:px-5 py-2 rounded-full hover:bg-white hover:text-red-600 transition-all whitespace-nowrap" style={inter}>Reservations</button>
        </div>
      </nav>
      <div className="relative z-20 min-h-screen flex flex-col px-4 sm:px-6 md:px-10">
        <div className="h-[72px] shrink-0" />
        <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between mx-auto gap-10 md:gap-32 py-8 md:py-0" style={{ maxWidth: '1100px', width: '100%' }}>
          <div className="max-w-[260px]">
            <p className="text-white text-[13px] tracking-[0.22em] uppercase leading-snug mb-2" style={{ ...inter, fontWeight: 700 }}>MARKETING<br />COLLECTIVE</p>
            <p className="text-white text-[13px] leading-relaxed" style={{ ...inter, opacity: 0.8 }}>Creative growth blueprints<br />for bold brands in Web3 era</p>
          </div>
          <div className="max-w-[260px] text-left">
            <div className="flex justify-start mb-2"><LogoRed /></div>
            <p className="text-white text-[14px] leading-relaxed mb-3" style={inter}>MetricX is the essential growth dashboard for bold agencies. Monitor reach, refine spend, steer campaigns, surface insights, delight your clients every day.</p>
            <p className="text-white text-[13px] leading-loose" style={{ ...inter, opacity: 0.7 }}>Audiences Dashboards Spend<br />Performance Channels Growth</p>
          </div>
        </div>
        <div className="pb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-6 shrink-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-white select-none mb-6 md:mb-10" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 600, fontSize: 'clamp(56px, 13vw, 155px)', letterSpacing: '-0.04em', lineHeight: 0.78, width: 'fit-content' }}>creative<br />studio</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <p className="text-white text-[14px] leading-relaxed" style={{ ...inter, minWidth: '160px' }}>Sharp ideas only. We craft<br />brands that own Web3.</p>
              <button className="bg-white text-black rounded-full hover:bg-gray-100 active:scale-95 transition-all shadow-lg w-full sm:w-auto" style={{ ...inter, fontWeight: 600, fontSize: '15px', whiteSpace: 'nowrap', padding: '24px 60px' }}>begin now</button>
            </div>
          </div>
          <div className="flex gap-4 sm:gap-6">
            {[['80%', 'Reach uplift'], ['92%', 'Client loyalty']].map(([number, label]) => (
              <div key={label} className="rounded-2xl px-5 sm:px-6 py-5 flex flex-col items-start justify-between text-left flex-1 lg:flex-initial" style={{ minWidth: '150px', minHeight: '150px', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)' }}>
                <p className="leading-none" style={{ fontFamily: 'Britanica-Black, sans-serif', fontSize: 'clamp(2rem, 6vw, 2.6rem)', color: '#111' }}>{number}</p>
                <p className="text-[12px] mt-auto" style={{ ...inter, color: '#888' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
