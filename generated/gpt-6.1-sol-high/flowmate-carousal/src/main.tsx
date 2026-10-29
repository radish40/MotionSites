import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './index.css';

const cards = [
  { id: 1, label: 'For Everyone', text: 'Unleash your creative vision' },
  { id: 2, label: 'For Teams', text: 'Smart helper supporting each teammate daily' },
  { id: 3, label: 'For Enterprises', text: 'Elevate your whole organization using business AI' },
  { id: 4, label: 'Platform', text: 'Enhanced with FlowMate' },
  { id: 5, label: 'Security', text: 'Creating trusted and helpful AI' },
];

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const } },
};

function CardsCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setDirection(1);
      setCurrentIndex(index => (index + 1) % cards.length);
    }, 4000);
    return () => window.clearInterval(interval);
  }, []);

  const navigate = (nextDirection: number) => {
    setDirection(nextDirection);
    setCurrentIndex(index => (index + nextDirection + cards.length) % cards.length);
  };
  const visibleCards = Array.from({ length: 3 }, (_, idx) => cards[(currentIndex + idx) % cards.length]);

  return (
    <section ref={sectionRef} aria-label="FlowMate cards carousel" aria-roledescription="carousel" className="overflow-x-clip border-t border-[#e8e8e8] bg-white px-6 py-20">
      <motion.div
        className="mx-auto max-w-7xl"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div variants={reveal} className="mb-12 flex justify-between">
          <h1 className="text-xl font-medium text-black md:text-2xl">FlowMate</h1>
          <div className="flex gap-3">
            <button type="button" aria-label="Previous cards" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 transition-colors hover:border-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
              <ChevronLeft className="h-5 w-5 text-black" aria-hidden="true" />
            </button>
            <button type="button" aria-label="Next cards" onClick={() => navigate(1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 transition-colors hover:border-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
              <ChevronRight className="h-5 w-5 text-black" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
        <motion.div variants={reveal} className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            {visibleCards.map((card, idx) => (
              <motion.div
                key={`${card.id}-${currentIndex}-${idx}`}
                data-card-id={card.id}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 100 : -100, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                variants={{ exit: (exitDirection: number) => ({ opacity: 0, x: exitDirection > 0 ? -100 : 100, scale: 0.95 }) }}
                exit="exit"
                transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1], opacity: { duration: 0.5 } }}
                className="group relative h-[500px] cursor-pointer overflow-hidden rounded-2xl"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url("${import.meta.env.BASE_URL}images/card-${card.id}.webp")` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="relative flex h-full flex-col justify-between p-6">
                  <span className="inline-block py-1 text-sm font-medium text-white">{card.label}</span>
                  <p className="text-xl font-normal leading-snug text-white">{card.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><CardsCarousel /></React.StrictMode>);
