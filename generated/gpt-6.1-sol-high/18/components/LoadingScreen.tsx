'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const words = ['Design', 'Create', 'Inspire'];
const ease = [0.4, 0, 0.2, 1] as const;

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setWordIndex(index);
      if (index === words.length - 1) window.clearInterval(interval);
    }, 900);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const start = performance.now();
    let frame: number;
    let completionTimer: number;
    const tick = (now: number) => {
      const next = Math.min(((now - start) / 2700) * 100, 100);
      setProgress(next);
      if (next < 100) frame = requestAnimationFrame(tick);
      else completionTimer = window.setTimeout(() => onCompleteRef.current(), 400);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); window.clearTimeout(completionTimer); };
  }, []);

  return (
    <motion.div className="loading-screen" data-testid="loader" exit={{ opacity: 0 }} transition={{ duration: 0.6, ease }} aria-label="Loading portfolio" aria-busy="true">
      <motion.div className="portfolio-label" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>Portfolio</motion.div>
      <div className="word-stage">
        <AnimatePresence mode="wait">
          <motion.span className="loading-word" key={wordIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease }}>{words[wordIndex]}</motion.span>
        </AnimatePresence>
      </div>
      <motion.div className="counter" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} aria-hidden="true">{Math.round(progress).toString().padStart(3, '0')}</motion.div>
      <div className="progress-track" role="progressbar" aria-label="Loading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
        <motion.div className="progress-fill" initial={{ scaleX: 0 }} animate={{ scaleX: progress / 100 }} transition={{ duration: 0.1, ease: 'linear' }} />
      </div>
    </motion.div>
  );
}
