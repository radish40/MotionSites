import React, { useMemo } from 'react';

export interface ParallaxStarsBackgroundProps {
  /** Main title; use newline characters for line breaks. */
  title?: string;
  /** Optional content displayed below the title. */
  children?: React.ReactNode;
  className?: string;
  /** Animation speed multiplier. Zero pauses the star field. */
  speed?: number;
}

const generateBoxShadows = (count: number) =>
  Array.from({ length: count }, () =>
    `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #fff`,
  ).join(', ');

export function ParallaxStarsBackground({
  title = 'PURE CSS\nPARALLAX PIXEL STARS',
  children,
  className = '',
  speed = 1,
}: ParallaxStarsBackgroundProps) {
  const shadowsSmall = useMemo(() => generateBoxShadows(700), []);
  const shadowsMedium = useMemo(() => generateBoxShadows(200), []);
  const shadowsBig = useMemo(() => generateBoxShadows(100), []);
  const layers = [shadowsSmall, shadowsMedium, shadowsBig];
  const multiplier = Number.isFinite(speed) && speed > 0 ? speed : 1;
  const lines = title.split('\n');

  return (
    <section className={`star-field ${className}`} aria-label="Parallax stars background">
      <div className="space-atmosphere" aria-hidden="true" />
      {layers.map((shadows, index) => (
        <div
          key={index}
          className={`stars stars-${index + 1}`}
          aria-hidden="true"
          style={{
            boxShadow: shadows,
            animationDuration: `${[50, 100, 150][index] / multiplier}s`,
            animationPlayState: speed <= 0 ? 'paused' : 'running',
          }}
        >
          <div className="stars-repeat" style={{ boxShadow: shadows }} />
        </div>
      ))}
      <div className="title-content">
        <h1>
          {lines.map((line, index) => (
            <React.Fragment key={index}>
              <span className="text-gradient">{line}</span>
              {index < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>
        {children && <div className="additional-content">{children}</div>}
      </div>
    </section>
  );
}

export default ParallaxStarsBackground;
