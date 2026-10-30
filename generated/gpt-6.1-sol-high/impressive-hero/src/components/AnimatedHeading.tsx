import { useEffect, useState, type CSSProperties } from 'react';

type Props = {
  text: string;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  charDelay?: number;
};

export default function AnimatedHeading({ text, className, style, delay = 0, charDelay = 30 }: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  return (
    <h1 className={className} style={style} aria-label={text.replace(/\n/g, ' ')}>
      {text.split('\n').map((line, lineIndex) => (
        <div key={lineIndex} className="flex flex-wrap justify-center" aria-hidden="true">
          {Array.from(line).map((char, charIndex) => (
            <span key={charIndex} className="inline-block transition-all duration-500" style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-18px)',
              transitionDelay: `${lineIndex * line.length * charDelay + charIndex * charDelay}ms`,
            }}>{char === ' ' ? '\u00A0' : char}</span>
          ))}
        </div>
      ))}
    </h1>
  );
}
