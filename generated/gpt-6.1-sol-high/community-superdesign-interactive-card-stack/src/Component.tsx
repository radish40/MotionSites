import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { motion, useMotionValue, useTransform, useReducedMotion, type PanInfo } from 'framer-motion';

export interface InteractiveCardStackProps {
  cards?: ReactNode[];
  randomRotation?: boolean;
  sensitivity?: number;
  sendToBackOnClick?: boolean;
  animationConfig?: { stiffness: number; damping: number };
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  mobileClickOnly?: boolean;
  mobileBreakpoint?: number;
  className?: string;
}

type Card = { id: number; content: ReactNode; randomRot: number };
const emptyCards: ReactNode[] = [];
const rotation = () => Math.random() * 10 - 5;

function StackCard({ card, index, depth, isTop, disableDrag, canClick, sensitivity, animationConfig, cycle }: {
  card: Card; index: number; depth: number; isTop: boolean; disableDrag: boolean; canClick: boolean;
  sensitivity: number; animationConfig: { stiffness: number; damping: number }; cycle: (id: number) => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);
  const dragged = useRef(false);
  const reduced = useReducedMotion();
  useEffect(() => { if (!isTop) { x.set(0); y.set(0); } }, [isTop, x, y]);
  function dragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) cycle(card.id);
  }
  return (
    <motion.div className="card-position" style={{ zIndex: index, pointerEvents: isTop ? 'auto' : 'none' }}
      animate={{ rotateZ: depth * -2 + card.randomRot, scale: 1 - depth * .04, y: depth * -8, opacity: 1 - depth * .15 }}
      transition={reduced ? { duration: 0 } : { type: 'spring', ...animationConfig }}>
      <motion.div className={`card ${disableDrag ? '' : 'draggable'}`}
        style={{ x, y, rotateX, rotateY, touchAction: disableDrag ? 'auto' : 'none' }}
        drag={!disableDrag} dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }} dragElastic={.6}
        onPointerDown={() => { dragged.current = false; }}
        onDragStart={() => { dragged.current = true; }} onDragEnd={dragEnd}
        onClick={() => { if (isTop && canClick && !dragged.current) cycle(card.id); }}
        role={canClick ? 'button' : undefined} tabIndex={isTop && canClick ? 0 : -1}
        aria-label={canClick ? `Showcase ${card.id + 1}. Next card` : undefined}
        aria-hidden={!isTop} data-card-id={card.id} data-top={isTop}
        onKeyDown={event => { if (isTop && canClick && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); cycle(card.id); } }}>
        {card.content}
      </motion.div>
    </motion.div>
  );
}

export function InteractiveCardStack({ cards = emptyCards, randomRotation = false, sensitivity = 180,
  sendToBackOnClick = false, animationConfig = { stiffness: 260, damping: 20 }, autoplay = false,
  autoplayDelay = 3000, pauseOnHover = true, mobileClickOnly = false, mobileBreakpoint = 768, className = ''
}: InteractiveCardStackProps) {
  const [stack, setStack] = useState<Card[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < mobileBreakpoint);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [mobileBreakpoint]);
  useEffect(() => {
    setStack(cards.map((content, id) => ({ id, content, randomRot: randomRotation ? rotation() : 0 })));
  }, [cards, randomRotation]);
  const sendToBack = useCallback((id?: number) => {
    setStack(previous => {
      const target = id ?? previous[previous.length - 1]?.id;
      const card = previous.find(item => item.id === target);
      if (!card) return previous;
      return [{ ...card, randomRot: randomRotation ? rotation() : 0 }, ...previous.filter(item => item.id !== target)];
    });
  }, [randomRotation]);
  useEffect(() => {
    if (!autoplay || stack.length < 2 || (pauseOnHover && isPaused)) return;
    const interval = window.setInterval(() => sendToBack(), autoplayDelay);
    return () => window.clearInterval(interval);
  }, [autoplay, autoplayDelay, stack.length, isPaused, pauseOnHover, sendToBack]);
  const clickOnly = mobileClickOnly && isMobile;
  return (
    <div className={`interactive-stack ${className}`} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      {stack.map((card, index) => <StackCard key={card.id} card={card} index={index}
        depth={stack.length - 1 - index} isTop={index === stack.length - 1}
        disableDrag={index !== stack.length - 1 || clickOnly} canClick={sendToBackOnClick || clickOnly}
        sensitivity={sensitivity} animationConfig={animationConfig} cycle={sendToBack} />)}
    </div>
  );
}
export default InteractiveCardStack;
