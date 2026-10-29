import React from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight } from 'lucide-react';
import './styles.css';

const stats = [
  {
    value: '7+ years',
    text: 'Launchex has served the market, guiding ventures and their journeys',
    image: 'market.webp',
    offset: false,
    placement: 'left-6 right-6 bottom-6',
    clipPath: 'polygon(64px 0, calc(100% - 14px) 0, calc(100% - 4px) 4px, 100% 14px, 100% calc(100% - 14px), calc(100% - 4px) calc(100% - 4px), calc(100% - 14px) 100%, 14px 100%, 4px calc(100% - 4px), 0 calc(100% - 14px), 0 64px)',
  },
  {
    value: '15000+',
    text: 'innovation ventures moved through the Launchex pipeline',
    image: 'ventures.webp',
    offset: true,
    placement: 'left-6 bottom-20',
    clipPath: 'polygon(0 14px, 4px 4px, 14px 0, calc(100% - 64px) 0, 100% 64px, 100% calc(100% - 14px), calc(100% - 4px) calc(100% - 4px), calc(100% - 14px) 100%, 64px 100%, 0 calc(100% - 64px))',
  },
  {
    value: '120+',
    text: 'accelerator sessions delivered by Launchex across Eastern Europe',
    image: 'sessions.webp',
    offset: false,
    placement: 'left-6 right-28 bottom-6',
    clipPath: 'polygon(0 14px, 4px 4px, 14px 0, calc(100% - 64px) 0, 100% 64px, 100% calc(100% - 64px), calc(100% - 64px) 100%, 14px 100%, 4px calc(100% - 4px), 0 calc(100% - 14px))',
  },
];

function StatCard({ stat }) {
  return (
    <div
      className={`relative w-full h-[280px] sm:h-[340px] ${stat.offset ? 'lg:mt-24' : ''}`}
      style={{ clipPath: stat.clipPath, backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '1.5px' }}
    >
      <div
        className="relative w-full h-full overflow-hidden bg-cover bg-center"
        style={{
          clipPath: stat.clipPath,
          backgroundImage: `url("${import.meta.env.BASE_URL}assets/${stat.image}")`,
          mixBlendMode: 'normal',
        }}
      >
        <div className={`absolute max-w-[66%] ${stat.placement}`}>
          <p className="font-firs font-semibold uppercase leading-none text-[36px] sm:text-[52px] stat-value">
            {stat.value}
          </p>
          <p className="mt-3 text-[14px] leading-[1.4] text-[#154359]">{stat.text}</p>
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="relative min-h-screen bg-[#F0F5F7] py-20 sm:py-28 px-6 sm:px-10 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-20 text-[#154359]">
          <h2 id="about-heading" className="font-firs text-[36px] sm:text-[48px] lg:text-[54px] font-semibold uppercase tracking-tight leading-[0.95]">
            About<br />the founders
          </h2>
          <div className="flex flex-col max-w-xl">
            <div className="text-[17px] sm:text-[18px] leading-[1.5] text-[#154359]">
              <p>Launchex.Hub is a platform that is part of a portfolio of companies Launchex, for sourcing and showcasing groundbreaking innovations.</p>
              <p className="mt-4">Launchex.Hub's mission is to offer every local-language innovator the chance to reshape our world with their pioneering creation.</p>
            </div>
            <a href="https://base.launchex.vc/" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-4 mt-6 text-[14px] font-medium text-[#154359] self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
              Launchex.Hub website
              <span aria-hidden="true" className="flex items-center justify-center w-8 h-8 border border-[#154359] transition-transform group-hover:-translate-y-0.5" style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}>
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
              </span>
            </a>
          </div>
        </div>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.map((stat) => <StatCard key={stat.value} stat={stat} />)}
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 sm:h-56 z-10" style={{ background: 'linear-gradient(to bottom, rgba(240, 245, 247, 0) 0%, rgba(240, 245, 247, 0.7) 60%, #F0F5F7 100%)' }} />
    </section>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><About /></React.StrictMode>);
