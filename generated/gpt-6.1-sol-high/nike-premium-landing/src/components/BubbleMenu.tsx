import { useState, useRef, useEffect, useId, type ReactNode } from 'react';
import { gsap } from 'gsap';
import './BubbleMenu.css';

interface MenuItem { label: string; href: string; ariaLabel?: string; rotation?: number; hoverStyles?: { bgColor: string; textColor: string }; }
interface BubbleMenuProps { logo?: string | ReactNode; onMenuClick?: (isOpen: boolean) => void; className?: string; style?: React.CSSProperties; menuAriaLabel?: string; menuBg?: string; menuContentColor?: string; useFixedPosition?: boolean; items?: MenuItem[]; animationEase?: string; animationDuration?: number; staggerDelay?: number; }

export default function BubbleMenu({ logo, onMenuClick, className, style, menuAriaLabel = 'Toggle menu', menuBg = '#fff', menuContentColor = '#111', useFixedPosition = false, items, animationEase = 'back.out(1.5)', animationDuration = 0.5, staggerDelay = 0.12 }: BubbleMenuProps) {
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const containerClassName = ['bubble-menu', useFixedPosition ? 'fixed' : 'absolute', className].filter(Boolean).join(' ');

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };

  useEffect(() => {
    if (!isMenuOpen) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsMenuOpen(false); onMenuClick?.(false); toggleRef.current?.focus(); }
      if (e.key === 'Tab') {
        const links = bubblesRef.current.filter(Boolean) as HTMLAnchorElement[];
        const focusable = [toggleRef.current!, ...links];
        const index = focusable.indexOf(document.activeElement as HTMLButtonElement & HTMLAnchorElement);
        e.preventDefault(); focusable[(index + (e.shiftKey ? -1 : 1) + focusable.length) % focusable.length]?.focus();
      }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', close);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', close); };
  }, [isMenuOpen, onMenuClick]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);
    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: 'flex' });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });
        tl.to(bubble, { scale: 1, duration: animationDuration, ease: animationEase });
        if (labels[i]) tl.to(labels[i], { y: 0, autoAlpha: 1, duration: animationDuration, ease: 'power3.out' }, `-=${animationDuration * 0.9}`);
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, { y: 24, autoAlpha: 0, duration: 0.2, ease: 'power3.in' });
      gsap.to(bubbles, { scale: 0, duration: 0.2, ease: 'power3.in', onComplete: () => { gsap.set(overlay, { display: 'none' }); setShowOverlay(false); } });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  return (
    <>
      <nav className={containerClassName} style={style} aria-label="Main navigation">
        <button ref={toggleRef} aria-label={menuAriaLabel} aria-expanded={isMenuOpen} aria-controls={menuId} type="button" className={`bubble toggle-bubble menu-btn ${isMenuOpen ? 'open' : ''}`} onClick={handleToggle} style={{ background: menuBg }}>
          <span className="menu-line" style={{ background: menuContentColor }} />
          <span className="menu-line short" style={{ background: menuContentColor }} />
        </button>
      </nav>
      {showOverlay && (
        <div id={menuId} ref={overlayRef} className="bubble-menu-items fixed" onClick={e => { if (e.target === e.currentTarget) handleToggle(); }}>
          <ul className="pill-list">
            {items?.map((item, idx) => (
              <li key={idx}>
                <a href={item.href} className="pill-link" style={{ '--item-rot': `${item.rotation ?? 0}deg`, '--pill-bg': menuBg, '--pill-color': menuContentColor, '--hover-bg': item.hoverStyles?.bgColor, '--hover-color': item.hoverStyles?.textColor } as any} ref={el => { bubblesRef.current[idx] = el; }} onClick={handleToggle}>
                  <span className="pill-label" ref={el => { labelRefs.current[idx] = el; }}>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
