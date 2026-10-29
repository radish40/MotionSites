import { useEffect, useRef } from 'react';

/** Capture the first pass, then play the actual captured frames in both directions. */
export default function BoomerangVideoBg() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const frames: HTMLCanvasElement[] = [];
    let disposed = false;
    let captureId = 0;
    let animationId = 0;
    let lastMediaTime = -1;
    let lastTick = 0;
    let frameIndex = 0;
    let direction = 1;
    const hasVideoCallback = typeof video.requestVideoFrameCallback === 'function';
    const capture = () => {
      if (disposed || video.ended) return;
      if (video.readyState >= 2 && video.currentTime !== lastMediaTime) {
        const frame = document.createElement('canvas');
        frame.width = Math.min(960, video.videoWidth);
        frame.height = Math.round(frame.width * video.videoHeight / video.videoWidth);
        frame.getContext('2d')!.drawImage(video, 0, 0, frame.width, frame.height);
        frames.push(frame);
        lastMediaTime = video.currentTime;
      }
      captureId = hasVideoCallback ? video.requestVideoFrameCallback(capture) : requestAnimationFrame(capture);
    };
    const loop = (now: number) => {
      if (disposed) return;
      if (now - lastTick >= 1000 / 30) {
        canvas.getContext('2d')!.drawImage(frames[frameIndex], 0, 0);
        frameIndex += direction;
        if (frameIndex >= frames.length) { direction = -1; frameIndex = Math.max(0, frames.length - 2); }
        if (frameIndex < 0) { direction = 1; frameIndex = Math.min(1, frames.length - 1); }
        lastTick = now - ((now - lastTick) % (1000 / 30));
      }
      animationId = requestAnimationFrame(loop);
    };
    const ended = () => {
      if (!frames.length || disposed) return;
      canvas.width = frames[0].width;
      canvas.height = frames[0].height;
      frameIndex = frames.length - 1;
      direction = -1;
      canvas.getContext('2d')!.drawImage(frames[frameIndex], 0, 0);
      canvas.hidden = false;
      video.style.visibility = 'hidden';
      canvas.dataset.playback = 'boomerang';
      canvas.dataset.frames = String(frames.length);
      animationId = requestAnimationFrame(loop);
    };
    video.addEventListener('ended', ended);
    capture();
    video.play().catch(() => { /* The first frame remains visible if autoplay is restricted. */ });
    return () => {
      disposed = true;
      video.removeEventListener('ended', ended);
      video.pause();
      if (hasVideoCallback) video.cancelVideoFrameCallback(captureId);
      else cancelAnimationFrame(captureId);
      cancelAnimationFrame(animationId);
      frames.forEach(frame => { frame.width = 0; frame.height = 0; });
    };
  }, []);
  return <div className="absolute inset-0 z-0 scale-[1.08] origin-center overflow-hidden" aria-hidden="true">
    <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" src={`${import.meta.env.BASE_URL}assets/vernal-woods.mp4`} autoPlay muted playsInline crossOrigin="anonymous" preload="auto" />
    <canvas ref={canvasRef} hidden className="absolute inset-0 h-full w-full object-cover" />
  </div>;
}
