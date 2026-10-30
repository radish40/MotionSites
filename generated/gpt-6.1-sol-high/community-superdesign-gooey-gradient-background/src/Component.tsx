import { useEffect, useRef, type ReactNode } from 'react';
import './Component.css';

interface GooeyGradientBackgroundProps {
  children?: ReactNode;
  className?: string;
}

export function GooeyGradientBackground({ children, className = '' }: GooeyGradientBackgroundProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const interactiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let curX = 0, curY = 0, targetX = 0, targetY = 0, frame = 0, previousTime = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handlePointerMove = (event: PointerEvent) => {
      const bounds = wrapperRef.current!.getBoundingClientRect();
      targetX = event.clientX - bounds.left;
      targetY = event.clientY - bounds.top;
    };
    const animate = (time: number) => {
      const elapsed = previousTime ? time - previousTime : 1000 / 60;
      previousTime = time;
      const smoothing = reducedMotion.matches ? 1 : 1 - Math.pow(0.95, elapsed / (1000 / 60));
      curX += (targetX - curX) * smoothing;
      curY += (targetY - curY) * smoothing;
      if (interactiveRef.current) {
        interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      }
      frame = requestAnimationFrame(animate);
    };
    const wrapper = wrapperRef.current!;
    wrapper.addEventListener('pointermove', handlePointerMove);
    frame = requestAnimationFrame(animate);
    return () => {
      wrapper.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`gooey-wrapper ${className}`}>
      <div className="gradient-bg" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg"><defs><filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -8" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter></defs></svg>
        <div className="gradients-container">
          <div className="g1" /><div className="g2" /><div className="g3" />
          <div className="g4" /><div className="g5" />
          <div ref={interactiveRef} className="interactive" />
        </div>
      </div>
      <div className="content-layer">{children}</div>
    </div>
  );
}
