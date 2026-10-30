const main = document.querySelector('main');
const svg = document.querySelector('.route');
const paths = [...svg.querySelectorAll('path')];
const drawn = document.querySelector('.route-drawn');
const glow = document.querySelector('.route-glow');
const tip = document.querySelector('.route-tip');
const halo = document.querySelector('.route-tip-halo');
const anchors = [...document.querySelectorAll('.route-anchor')];
const stages = [...document.querySelectorAll('.stage')];
const value = document.querySelector('.progress-value');
const meter = document.querySelector('.meter-fill');
const rail = document.querySelector('.progress-rail > span');
let length = 0;
let scheduled = false;
let stageThresholds = [];
function layoutRoute() {
  const box = main.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
  const points = anchors.map(el => { const r = el.getBoundingClientRect(); return {x:r.left + r.width / 2 - box.left, y:r.top + r.height / 2 - box.top}; });
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i-1], b = points[i], dy = b.y - a.y;
    if (innerWidth <= 600) {
      const gutter = box.width - 12;
      const turn = Math.min(120,dy * .25);
      d += ` C ${a.x} ${a.y + turn}, ${gutter} ${a.y + turn * .4}, ${gutter} ${a.y + turn * 1.4} L ${gutter} ${b.y - turn * 1.4} C ${gutter} ${b.y - turn * .4}, ${b.x} ${b.y - turn}, ${b.x} ${b.y}`;
    } else {
      d += ` C ${a.x} ${a.y + dy * .55}, ${b.x} ${b.y - dy * .55}, ${b.x} ${b.y}`;
    }
  }
  paths.forEach(path => path.setAttribute('d', d));
  length = drawn.getTotalLength();
  drawn.style.strokeDasharray = length;
  glow.style.strokeDasharray = length;
  stageThresholds = points.slice(1,-1).map(p => {
    let best = 0, distance = Infinity;
    for (let i = 0; i <= 500; i++) { const sample = drawn.getPointAtLength(length * i / 500); const delta = Math.hypot(sample.x-p.x,sample.y-p.y); if(delta<distance){distance=delta;best=i/500;} }
    return best;
  });
  update();
}
function update() {
  scheduled = false;
  const maximum = document.documentElement.scrollHeight - innerHeight;
  const progress = maximum > 0 ? Math.min(1, Math.max(0, scrollY / maximum)) : 0;
  const current = length * progress;
  drawn.style.strokeDashoffset = length-current;
  glow.style.strokeDashoffset = length-current;
  const point = drawn.getPointAtLength(current);
  for(const circle of [tip,halo]){circle.setAttribute('cx',point.x);circle.setAttribute('cy',point.y);}
  value.textContent = Math.round(progress*100);
  meter.style.strokeDashoffset = 100.531*(1-progress);
  rail.style.width = `${progress*100}%`;
  stages.forEach((stage,i) => stage.classList.toggle('reached',progress >= stageThresholds[i]));
}
addEventListener('scroll', () => {if(!scheduled){scheduled=true;requestAnimationFrame(update);}}, {passive:true});
addEventListener('resize',layoutRoute);
document.fonts.ready.then(layoutRoute);
layoutRoute();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
document.querySelector('.restart').addEventListener('click',()=>scrollTo({top:0,behavior:reducedMotion.matches?'instant':'smooth'}));
const dialog = document.querySelector('.info-dialog');
document.querySelector('.how-button').addEventListener('click',()=>dialog.showModal());
document.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
document.querySelector('.dialog-start').addEventListener('click',()=>{dialog.close();document.querySelector('#journey').scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth'});});
