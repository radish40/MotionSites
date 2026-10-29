import { useEffect, useRef, useState } from 'react';
const VIDEO_URL = `${import.meta.env.BASE_URL}assets/aether-flight.mp4`;

export default function ScrollVideo() {
  const [framesReady, setFramesReady] = useState(false);
  const framesRef = useRef<ImageBitmap[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | undefined;
    const frames: ImageBitmap[] = [];
    const controller = new AbortController();
    const source = document.createElement('video');
    source.muted = true;
    source.playsInline = true;
    source.preload = 'auto';
    const waitFor = (event: string) => new Promise<void>((resolve, reject) => {
      const clean = () => {
        source.removeEventListener(event, done);
        source.removeEventListener('error', fail);
        controller.signal.removeEventListener('abort', fail);
      };
      const done = () => { clean(); resolve(); };
      const fail = () => { clean(); reject(new Error('Video extraction interrupted')); };
      source.addEventListener(event, done, { once: true });
      source.addEventListener('error', fail, { once: true });
      controller.signal.addEventListener('abort', fail, { once: true });
    });
    async function extract() {
      try {
        const response = await fetch(VIDEO_URL, { signal: controller.signal });
        if (!response.ok) throw new Error('Video unavailable');
        const blob = await response.blob();
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        const loaded = waitFor('loadeddata');
        source.src = objectUrl;
        await loaded;
        if (!Number.isFinite(source.duration) || source.duration <= 0) return;
        const count = Math.max(30, Math.min(120, Math.round(source.duration * 24)));
        const width = Math.min(1280, source.videoWidth);
        const height = Math.round(width * source.videoHeight / source.videoWidth);
        for (let index = 0; index < count; index++) {
          if (cancelled) return;
          const time = Math.max(0.001, index / (count - 1) * (source.duration - 0.05));
          const seeked = waitFor('seeked');
          source.currentTime = time;
          await seeked;
          const bitmap = await createImageBitmap(source, { resizeWidth: width, resizeHeight: height, resizeQuality: 'high' });
          if (cancelled) { bitmap.close(); return; }
          frames.push(bitmap);
        }
        if (!cancelled) {
          framesRef.current = frames;
          // Paint before the handoff so the visible canvas never starts blank.
          const canvas = canvasRef.current;
          const frame = frames[Math.round(progressRef.current * (frames.length - 1))];
          if (canvas && frame) drawCover(canvas, frame);
          setFramesReady(true);
        }
      } catch {
        if (!cancelled) { frames.forEach(frame => frame.close()); frames.length = 0; }
        // Keep the visible, scroll-seeking video as the permanent fallback.
      } finally {
        source.removeAttribute('src');
        source.load();
        if (objectUrl) { URL.revokeObjectURL(objectUrl); objectUrl = undefined; }
      }
    }
    void extract();
    return () => {
      cancelled = true;
      controller.abort();
      frames.forEach(frame => frame.close());
      frames.length = 0;
      framesRef.current = [];
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let targetProgress = 0;
    let animation = 0;
    let seekLocked = false;
    const video = videoRef.current;
    const unlock = () => { seekLocked = false; };
    const scroll = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      targetProgress = Math.max(0, Math.min(1, range > 0 ? window.scrollY / range : 0));
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      scroll();
    };
    video?.addEventListener('seeked', unlock);
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', resize);
    resize();
    function tick() {
      progressRef.current += (targetProgress - progressRef.current) * 0.1;
      const frames = framesRef.current;
      if (frames.length > 1) {
        const index = Math.max(0, Math.min(frames.length - 1, Math.round(progressRef.current * (frames.length - 1))));
        drawCover(canvas!, frames[index]);
      } else if (video && video.readyState >= 2 && Number.isFinite(video.duration) && !seekLocked) {
        const nextTime = progressRef.current * Math.max(0, video.duration - 0.05);
        if (Math.abs(video.currentTime - nextTime) > 0.025) {
          seekLocked = true;
          video.currentTime = nextTime;
        }
      }
      animation = requestAnimationFrame(tick);
    }
    animation = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', resize);
      video?.removeEventListener('seeked', unlock);
    };
  }, [framesReady]);

  return <div className="fixed inset-0 -z-10 bg-[#0a0a0a]" aria-hidden="true" data-frames-ready={framesReady} data-frame-count={framesRef.current.length}>
    {!framesReady && <video ref={videoRef} src={VIDEO_URL} muted playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover" />}
    <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full ${!framesReady ? 'invisible' : ''}`} />
    <div className="absolute inset-0 bg-black/20" />
    <div className="video-shade absolute inset-0" />
  </div>;
}

function drawCover(canvas: HTMLCanvasElement, frame: ImageBitmap) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const scale = Math.max(canvas.width / frame.width, canvas.height / frame.height);
  const width = frame.width * scale;
  const height = frame.height * scale;
  ctx.drawImage(frame, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
}
