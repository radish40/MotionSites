'use strict';
const section = document.querySelector('.cinema-scroll');
const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const track = document.querySelector('.sights-track');
const sightsControls = document.querySelector('.sights-controls');
const sightPrev = document.querySelector('.sight-prev');
const sightNext = document.querySelector('.sight-next');
const originalCards = [...document.querySelectorAll('.sight-card')];
let targetMouseX = 0, targetMouseY = 0, mouseX = 0, mouseY = 0;
let targetScroll = 0, smoothScroll = 0, initialized = false, rafPending = false;
let sightCards = [], originalSightCount = originalCards.length, activeSight = originalSightCount;
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const smoothstep = (e0, e1, v) => { const x = clamp((v - e0) / (e1 - e0)); return x * x * (3 - 2 * x); };
const lerp = (a, b, t) => a + (b - a) * t;
const segmentInOut = (s, a, b, c, d) => { const enter = smoothstep(a, b, s), exit = smoothstep(c, d, s); return { enter, exit, active: enter * (1 - exit) }; };
const getScrollDistance = () => clamp(-section.getBoundingClientRect().top, 0, section.offsetHeight - window.innerHeight);
function update() {
  rafPending = false;
targetScroll = getScrollDistance();
if (!initialized || reduceMotion.matches) { smoothScroll = targetScroll; initialized = true; }
else { smoothScroll = lerp(smoothScroll, targetScroll, 0.14); }
if (Math.abs(smoothScroll - targetScroll) < 0.08) smoothScroll = targetScroll;

mouseX = lerp(mouseX, targetMouseX, 0.12);
mouseY = lerp(mouseY, targetMouseY, 0.12);

const frame2 = segmentInOut(smoothScroll, 560, 900, 1300, 1620);
const frame3 = segmentInOut(smoothScroll, 1760, 2140, 2540, 2700);
const progress = clamp(smoothScroll / 2700);
const introExit = smoothstep(90, 650, smoothScroll);
const sightsEnterRaw = smoothstep(2760, 3560, smoothScroll);
const sightsEnter = Math.pow(sightsEnterRaw, 1.55);
const sightsControlsEnter = smoothstep(3360, 3660, smoothScroll);
const blurActive = clamp(frame2.active + frame3.active);
const frame2Opacity = frame2.active * (1 - frame3.enter);
const splitDrift = Math.pow(frame2.enter, 1.5);
const panel2Opacity = frame2.active * (1 - frame2.exit);
const panel3Opacity = frame3.active * (1 - frame3.exit);
const backScale = 0.76 + progress * 0.2 + frame2.enter * 0.18 + frame3.enter * 0.16;
const sharedHeroY = progress * -74;
const sharedHeroScale = progress * 0.23;
const sightsScreenTop = Math.min(220, Math.max(112, window.innerHeight * 0.19)) - 50;
const sightsParentTop = window.innerHeight - (window.innerHeight - sightsScreenTop) / backScale;

  const values = {
    '--mx': (reduceMotion.matches ? 0 : mouseX).toFixed(4),
    '--my': (reduceMotion.matches ? 0 : mouseY).toFixed(4),
    '--back-opacity': 1 - frame2.active * 0.06,
    '--back-x': `${mouseX * -12}px`, '--back-y': `${mouseY * -4}px`, '--back-scale': backScale,
    '--four-y': `${10 + progress * 10}vh`, '--four-scale': 0.78 + progress * 0.16,
    '--bazaar-y': `${20 - progress * 8}vh`, '--blur-px': `${blurActive * 14}px`,
    '--back-brightness': 1 - blurActive * 0.255,
    '--bazaar-blur-px': `${frame2.active * 14}px`,
    '--bazaar-brightness': 1 - frame2.active * 0.255 - frame3.active * 0.06,
    '--bazaar-saturation': 1 + frame3.active * 0.18,
    '--shade-opacity': '1', '--shade-z': frame2.active > 0.02 ? '2' : '0',
    '--shade-top-alpha': blurActive * 0.465, '--shade-mid-alpha': blurActive * 0.42, '--shade-bottom-alpha': blurActive * 0.51,
    '--title-y': `${introExit * -210}px`, '--title-scale': 1 - introExit * 0.08, '--title-opacity': 1 - introExit,
    '--bridge-x': `calc(-50% + ${mouseX * 18}px)`,
    '--bridge-y': `${mouseY * 8 + sharedHeroY - frame2.exit * 760}px`,
    '--bridge-bottom': `${5 - frame2.enter * 13}vh`, '--bridge-width': `${67.2 + frame2.enter * 37.8}vw`,
    '--bridge-scale': 1.02 + sharedHeroScale + frame2.exit * 0.46,
    '--split-left-x': `calc(-50% + ${-splitDrift * 46}vw + ${mouseX * 22}px)`,
    '--split-left-y': `${mouseY * 10 + sharedHeroY - splitDrift * 180}px`,
    '--split-left-scale': 1 + sharedHeroScale + frame2.enter * 0.74,
    '--split-right-x': `calc(-50% + ${splitDrift * 46}vw + ${mouseX * 22}px)`,
    '--split-right-y': `${mouseY * 10 + sharedHeroY - splitDrift * 180}px`,
    '--split-right-scale': 1 + sharedHeroScale + frame2.enter * 0.74,
    '--frame2-opacity': frame2Opacity, '--frame2-x': `calc(-50% + ${mouseX * 10}px)`,
    '--frame2-y': `calc(-50% + ${mouseY * 8 - frame2.exit * 150}px)`,
    '--frame2-scale': 1.06 + frame2.enter * 0.08 + frame2.exit * 0.08,
    '--intro-copy-y': `${introExit * 90}px`, '--intro-copy-opacity': 1 - introExit,
    '--panel2-opacity': panel2Opacity, '--panel2-y': `calc(-50% + ${-frame2.exit * 86 + (1 - frame2.enter) * 58}px)`,
    '--panel3-opacity': panel3Opacity, '--panel3-y': `calc(-50% + ${-frame3.exit * 86 + (1 - frame3.enter) * 58}px)`,
    '--sights-opacity': sightsEnter, '--sights-controls-opacity': sightsControlsEnter,
    '--sights-visibility': sightsEnter > 0.01 ? 'visible' : 'hidden', '--sights-y': '0px',
    '--sights-enter-x': `${(1 - sightsEnter) * 420}vw`, '--sights-scale': 1 / backScale,
    '--sights-top': `${sightsParentTop}px`, '--sights-screen-top': `${sightsScreenTop}px`
  };
  for (const [property, value] of Object.entries(values)) root.style.setProperty(property, value);
  sightsControls.classList.toggle('is-ready', sightsControlsEnter > 0.98);
  if (Math.abs(smoothScroll - targetScroll) > 0.08 || Math.abs(mouseX - targetMouseX) > 0.001 || Math.abs(mouseY - targetMouseY) > 0.001) requestTick();
}
function requestTick() { if (!rafPending) { rafPending = true; requestAnimationFrame(update); } }
function setupSightSlider() {
  track.replaceChildren();
  for (let setIndex = 0; setIndex < 3; setIndex++) {
    originalCards.forEach((card, cardIndex) => {
      const clone = card.cloneNode(true);
      clone.dataset.sightIndex = setIndex * originalSightCount + cardIndex;
      track.append(clone);
    });
  }
  sightCards = [...track.querySelectorAll('.sight-card')];
  activeSight = originalSightCount;
  sightCards.forEach(card => {
    card.addEventListener('click', () => selectSightCard(card));
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectSightCard(card); } });
  });
  track.addEventListener('transitionend', normalizeSightSlider);
  updateSightSlider();
}
function updateSightSlider() {
  const cardWidth = sightCards[0].offsetWidth;
  const gap = parseFloat(getComputedStyle(track).columnGap || '0');
  root.style.setProperty('--sights-shift', `${-(cardWidth + gap) * activeSight}px`);
  sightCards.forEach((card, index) => card.classList.toggle('is-active', index === activeSight));
}
function moveSightSlider(dir) { activeSight += dir; updateSightSlider(); }
function selectSightCard(card) { const index = Number(card.dataset.sightIndex); if (Number.isFinite(index)) { activeSight = index; updateSightSlider(); } }
function jumpSightSlider(index) {
  track.classList.add('is-jumping'); activeSight = index; updateSightSlider();
  requestAnimationFrame(() => requestAnimationFrame(() => track.classList.remove('is-jumping')));
}
function normalizeSightSlider() {
  if (activeSight >= originalSightCount * 2) jumpSightSlider(activeSight - originalSightCount);
  else if (activeSight < originalSightCount) jumpSightSlider(activeSight + originalSightCount);
}
window.addEventListener('scroll', requestTick, { passive:true });
window.addEventListener('resize', () => { updateSightSlider(); requestTick(); });
window.addEventListener('pointermove', event => {
  targetMouseX = reduceMotion.matches ? 0 : event.clientX / innerWidth - 0.5;
  targetMouseY = reduceMotion.matches ? 0 : event.clientY / innerHeight - 0.5;
  requestTick();
}, { passive:true });
reduceMotion.addEventListener('change', () => { targetMouseX = targetMouseY = mouseX = mouseY = 0; requestTick(); });
sightPrev.addEventListener('click', () => moveSightSlider(-1));
sightNext.addEventListener('click', () => moveSightSlider(1));
// Sticky scene destinations have scroll distances rather than additional DOM sections.
const destinations = { cinema:0, bridge:1050, bazaar:2300, routes:3700 };
function navigateScene(hash, behavior) {
  const key = hash.replace('#', '');
  if (!(key in destinations)) return;
  window.scrollTo({ top:section.offsetTop + destinations[key], behavior:reduceMotion.matches ? 'instant' : behavior });
}
document.querySelectorAll('.site-header a').forEach(link => link.addEventListener('click', event => {
  event.preventDefault(); history.replaceState(null, '', link.hash); navigateScene(link.hash, 'smooth');
}));
window.addEventListener('hashchange', () => navigateScene(location.hash, 'smooth'));
setupSightSlider();
if (location.hash) navigateScene(location.hash, 'instant');
requestTick();
