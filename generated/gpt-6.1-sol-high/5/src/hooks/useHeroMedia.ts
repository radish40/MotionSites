import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { ORIGINAL_HLS_URL, ORIGINAL_MP4_URL } from '../lib/hero-media';
export function useHeroMedia(enabled: boolean, reduced: boolean | null) {
 const video = useRef<HTMLVideoElement>(null);
 const [status, setStatus] = useState<'disabled' | 'loading' | 'ready' | 'failed'>(enabled ? 'loading' : 'disabled');
 const [playing, setPlaying] = useState(false);
 useEffect(() => {
  // No player, source assignment, preload, or network probe in approximation mode.
  if (!enabled) return;
  const element = video.current; if (!element) return;
  let hls: Hls | undefined; let fellBack = false; let disposed = false;
  setStatus('loading');
  const play = () => { if (!reduced && !disposed) element.play().catch(() => { if (!disposed) setPlaying(false); }); };
  const fail = () => { if (disposed) return; setStatus('failed'); setPlaying(false); };
  const useFallback = () => {
   if (disposed) return;
   if (fellBack) { fail(); return; }
   fellBack = true; hls?.destroy(); hls = undefined;
   element.src = ORIGINAL_MP4_URL; element.load();
  };
  const ready = () => { if (!disposed) { setStatus('ready'); play(); } };
  const onPlay = () => { if (!disposed) setPlaying(true); };
  const onPause = () => { if (!disposed) setPlaying(false); };
  element.addEventListener('error', useFallback);
  element.addEventListener('canplay', ready);
  element.addEventListener('play', onPlay);
  element.addEventListener('pause', onPause);
  if (Hls.isSupported()) {
   hls = new Hls({manifestLoadingMaxRetry:0,levelLoadingMaxRetry:0,fragLoadingMaxRetry:0});
   hls.loadSource(ORIGINAL_HLS_URL); hls.attachMedia(element);
   hls.on(Hls.Events.MANIFEST_PARSED, play);
   hls.on(Hls.Events.ERROR, (_event, data) => { if (data.fatal) useFallback(); });
  } else if (element.canPlayType('application/vnd.apple.mpegurl')) {
   element.src = ORIGINAL_HLS_URL;
  } else useFallback();
  return () => {
   disposed = true;
   element.removeEventListener('error', useFallback);
   element.removeEventListener('canplay', ready);
   element.removeEventListener('play', onPlay);
   element.removeEventListener('pause', onPause);
   hls?.destroy(); element.pause(); element.removeAttribute('src'); element.load();
  };
 }, [enabled, reduced]);
 const togglePlayback = () => {
  const element = video.current; if (!element || status !== 'ready') return;
  if (element.paused) element.play().catch(() => setPlaying(false)); else element.pause();
 };
 return {video, status, playing, togglePlayback};
}
