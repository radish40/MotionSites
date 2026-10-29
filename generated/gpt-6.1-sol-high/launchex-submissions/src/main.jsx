import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260514_154120_b89bfedd-530d-4ebb-9eb7-42eeafe08667.mp4';
const leftNominations = [
  ['Lead', 'AI venture for commerce'],
  ['Emerging innovations', 'in food commerce'],
  ['The finest innovations', 'for learners and young students'],
];
const rightNominations = [
  ['Innovations for advanced', 'career training'],
  ['The finest innovations', 'in finance'],
  ['Categories', 'coming soon'],
];

function NominationCard({ title, subtitle }) {
  return (
    <a href="#" className="group relative block h-[5em] w-full max-w-[20em] transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#154359]">
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true">
        <polygon points="14,0 100,0 100,86 86,100 0,100 0,14" fill="none" stroke="rgba(6, 99, 119, 0.25)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="px-4 text-center text-[#154359]">
          <div className="text-[13px] font-semibold leading-tight">{title}</div>
          <div className="text-[12px] font-normal leading-tight opacity-80">{subtitle}</div>
        </div>
      </div>
    </a>
  );
}

function App() {
  return (
    <section id="nominations" aria-labelledby="submissions-heading" className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#F0F0F0] px-6 py-20 sm:px-10 sm:py-28">
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-start justify-center gap-10 lg:flex-row lg:items-stretch lg:gap-12">
        <div className="order-2 flex w-full min-w-0 flex-col items-center gap-4 lg:order-1 lg:mt-36 lg:flex-1 lg:items-start" data-column="left">
          {leftNominations.map(([title, subtitle]) => <NominationCard key={title} title={title} subtitle={subtitle} />)}
        </div>
        <div className="order-1 flex w-full flex-1 flex-col items-center justify-start lg:order-2 lg:w-auto" data-column="center">
          <div className="flex flex-col items-center gap-2 uppercase text-[#154359]">
            <span className="text-[12px] tracking-[0.24em]">[submissions]</span>
            <h2 id="submissions-heading" className="font-firs text-[44px] font-semibold tracking-tight sm:text-[54px]">submissions</h2>
          </div>
          <div className="mt-6 h-[220px] w-[220px] sm:mt-8 sm:h-[380px] sm:w-[380px] lg:h-[460px] lg:w-[460px]">
            <video className="h-full w-full object-cover" autoPlay loop muted playsInline preload="auto" aria-label="LaunchEx submissions visual" src={videoUrl} onError={(event) => {
              const video = event.currentTarget;
              if (!video.dataset.fallback) {
                video.dataset.fallback = 'true';
                video.src = `${import.meta.env.BASE_URL}assets/submissions.mp4`;
                video.load();
              }
            }} />
          </div>
        </div>
        <div className="order-3 flex w-full min-w-0 flex-col items-center gap-4 lg:mt-36 lg:flex-1 lg:items-end" data-column="right">
          {rightNominations.map(([title, subtitle]) => <NominationCard key={title} title={title} subtitle={subtitle} />)}
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 sm:h-56" style={{ background: 'linear-gradient(to bottom, rgba(240, 245, 247, 0) 0%, rgba(240, 245, 247, 0.7) 60%, #F0F5F7 100%)' }} />
    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
