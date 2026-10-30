import { useState } from 'react';
import BubbleMenu from './components/BubbleMenu';
import SpotlightReveal from './components/SpotlightReveal';

const items = [
  { label: 'Drops', href: '#drops', rotation: -8, hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' } },
  { label: 'Innovation', href: '#innovation', rotation: 8, hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' } },
  { label: 'Collections', href: '#innovation', rotation: 8, hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' } },
  { label: 'Community', href: '#innovation', rotation: 8, hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' } },
  { label: 'Stores', href: '#innovation', rotation: -8, hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' } }
];

export default function App() {
  const [isFirstVideoPlaying, setIsFirstVideoPlaying] = useState(false);
  const [isSecondVideoPlaying, setIsSecondVideoPlaying] = useState(false);

  return (
    <div className="relative w-full flex flex-col bg-[#050505]">
      {/* First Screen */}
      <section id="drops" className="sticky top-0 z-0 w-full h-[100dvh] overflow-hidden flex flex-col justify-between pointer-events-auto">
        <SpotlightReveal 
          imageSrc={`${import.meta.env.BASE_URL}assets/hero-fallback.jpg`}
          videoSrc={`${import.meta.env.BASE_URL}assets/hero-motion.webm`}
          isPlaying={isFirstVideoPlaying}
        />
        
        <div className="absolute bottom-0 left-0 w-full h-[75%] z-20" onMouseEnter={() => setIsFirstVideoPlaying(true)} onMouseLeave={() => setIsFirstVideoPlaying(false)} />
        
        <header className="hero-header relative z-50 w-full flex justify-center items-start pt-[150px]">
          <svg width="120" viewBox="135.5 361.38 420.32 149.8" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="m181.86 511.11c-12.524-0.49755-22.77-3.9244-30.782-10.289-1.529-1.2159-5.1725-4.8616-6.3949-6.3992-3.2489-4.0853-5.4578-8.0611-6.931-12.472-4.5334-13.579-2.2002-31.397 6.6737-50.953 7.5979-16.742 19.322-33.347 39.776-56.344 3.013-3.384 11.986-13.281 12.043-13.281 0.0216 0-0.46749 0.84706-1.083 1.8786-5.3183 8.9082-9.8689 19.401-12.348 28.485-3.9823 14.576-3.502 27.085 1.4068 36.784 3.3862 6.6822 9.1913 12.47 15.719 15.67 11.428 5.5993 28.159 6.0625 48.592 1.3554 1.4068-0.32599 71.116-18.831 154.91-41.123 83.794-22.294 152.36-40.52 152.37-40.505 0.0237 0.0193-194.68 83.333-295.75 126.56-16.007 6.8431-20.287 8.5715-27.812 11.214-19.236 6.7551-36.467 9.9783-50.396 9.4251z"/>
          </svg>
          <BubbleMenu items={items} className="absolute top-8 right-8 z-50" />
        </header>

        <main className="hero-copy relative z-10 w-full flex-1 flex flex-col items-center justify-end pb-24 px-4 text-center text-white">
          <h1 className="font-sans font-medium leading-[1.05] tracking-tight w-full mx-auto translate-y-[50px]" style={{ fontSize: 'clamp(14px, 3vw, 51px)' }}>
            <span className="block">Pure Comfort For</span>
            <span className="block">Next-Generation Athletes. <span className="font-serif italic font-normal pr-1">We Craft</span></span>
            <span className="block font-serif italic font-normal pr-1">The Ultimate Footwear For Elite Performance,</span>
            <span className="block font-serif italic font-normal pr-1">Urban Exploration, Everyday Style.</span>
          </h1>
        </main>
      </section>

      {/* Second Screen */}
      <section id="innovation" className="relative z-10 w-full h-[100dvh] overflow-hidden bg-black text-white" style={{ boxShadow: '0 -20px 50px rgba(0,0,0,0.5)' }}>
        <SpotlightReveal 
          imageSrc={`${import.meta.env.BASE_URL}assets/innovation-fallback.jpg`}
          videoSrc={`${import.meta.env.BASE_URL}assets/innovation-motion.webm`}
          isPlaying={isSecondVideoPlaying}
          baseRadius={520}
        />

        <div className="absolute right-[calc(8%+100px)] bottom-[12%] w-[calc(50%-50px)] h-[calc(50%+230px)] z-30" onMouseEnter={() => setIsSecondVideoPlaying(true)} onMouseLeave={() => setIsSecondVideoPlaying(false)} />
        <div className="absolute left-[calc(8%+200px)] top-[calc(20%+190px)] w-[calc(15%+250px)] h-[calc(22.5%+130px)] -translate-y-full z-30" onMouseEnter={() => setIsSecondVideoPlaying(true)} onMouseLeave={() => setIsSecondVideoPlaying(false)} />

        <div className="innovation-card absolute left-[calc(8%+200px)] top-[20%] z-20 w-[320px] px-8 py-6 rounded-sm border border-white/10" style={{ background: 'rgba(0, 0, 0, 0.16)', backdropFilter: 'blur(80px)', WebkitBackdropFilter: 'blur(80px)' }}>
          <div className="flex items-end gap-2 mb-4">
            <span className="font-serif italic text-[#DA3A16] text-[72px] leading-[80px] tracking-tight">78%</span>
            <div className="w-[11px]">
              <svg style={{ width: '160px', height: '80px' }} viewBox="0 0 289 138" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_878_28499)"><path d="M22.5 48.7306C39.7833 48.7306 49.34 54.94 63.1667 69.2965C76.9933 83.653 86.55 110.5 103.833 110.5C121.117 110.5 130.673 84.2876 144.5 59.2856C158.327 34.2837 167.883 19.5573 185.167 19.5573C202.45 19.5573 208.55 57.6673 225.833 57.6673C243.117 57.6673 249.217 19.5 266.5 19.5" stroke="#DA3A16" strokeWidth="2"/></g>
                <defs><filter id="filter0_d_878_28499" x="0" y="0" width="289" height="138" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="11.25"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0.854902 0 0 0 0 0.227451 0 0 0 0 0.0862745 0 0 0 1 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_878_28499"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_878_28499" result="shape"/></filter></defs>
              </svg>
            </div>
          </div>
          <h3 className="font-serif text-white text-[15px] tracking-[0.02em] uppercase mb-2 leading-tight">NEXT-GEN CUSHIONING ARCHITECTURE</h3>
          <p className="font-serif text-white/64 text-[13px]">Impact Absorption & Energy Return Dynamics</p>
        </div>

        <div className="innovation-copy absolute left-[8%] bottom-[12%] z-20 text-white max-w-[500px]">
          <h2 className="text-[44px] leading-[1.05] tracking-tight flex flex-col">
            <span className="font-sans font-medium">Bringing Aerospace-</span>
            <span className="font-sans font-medium">Grade Infrastructure</span>
            <span className="font-serif font-normal pt-1"><span className="not-italic">Directly To Your </span><span className="italic">Everyday</span></span>
            <span className="font-serif italic font-normal">Urban Exploration</span>
          </h2>
        </div>

        <div className="impact-badge absolute right-[calc(8%+100px)] bottom-[12%] z-20 flex flex-col items-center">
           <div className="bg-white w-[180px] py-[6px] flex justify-center items-center">
              <span className="text-black font-serif text-[10px] uppercase font-bold tracking-[0.08em] text-center leading-[16px]">THE SCIENCE OF IMPACT CONTROL</span>
           </div>
           <div className="bg-[#DA3A16] w-[180px] h-[100px] flex justify-center items-center">
              <svg width="86" viewBox="135.5 361.38 420.32 149.8" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="m181.86 511.11c-12.524-0.49755-22.77-3.9244-30.782-10.289-1.529-1.2159-5.1725-4.8616-6.3949-6.3992-3.2489-4.0853-5.4578-8.0611-6.931-12.472-4.5334-13.579-2.2002-31.397 6.6737-50.953 7.5979-16.742 19.322-33.347 39.776-56.344 3.013-3.384 11.986-13.281 12.043-13.281 0.0216 0-0.46749 0.84706-1.083 1.8786-5.3183 8.9082-9.8689 19.401-12.348 28.485-3.9823 14.576-3.502 27.085 1.4068 36.784 3.3862 6.6822 9.1913 12.47 15.719 15.67 11.428 5.5993 28.159 6.0625 48.592 1.3554 1.4068-0.32599 71.116-18.831 154.91-41.123 83.794-22.294 152.36-40.52 152.37-40.505 0.0237 0.0193-194.68 83.333-295.75 126.56-16.007 6.8431-20.287 8.5715-27.812 11.214-19.236 6.7551-36.467 9.9783-50.396 9.4251z"/>
              </svg>
           </div>
        </div>
      </section>
    </div>
  );
}
