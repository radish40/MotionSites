import { useEffect, useRef } from 'react';
const brands = ['Vortex', 'Nimbus', 'Prysma', 'Cirrus', 'Kynder', 'Halcyn'];
export function SocialProofSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let frame = 0;
    let restart: ReturnType<typeof setTimeout>;
    let disposed = false;
    const update = () => {
      const { currentTime, duration } = video;
      video.style.opacity = String(Number.isFinite(duration) ? Math.max(0, Math.min(1, currentTime / 0.5, (duration - currentTime) / 0.5)) : 0);
      frame = requestAnimationFrame(update);
    };
    const ended = () => {
      video.style.opacity = '0';
      restart = setTimeout(() => { if (!disposed) { video.currentTime = 0; void video.play().catch(() => {}); } }, 100);
    };
    video.addEventListener('ended', ended);
    frame = requestAnimationFrame(update);
    return () => { disposed = true; cancelAnimationFrame(frame); clearTimeout(restart); video.removeEventListener('ended', ended); };
  }, []);
  return <section className="relative w-full overflow-hidden" aria-label="Trusted by global brands">
    <video ref={videoRef} autoPlay muted playsInline preload="auto" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" style={{ opacity: 0 }}><source src={`${import.meta.env.BASE_URL}assets/talent-background.mp4`} type="video/mp4" /></video>
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
    <div className="relative z-10 flex flex-col items-center gap-20 px-4 pb-24 pt-16">
      <div className="h-40" aria-hidden="true" />
      <div className="flex w-full max-w-5xl flex-col items-center gap-8 sm:flex-row sm:gap-14">
        <p className="shrink-0 whitespace-nowrap text-center text-sm text-foreground/50 sm:text-left">Relied on by brands<br />across the globe</p>
        <div className="marquee-window w-full min-w-0 overflow-hidden"><div className="flex w-max animate-marquee" aria-label={brands.join(', ')}>
          {[0, 1].map(copy => <div key={copy} aria-hidden={copy === 1 ? true : undefined} className="flex shrink-0 items-center gap-16 pr-16">{brands.map(brand => <div key={brand} className="flex shrink-0 items-center gap-2.5 text-base font-semibold text-foreground"><span className="liquid-glass flex h-6 w-6 items-center justify-center rounded-lg text-xs font-medium">{brand[0]}</span><span>{brand}</span></div>)}</div>)}
        </div></div>
      </div>
    </div>
  </section>;
}
