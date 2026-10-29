// Respect reduced motion for the decorative footage as well as the marquees.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const videos = document.querySelectorAll('video');
function updateMotion() {
  for (const video of videos) {
    if (motionPreference.matches) video.pause();
    else video.play().catch(() => { /* The local poster remains if autoplay is unavailable. */ });
  }
}
motionPreference.addEventListener('change', updateMotion);
updateMotion();
