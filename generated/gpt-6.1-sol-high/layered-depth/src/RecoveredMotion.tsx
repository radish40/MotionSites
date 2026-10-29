import { useEffect, useRef } from 'react';
import { localAsset } from './assets';

// A separate foliage matte, reconstructed from this design's leaf-shadow reference.
// Native Web Animations keep every visual asset independent of page text and controls.
export function LeafShadows({ second = false }: { second?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const animations = Array.from(ref.current!.children).map((leaf, i) => leaf.animate([
      { transform: `rotate(${-3 + i}deg) translate(-6px, 0px)` },
      { transform: `rotate(${3 - i}deg) translate(12px, 9px)` },
      { transform: `rotate(${-3 + i}deg) translate(-6px, 0px)` },
    ], { duration: 9500 + i * 2300, iterations: Infinity, easing: 'ease-in-out', delay: -i * 1700 }));
    return () => animations.forEach(animation => animation.cancel());
  }, []);
  return <div ref={ref} data-leaf-shadows aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0, background: '#e8e8e6' }}>
    {[0, 1, 2].map(i => <img key={i} src={localAsset('leaf-shadows.svg')} alt="" style={{ position: 'absolute', width: i === 0 ? '74%' : '64%', maxWidth: 'none', height: 'auto', left: i === 0 ? '-12%' : i === 1 ? '66%' : '-25%', top: i === 0 ? '-18%' : i === 1 ? '-5%' : second ? '42%' : '7%', opacity: second ? 0.15 : i === 2 ? 0.16 : 0.27, filter: `blur(${i === 2 ? 7 : 5}px)`, transformOrigin: 'top center', rotate: i === 0 ? '15deg' : i === 1 ? '125deg' : '-40deg', pointerEvents: 'none' }} />)}
  </div>;
}

export function RecoveredBird({ state, isMobile, onComplete }: { state: string; isMobile: boolean; onComplete: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;
  useEffect(() => {
    const bird = ref.current!;
    if (state === 'hidden') return;
    const frames = state === 'enter' ? [
      { transform: 'translate(48vw, -23vh) rotate(-22deg)', opacity: 0 },
      { transform: 'translate(18vw, -10vh) rotate(8deg)', opacity: 1, offset: 0.45 },
      { transform: 'translate(0, 0) rotate(0)', opacity: 1 },
    ] : state === 'leave' ? [
      { transform: 'translate(0, 0) rotate(0)', opacity: 1 },
      { transform: 'translate(-18vw, -15vh) rotate(-18deg)', opacity: 1, offset: 0.6 },
      { transform: 'translate(-70vw, -28vh) rotate(-10deg)', opacity: 0 },
    ] : state === 'idle1' ? [
      { transform: 'translateY(0) rotate(0)' },
      { transform: 'translateY(-2px) rotate(-3deg)' },
      { transform: 'translateY(0) rotate(0)' },
    ] : [
      { transform: 'rotate(0) scaleX(1)' },
      { transform: 'rotate(2deg) scaleX(.94)' },
      { transform: 'rotate(0) scaleX(1)' },
    ];
    const animation = bird.animate(frames, { duration: state === 'enter' ? 1500 : state === 'leave' ? 1100 : 2600, easing: state.startsWith('idle') ? 'ease-in-out' : 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' });
    animation.onfinish = () => completeRef.current();
    return () => animation.cancel();
  }, [state]);
  // Align the feet with the recovered slab's top rim at x=~68% of its source frame.
  const scale = isMobile ? 2.2 : 1.6;
  return <div data-recovered-bird ref={ref} style={{ position: 'absolute', left: `calc(50% + ${scale * 5.5}vw)`, top: `calc(50% - ${scale * 3.35}vw)`, width: `${scale * 5}vw`, display: state === 'hidden' ? 'none' : 'block', transformOrigin: '65% 95%', willChange: 'transform', pointerEvents: 'none' }}><img src={localAsset('bird-recovered.png')} alt="" style={{ display: 'block', width: '100%', height: 'auto' }} /></div>;
}
