export function VideoBackground(host, source) {
  const video = document.createElement('video');
  video.className = 'background-video';
  video.muted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.setAttribute('aria-hidden', 'true');
  video.src = source;
  host.append(video);
  let frame = 0;
  let restartTimer = 0;
  let fadingOutRef = false;
  // All opacity animation is driven by rAF; every fade starts at the current value.
  function fadeTo(target) {
    cancelAnimationFrame(frame);
    const initial = Number(video.style.opacity || 0);
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / 250, 1);
      video.style.opacity = String(initial + (target - initial) * progress);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  }
  video.addEventListener('playing', () => {
    if (!fadingOutRef) fadeTo(1);
  });
  video.addEventListener('timeupdate', () => {
    if (Number.isFinite(video.duration) && video.duration - video.currentTime <= .55 && !fadingOutRef) {
      fadingOutRef = true;
      fadeTo(0);
    }
  });
  video.addEventListener('ended', () => {
    cancelAnimationFrame(frame);
    video.style.opacity = '0';
    clearTimeout(restartTimer);
    restartTimer = setTimeout(() => {
      video.currentTime = 0;
      fadingOutRef = false;
      video.play().catch(() => {});
    }, 100);
  });
  video.play().catch(() => {});
  return video;
}
