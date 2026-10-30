const headline = document.querySelector('#headline');
const lines = ['Big ideas.', 'One letter', 'at a time.'];
const characters = [];
for (const [lineIndex, text] of lines.entries()) {
  const line = document.createElement('span');
  line.className = 'headline-line';
  if (lineIndex === 1) {
    const first = document.createElement('span');
    const accent = document.createElement('span');
    accent.className = 'highlight';
    line.append(first, accent);
    for (const [i, letter] of [...text].entries()) addLetter(letter, i < 4 ? first : accent);
  } else {
    for (const letter of text) addLetter(letter, line);
  }
  headline.append(line);
}
function addLetter(letter, parent) {
  const span = document.createElement('span');
  span.className = 'character';
  span.textContent = letter;
  parent.append(span);
  characters.push(span);
}
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const counter = document.querySelector('#character-count');
const status = document.querySelector('#playback-status');
const progress = document.querySelector('#progress');
const track = document.querySelector('.progress-track');
document.querySelector('#total-count').textContent = characters.length;
let timer;
function update(count) {
  counter.textContent = String(count).padStart(2, '0');
  const percent = count / characters.length * 100;
  progress.style.width = `${percent}%`;
  track.setAttribute('aria-valuenow', String(Math.round(percent)));
}
function play() {
  clearInterval(timer);
  characters.forEach(char => char.classList.remove('visible', 'cursor', 'typing'));
  let count = 0;
  update(count);
  status.textContent = 'Typing in progress';
  const step = () => {
    if (count > 0) characters[count - 1].classList.remove('cursor', 'typing');
    characters[count].classList.add('visible', 'cursor', 'typing');
    count++;
    update(count);
    if (count === characters.length) {
      clearInterval(timer);
      characters[count - 1].classList.remove('typing');
      status.textContent = 'Thought complete';
    }
  };
  if (reducedMotion.matches) {
    characters.forEach(char => char.classList.add('visible'));
    update(characters.length);
    status.textContent = 'Thought complete';
    return;
  }
  timer = setInterval(step, 50);
}
document.querySelector('#replay').addEventListener('click', play);
reducedMotion.addEventListener('change', play);
await document.fonts.ready;
play();
