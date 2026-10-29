import { useEffect, useRef, useState } from 'react';

export function BoomerangVideoBg() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<HTMLCanvasElement[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let frameCallback = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    let disposed = false;
    const capture = () => {
      if (disposed || video.paused || video.ended || !video.videoWidth) return;
      const frame = document.createElement('canvas');
      frame.width = Math.min(video.videoWidth, 960);
      frame.height = Math.round(video.videoHeight * frame.width / video.videoWidth);
      const context = frame.getContext('2d');
      if (context) { context.drawImage(video, 0, 0, frame.width, frame.height); frames.current.push(frame); }
    };
    const nextFrame = () => {
      if (disposed) return;
      capture();
      frameCallback = video.requestVideoFrameCallback(nextFrame);
    };
    const ended = () => { if (frames.current.length) setReady(true); };
    video.addEventListener('ended', ended);
    if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) frameCallback = video.requestVideoFrameCallback(nextFrame);
    else interval = setInterval(capture, 1000 / 60);
    return () => {
      disposed = true;
      video.removeEventListener('ended', ended);
      if (frameCallback) video.cancelVideoFrameCallback(frameCallback);
      if (interval) clearInterval(interval);
      frames.current.length = 0;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const stored = frames.current;
    if (!canvas || !context || !stored.length) return;
    canvas.width = stored[0].width;
    canvas.height = stored[0].height;
    let raf = 0;
    let start: number | undefined;
    const render = (time: number) => {
      start ??= time;
      const cycleLength = Math.max(1, (stored.length - 1) * 2);
      const phase = Math.floor((time - start) / (1000 / 30)) % cycleLength;
      const index = phase < stored.length ? phase : cycleLength - phase;
      context.drawImage(stored[index], 0, 0);
      canvas.dataset.frame = String(index);
      canvas.dataset.direction = phase < stored.length - 1 ? 'forward' : 'reverse';
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  return <div className="absolute inset-0 w-full h-full" aria-hidden="true" data-video-ready={ready}>
    <video ref={videoRef} autoPlay muted playsInline crossOrigin="anonymous" className="w-full h-full object-cover" style={{ display: ready ? 'none' : 'block' }} src={`${import.meta.env.BASE_URL}energy.mp4`} />
    <canvas ref={canvasRef} className="w-full h-full object-cover" style={{ display: ready ? 'block' : 'none' }} />
  </div>;
}
