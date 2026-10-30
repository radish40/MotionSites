import './style.css';
const video = document.querySelector('video');
if (matchMedia('(prefers-reduced-motion: reduce)').matches) video.pause();
const modal = document.querySelector('dialog');
const content = document.querySelector('#dialog-content');
const services = document.querySelector('#services-button');
const menu = document.querySelector('#services-menu');
function closeServices(){ menu.hidden=true;services.setAttribute('aria-expanded','false'); }
services.addEventListener('click',()=>{menu.hidden=!menu.hidden;services.setAttribute('aria-expanded',String(!menu.hidden));});
document.addEventListener('click',e=>{if(!e.target.closest('.services-wrap'))closeServices();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeServices();});
const nav = document.querySelector('.navbar');
const toggle = document.querySelector('.mobile-toggle');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('menu-open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
function show(html){content.innerHTML=html;modal.showModal();nav.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');closeServices();}
function heading(title){return `<span class="dialog-eyebrow">Finlytic AI Agent</span><h2 id="dialog-title">${title}</h2>`;}
document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>{
 const mode=button.dataset.open;
 if(mode==='demo'){show(heading('Your workspace, on autopilot.')+'<p>A preview of the workflows in your AI workspace.</p><div class="demo-item"><span>01</span> Find and qualify your next leads</div><div class="demo-item"><span>02</span> Keep customer conversations moving</div><div class="demo-item"><span>03</span> Turn repetitive data entry into time saved</div><p class="form-note">The 2-minute demo video has not been supplied for this preview.</p>');return;}
 const signin=mode==='signin';
 show(heading(signin?'Welcome back.':'Make room for growth.')+`<p>${signin?'Sign in to your AI workspace.':'Start with your work email.'}</p><form><label>Work email<input type="email" autocomplete="email" required placeholder="you@company.com"></label>${signin?'<label>Password<input type="password" autocomplete="current-password" required minlength="8" placeholder="Your password"></label>':''}<button class="hero-button primary" type="submit">${signin?'Sign In':'Get Started Free'}</button><p class="form-note">Preview only. Account services are not connected.</p></form>`);
 content.querySelector('form').addEventListener('submit',e=>{e.preventDefault();content.querySelector('form').innerHTML='<p class="success" role="status">This design preview is ready to explore. Account creation and sign-in will be available when account services are connected.</p>';});
}));
document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>show(heading(button.dataset.service)+'<p>The next-generation AI agent platform handles '+button.dataset.service.toLowerCase()+' while you focus on growth.</p>')));
document.querySelectorAll('[data-info]').forEach(button=>button.addEventListener('click',()=>show(button.dataset.info==='reviews'?heading('Reviews')+'<p>Customer reviews have not been supplied for this preview.</p>':heading('Contact us')+'<p>Contact details have not been supplied for this preview.</p>')));
document.querySelector('.dialog-close').addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close();}});
document.querySelectorAll('a[href="#home"]').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');}));
