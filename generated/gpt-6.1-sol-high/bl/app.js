(function(){
var container = document.getElementById('scrollContainer');
var videos = { v1: document.getElementById('v1'), v2: document.getElementById('v2'), v3: document.getElementById('v3') };
var canvas = document.getElementById('mainCanvas');
var bgWrapper = document.getElementById('bgWrapper');
var brandHeader = document.getElementById('brandHeader');
var navHeader = document.getElementById('navHeader');
var botanicalCard = document.getElementById('botanicalCard');
var featuresContainer = document.getElementById('featuresContainer');
var fCard1 = document.getElementById('fCard1');
var fCard2 = document.getElementById('fCard2');
var fCard3 = document.getElementById('fCard3');
var missionContainer = document.getElementById('missionContainer');
var mPara1 = document.getElementById('mPara1');
var mPara2 = document.getElementById('mPara2');
var mPara3 = document.getElementById('mPara3');
var feedbackContainer = document.getElementById('feedbackContainer');
var feedbackForm = document.getElementById('feedbackForm');
var loadingScreen = document.getElementById('loadingScreen');
var errorScreen = document.getElementById('errorScreen');

var targetProgress = 0, currentProgress = 0;
var durations = { v1: 0, v2: 0, v3: 0 };
var metaLoaded = { v1: false, v2: false, v3: false };
var seeking = { v1: false, v2: false, v3: false };
var pendingSeek = { v1: -1, v2: -1, v3: -1 };
var offscreen = null;

function getActiveKey(p) { return p <= 0.333 ? 'v1' : p <= 0.666 ? 'v2' : 'v3'; }

// Canvas draw with double-buffer
function drawFrame() {
var p = currentProgress;
var key = getActiveKey(p);
var video = videos[key];
if (!video || video.readyState < 2) return;
var dpr = window.devicePixelRatio || 1;
var cW = canvas.width / dpr, cH = canvas.height / dpr;
if (cW === 0 || cH === 0) return;
var vW = video.videoWidth || 1920, vH = video.videoHeight || 1080;
var vA = vW / vH, cA = cW / cH;
var dW = cW, dH = cH, oX = 0, oY = 0;
if (vA > cA) { dW = cH * vA; oX = (cW - dW) / 2; }
else { dH = cW / vA; oY = (cH - dH) / 2; }
if (!offscreen) offscreen = document.createElement('canvas');
if (offscreen.width !== canvas.width || offscreen.height !== canvas.height) {
offscreen.width = canvas.width; offscreen.height = canvas.height;
}
var oc = offscreen.getContext('2d');
if (!oc) return;
try {
oc.setTransform(dpr, 0, 0, dpr, 0, 0);
oc.clearRect(0, 0, cW, cH);
oc.drawImage(video, oX, oY, dW, dH);
var ctx = canvas.getContext('2d');
if (!ctx) return;
ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.drawImage(offscreen, 0, 0);
} catch(e) {}
}

function handleResize() {
var parent = canvas.parentElement;
if (!parent) return;
var dpr = window.devicePixelRatio || 1;
var w = parent.clientWidth, h = parent.clientHeight;
canvas.width = w * dpr; canvas.height = h * dpr;
canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
if (offscreen) { offscreen.width = canvas.width; offscreen.height = canvas.height; }
drawFrame();
}

function safeSeek(key, targetTime) {
var video = videos[key];
if (!video || !metaLoaded[key] || video.readyState < 2) return;
var dur = durations[key] || video.duration || 10;
var clamped = Math.max(0, Math.min(targetTime, dur - 0.05));
if (Math.abs(video.currentTime - clamped) < 0.01) return;
if (seeking[key]) { pendingSeek[key] = clamped; return; }
seeking[key] = true; pendingSeek[key] = -1;
video.currentTime = clamped;
}

['v1','v2','v3'].forEach(function(key) {
videos[key].addEventListener('seeked', function() {
seeking[key] = false;
if (key === getActiveKey(currentProgress)) drawFrame();
if (pendingSeek[key] >= 0) { var t = pendingSeek[key]; pendingSeek[key] = -1; safeSeek(key, t); }
});
});

// Loading
var experienceReady = false;
function checkAllReady() {
if (!experienceReady && metaLoaded.v1 && metaLoaded.v2 && metaLoaded.v3 && videos.v1.readyState >= 2) {
experienceReady = true;
setTimeout(function() { loadingScreen.classList.add('hidden'); handleResize(); }, 100);
}
}
['v1','v2','v3'].forEach(function(key) {
var el = videos[key];
function onMeta() {
var d = el.duration;
if (d && !isNaN(d) && d > 0 && d !== Infinity) { durations[key] = d; metaLoaded[key] = true; checkAllReady(); }
}
el.addEventListener('loadedmetadata', onMeta);
el.addEventListener('durationchange', onMeta);
el.addEventListener('canplay', onMeta);
el.addEventListener('loadeddata', function(){ onMeta(); handleResize(); });
el.addEventListener('error', function() { loadingScreen.classList.add('hidden'); errorScreen.classList.add('show'); });
if (el.readyState >= 1) onMeta();
});
window.addEventListener('resize', handleResize);

// Cursor parallax
window.addEventListener('mousemove', function(e) {
var x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
var y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
bgWrapper.style.transform = 'translate3d(' + (x * -24) + 'px,' + (y * -24) + 'px,0)';
});

// Scroll progress
window.addEventListener('scroll', function() {
var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
var maxScroll = container.scrollHeight - window.innerHeight;
targetProgress = maxScroll > 0 ? Math.max(0, Math.min(1, scrollTop / maxScroll)) : 0;
}, { passive: true });

// Helpers
function setVisible(el, v) { if (!el) return; el.inert = !v; el.style.visibility = v ? 'visible' : 'hidden'; el.style.pointerEvents = v ? 'auto' : 'none'; }
function applyStyle(el, op, tx, ty, bl) {
if (!el) return;
el.inert = op < 0.05;
el.style.opacity = op;
el.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
el.style.filter = 'blur(' + bl + 'px)';
}

// Stop rewriting filters and transforms once the scroll position has settled.
var lastRenderedProgress = -1;
function tick() {
currentProgress += (targetProgress - currentProgress) * 0.08;
if (Math.abs(targetProgress - currentProgress) < 0.00001) currentProgress = targetProgress;
if (currentProgress === lastRenderedProgress) { requestAnimationFrame(tick); return; }
lastRenderedProgress = currentProgress;
var p = currentProgress;

var activeKey = getActiveKey(p);
var pLocal = activeKey === 'v1' ? Math.max(0, Math.min(1, p * 3))
: activeKey === 'v2' ? Math.max(0, Math.min(1, (p - 0.333) * 3))
: Math.max(0, Math.min(1, (p - 0.666) * 3));
safeSeek(activeKey, pLocal * (durations[activeKey] || 10));

// Botanical Card
var f = Math.min(1, Math.max(0, p / 0.15));
applyStyle(botanicalCard, 1 - f, f * -35, f * 35, f * 16);
botanicalCard.style.pointerEvents = f > 0.95 ? 'none' : 'auto';

// Nav header
f = Math.min(1, Math.max(0, (p - 0.03) / 0.15));
applyStyle(navHeader, 1 - f, 0, f * -35, f * 14);
navHeader.style.pointerEvents = f > 0.95 ? 'none' : 'auto';

// Brand header
f = Math.min(1, Math.max(0, (p - 0.06) / 0.15));
applyStyle(brandHeader, 1 - f, f * -25, f * -35, f * 12);
brandHeader.style.pointerEvents = f > 0.95 ? 'none' : 'auto';

// Feature cards
var show = p > 0.13 && p < 0.55;
setVisible(featuresContainer, show);
function animCard(el, enterStart, enterDur, exitStart, exitDur, tx, ty) {
if (!el) return;
var op = 0, bl = 16, x = tx, y = ty;
if (p >= enterStart && p <= 0.333) {
var r = Math.min(1, Math.max(0, (p - enterStart) / enterDur));
op = r; bl = (1 - r) * 16; x = (1 - r) * tx; y = (1 - r) * ty;
} else if (p > 0.333 && p <= exitStart + exitDur) {
var r = Math.min(1, Math.max(0, (p - exitStart) / exitDur));
op = 1 - r; bl = r * 16; x = r * tx; y = r * ty;
}
applyStyle(el, op, x, y, bl);
}
animCard(fCard1, 0.15, 0.15, 0.333, 0.12, -35, 35);
animCard(fCard2, 0.18, 0.13, 0.333, 0.15, 0, 35);
animCard(fCard3, 0.21, 0.11, 0.333, 0.18, 35, 35);

// Mission paragraphs
setVisible(missionContainer, p > 0.44);
function animPara(el, inS, inE, holdE, outE) {
if (!el) return;
var op = 0, bl = 20, y = 120;
if (p >= inS && p < inE) { var r = (p - inS) / (inE - inS); op = r; bl = (1 - r) * 20; y = (1 - r) * 120; }
else if (p >= inE && p <= holdE) { op = 1; bl = 0; y = 0; }
else if (p > holdE && p <= outE) { var r = (p - holdE) / (outE - holdE); op = 1 - r; bl = r * 20; y = r * -120; }
else if (p > outE) { op = 0; bl = 20; y = -120; }
applyStyle(el, op, 0, y, bl);
}
animPara(mPara1, 0.44, 0.47, 0.59, 0.62);
animPara(mPara2, 0.62, 0.65, 0.77, 0.80);
animPara(mPara3, 0.80, 0.83, 0.95, 0.98);

// Feedback form
setVisible(feedbackContainer, p > 0.93);
if (p > 0.93) {
var opF = 0, blF = 20, yF = 120;
if (p >= 0.94 && p < 0.97) { var r = (p - 0.94) / 0.03; opF = r; blF = (1 - r) * 20; yF = (1 - r) * 120; }
else if (p >= 0.97) { opF = 1; blF = 0; yF = 0; }
applyStyle(feedbackForm, opF, 0, yF, blF);
}

requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// Hamburger menu
var menuOpen = false;
var hamburgerBtn = document.getElementById('hamburgerBtn');
var mobileMenu = document.getElementById('mobileMenu');
var hLine1 = document.getElementById('hLine1');
var hLine2 = document.getElementById('hLine2');
var hLine3 = document.getElementById('hLine3');
function setMenu(open) {
menuOpen = open;
mobileMenu.classList.toggle('open', open);
mobileMenu.inert = !open;
mobileMenu.setAttribute('aria-hidden', String(!open));
navHeader.classList.toggle('menu-open', open);
hLine1.classList.toggle('top-open', open);
hLine2.classList.toggle('mid-open', open);
hLine3.classList.toggle('bot-open', open);
hamburgerBtn.setAttribute('aria-expanded', String(open));
hamburgerBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
hamburgerBtn.addEventListener('click', function(){setMenu(!menuOpen);});
document.addEventListener('keydown', function(e){
 if(e.key === 'Escape' && menuOpen){setMenu(false);hamburgerBtn.focus();}
 if(e.key === 'Tab' && menuOpen){
  var controls = [hamburgerBtn].concat(Array.from(mobileMenu.querySelectorAll('a')));
  var i = controls.indexOf(document.activeElement);
  e.preventDefault(); controls[(i + (e.shiftKey ? controls.length - 1 : 1)) % controls.length].focus();
 }
});
var destinations = {atelier:0, collections:0.325, rituals:0.53, about:0.855, contact:1};
function navigateTo(hash, smooth) {
 var stage = destinations[hash.replace('#','')];
 if(stage === undefined) return;
 window.scrollTo({top:stage * (container.scrollHeight - window.innerHeight),behavior:smooth?'smooth':'instant'});
}
document.querySelectorAll('a[href^="#"]').forEach(function(a){
 a.addEventListener('click',function(e){
  e.preventDefault();setMenu(false);
  history.replaceState(null,'',a.getAttribute('href'));
  navigateTo(a.hash,true);
 });
});
window.addEventListener('load',function(){navigateTo(location.hash,false);});
window.addEventListener('hashchange',function(){navigateTo(location.hash,true);});

// CTA button
document.getElementById('ctaBtn').addEventListener('click', function() {
window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
});

// Feedback form
var fbForm = document.getElementById('fbForm');
var fbBtn = document.getElementById('fbBtn');
var fbSuccess = document.getElementById('fbSuccess');
fbForm.addEventListener('submit', function(e) {
e.preventDefault();
var email = document.getElementById('fbEmail').value.trim();
if (email) {
fbBtn.textContent = 'SUBMITTED';
fbBtn.classList.add('submitted');
fbBtn.disabled = true;
fbSuccess.classList.add('show');
}
});
})();
