const words = ['ideas.', 'good things.', 'a little magic.', 'possibility.'];
const container = document.querySelector('.rolodex');
const choices = [...document.querySelectorAll('.word-choice')];
const pause = document.querySelector('#pause');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let index = 0;
let paused = reduceMotion.matches;
let transitioning = false;
let timer;
let finishTimer;
function updateControls() {
  pause.classList.toggle('paused', paused);
  pause.setAttribute('aria-pressed', String(paused));
  pause.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
  document.querySelector('#playback-label').textContent = paused ? 'Taking a breather' : 'On a roll';
}
function schedule() {
  clearInterval(timer);
  if (!paused && !document.hidden) timer = setInterval(() => changeWord((index + 1) % words.length), 2800);
}
function changeWord(nextIndex) {
  if (transitioning || nextIndex === index) return;
  transitioning = true;
  const old = container.querySelector('.current');
  const incoming = document.createElement('span');
  incoming.className = 'word entering';
  incoming.textContent = words[nextIndex];
  container.append(incoming);
  index = nextIndex;
  choices.forEach((choice, i) => {
    choice.classList.toggle('active', i === index);
    choice.setAttribute('aria-pressed', String(i === index));
  });
  document.querySelector('#active-count').textContent = String(index + 1).padStart(2, '0');
  document.querySelector('#sentence-accessible').textContent = `We deliver ${words[index]}`;
  // Flush the initial bottom position before beginning both halves of the flip.
  incoming.getBoundingClientRect();
  old.className = 'word leaving';
  incoming.className = 'word arriving';
  const finish = () => {
    if (!transitioning) return;
    clearTimeout(finishTimer);
    old.remove();
    incoming.className = 'word current';
    transitioning = false;
  };
  incoming.addEventListener('animationend', finish, { once: true });
  finishTimer = setTimeout(finish, 850);
}
pause.addEventListener('click', () => { paused = !paused; updateControls(); schedule(); });
document.querySelector('#next').addEventListener('click', () => { changeWord((index + 1) % words.length); schedule(); });
choices.forEach((choice, i) => choice.addEventListener('click', () => { changeWord(i); schedule(); }));
document.addEventListener('visibilitychange', schedule);
reduceMotion.addEventListener('change', event => { paused = event.matches; updateControls(); schedule(); });
updateControls();
schedule();
