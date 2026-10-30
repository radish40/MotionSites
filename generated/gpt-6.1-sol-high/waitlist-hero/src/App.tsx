import { useEffect, useRef, useState, type CSSProperties } from 'react';

const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`;

function Orb({ color, style }: { color: string; style: CSSProperties }) {
  return <div aria-hidden="true" className="absolute pointer-events-none z-10 rounded-full" style={{ ...style, background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, filter: 'blur(20px)', mixBlendMode: 'screen' }} />;
}

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvases = useRef<(HTMLCanvasElement | null)[]>([]);
  const [frames, setFrames] = useState<HTMLCanvasElement[]>([]);
  const [playback, setPlayback] = useState('capturing');

  function paint(frame: CanvasImageSource, width: number, height: number) {
    const visible = canvases.current.filter((canvas): canvas is HTMLCanvasElement => !!canvas && canvas.clientWidth > 0);
    if (!visible.length) return;
    const cw = visible[0].clientWidth;
    const ch = visible[0].clientHeight;
    const aspect = cw * visible.length / ch;
    let sw = width, sh = height;
    if (width / height > aspect) sw = height * aspect;
    else sh = width / aspect;
    const sx = (width - sw) / 2, sy = (height - sh) / 2;
    visible.forEach((canvas, i) => {
      if (canvas.width !== canvas.clientWidth) canvas.width = canvas.clientWidth;
      if (canvas.height !== canvas.clientHeight) canvas.height = canvas.clientHeight;
      canvas.getContext('2d')?.drawImage(frame, sx + sw / visible.length * i, sy, sw / visible.length, sh, 0, 0, canvas.width, canvas.height);
    });
  }

  useEffect(() => {
    const video = videoRef.current!;
    const captured: HTMLCanvasElement[] = [];
    let disposed = false, callback = 0, fallback = 0, lastTime = -1;
    const capture = () => {
      if (disposed || video.readyState < 2 || video.currentTime === lastTime) return;
      lastTime = video.currentTime;
      const frame = document.createElement('canvas');
      frame.width = Math.min(960, video.videoWidth);
      frame.height = Math.round(video.videoHeight * frame.width / video.videoWidth);
      frame.getContext('2d')!.drawImage(video, 0, 0, frame.width, frame.height);
      captured.push(frame);
      paint(frame, frame.width, frame.height);
    };
    const tick = () => {
      capture();
      if (!disposed && !video.ended) {
        if ('requestVideoFrameCallback' in video) callback = video.requestVideoFrameCallback(tick);
        else fallback = requestAnimationFrame(tick);
      }
    };
    const ended = () => {
      capture();
      if (!disposed && captured.length) { setFrames(captured); setPlayback('boomerang'); }
    };
    const failed = () => setPlayback('unavailable');
    const play = () => { video.play().catch(() => { if (!disposed) setPlayback('autoplay-blocked'); }); };
    video.addEventListener('ended', ended);
    video.addEventListener('error', failed);
    video.addEventListener('canplay', play, { once: true });
    tick();
    play();
    return () => {
      disposed = true;
      video.pause();
      if (callback) video.cancelVideoFrameCallback(callback);
      cancelAnimationFrame(fallback);
      video.removeEventListener('ended', ended);
      video.removeEventListener('error', failed);
      video.removeEventListener('canplay', play);
    };
  }, []);

  useEffect(() => {
    if (!frames.length) return;
    let raf = 0, index = 0, direction = 1, previous = 0;
    const render = (now: number) => {
      if (now - previous >= 1000 / 30) {
        previous = now - ((now - previous) % (1000 / 30));
        const frame = frames[index];
        paint(frame, frame.width, frame.height);
        const card = canvases.current[0];
        if (card) { card.dataset.frame = String(index); card.dataset.direction = String(direction); }
        if (frames.length > 1) {
          if (index === frames.length - 1) direction = -1;
          if (index === 0) direction = 1;
          index += direction;
        }
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [frames]);

  return <div className="page w-screen h-screen overflow-hidden flex flex-col text-white font-sans" data-playback={playback} data-frames={frames.length}>
    <nav aria-label="Main navigation" className="flex items-center justify-between px-7 py-7 shrink-0">
      <a href={import.meta.env.BASE_URL} aria-label="micro home" className="font-semibold text-2xl tracking-[-0.02em]">micro</a>
      <div className="flex items-center gap-3">
        <button type="button" className="text-white/70 text-sm font-medium px-4 py-2 rounded-full hover:text-white transition-all">Login</button>
        <button type="button" className="bg-black border border-white text-white text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 active:scale-95 transition-all">Join the Waitlist</button>
      </div>
    </nav>
    <main className="flex-1 min-h-0 flex flex-col mx-2 mb-2 bg-[#030404] rounded-[32px] overflow-hidden relative">
      <video ref={videoRef} src={asset('boomerang.mp4')} muted playsInline preload="auto" aria-hidden="true" style={{ position: 'absolute', width: 1, height: 1, opacity: 0, left: -9999, top: -9999 }} />
      <div className="flex-1 flex gap-2 p-2 lg:p-5 min-h-0" aria-hidden="true">
        {[0, 1, 2].map(i => <div key={i} className={`flex-1 min-w-0 relative overflow-hidden rounded-[22px] ${i ? 'hidden sm:block' : ''}`}>
          <canvas ref={el => { canvases.current[i] = el; }} className="absolute inset-0 w-full h-full" />
          {i === 0 && <Orb color="rgba(255,255,255,0.70)" style={{ top: '14%', left: '16%', width: 100, height: 100 }} />}
          {i === 1 && <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130px] h-[225px] rounded-full overflow-hidden shadow-[0_0_0_1.5px_rgba(255,255,255,0.10)]"><img src={asset('portrait.webp')} alt="" className="w-full h-full object-cover object-center" /></div>
            <Orb color="rgba(200,215,255,0.55)" style={{ top: '8%', left: '50%', transform: 'translateX(-50%)', width: 72, height: 72 }} />
          </>}
          {i === 2 && <Orb color="rgba(185,210,235,0.55)" style={{ top: '20%', right: '10%', width: 110, height: 110 }} />}
        </div>)}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[260px] z-10 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(3,4,4,0.88) 0%, rgba(3,4,4,0.50) 45%, transparent 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 pb-10 md:pb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-0 z-20 pointer-events-none">
        <div className="pointer-events-auto flex flex-col gap-4">
          <p className="text-white/70 text-sm leading-relaxed max-w-[280px]">An all-in-one tool for email, CRM, project management and more that automatically organizes itself.</p>
          <button type="button" className="self-start px-6 py-2.5 rounded-full text-sm font-semibold bg-white text-[#030404] hover:opacity-90 active:scale-95 transition-all">Join the Waitlist</button>
        </div>
        <div className="flex flex-col md:items-end gap-2">
          <h1 className="text-[clamp(52px,10vw,110px)] font-semibold leading-none tracking-[-0.03em] md:text-right">Organized.</h1>
          <p className="text-white/60 text-base italic tracking-wide">So you don't have to be.</p>
        </div>
      </div>
    </main>
  </div>;
}
