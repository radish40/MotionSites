import './style.css';

const colors = [
  ['Green','#58CC02'],['Green Hover','#4BB200'],['Blue','#1CB0F6'],['Dark Blue','#100F3E'],
  ['Red','#FF4B4B'],['Orange','#FF9600'],['Golden','#FFC800'],['Footer Green','#4EC604'],
  ['Gray Text','#4B4B4B'],['Gray Light','#777777'],['Nav Text','#AFAFAF'],['Border','#E5E5E5']
];
document.querySelector('#color-grid').innerHTML = colors.map(([name, hex]) => `<div class="swatch"><div class="swatch-color" style="background:${hex}"></div><div class="swatch-name">${name}</div><div class="swatch-hex">${hex}</div></div>`).join('');

document.querySelectorAll('.language').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.language').forEach(pill => {
    const selected = pill === button;
    pill.classList.toggle('active', selected);
    pill.setAttribute('aria-pressed', String(selected));
  });
}));

document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('.form-message').textContent = 'Thanks! Your subscription demo is complete.';
});

const navigation = [...document.querySelectorAll('nav a')];
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    navigation.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  }
}, { rootMargin: '-64px 0px -55% 0px', threshold: 0 });
document.querySelectorAll('.panel[id]').forEach(panel => observer.observe(panel));
