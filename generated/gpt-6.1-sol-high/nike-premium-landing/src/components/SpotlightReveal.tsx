import { useEffect, useId, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

interface SpotlightRevealProps { imageSrc: string; videoSrc: string; isPlaying?: boolean; baseRadius?: number; }

export default function SpotlightReveal({ imageSrc, videoSrc, isPlaying = true, baseRadius = 420 }: SpotlightRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const [failed, setFailed] = useState(false);
  const uid = useId().replace(/:/g, '');
  const gradientId = `gradient-${uid}`, maskId = `mask-${uid}`;
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const points = Array.from({length: 6}, () => ({x: -1000, y: -1000}));
    let targetX = window.innerWidth / 2, targetY = window.innerHeight / 2;
    const move = (e: PointerEvent) => { targetX = e.clientX; targetY = e.clientY; };
    window.addEventListener('pointermove', move, {passive: true});
    window.addEventListener('pointerdown', move, {passive: true});
    let frame: number;
    const animate = () => {
      const bounds = root.getBoundingClientRect();
      points[0].x += (targetX - bounds.left - points[0].x) * (reduce ? 1 : .2);
      points[0].y += (targetY - bounds.top - points[0].y) * (reduce ? 1 : .2);
      points.forEach((point, i) => {
        if (i) { point.x += (points[i-1].x-point.x)*.35; point.y += (points[i-1].y-point.y)*.35; }
        circleRefs.current[i]?.setAttribute('cx', String(point.x));
        circleRefs.current[i]?.setAttribute('cy', String(point.y));
      });
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', move); window.removeEventListener('pointerdown', move); };
  }, []);
  return (
    <div ref={rootRef} className="spotlight absolute inset-0 w-full h-full z-0 bg-black pointer-events-none overflow-hidden" aria-hidden="true">
      <img src={imageSrc} className="absolute inset-0 w-full h-full object-cover" alt="" />
      {!failed && <ReactPlayer src={videoSrc} playing={isPlaying} muted loop playsInline width="100%" height="100%" style={{position:'absolute',inset:0,objectFit:'cover'}} onError={() => setFailed(true)} />}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={gradientId}>
            <stop offset="0%" stopColor="black" stopOpacity="1" />
            <stop offset="60%" stopColor="black" stopOpacity="0.8" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </radialGradient>
          <mask id={maskId} maskContentUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect width="100%" height="100%" fill="white" />
            {[5,4,3,2,1,0].map(i => <circle key={i} ref={el => {circleRefs.current[i] = el;}} cx="-1000" cy="-1000" r={baseRadius-i*35} fill={`url(#${gradientId})`} opacity={1-i*.15} />)}
          </mask>
        </defs>
        <image href={imageSrc} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" mask={`url(#${maskId})`} style={{filter:'grayscale(1) brightness(.48)'}} />
      </svg>
      <div className="absolute inset-0" style={{background:'linear-gradient(180deg,rgba(0,0,0,.12),transparent 45%,rgba(0,0,0,.62))'}} />
    </div>
  );
}
