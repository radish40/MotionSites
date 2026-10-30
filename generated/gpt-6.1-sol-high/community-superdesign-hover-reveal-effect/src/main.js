import './style.css';
const hero=document.querySelector('.hero');
const svg=document.querySelector('.reveal');
const alternate=document.querySelector('.alternate');
const blob=document.querySelector('#blob');
const trails=[...document.querySelectorAll('.trail')];
const text=[...document.querySelectorAll('.reactive')];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let width=innerWidth,height=innerHeight,target={x:width/2,y:height/2},head={...target},active=false,amount=0,speed=0,last={...target},lastTime=0;
let touchTimer;
let tail=trails.map(()=>({...target}));
function resize(){width=hero.clientWidth;height=hero.clientHeight;svg.setAttribute('viewBox',`0 0 ${width} ${height}`);alternate.setAttribute('width',width);alternate.setAttribute('height',height); // Match the base photograph's 40% vertical crop.
 const imageRatio=.8,renderedHeight=Math.max(height,width/imageRatio),offset=(renderedHeight-height)*.4;
 alternate.setAttribute('y',-offset);alternate.setAttribute('height',renderedHeight);
}
resize();addEventListener('resize',resize);
function move(e){clearTimeout(touchTimer);target={x:e.clientX,y:e.clientY};if(!active){head={...target};tail=tail.map(()=>({...target}));}active=true;}
hero.addEventListener('pointermove',move);
hero.addEventListener('pointerdown',move);
hero.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')active=false;});
hero.addEventListener('pointerup',e=>{if(e.pointerType==='touch')touchTimer=setTimeout(()=>active=false,1000);});
hero.addEventListener('pointercancel',()=>active=false);
function animate(time){
 const dt=Math.min((time-lastTime)/16.67 || 1,2);lastTime=time;
 const smoothing=reduce?1:1-Math.pow(.82,dt);
 head.x+=(target.x-head.x)*smoothing;head.y+=(target.y-head.y)*smoothing;
 amount+=((active?1:0)-amount)*(reduce?1:.12)*dt;
 speed+=(Math.min(Math.hypot(head.x-last.x,head.y-last.y),70)-speed)*.15;last={...head};
 const radius=Math.min(width*.25,167)*amount;
 let d='';const count=72;
 for(let i=0;i<count;i++){const a=i/count*Math.PI*2;const variation=1+.09*Math.sin(a*3+time*.0006)+.055*Math.cos(a*5-time*.00045);const r=radius*variation;d+=`${i?'L':'M'}${head.x+Math.cos(a)*r},${head.y+Math.sin(a)*r}`;}blob.setAttribute('d',d+'Z');
 tail.forEach((point,i)=>{const ahead=i?tail[i-1]:head;point.x+=(ahead.x-point.x)*.19*dt;point.y+=(ahead.y-point.y)*.19*dt;const r=reduce?0:radius*(.64-i*.105)*Math.min(speed/15,1);trails[i].setAttribute('cx',point.x);trails[i].setAttribute('cy',point.y);trails[i].setAttribute('r',Math.max(r,0));trails[i].setAttribute('opacity',1-i*.12);});
 text.forEach(el=>{const b=el.getBoundingClientRect();const x=Math.max(b.left,Math.min(head.x,b.right)),y=Math.max(b.top,Math.min(head.y,b.bottom));el.classList.toggle('is-revealed',amount>.4&&Math.hypot(x-head.x,y-head.y)<radius*.9);});
 if(!reduce){hero.style.setProperty('--px',`${-(target.x/width-.5)*8}px`);hero.style.setProperty('--py',`${-(target.y/height-.5)*6}px`);hero.style.setProperty('--wx',`${-(target.x/width-.5)*14}px`);hero.style.setProperty('--wy',`${-(target.y/height-.5)*10}px`);}
 requestAnimationFrame(animate);
}requestAnimationFrame(animate);
