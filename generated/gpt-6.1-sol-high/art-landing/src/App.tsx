import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

const heroVideo = 'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/baby-track-video_crqby5.mp4';
const bottomVideo = 'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/track-video_2_haxdch.mp4';
const cloudImage = 'https://res.cloudinary.com/dsdhxhhqh/image/upload/v1781500777/cloude_vj4pjv.png';
const logoPath = 'M60 120C26.8629 120 0 93.1371 0 60V0C22.5654 0 42.2213 12.4569 52.4662 30.8691C38.4788 34.2089 28.0787 46.7902 28.0787 61.8006V63.1443C28.0787 79.9648 41.7146 93.6006 58.5353 93.6006H59.8789L59.8785 61.8006C59.8785 79.3633 74.1159 93.6006 91.6787 93.6006L91.6787 61.8006C91.6787 44.2783 77.5071 30.0661 60 30.0008L60 0H62.5352C94.2722 0 120 25.7279 120 57.4648V60C120 93.1371 93.1371 120 60 120Z';
function Logo({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 120 120" fill="white" aria-hidden="true"><path d={logoPath} /></svg>;
}
function Description() {
  return <><p>We automate your daily business routines with intelligent SaaS solutions, giving you more time to focus on what matters.</p><p>From everyday tasks to complex operations, we handle the details. Your business grows. You relax.</p></>;
}
function Cloud() {
  return <img src={cloudImage} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = `${import.meta.env.BASE_URL}cloud-fallback.svg`; }} className="w-full h-auto block" referrerPolicy="no-referrer" alt="" />;
}
export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll({ container: containerRef });
  const cloudYDesktop = useTransform(scrollY, [0, 300], [0, -100]);
  const cloudYMobile = useTransform(scrollY, [0, 300], [0, -24]);
  return <main ref={containerRef} className="h-screen overflow-y-auto overflow-x-hidden font-manrope bg-black relative">
    <section aria-label="Intelligent business automation" className="relative h-screen w-full flex-shrink-0 overflow-hidden">
      <video aria-label="Animated classical artwork" src={heroVideo} className="absolute inset-0 z-10 w-full h-full object-cover" autoPlay loop muted playsInline />
      <div className="absolute inset-0 z-30 pointer-events-none">
        <div className="absolute top-[24px] left-[20px] md:top-[64px] md:left-[64px] pointer-events-auto max-w-[calc(100vw-140px)] md:max-w-none">
          <div className="flex gap-[16px] md:gap-[24px] items-center">
            <Logo className="w-[48px] h-[48px] md:w-[64px] md:h-[64px] shrink-0" />
            <div className="text-white text-[11px] md:text-[16px] w-[112px] md:w-auto leading-[1.2] font-semibold tracking-[0.02em]">
              <p className="hidden md:block">Effortless Growth<br />Operations. We Handle All Tasks.<br />Stay Calm.</p>
              <p className="block md:hidden">Complete Business<br />Automation. We Handle All<br />Tasks. You Relax.</p>
            </div>
          </div>
          <div className="hidden md:flex mt-[400px] flex-col gap-[24px] w-full max-w-[320px] text-white text-[14px] font-normal leading-relaxed"><Description /></div>
        </div>
        <button onClick={() => containerRef.current?.scrollTo({ top: sectionRef.current?.offsetTop ?? window.innerHeight, behavior: reducedMotion ? 'instant' : 'smooth' })} className="absolute top-[24px] right-[20px] md:top-[64px] md:right-[64px] pointer-events-auto px-5 py-3 md:px-10 md:py-7 border border-white rounded-[100%] text-white text-[12px] md:text-[18px] font-italiana uppercase tracking-widest hover:bg-white/10 hover:backdrop-blur-[48px] transition-all duration-300 cursor-pointer bg-black/10 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none">Get started</button>
        <div className="absolute bottom-[32px] left-[20px] right-[20px] md:left-auto md:bottom-[64px] md:right-[64px] md:max-w-[1200px] text-left md:text-right">
          <div className="md:hidden flex flex-col gap-[16px] max-w-[280px] text-white text-[12px] font-normal mb-[32px]"><Description /></div>
          <h1 className="text-white text-[36px] leading-[1.1] md:text-[96px] font-italiana md:leading-[88px]">
            <span className="hidden md:block">Intelligent Daily<br />Routine Automation<br />For Your Business.<br />You Relax</span>
            <span className="block md:hidden text-[32px]">Intelligent Daily Routine<br />Automation For Your<br />Business. You Relax</span>
          </h1>
        </div>
      </div>
    </section>
    <section ref={sectionRef} aria-label="Our purpose" className="relative min-h-screen w-full bg-[#FF0000] flex flex-col z-10">
      <motion.div style={{ y: reducedMotion ? 0 : cloudYDesktop }} className="hidden md:block absolute top-0 left-0 w-full z-[100] pointer-events-none -translate-y-1/2"><Cloud /></motion.div>
      <motion.div style={{ y: reducedMotion ? 0 : cloudYMobile }} className="md:hidden absolute top-0 left-0 w-full z-[100] pointer-events-none -translate-y-1/2"><Cloud /></motion.div>
      <div className="flex-1 flex flex-col items-center w-full pt-[100px] md:pt-[400px]">
        <div className="flex flex-col items-center w-full px-8 text-center z-20 relative max-w-[900px] h-auto md:h-[620px] mx-auto">
          <Logo className="w-[80px] h-[80px] shrink-0 mb-[40px]" />
          <p className="text-white text-[16px] h-[100px] max-w-[400px] leading-[1.6] mb-[40px] uppercase tracking-wider mx-auto">We built this platform with a single purpose to eliminate operational chaos and restore balance to your daily business routine</p>
          <div className="font-marck text-white text-[120px] leading-none mb-[32px]">S.P.D</div>
          <div className="mb-[100px] md:mb-24 text-white text-[16px] w-[400px] max-w-full font-light leading-relaxed">
            <p className="mb-[24px]">We believe your energy belongs to your ideas, your people, and the things that move your business forward.</p>
            <p>Let intelligent automation take care of the everyday. Find your balance. Enjoy the freedom to grow.</p>
          </div>
        </div>
      </div>
      <div className="relative w-full shrink-0">
        <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-[#FF0000] to-transparent z-10 pointer-events-none" />
        <video aria-label="Animated classical artwork" src={bottomVideo} autoPlay loop muted playsInline className="w-full h-auto block object-contain" />
      </div>
    </section>
  </main>;
}
