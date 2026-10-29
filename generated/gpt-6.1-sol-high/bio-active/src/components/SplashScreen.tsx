import { useEffect, useState } from 'react';
export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [revealing, setRevealing] = useState(false);
  useEffect(() => {
    let step = 0;
    const interval = window.setInterval(() => { step++; setProgress(Math.min(100, step / 120 * 100)); if (step >= 120) clearInterval(interval); }, 20);
    const reveal = window.setTimeout(() => setRevealing(true), 2700);
    const complete = window.setTimeout(onComplete, 3900);
    return () => { clearInterval(interval); clearTimeout(reveal); clearTimeout(complete); };
  }, [onComplete]);
  return <div className="fixed inset-0 z-[9999]" aria-label="Loading LumiDerm">
    <div className={`curtain left-0 ${revealing ? '-translate-x-full' : ''}`} />
    <div className={`curtain right-0 ${revealing ? 'translate-x-full' : ''}`} />
    <div className={`absolute bottom-12 left-12 right-12 transition-opacity duration-300 ${revealing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="mb-4 flex items-center justify-between"><span className="text-xs uppercase tracking-[0.2em] text-white/40">Loading</span><span className="text-sm font-medium tabular-nums text-white">{Math.floor(progress)}%</span></div>
      <div className="h-px bg-white/10" role="progressbar" aria-valuenow={Math.floor(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Loading"><div className="h-full bg-white transition-[width] duration-[20ms] ease-linear" style={{ width: `${progress}%` }} /></div>
    </div>
  </div>;
}
