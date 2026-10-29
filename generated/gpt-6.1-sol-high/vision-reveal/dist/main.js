(function() {
// Word reveal
const headline = document.getElementById('headline');
const text = "I build compelling visual stories & motion that make ideas shine.";
headline.setAttribute('aria-label', text);
const words = text.split(' ');
words.forEach(function(word, i) {
const span = document.createElement('span');
span.className = 'word-reveal';
span.textContent = word;
span.style.animationDelay = (1 + i * 0.05) + 's';
headline.appendChild(span);
});

// Burger menu, including keyboard and focus handling.
const burgerBtn = document.getElementById('burger-btn');
const menuPanel = document.getElementById('menu-panel');
function setMenu(open) {
 burgerBtn.classList.toggle('open', open);
 menuPanel.classList.toggle('open', open);
 burgerBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
 burgerBtn.setAttribute('aria-expanded', String(open));
 menuPanel.inert = !open;
}
burgerBtn.addEventListener('click', () => setMenu(!menuPanel.classList.contains('open')));
menuPanel.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => {
 if (e.key === 'Escape' && menuPanel.classList.contains('open')) { setMenu(false); burgerBtn.focus(); }
});
document.addEventListener('pointerdown', e => {
 if (!menuPanel.contains(e.target) && !burgerBtn.contains(e.target)) setMenu(false);
});

// Soft 260px spotlight with the original 0.1 pointer easing.
const imgLayer = document.getElementById('reveal-img');
const mouse = { x: -999, y: -999 };
const smooth = { x: -999, y: -999 };
let frame = 0;
function draw() {
 smooth.x += (mouse.x - smooth.x) * 0.1;
 smooth.y += (mouse.y - smooth.y) * 0.1;
 const bounds = imgLayer.getBoundingClientRect();
 const mask = `radial-gradient(circle 260px at ${smooth.x - bounds.left}px ${smooth.y - bounds.top}px, #fff 0%, #fff 40%, rgba(255,255,255,.75) 60%, rgba(255,255,255,.4) 75%, rgba(255,255,255,.12) 88%, transparent 100%)`;
 imgLayer.style.webkitMaskImage = mask;
 imgLayer.style.maskImage = mask;
 if (Math.abs(mouse.x - smooth.x) + Math.abs(mouse.y - smooth.y) > 0.1) frame = requestAnimationFrame(draw);
 else frame = 0;
}
function track(e) {
 mouse.x = e.clientX;
 mouse.y = e.clientY;
 if (!frame) frame = requestAnimationFrame(draw);
}
window.addEventListener('pointermove', track);
window.addEventListener('pointerdown', track);
document.documentElement.addEventListener('pointerleave', e => {
 if (e.pointerType === 'touch') return;
 mouse.x = -999; mouse.y = -999;
 if (!frame) frame = requestAnimationFrame(draw);
});
window.addEventListener('resize', () => { if (!frame) frame = requestAnimationFrame(draw); });
})();
