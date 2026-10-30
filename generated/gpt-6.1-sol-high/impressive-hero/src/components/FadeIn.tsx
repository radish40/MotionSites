import { useEffect, useState, type ReactNode } from 'react';

type Props = { children: ReactNode; delay?: number; duration?: number };

export default function FadeIn({ children, delay = 0, duration = 800 }: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);
  return <div className="transition-opacity" style={{ opacity: visible ? 1 : 0, transitionDuration: `${duration}ms` }}>{children}</div>;
}
