import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { RollingCounter } from './Component';

export default function App() {
  const [value, setValue] = useState(1234.5);
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 600px)').matches);

  useEffect(() => {
    const timer = window.setInterval(() => setValue(v => parseFloat((v + 1.1).toFixed(1))), 2000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 600px)');
    const update = () => setCompact(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return (
    <main className="showcase">
      <h1>Rolling Counter</h1>
      <section className="counter-card" aria-label="Rolling counter demonstration">
        <RollingCounter
          value={value}
          fontSize={compact ? 64 : 120}
          textColor="hsl(var(--foreground))"
          fontWeight={600}
          gradientFrom="white"
          gradientHeight={compact ? 16 : 30}
          gap={compact ? 2 : 4}
        />
        <button onClick={() => setValue(1234.5)} type="button">
          <RotateCcw size={16} aria-hidden="true" />
          Reset Counter
        </button>
      </section>
      <p>A precision mechanical-style animation using Framer Motion with automatic place value detection and smooth transitions.</p>
    </main>
  );
}
