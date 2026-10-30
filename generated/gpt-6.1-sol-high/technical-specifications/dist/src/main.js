import { datasets } from './data.js';
const tabs = [...document.querySelectorAll('[data-stats-tab]')];
const summary = document.querySelector('.stats__summary');
const chart = document.querySelector('[data-stats-chart]');
let timer;
let frame;
function render(key) {
  const dataset = datasets[key];
  summary.textContent = dataset.summary;
  chart.setAttribute('aria-labelledby', `tab-${key}`);
  chart.innerHTML = `
    <div class="statschart-head"><strong>${dataset.title}</strong><span>Operating envelope</span></div>
    <div class="statsbars">${dataset.bars.map((bar, i) => `
      <article class="stats__bar-row" style="--bar-value:${bar.value}%;--range-start:${bar.rangeStart}%;--range-width:${bar.rangeEnd - bar.rangeStart}%;--bar-delay:${i * 90}ms" aria-label="${bar.label}: ${bar.value}${bar.unit}, ${bar.note}">
        <div class="statsbar-label"><strong>${bar.label}</strong><span>${bar.note}</span></div>
        <div class="statstrack" aria-hidden="true">
          <div class="statsrange"></div><div class="statsbar"></div>
          <span class="statsvalue">${bar.value}${bar.unit}</span>
          <div class="statstrace">${bar.trace.map((x, j) => `<i class="statspoint statspoint--${j % 3}" style="--point-x:${x}%;--point-y:${j % 2 ? 62 : 34}%;--point-delay:${j * 70}ms"></i>`).join('')}</div>
        </div>
      </article>`).join('')}
    </div>
    <div class="statsaxis" aria-hidden="true"><span></span><div>${Array.from({length: 11}, (_, i) => `<span>${i * 10}</span>`).join('')}</div></div>`;
  // Commit the initial state before replaying CSS entrance animations.
  void chart.offsetWidth;
  frame = requestAnimationFrame(() => {
    summary.classList.add('is-visible');
    chart.classList.add('is-ready');
  });
}
function select(key) {
  clearTimeout(timer);
  cancelAnimationFrame(frame);
  tabs.forEach(tab => {
    const active = tab.dataset.statsTab === key;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  summary.classList.remove('is-visible');
  chart.classList.remove('is-ready');
  timer = setTimeout(() => render(key), 140);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => select(tab.dataset.statsTab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    tabs[next].focus();
    tabs[next].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    select(tabs[next].dataset.statsTab);
  });
});
render('cities');
