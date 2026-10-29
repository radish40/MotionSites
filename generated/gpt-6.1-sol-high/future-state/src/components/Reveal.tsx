import { useEffect, useRef, useState, type ReactNode } from 'react';
type Props = { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'span' };
export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLDivElement & HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <Tag ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-700 ease-out will-change-transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${className}`}>{children}</Tag>;
}
