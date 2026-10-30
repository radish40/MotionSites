import './style.css';

const story = document.querySelector('.assembly-story');
const device = document.querySelector('.device');
const intro = document.querySelector('.intro-copy');
const explodedCopy = document.querySelector('.exploded-copy');
const finalCopy = document.querySelector('.final-copy');
const parts = [...document.querySelectorAll('.part')];
const callouts = [...document.querySelectorAll('.callout')];
const chapters = [...document.querySelectorAll('.chapter')];
const mobile = () => innerWidth <= 700;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const ease = t => t*t*(3-2*t);
const lerp = (a,b,t) => a+(b-a)*t;
// Each component has an independent path. The final coordinates form a new, wide desktop layout.
const exploded = [[0,40,-3],[-45,15,-5],[-205,-100,-7],[40,-145,7],[250,8,12],[0,55,-3]];
const assembled = [[0,0,0],[0,0,0],[-105,0,0],[0,0,0],[105,0,0],[0,20,0]];
let scheduled = false;
let progress = 0;
function render() {
  scheduled = false;
  const length = story.offsetHeight - innerHeight;
  progress = clamp(-story.getBoundingClientRect().top / length);
  const expand = reduced ? Number(progress >= .28) : ease(clamp((progress-.09)/.35));
  const join = reduced ? Number(progress >= .73) : ease(clamp((progress-.58)/.34));
  const expansion = expand*(1-join);
  intro.style.opacity = 1-ease(clamp(progress/.19));
  intro.style.transform = `translateY(${-progress*90}px)`;
  explodedCopy.style.opacity = ease(clamp((progress-.15)/.12))*(1-ease(clamp((progress-.57)/.13)));
  explodedCopy.style.transform = `translateY(${15*(1-expand)}px)`;
  finalCopy.style.opacity = ease(clamp((progress-.68)/.16));
  finalCopy.style.transform = `translateY(${15*(1-join)}px)`;
  const rotate = lerp(mobile()?-13:-9,0,join);
  device.style.scale = mobile() ? String(.48-.17*expansion-.10*join) : String((innerWidth<=1100?.87:1)-.1*expansion);
  device.style.transform = `perspective(1200px) rotateX(${lerp(24,10,join)}deg) rotateZ(${rotate}deg) translateY(${lerp(0,0,expand)}px)`;
  parts.forEach((part,i) => {
    const [x,y,r] = exploded[i]; const [fx,fy,fr] = assembled[i];
    const tx = x*expansion+fx*join, ty = y*expansion+fy*join, angle = r*expansion+fr*join;
    part.style.transform = `translate3d(${tx}px,${ty}px,${i>1?6:1}px) rotate(${angle}deg)`;
    if(i===0) { part.style.width = `${lerp(690,900,join)}px`; part.style.left = `${lerp(0,-105,join)}px`; }
    if(i===1) part.style.opacity = 1-join;
    if(i===5) { part.style.width = `${lerp(634,844,join)}px`; part.style.left = `${lerp(28,-77,join)}px`; }
  });
  callouts.forEach(c => c.style.opacity = expansion);
  document.querySelectorAll('.stage-coordinate').forEach(c => c.style.opacity = 1-expansion);
  const active = progress < .28 ? 0 : progress < .73 ? 1 : 2;
  chapters.forEach((c,i) => { c.classList.toggle('active',active===i); c.setAttribute('aria-current',active===i?'step':'false'); });
  document.querySelectorAll('.track-line i').forEach((el,i) => el.style.width = `${clamp(progress*2-i)*100}%`);
  document.querySelector('.device-shadow').style.opacity = 1-expansion*.65;
  document.querySelector('.product-tag').style.opacity = 1-expansion;
  document.querySelector('.scroll-cue').style.opacity = progress>.15 ? '.45':'1';
}
function requestRender(){if(!scheduled){scheduled=true;requestAnimationFrame(render);}}
addEventListener('scroll',requestRender,{passive:true});
addEventListener('resize',requestRender);
render();
function chapterScroll(index){
  const offsets=[0,.46,.98];
  scrollTo({top:story.offsetTop+(story.offsetHeight-innerHeight)*offsets[index],behavior:reduced?'instant':'smooth'});
}
chapters.forEach((el,i)=>el.addEventListener('click',()=>chapterScroll(i)));
document.querySelectorAll('[data-jump="inside"]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();chapterScroll(1);}));
document.querySelector('.replay').addEventListener('click',e=>{e.preventDefault();chapterScroll(0);});
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.navigation');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}));
const presets=['MELLOW WAVES','SOFT FOCUS','DAYBREAK','AFTER HOURS'];
const wavePaths=[
'M0 34h16l5-12 6 24 7-39 7 54 7-46 7 38 7-19h15l6-12 7 24 7-39 7 54 7-46 7 38 7-19h15l6-12 7 24 7-39 7 54 7-46 7 38 7-19h16l6-12 7 24 7-39 7 54 7-46 7 38 7-19h17',
'M0 50V18h32v32h33V18h32v32h33V18h32v32h33V18h32v32h33',
'M0 52 22 16 44 52 66 16 88 52 110 16 132 52 154 16 176 52 198 16 220 52 242 16 260 45',
'M0 52 42 15v37l43-37v37l43-37v37l43-37v37l43-37v37l46-37v37'
];
const pads=[...document.querySelectorAll('.pad')];
pads.forEach((pad,i)=>pad.addEventListener('click',()=>{
 if(device.classList.contains('off')) return;
 pads.forEach((p,j)=>{p.classList.toggle('active',i===j);p.setAttribute('aria-pressed',String(i===j));});
 document.querySelector('.preset-name').textContent=presets[i];
 document.querySelector('.pad-active').textContent=`0${i+1}`;
 document.querySelector('.waveform path').setAttribute('d',wavePaths[i]);
}));
const power=document.querySelector('.power-button');
power.addEventListener('click',()=>{const off=device.classList.toggle('off');power.setAttribute('aria-pressed',String(!off));power.setAttribute('aria-label',`Turn sound engine ${off?'on':'off'}`);pads.forEach(p=>p.disabled=off);});
let texture=64;
document.querySelector('.main-knob').addEventListener('click',e=>{texture=(texture+12)%101;document.querySelector('.texture-value').textContent=`${texture}%`;e.currentTarget.style.transform=`rotate(${texture*2-90}deg)`;document.querySelector('.waveform').style.transform=`scaleY(${.5+texture/100})`;});
document.querySelectorAll('.small-knob').forEach((knob,i)=>{let value=i?35:-30;knob.addEventListener('click',()=>{value+=40;knob.style.transform=`rotate(${value}deg)`;knob.setAttribute('aria-label',`Adjust ${i?'space':'tone'}, position ${Math.round((value%360)/3.6)} percent`);document.querySelector('.screen').style.filter=`hue-rotate(${value/4}deg)`;});});
