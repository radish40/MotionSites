const button = document.querySelector('.glow-button');
const label = button.querySelector('.button-label');
const status = document.querySelector('[role="status"]');
let resetTimer;

function moveGlow(event) {
  const bounds = button.getBoundingClientRect();
  button.style.setProperty('--cursor-x', `${event.clientX - bounds.left}px`);
  button.style.setProperty('--cursor-y', `${event.clientY - bounds.top}px`);
}

button.addEventListener('pointermove', moveGlow);
button.addEventListener('pointerdown', (event) => {
  moveGlow(event);
  button.classList.add('is-pressed');
});
for (const event of ['pointerup', 'pointercancel', 'blur']) {
  button.addEventListener(event, () => button.classList.remove('is-pressed'));
}
button.addEventListener('pointerleave', () => {
  button.classList.remove('is-pressed');
  button.style.removeProperty('--cursor-x');
  button.style.removeProperty('--cursor-y');
});
button.addEventListener('click', () => {
  clearTimeout(resetTimer);
  button.classList.add('is-activated');
  label.textContent = "Let’s go";
  status.textContent = 'Button activated.';
  resetTimer = setTimeout(() => {
    button.classList.remove('is-activated');
    label.textContent = 'Get started';
    status.textContent = '';
  }, 1600);
});
