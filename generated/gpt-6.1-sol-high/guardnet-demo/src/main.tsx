import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const gradient = { background: 'linear-gradient(90deg, #FA8453 0%, #F8C9B2 100%)' };
const statement = 'shielding users info with premier tech, granting them with safety in all place';

function SecuritySection() {
  return (
    <section aria-label="security" className="relative min-h-[600px] h-screen w-full overflow-hidden bg-black">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay loop muted playsInline aria-hidden="true"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260421_072418_508a7d2e-396d-4f6f-9d42-ec920fcf7755.mp4"
      />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent z-10" />
      <div className="relative h-full w-full max-w-[1100px] mx-auto">
        <nav aria-label="demo" className="absolute top-6 sm:top-10 left-1/2 -translate-x-1/2 z-20 w-max max-w-[95vw]">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-neutral-900/80 backdrop-blur rounded-full p-2 sm:p-3">
            <button type="button" className="text-white/90 text-xs sm:text-sm px-4 sm:px-7 py-2 sm:py-3 rounded-full hover:text-white transition-colors whitespace-nowrap">confirm real person</button>
            <button type="button" className="text-black text-xs sm:text-sm font-normal px-4 sm:px-7 py-2 sm:py-3 rounded-full whitespace-nowrap" style={gradient}>run demo</button>
          </div>
        </nav>
        <p className="absolute left-4 sm:left-6 md:left-16 top-[62%] sm:top-[56%] max-w-[280px] sm:max-w-[440px] text-[13px] sm:text-[18px] leading-relaxed text-white/80 font-light">{statement}</p>
        <p className="absolute right-4 sm:right-6 md:right-16 top-[26%] sm:top-[34%] max-w-[280px] sm:max-w-[500px] text-[13px] sm:text-[18px] leading-relaxed text-white/90 font-light">By teaming up with a defender service, a business can dramatically improve the safeguard of its important info. This covers applying strong obfuscation protocols, gateway barriers, and observation engines to shield against unauthorized entries, info escapes, and malicious cyberhacks.</p>
      </div>
    </section>
  );
}

const companies = [
  {
    name: 'Apex',
    path: 'M12 2l2.39 4.84L20 8l-4 3.9L17.28 18 12 15.27 6.72 18 8 11.9 4 8l5.61-1.16L12 2z',
    blobs: ['absolute -top-24 -left-24 h-40 w-40 rounded-full bg-[#1e3a8a] blur-3xl opacity-40'],
  },
  {
    name: 'forge',
    path: 'M20.63 8.46l-4.73-2.73-.53.31 5.1 2.94v5.88l-5.1 2.94.53.3 4.73-2.72V8.46zM8.1 6.04l.53.3L3.53 9.28v5.88L8.63 18.1l-.53.3-4.73-2.72V8.46L8.1 6.04zM16.05 14.3v-4.6L12 7.4 7.95 9.7v4.6L12 16.6l4.05-2.3zm-.53-.3L12 16.02l-3.52-2.02v-4.02L12 7.96l3.52 2.02v4.02z',
    blobs: ['absolute -top-24 -left-24 h-40 w-40 rounded-full bg-[#FA8453] blur-3xl opacity-30', 'absolute -bottom-24 -right-24 h-40 w-40 rounded-full bg-[#F5D547] blur-3xl opacity-25'],
  },
  {
    name: 'Eastern Delta',
    path: 'M2 4l3 16h3l2-10 2 10h3l3-16h-3l-1.5 10L12 4h-2L8.5 14 7 4H2z',
    blobs: ['absolute -bottom-24 -left-24 h-40 w-40 rounded-full bg-[#F5D547] blur-3xl opacity-30'],
  },
  {
    name: 'Skybank',
    path: 'M6 2l6 3.75L6 9.5 0 5.75 6 2zm12 0l6 3.75L18 9.5l-6-3.75L18 2zM0 13.25L6 9.5l6 3.75L6 17l-6-3.75zm18-3.75l6 3.75L18 17l-6-3.75 6-3.75zM6 18.25L12 14.5l6 3.75L12 22l-6-3.75z',
    blobs: ['absolute top-1/2 -translate-y-1/2 -right-28 h-48 w-48 rounded-full bg-[#1e3a8a] blur-3xl opacity-40'],
  },
];

function CompaniesSection() {
  return (
    <section aria-label="companies" className="relative w-full bg-black px-4 sm:px-6 md:px-10 py-12 sm:py-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {companies.map(company => (
          <div key={company.name} className="relative h-24 sm:h-32 md:h-36 rounded-2xl bg-neutral-950 overflow-hidden flex items-center justify-center">
            {company.blobs.map(blob => <div key={blob} aria-hidden="true" className={blob} />)}
            <div className="relative z-10 flex items-center gap-2 sm:gap-3">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 sm:h-8 sm:w-8 fill-white"><path d={company.path} /></svg>
              <span className={company.name === 'Eastern Delta' ? 'text-white text-lg sm:text-2xl font-semibold leading-tight tracking-tight' : 'text-white text-xl sm:text-3xl font-semibold tracking-tight'}>
                {company.name === 'Eastern Delta' ? <>Eastern<br />Delta</> : company.name}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-16 sm:mt-28 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 md:w-[70%] md:ml-auto">
        <p className="max-w-md text-[13px] sm:text-[18px] leading-relaxed text-white/70 font-light">{statement}</p>
        <button type="button" className="relative rounded-full p-[1.5px] self-start md:self-auto shrink-0" style={gradient}>
          <span className="block rounded-full bg-black px-8 sm:px-10 py-2.5 sm:py-3 text-white text-sm">Run Demo</span>
        </button>
      </div>
    </section>
  );
}

function App() {
  return <main className="w-full max-w-[1400px] mx-auto"><SecuritySection /><CompaniesSection /></main>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
