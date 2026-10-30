import './style.css';
const base = import.meta.env.BASE_URL;
document.querySelectorAll('[data-icon]').forEach(el => {
 el.style.setProperty('--icon', `url("${base}assets/${el.dataset.icon}.svg")`);
 el.setAttribute('aria-hidden', 'true');
});
const colors = ['#38bdf8','#fb7185','#fbbf24','#34d399','#a78bfa'];
for (let i=0;i<27;i++) {
 const chip=document.createElement('span');
 const falling=i<15;
 chip.style.cssText=`left:${(i*37+8)%98}%;top:${falling ? (i*19)%100 : (i*29)%94}%;width:${i%3===0?8:10}px;height:${i%3===0?8:14}px;background:${colors[i%5]};border-radius:${i%3===0?'50%':'1px'};--r:${i*31}deg;--drop:760px;--spin:${140+i*17}deg;--dur:${12+i%5*2}s;--del:-${i*1.7}s;--fd:${4+i%4}s`;
 (falling?document.querySelector('.confetti'):document.querySelector('.scatter')).append(chip);
}
const card=document.querySelector('.success-card');
const replay=document.querySelector('.replay-card');
const modal=document.querySelector('dialog');
let toastTimer;
function toast(message){const el=document.querySelector('.toast');el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,4200);}
function restore(){card.hidden=false;replay.hidden=true;const badge=card.querySelector('.badge-pop');badge.style.animation='none';void badge.offsetWidth;badge.style.animation='';const check=card.querySelector('.check-path');check.style.animation='none';void check.getBoundingClientRect();check.style.animation='';}
function openDialog(title,copy){document.querySelector('#utility-title').textContent=title;document.querySelector('#utility-copy').textContent=copy;modal.showModal();}
document.addEventListener('click',async e=>{
 const target=e.target.closest('[data-action]');if(!target)return;
 switch(target.dataset.action){
 case 'dismiss':card.hidden=true;replay.hidden=false;replay.querySelector('button').focus();break;
 case 'replay':restore();card.querySelector('.close').focus();break;
 case 'demo':restore();break;
 case 'continue':document.querySelector('#patterns').scrollIntoView({behavior:'smooth'});toast('Your design system is ready. Explore the pattern library below.');break;
 case 'share':try{await navigator.clipboard.writeText(`A little win worth sharing: my design system is live! ${location.href.split('#')[0]}`);toast('Celebration link copied. Share the win with your team!');}catch{openDialog('Share the win','Your design system is live! Copy the page address from your browser to share this celebration with your team.');}break;
 case 'explore':document.querySelector('#patterns').scrollIntoView({behavior:'smooth'});toast('Welcome to Pro. Explore your modal patterns.');break;
 case 'later':toast('Your Pro components will be here when you’re ready.');break;
 case 'purchase':openDialog('A little kit. A lot of joy.','Modal.Design includes 40 modal patterns for $49. This is a live design preview; checkout is not connected.');break;
 case 'signin':openDialog('Welcome back.','You’re exploring the Modal.Design preview. Account sign-in will be available when the product is connected.');break;
 case 'close-dialog':modal.close();break;
 }
});
modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close();}});
modal.addEventListener('keydown',e=>{
 if(e.key!=='Tab')return;
 const controls=[...modal.querySelectorAll('button,a[href],input,select,textarea,[tabindex="0"]')].filter(el=>!el.disabled);
 const first=controls[0],last=controls[controls.length-1];
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
});
