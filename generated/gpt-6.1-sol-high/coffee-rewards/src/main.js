import './style.css';

// The rounded-rectangle signed distance field defines the refracting edge.
function roundedSDF(x, y, width, height, radius) {
  const qx = Math.abs(x - width / 2) - width / 2 + radius;
  const qy = Math.abs(y - height / 2) - height / 2 + radius;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius;
}
function applyLiquidGlass() {
  const supportsSVG = CSS.supports('backdrop-filter', 'url(#liquid-test) blur(0.3px) saturate(1.3)');
  if (!supportsSVG) return;
  const ns = 'http://www.w3.org/2000/svg';
  document.querySelectorAll('[data-liquid]').forEach((button, index) => {
    const width = button.offsetWidth, height = button.offsetHeight;
    if (!width || !height) return;
    const radius = Math.min(parseFloat(getComputedStyle(button).borderRadius), height / 2);
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    const pixels = ctx.createImageData(width, height);
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const d = roundedSDF(x, y, width, height, radius);
      const dx = roundedSDF(x + .5, y, width, height, radius) - roundedSDF(x - .5, y, width, height, radius);
      const dy = roundedSDF(x, y + .5, width, height, radius) - roundedSDF(x, y - .5, width, height, radius);
      const edge = Math.exp(-Math.abs(d + 2) / 3.5);
      const i = (y * width + x) * 4;
      pixels.data[i] = 128 + dx * edge * 110;
      pixels.data[i + 1] = 128 + dy * edge * 110;
      pixels.data[i + 2] = 128; pixels.data[i + 3] = 255;
    }
    ctx.putImageData(pixels, 0, 0);
    const filter = document.createElementNS(ns, 'filter');
    filter.id = `liquid-${index}`;
    filter.setAttribute('x', '0%'); filter.setAttribute('y', '0%');
    filter.setAttribute('width', '100%'); filter.setAttribute('height', '100%');
    filter.setAttribute('color-interpolation-filters', 'sRGB');
    const map = document.createElementNS(ns, 'feImage');
    map.setAttribute('href', canvas.toDataURL());
    map.setAttribute('width', '100%'); map.setAttribute('height', '100%');
    map.setAttribute('preserveAspectRatio', 'none'); map.setAttribute('result', 'refraction');
    const displacement = document.createElementNS(ns, 'feDisplacementMap');
    displacement.setAttribute('in', 'SourceGraphic'); displacement.setAttribute('in2', 'refraction');
    displacement.setAttribute('scale', '9'); displacement.setAttribute('xChannelSelector', 'R'); displacement.setAttribute('yChannelSelector', 'G');
    filter.append(map, displacement); document.querySelector('#liquid-filters').append(filter);
    button.style.backdropFilter = `url(#${filter.id}) blur(0.3px) saturate(1.3)`;
  });
}
applyLiquidGlass();
const video = document.querySelector('video');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function updateMotion() { if (reducedMotion.matches) video.pause(); else video.play().catch(() => {}); }
video.addEventListener('loadeddata', updateMotion); reducedMotion.addEventListener('change', updateMotion); updateMotion();

const dialog = document.querySelector('dialog');
const content = dialog.querySelector('.dialog-content');
let previousFocus;
function openDialog(html) { previousFocus = document.activeElement; content.innerHTML = html; dialog.showModal(); }
dialog.addEventListener('close', () => previousFocus?.focus());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.querySelector('.edit').addEventListener('click', () => {
  openDialog('<h2>Edit profile</h2><label for="profile-name">Name</label><input id="profile-name" name="name" maxlength="24" required autocomplete="given-name" /><button class="glass pill save" value="save">Save changes</button>');
  const input = content.querySelector('input'); input.value = document.querySelector('h1').textContent;
  content.querySelector('.save').addEventListener('click', event => {
    if (!input.value.trim()) { event.preventDefault(); input.setCustomValidity('Enter a name'); input.reportValidity(); return; }
    document.querySelector('h1').textContent = input.value.trim(); input.setCustomValidity('');
  });
  input.addEventListener('input', () => input.setCustomValidity(''));
});
document.querySelector('.achievements').addEventListener('click', () => openDialog('<h2>12 achievements</h2><p>Your coffee journey so far.</p><div class="achievement-summary"><div><b>154</b> drinks consumed</div><div><b>36</b> sandwiches eaten</div><div><b>12</b> cafes visited</div></div>'));
document.querySelector('.close').addEventListener('click', () => { document.querySelector('.screen').hidden = true; document.querySelector('.closed-state').hidden = false; document.querySelector('.reopen').focus(); });
document.querySelector('.reopen').addEventListener('click', () => { document.querySelector('.screen').hidden = false; document.querySelector('.closed-state').hidden = true; document.querySelector('.close').focus(); });
let toastTimer;
document.querySelector('.shuffle').addEventListener('click', () => {
  const image = document.querySelector('.favorite-image'); image.classList.remove('shuffling'); void image.offsetWidth; image.classList.add('shuffling');
  const toast = document.querySelector('.toast'); toast.textContent = 'Latte is still your favorite'; toast.classList.add('visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('visible'), 2400);
});
