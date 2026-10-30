import { Dashboard } from './Dashboard';
export function ShowcaseSection({ scrollProgress }: { scrollProgress: number }) {
  const t = Math.min(Math.max((scrollProgress - 0.35) / (0.75 - 0.35), 0), 1);
  return <section id="showcase" className="relative min-h-screen flex items-center justify-center px-6 md:px-16 lg:px-24 will-change-transform" style={{ opacity: t, transform: `scale(${0.88 + t * 0.12})`, transformOrigin: 'center top', zIndex: 20 }}>
    <div className="relative w-full max-w-7xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden min-h-[480px] sm:min-h-[560px] md:min-h-[680px]">
      <video className="absolute inset-0 w-full h-full object-cover" src={`${import.meta.env.BASE_URL}assets/showcase.mp4`} autoPlay loop muted playsInline aria-hidden="true" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row items-end md:items-stretch h-full min-h-[480px] sm:min-h-[560px] md:min-h-[680px]">
        <div className="flex flex-col justify-end p-4 sm:p-5 md:p-8 md:w-1/2">
          <h2 className="text-2xl sm:text-3xl md:text-[2.75rem] font-medium text-gray-900 md:text-white md:leading-[1.15] leading-tight tracking-tighter">Your Content Engine,<br />Faster and Clearer</h2>
          <p className="mt-5 text-sm md:text-base text-gray-600 md:text-white/70 leading-relaxed max-w-md">Get live performance data, editorial analytics, and the clarity you need to publish confidently every single time.</p>
        </div>
        <div className="flex items-end justify-end md:w-1/2 mt-auto origin-bottom-right scale-[0.75] sm:scale-[0.85] md:scale-100"><Dashboard /></div>
      </div>
    </div>
  </section>;
}
