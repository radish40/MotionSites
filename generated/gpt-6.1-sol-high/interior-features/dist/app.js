const card = document.querySelector('.direct-card');
const artboard = document.querySelector('#directCardTwoArtboard');
const photo = document.querySelector('.direct-card__photo');
const video = document.querySelector('.direct2-video');
const themeSwitch = document.querySelector('.theme-switch');
const label = document.querySelector('#light-label');
const themeColor = document.querySelector('meta[name="theme-color"]');
const daySource = photo.src;
const nightSource = photo.dataset.nightSrc;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let swapTimer;
let generation = 0;

function scaleArtboard() {
  artboard.style.setProperty('--direct-scale', Math.min(card.clientWidth / 660, card.clientHeight / 836));
}
scaleArtboard();
window.addEventListener('load', scaleArtboard);
window.addEventListener('resize', scaleArtboard);
new ResizeObserver(scaleArtboard).observe(card);

// Warm the still so its source can change without an empty frame.
const nightStill = new Image();
nightStill.src = nightSource;

function swapPhoto(source) {
  const current = ++generation;
  clearTimeout(swapTimer);
  photo.style.opacity = '0';
  swapTimer = setTimeout(async () => {
    const next = new Image();
    next.src = source;
    try { await next.decode(); } catch { if (current === generation) photo.style.opacity = '1'; return; }
    if (current !== generation) return;
    photo.onload = () => {
      if (current === generation) requestAnimationFrame(() => requestAnimationFrame(() => { photo.style.opacity = '1'; }));
    };
    photo.src = source;
    if (photo.complete) photo.onload();
  }, reducedMotion.matches ? 0 : 4500);
}

themeSwitch.addEventListener('click', () => {
  const night = document.body.classList.toggle('is-night');
  themeSwitch.setAttribute('aria-checked', String(night));
  label.textContent = `The living room · ${night ? 'After hours' : 'Daylight'}`;
  themeColor.content = night ? '#171b18' : '#f4f2ed';
  video.muted = true;
  if (night) { const playback = video.play(); if (playback) playback.catch(() => {}); }
  else video.pause();
  swapPhoto(night ? nightSource : daySource);
});
