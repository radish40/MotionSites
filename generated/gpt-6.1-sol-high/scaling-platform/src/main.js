import './style.css';

const videos = [...document.querySelectorAll('video')];
function playVideos() {
  videos.forEach(video => {
    video.muted = true;
    const playback = video.play();
    if (playback) playback.catch(() => {});
  });
}
playVideos();
setInterval(playVideos, 1000);
document.addEventListener('click', playVideos, { once: true });
document.addEventListener('touchstart', playVideos, { once: true, passive: true });

const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-nav');
function closeMenu() {
  menu.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
}
toggle.addEventListener('click', () => {
  const opening = menu.hidden;
  menu.hidden = !opening;
  toggle.setAttribute('aria-expanded', String(opening));
  toggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
});
menu.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) {
    closeMenu();
    toggle.focus();
  }
});
window.addEventListener('resize', () => { if (window.innerWidth > 700) closeMenu(); });
