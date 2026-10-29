const shader = document.querySelector('.shader-bg');
let resizeTimer;
function sizeShader() {
  const aspect = innerWidth / innerHeight;
  const width = Math.floor(Math.min(1422, 800 * aspect));
  const height = Math.min(800, Math.round(width / aspect));
  shader.style.width = `${width}px`;
  shader.style.height = `${height}px`;
  shader.style.setProperty('--shader-scale', Math.max(innerWidth / width, (innerHeight + 110) / height));
  const src = `https://fragcoord.xyz/embed/c6zisyc6?viewport=${width}x${height}`;
  if (shader.src !== src) shader.src = src;
}
sizeShader();
window.addEventListener('load', () => { sizeShader(); shader.src = shader.src; }, {once:true});
window.addEventListener('resize', () => {clearTimeout(resizeTimer); resizeTimer = setTimeout(() => {sizeShader(); updateScroll();}, 180);});

const tabs = [...document.querySelectorAll('.console-tabs button')];
let typeTimer;
function activateConsole(tab) {
  clearInterval(typeTimer);
  tabs.forEach(button => {
    const active = button === tab;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', active);
    button.tabIndex = active ? 0 : -1;
    document.getElementById(`pane-${button.dataset.pane}`).hidden = !active;
  });
  const typed = document.querySelector(`#pane-${tab.dataset.pane} [data-typed]`);
  typed.textContent = '';
  let count = 0;
  typeTimer = setInterval(() => {typed.textContent = typed.dataset.typed.slice(0, ++count); if (count >= typed.dataset.typed.length) clearInterval(typeTimer);}, 42);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateConsole(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if(event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if(event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if(event.key === 'Home') next = 0;
    if(event.key === 'End') next = tabs.length - 1;
    if(next !== undefined) {event.preventDefault(); tabs[next].focus(); activateConsole(tabs[next]);}
  });
});
activateConsole(tabs[0]);

const platform = document.querySelector('#platform');
const stack = document.querySelector('.accordion-stack');
const cards = [...document.querySelectorAll('.accordion-card')];
const featureTabs = [...document.querySelectorAll('.accordion-tab')];
const barContainer = document.querySelector('.pricing-bars');
const bars = [...barContainer.children];
const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
function updateScroll() {
  const rect = platform.getBoundingClientRect();
  const progress = clamp(-rect.top / (rect.height - innerHeight));
  const position = progress * (cards.length - 1);
  const active = Math.round(position);
  const collapsed = innerWidth <= 820 ? 96 : 84;
  const height = stack.clientHeight;
  const offsets = cards.map((card, index) => {
    const reveal = index === 0 ? 1 : clamp(position - (index - 1));
    return (height + collapsed) * (1 - reveal) + index * collapsed * reveal;
  });
  cards.forEach((card, index) => {
    const next = offsets[index + 1];
    card.style.setProperty('--card-y', `${offsets[index]}px`);
    // Keep each visual inside the space available below its collapsed headers.
    card.style.height = `${height - index * collapsed}px`;
    const actualClip = next === undefined ? 0 : Math.max(0, height - index * collapsed - (next - offsets[index]));
    card.style.setProperty('--card-clip-bottom', `${actualClip}px`);
    featureTabs[index].classList.toggle('active', index === active);
    if(index === active) featureTabs[index].setAttribute('aria-current', 'true'); else featureTabs[index].removeAttribute('aria-current');
  });
  const barRect = barContainer.getBoundingClientRect();
  const barProgress = clamp((innerHeight - barRect.top) / (innerHeight + barRect.height));
  bars.forEach((bar, i) => bar.style.setProperty('--bar-morph', `${Math.sin(barProgress * 2 * Math.PI + i * .72) * 34 + Math.cos(barProgress * Math.PI + i * .34) * 14}px`));
}
featureTabs.forEach((tab, index) => tab.addEventListener('click', () => {
  const top = scrollY + platform.getBoundingClientRect().top;
  window.scrollTo({top: top + index / (cards.length - 1) * (platform.offsetHeight - innerHeight), behavior: 'smooth'});
}));
let scrollQueued = false;
window.addEventListener('scroll', () => {
  if(!scrollQueued) {scrollQueued = true; requestAnimationFrame(() => {updateScroll(); scrollQueued = false;});}
}, {passive: true});
updateScroll();

const billingButtons = [...document.querySelectorAll('[data-billing]')];
billingButtons.forEach(button => button.addEventListener('click', () => {
  const monthly = button.dataset.billing === 'month';
  billingButtons.forEach(b => {b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', b === button);});
  document.querySelectorAll('[data-rate]').forEach(row => row.textContent = monthly ? `$${(Number(row.dataset.rate)*1024).toFixed(2)} / TiB / month` : `$${row.dataset.rate} / GiB / month`);
  document.querySelector('.billing-note').hidden = !monthly;
}));

const shell = document.querySelector('.modal-cube-shell');
const particleHolder = document.querySelector('.cube-particles');
// The supplied prompt specifies count and ranges, but does not include original coordinates.
const particles = [
  [-270,-155,80,.32,-24,0],[-155,-250,130,.22,38,30],[70,-195,60,.38,-16,60],[250,-140,110,.26,44,90],
  [330,15,30,.18,-34,120],[215,180,100,.45,22,60],[20,225,65,.28,-40,150],[-185,175,120,.34,28,90],
  [-310,25,50,.24,-18,120],[125,55,210,.58,36,180],[-225,-60,80,.09,0,50],[-65,-210,120,.1,0,100],[290,110,70,.12,0,150],[-110,220,30,.09,0,200]
];
particles.forEach(([tx,ty,tz,s,r,d], index) => {
  const particle = document.createElement('span');
  particle.className = `cube-particle${index > 9 ? ' dot' : ''}`;
  particle.style.cssText = `--tx:${tx}px;--ty:${ty}px;--tz:${tz}px;--s:${s};--r:${r}deg;--d:${d}ms`;
  if(index < 10) ['front','back','right','left','top','bottom'].forEach(face => {const side = document.createElement('span');side.className = `cube-face ${face}`;particle.append(side);});
  particleHolder.append(particle);
});
shell.addEventListener('click', () => {
  const exploded = shell.classList.toggle('is-exploded');
  shell.setAttribute('aria-pressed', exploded);
  shell.setAttribute('aria-label', exploded ? 'Reassemble the operations cube' : 'Explode the operations cube');
});
const toast = document.querySelector('.dashboard-toast');
let toastTimer;
document.querySelector('.new-pool').addEventListener('click', () => {
  toast.classList.add('flash');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('flash'), 1800);
});
