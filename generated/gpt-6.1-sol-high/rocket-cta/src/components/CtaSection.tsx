import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeUp, PrimaryButton } from './primitives';
import { CtaDashboardMock } from './CtaDashboardMock';
const GRASS_SRC = 'https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1780586778/cta-bg_mlwy5s.png';
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  useEffect(() => { const query = window.matchMedia('(max-width: 767px)'); const update = () => setIsMobile(query.matches); query.addEventListener('change', update); return () => query.removeEventListener('change', update); }, []);
  return isMobile;
}
export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const dashboardY = useTransform(scrollYProgress, [0, 1], ['120px', '-120px']);
  const grassY = useTransform(scrollYProgress, [0, 1], isMobile ? ['80px', '-40px'] : ['200px', '-200px']);
  return <section ref={sectionRef} id="cta" className="relative w-full" style={{ background: 'linear-gradient(to bottom, transparent 0%, #14191E 100%)' }}>
    <div className="relative mx-auto max-w-[1080px] px-4 pb-[440px] pt-24 sm:px-6 sm:pb-[520px] sm:pt-32 md:pb-[440px] md:pt-40">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-8">
        <div className="relative z-20 max-w-[400px]">
          <FadeUp delay={1}><h2 className="text-3xl font-normal leading-[1.05] tracking-[-0.02em] text-foreground sm:text-4xl">Learn how can one go from 0 to $11.5k with AI in 60 days.</h2></FadeUp>
          <FadeUp delay={0.1}><p className="mt-6 max-w-[380px] text-base leading-[1.5] text-landing-text sm:text-lg">Learn to turn your ideas into stunning websites with AI — the same skills agencies charge $5,000 for. Join the UI Rocket training and start building like a pro today.</p></FadeUp>
          <FadeUp delay={0.2} className="mt-10"><PrimaryButton as="button">Start for free</PrimaryButton></FadeUp>
        </div>
      </div>
    </div>
    <motion.div style={{ y: dashboardY }} className="absolute left-4 right-4 top-[440px] z-10 sm:-right-[8%] sm:left-auto sm:top-[460px] sm:w-[85%] md:-right-[10%] md:top-[500px] md:w-[80%] lg:-right-[12%] lg:top-20 lg:w-[68%]">
      <CtaDashboardMock />
    </motion.div>
    <motion.img src={GRASS_SRC} onError={event => { const image = event.currentTarget; if (!image.dataset.fallback) { image.dataset.fallback = 'reference-extraction'; image.src = `${import.meta.env.BASE_URL}assets/grass-recovered.png`; } }} alt="" aria-hidden="true" style={{ y: grassY }} className="pointer-events-none absolute bottom-[-40px] left-0 right-0 z-30 w-full select-none object-cover sm:bottom-[-80px] lg:bottom-[-140px]" />
  </section>;
}
