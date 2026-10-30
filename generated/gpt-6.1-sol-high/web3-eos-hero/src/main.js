const dialog = document.querySelector('dialog');
document.querySelectorAll('[data-waitlist]').forEach(button => {
  button.addEventListener('click', () => dialog.showModal());
});
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
const video = document.querySelector('video');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const syncMotion = () => { if (reducedMotion.matches) video.pause(); else video.play().catch(() => {}); };
video.addEventListener('loadeddata', syncMotion, { once: true });
reducedMotion.addEventListener('change', syncMotion);
