import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
export function HlsVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (Hls.isSupported()) {
      const hls = new Hls({ capLevelToPlayerSize: true, startLevel: 0 });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => { void video.play().catch(() => {}); });
      return () => hls.destroy();
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) video.src = src;
  }, [src]);
  return <video ref={ref} className="absolute inset-0 w-full h-full object-cover z-0" autoPlay loop muted playsInline aria-hidden="true" />;
}
