from pathlib import Path
import json
root=Path(__file__).resolve().parent.parent
s=(root/'PROMPT.md').read_text()
for a in json.loads((root/'assets/manifest.json').read_text()):
    if a['status']=='ok': s=s.replace(a['url'],a['local'])
s=s.replace('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />','<link rel="preload" href="assets/geist-latin.woff2" as="font" type="font/woff2" crossorigin />')
s=s.replace('<style>','''<style>
@font-face { font-family: "Geist"; font-style: normal; font-weight: 100 900; font-display: swap; src: url("assets/geist-latin.woff2") format("woff2"); }
engine-hero { display: block; }
.showcase__tab { border: 0; padding: 0; background: transparent; font-family: inherit; }
a:focus-visible, button:focus-visible { outline: 2px solid #7191d0; outline-offset: 5px; }
''',1)
s=s.replace('href="/"','href="/motionsites-results/aerocore/"')
s=s.replace('https://res.cloudinary.com/dsdhxhhqh/image/upload/v1780405513/hero-engine_isebcf.png', 'assets/engine-reconstructed.png')
s=s.replace('<title>', '<link rel="icon" href="data:," />\n<title>', 1)
# Use the transparent reconstruction authorized by the scoped repair; upstream 401 is documented.
s=s.replace('<div class="showcase__tab${','<button type="button" class="showcase__tab${').replace('<span class="showcase__tab-num">${t.num}</span>\n</div>','<span class="showcase__tab-num">${t.num}</span>\n</button>')
s=s.replace('this.tabs = this.el.querySelectorAll(".showcase__tab");','''this.tabs = this.el.querySelectorAll(".showcase__tab");
this.tabs.forEach((tab, index) => tab.addEventListener("click", () => {
  const top = this.el.getBoundingClientRect().top + window.scrollY;
  const progress = 0.08 + ((index + 0.15) / TABS.length) * 0.92;
  window.scrollTo({ top: top + progress * (this.el.offsetHeight - window.innerHeight), behavior: "smooth" });
}));''')
a=s.index('if (missionMedia) {\nconst mr ='); b=s.index('const expandP =',a)
s=s[:a]+'''// Derive the expansion from document position so anchor jumps and reloads work too.
if (missionMedia) {
  const mr = missionMedia.getBoundingClientRect();
  const trigger = mr.top + window.scrollY + mr.height / 2 - vh / 2;
  this.expandStartScrollY = trigger;
  this.isStartLocked = window.scrollY >= trigger;
  this.startRect = this.isStartLocked
    ? { top: vh / 2 - mr.height / 2, left: mr.left, width: mr.width, height: mr.height, radius: 0 }
    : this.cardToRect(mr);
  if (!this.isStartLocked) {
    this.applyRect(this.startRect);
    film.style.opacity = mr.bottom > 0 && mr.top < vh ? "1" : "0";
    filmOverlay.style.opacity = "0";
    ui.style.opacity = "0";
    this.frame = requestAnimationFrame(this.loop);
    return;
  }
}

'''+s[b:]
s=s.replace('window.setTimeout(() => {\nthis.summary.textContent', 'clearTimeout(this.renderTimeout);\nthis.renderTimeout = window.setTimeout(() => {\nthis.summary.textContent')
(root/'index.html').write_text(s)
