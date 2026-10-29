import { useCallback, useEffect, useRef, useState } from 'react';
export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [fading, setFading] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const finish = useCallback(() => setFading(true), []);
  useEffect(() => {
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // A stalled or unavailable introduction must not hide the page forever.
    const watchdog = window.setTimeout(finish, 20000);
    video.current?.play().catch(finish);
    return () => { document.body.style.overflow = old; window.clearTimeout(watchdog); };
  }, [finish]);
  useEffect(() => {
    if (!fading) return;
    const timer = window.setTimeout(onComplete, 800);
    return () => window.clearTimeout(timer);
  }, [fading, onComplete]);
  return <div role="status" aria-label="VELORA introduction" className={`fixed inset-0 z-[9999] bg-black flex items-center transition-opacity duration-700 ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
    <video ref={video} className="absolute top-[20%] left-[30%] md:left-[55%] md:-translate-x-1/2 w-[320px] sm:w-[390px] md:w-[750px] aspect-video object-contain" src={`${import.meta.env.BASE_URL}assets/splash.mp4`} autoPlay muted playsInline onEnded={finish} onError={finish} />
  </div>;
}
