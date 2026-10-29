import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { useInViewAnimation } from '../hooks/useInViewAnimation';

type TrailImage = { id: number; x: number; y: number; timestamp: number; src: string; rotation: number };

export default function PartnerSection({ images }: { images: string[] }) {
  const [trailImages, setTrailImages] = useState<TrailImage[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [now, setNow] = useState(Date.now);
  const sectionRef = useRef<HTMLDivElement>(null);
  const lastSpawnTime = useRef(0);
  const imageIdCounter = useRef(0);
  const { ref: animationRef, isInView } = useInViewAnimation();

  useEffect(() => {
    const interval = window.setInterval(() => {
      const time = Date.now();
      setNow(time);
      setTrailImages(previous => previous.filter(image => time - image.timestamp <= 1000));
    }, 50);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    images.forEach(src => { const image = new Image(); image.src = src; });
  }, [images]);

  function onMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (!isHovered || !sectionRef.current || images.length === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timestamp = Date.now();
    if (timestamp - lastSpawnTime.current < 80) return;
    lastSpawnTime.current = timestamp;
    const rect = sectionRef.current.getBoundingClientRect();
    const image = {
      id: imageIdCounter.current++, x: event.clientX - rect.left, y: event.clientY - rect.top,
      timestamp, src: images[Math.floor(Math.random() * images.length)], rotation: (Math.random() - 0.5) * 20,
    };
    setNow(timestamp);
    setTrailImages(previous => [...previous, image]);
  }

  return <section ref={animationRef} aria-labelledby="partner-heading" className="w-full">
    <div ref={sectionRef} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onMouseMove={onMouseMove}
      className="partner-card w-full max-w-7xl mx-auto py-48 bg-white relative overflow-hidden shadow-[0_0_0_0.5px_rgba(0,0,0,0.05),0_4px_30px_rgba(0,0,0,0.08)] rounded-[40px]">
      <div className="relative z-10 px-4 text-center pointer-events-none">
        <h1 id="partner-heading" className={`text-[48px] md:text-[64px] lg:text-[80px] leading-[1.1] text-[#0D212C] tracking-tight font-normal mb-12 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ fontFamily: "'PP Mondwest', serif", animationDelay: isInView ? '0.1s' : '0s' }}>Partner with us</h1>
        <a href="mailto:?subject=Let%E2%80%99s%20partner%20on%20a%20project&body=Hi%20Viktor%2C%0A%0AI%E2%80%99d%20love%20to%20talk%20about%20a%20project.%0A%0A"
          className={`partner-button pointer-events-auto w-fit mx-auto bg-[#051A24] text-white px-6 py-3.5 rounded-full flex items-center gap-3 hover:bg-[#0D212C] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D212C] ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ animationDelay: '0.2s' }}>
          <img src={`${import.meta.env.BASE_URL}viktor.jpg`} alt="Viktor Oddy" className="w-10 h-10 rounded-full object-cover" width="40" height="40" />
          <span>Start chat with Viktor</span>
        </a>
      </div>
      {trailImages.map(img => {
        const progress = Math.min(Math.max(now - img.timestamp, 0) / 1000, 1);
        return <div key={img.id} data-trail-image="" aria-hidden="true" className="absolute pointer-events-none w-24"
          style={{ left: img.x - 50, top: img.y - 50, opacity: 1 - progress, transform: `scale(${1 - progress * 0.15}) rotate(${img.rotation}deg)` }}>
          <img src={img.src} alt="" draggable="false" className="w-24 rounded-xl shadow-lg" width="96" height="72" />
        </div>;
      })}
    </div>
  </section>;
}
