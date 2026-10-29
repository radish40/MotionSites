import { useState, type ReactNode } from 'react';

const CARD_GRADIENT = 'linear-gradient(90deg, rgb(28,78,255), rgb(172,36,255) 50%, rgb(254,136,27))';
// Original prompt assets are mirrored locally for reliable static delivery.
const BULLET_URL = `${import.meta.env.BASE_URL}assets/bullet-list.svg`;
const CARD_IMG = `${import.meta.env.BASE_URL}assets/hover_card_img.png`;

interface ServiceCardProps {
  label: string;
  icon: ReactNode;
  title: ReactNode;
  bullets: string[];
}

export default function ServiceCard({ label, icon, title, bullets }: ServiceCardProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  return (
    <div
      className="service-card relative flex flex-col overflow-hidden rounded-[36px] cursor-pointer"
      style={{ backgroundColor: 'rgba(10, 5, 20, 0.88)', backdropFilter: 'blur(36px)', height: 'clamp(320px, 32vw, 500px)' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false); }}
      onClick={() => setHovered(true)} tabIndex={0} aria-label={`${label} services`}
    >
      <div className="absolute inset-x-0 top-0 pointer-events-none select-none transition-all duration-500"
        style={{ height: '55%', zIndex: 1, transform: hovered ? 'translateY(0)' : 'translateY(-30%)', opacity: hovered ? 1 : 0.7 }}>
        <img src={CARD_IMG} alt="" aria-hidden="true" className="w-full h-full" style={{ objectFit: 'cover', objectPosition: 'top' }} />
      </div>
      <div className="absolute inset-x-0 bottom-0 pointer-events-none select-none transition-all duration-500"
        style={{ height: '55%', zIndex: 1, background: 'linear-gradient(to top, rgba(10,5,20,0.95) 60%, transparent)', transform: hovered ? 'translateY(0)' : 'translateY(100%)', opacity: hovered ? 1 : 0 }} />
      <div className="relative flex flex-col h-full" style={{ zIndex: 2, padding: 'clamp(16px, 1.94vw, 32px) clamp(18px, 2.36vw, 36px)' }}>
        <div className="flex items-center gap-2 w-fit rounded-full text-white text-sm font-medium flex-shrink-0"
          style={{ backgroundColor: 'rgb(41, 31, 57)', padding: 'clamp(6px, 0.7vw, 12px) clamp(10px, 1.25vw, 20px)' }}>
          <span className="flex items-center justify-center" style={{ width: '1.11vw', minWidth: 14, height: 17 }}>{icon}</span>
          {label}
        </div>
        <div className="flex-grow" />
        <div className="flex flex-col transition-all duration-500" style={{ gap: 16 }}>
          <div className="flex flex-col transition-transform duration-500" style={{ gap: 16, transform: hovered ? 'translateY(-8px)' : 'translateY(0)' }}>
            <div className="text-white font-medium leading-snug" style={{ fontSize: 'clamp(16px, 1.7vw, 24px)' }}>{title}</div>
            <ul className="flex flex-col" style={{ gap: 10, listStyle: 'none', padding: 0, margin: 0 }}>
              {bullets.map(bullet => <li key={bullet} style={{ color: 'rgb(189, 174, 231)', fontSize: 'clamp(12px, 1vw, 15px)', paddingLeft: 'clamp(22px, 1.8vw, 28px)', backgroundImage: `url("${BULLET_URL}")`, backgroundRepeat: 'no-repeat', backgroundSize: 18, backgroundPosition: '0% 50%' }}>{bullet}</li>)}
            </ul>
          </div>
          <div className="transition-all duration-500 overflow-hidden" style={{ maxHeight: hovered ? 80 : 0, opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(20px)', pointerEvents: hovered ? 'auto' : 'none' }}>
            <a href="#" className="flex items-center justify-center w-full rounded-xl text-white font-medium"
              tabIndex={hovered ? 0 : -1}
              style={{ background: CARD_GRADIENT, padding: 'clamp(10px, 0.9vw, 14px) 0', fontSize: 'clamp(13px, 1.1vw, 16px)', marginBottom: 'clamp(6px, 0.5vw, 10px)' }}>Learn more</a>
          </div>
        </div>
      </div>
    </div>
  );
}
