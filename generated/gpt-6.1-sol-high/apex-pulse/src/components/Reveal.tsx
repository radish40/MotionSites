import { useEffect, useRef, useState, type ReactNode } from 'react';
interface Props { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'span' }
export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLDivElement & HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <Tag ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`block transition-[opacity,transform] duration-700 ease-out will-change-transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${className}`}>{children}</Tag>;
}
