import { useEffect, useRef, useState } from 'react';
const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260611_104107_121bfb5a-b1df-4e0d-8240-25b81f7cc85d.mp4';
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export default function ScrollVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d', { alpha: false });
    const controller = new AbortController();
    let disposed = false, objectURL = '', raf = 0, lastIndex = -1, target = 0, smoothed = 0, seeking = false;
    let frames: ImageBitmap[] = [];
    const extractor = document.createElement('video');
    extractor.muted = true; extractor.playsInline = true; extractor.preload = 'auto';
    const waitFor = (element: HTMLVideoElement, event: string) => new Promise<void>((resolve, reject) => {
      const done = () => { cleanup(); resolve(); };
      const fail = () => { cleanup(); reject(new Error(`Video ${event} failed`)); };
      const cleanup = () => { element.removeEventListener(event, done); element.removeEventListener('error', fail); controller.signal.removeEventListener('abort', fail); };
      element.addEventListener(event, done, { once: true }); element.addEventListener('error', fail, { once: true }); controller.signal.addEventListener('abort', fail, { once: true });
    });
    async function extract() {
      try {
        canvas.dataset.loading = 'fetch';
        const response = await fetch(VIDEO_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`Video HTTP ${response.status}`);
        const blob = await response.blob();
        if (disposed) return;
        objectURL = URL.createObjectURL(blob);
        const metadata = waitFor(extractor, 'loadedmetadata');
        extractor.src = objectURL; await metadata;
        if (extractor.readyState < 2) await waitFor(extractor, 'loadeddata');
        canvas.dataset.loading = 'metadata';
        const width = Math.min(1280, extractor.videoWidth);
        const height = Math.round(extractor.videoHeight * width / extractor.videoWidth);
        const count = clamp(Math.round(extractor.duration * 24), 30, 120);
        for (let index = 0; index < count; index++) {
          if (disposed) return;
          if (index > 0) {
            canvas.dataset.loading = `seek-${index}`;
            const seeked = waitFor(extractor, 'seeked');
            extractor.currentTime = index / (count - 1) * (extractor.duration - 0.05);
            await seeked;
          }
          canvas.dataset.loading = `bitmap-${index}`;
          const frame = await createImageBitmap(extractor, { resizeWidth: width, resizeHeight: height });
          if (disposed) { frame.close(); return; }
          frames.push(frame);
        }
        canvas.dataset.loading = 'ready';
        canvas.dataset.frameCount = String(frames.length);
        lastIndex = -1; setReady(true);
      } catch (error) {
        if (!disposed) { canvas.dataset.fallback = 'true'; console.warn('Frame extraction unavailable; using the scroll-scrubbed video.', error); }
        frames.forEach(frame => frame.close()); frames = [];
      }
    }
    const updateTarget = () => { target = clamp(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight), 0, 1); };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr); canvas.height = Math.round(canvas.clientHeight * dpr);
      lastIndex = -1; updateTarget();
    };
    const fallback = fallbackRef.current;
    const onSeeked = () => { seeking = false; };
    fallback?.addEventListener('seeked', onSeeked);
    function tick() {
      smoothed += (target - smoothed) * 0.1;
      if (frames.length && canvas.dataset.frameCount && context) {
        const index = clamp(Math.round(smoothed * (frames.length - 1)), 0, frames.length - 1);
        if (index !== lastIndex) {
          const frame = frames[index];
          const scale = Math.max(canvas.width / frame.width, canvas.height / frame.height);
          const width = frame.width * scale, height = frame.height * scale;
          context.drawImage(frame, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
          canvas.dataset.frame = String(index); lastIndex = index;
        }
      } else if (fallback && Number.isFinite(fallback.duration) && !seeking) {
        const time = smoothed * Math.max(0, fallback.duration - 0.05);
        if (Math.abs(fallback.currentTime - time) > 0.001) { seeking = true; fallback.currentTime = time; }
      }
      raf = requestAnimationFrame(tick);
    }
    resize(); updateTarget(); raf = requestAnimationFrame(tick); void extract();
    window.addEventListener('scroll', updateTarget, { passive: true }); window.addEventListener('resize', resize);
    return () => {
      disposed = true; controller.abort(); cancelAnimationFrame(raf);
      window.removeEventListener('scroll', updateTarget); window.removeEventListener('resize', resize);
      fallback?.removeEventListener('seeked', onSeeked);
      extractor.removeAttribute('src'); extractor.load();
      frames.forEach(frame => frame.close()); frames = [];
      if (objectURL) URL.revokeObjectURL(objectURL);
    };
  }, []);
  return <div aria-hidden="true" className="fixed inset-0 -z-10 bg-[#0a0a0a]">
    <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    {!ready && <video ref={fallbackRef} src={VIDEO_URL} muted playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover" />}
    <div className="absolute inset-0 bg-black/20" />
  </div>;
}
