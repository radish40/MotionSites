import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function Hero() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#21346e] text-white">
      <video
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
        autoPlay loop muted playsInline preload="auto" aria-hidden="true"
      >
        <source src={`${import.meta.env.BASE_URL}assets/new-era.mp4`} type="video/mp4" />
      </video>
      <div className="hero-container relative mx-auto w-full px-6 pb-20 pt-32 md:px-12 md:pt-48 xl:px-16">
        <h1 className="m-0 text-6xl font-bold uppercase leading-[0.98] tracking-[-4px] md:text-8xl xl:text-[100px]">
          <span className="block">New era</span>
          <span className="block">Of design</span>
          <span className="block whitespace-nowrap">Starts now</span>
        </h1>
        <button
          type="button"
          className="relative mt-10 flex h-[65px] w-[184px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-xl font-bold uppercase text-[#161a20] transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-white"
        >
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 184 65" fill="none" aria-hidden="true">
            <path d="M13 0H176C181 0 184 4 183 9L174 55C173 61 169 65 163 65H8C2 65 0 61 1 55L6 10C7 4 8 0 13 0Z" fill="white" />
          </svg>
          <span className="relative">Get started</span>
        </button>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<Hero />);
