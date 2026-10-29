const viewport = document.querySelector('.viewport');
const stage = document.querySelector('.stage');
function fitStage() {
  const ratio = Math.min((window.innerWidth - 80) / 810, (window.innerHeight - 80) / 790);
  stage.style.transform = `scale(${Math.max(0, Math.min(1, ratio)) * .95})`;
}
fitStage();
window.addEventListener('resize', fitStage, { passive: true });
const videos = [...document.querySelectorAll('video')];
const mediaReady = videos.map(video => new Promise(resolve => {
  if (video.readyState >= 2) resolve();
  else video.addEventListener('loadeddata', resolve, { once: true });
}));
let ready = false;
function reveal() {
  if (ready) return;
  ready = true;
  viewport.classList.add('ze-ready');
}
const safetyTimeout = setTimeout(reveal, 5000);
Promise.all([...mediaReady, document.fonts.ready]).then(() => { clearTimeout(safetyTimeout); reveal(); });
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function syncMotion() {
  videos.forEach(video => {
    if (reducedMotion.matches) video.pause();
    else video.play().catch(() => {});
  });
}
syncMotion();
reducedMotion.addEventListener('change', syncMotion);
let selectedPlan = 'Monthly';
document.querySelectorAll('.plan').forEach(button => {
  button.addEventListener('click', () => {
    selectedPlan = button.dataset.plan;
    document.querySelectorAll('.plan').forEach(plan => {
      const selected = plan === button;
      plan.classList.toggle('selected', selected);
      plan.setAttribute('aria-pressed', String(selected));
    });
  });
});
const dialog = document.querySelector('dialog');
function showDialog(title, copy) {
  document.getElementById('dialog-title').textContent = title;
  document.getElementById('dialog-copy').textContent = copy;
  dialog.showModal();
}
document.getElementById('continue').addEventListener('click', () => showDialog('Continue with Apple', 'This is a Place Saver design showcase. Apple sign-in is not connected.'));
document.getElementById('subscribe').addEventListener('click', () => showDialog('Unlock Pro', `${selectedPlan} plan: ${selectedPlan === 'Monthly' ? '$20 billed monthly' : '$200 billed yearly'}. This showcase does not process payments.`));
document.getElementById('terms').addEventListener('click', () => showDialog('Terms of Use', 'This is an interactive design preview. No account is created and no subscription is purchased. Production terms have not been supplied.'));
document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
