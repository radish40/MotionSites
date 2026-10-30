const burger = document.querySelector('.burger');
const menu = document.querySelector('.mobile-menu');
const overlay = document.querySelector('.mobile-overlay');
function setMenu(open, restoreFocus = false) {
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.hidden = overlay.hidden = !open;
  document.body.classList.toggle('menu-open', open);
  if (open) menu.querySelector('a').focus();
  if (restoreFocus) burger.focus();
}
burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
overlay.addEventListener('click', () => setMenu(false, true));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) setMenu(false, true);
  if (event.key === 'Tab' && !menu.hidden) {
    const links = [...menu.querySelectorAll('a')];
    if (event.shiftKey && document.activeElement === links[0]) {
      event.preventDefault(); burger.focus();
    } else if (!event.shiftKey && document.activeElement === burger) {
      event.preventDefault(); links[0].focus();
    } else if (event.shiftKey && document.activeElement === burger) {
      event.preventDefault(); links.at(-1).focus();
    } else if (!event.shiftKey && document.activeElement === links.at(-1)) {
      event.preventDefault(); burger.focus();
    }
  }
});
window.addEventListener('resize', () => { if (innerWidth > 720) setMenu(false); });
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(item => {
      const active = item.hash === link.hash;
      item.classList.toggle('active', active);
      if (active) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
  });
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false, true)));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const values = document.querySelectorAll('.stat-value');
function count(value, index) {
  const target = Number(value.dataset.target);
  const decimals = Number(value.dataset.decimals);
  const suffix = value.dataset.suffix;
  if (reducedMotion.matches) return;
  value.textContent = (0).toFixed(decimals) + suffix;
  setTimeout(() => {
    const start = performance.now();
    const duration = 1500 + index * 80;
    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      value.textContent = (target * (1 - Math.pow(1 - progress, 3))).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }, 480 + index * 90);
}
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    count(entry.target, [...values].indexOf(entry.target));
    observer.unobserve(entry.target);
  });
}, { threshold: .25 });
values.forEach(value => observer.observe(value));
// Keep the exact remote source primary; use its byte-identical copy on network failure.
const video = document.querySelector('.bg-video');
function useVideoFallback() {
  if (video.dataset.fallback) return;
  video.dataset.fallback = 'true';
  video.src = new URL('assets/background.mp4', document.baseURI).href;
  video.play().catch(() => {});
}
video.querySelector('source').addEventListener('error', useVideoFallback);
video.addEventListener('error', useVideoFallback);
if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) useVideoFallback();
