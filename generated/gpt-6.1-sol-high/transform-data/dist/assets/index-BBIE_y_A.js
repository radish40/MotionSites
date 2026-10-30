(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))c(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const d of a.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&c(d)}).observe(document,{childList:!0,subtree:!0});function t(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function c(o){if(o.ep)return;o.ep=!0;const a=t(o);fetch(o.href,a)}})();const A={chevron:'<path d="m6 9 6 6 6-6"/>',arrow:'<path d="M12 19V5m-6 6 6-6 6 6"/>',star:'<path fill="currentColor" stroke="none" d="m12 2 2.7 6.8L22 12l-7.3 3.2L12 22l-2.7-6.8L2 12l7.3-3.2Z"/>',ai:'<path d="m10 3 2.5 6.5L19 12l-6.5 2.5L10 21l-2.5-6.5L1 12l6.5-2.5L10 3Zm10-2 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z"/>',attach:'<path d="m8 13 6.9-6.9a3 3 0 0 1 4.2 4.2l-9.2 9.2a5 5 0 0 1-7.1-7.1l9-9a2 2 0 0 1 2.8 2.8l-8.7 8.7a1 1 0 0 0 1.4 1.4l7.8-7.8"/>',mic:'<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>'},i=(e,n="")=>`<svg class="icon ${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${A[e]||""}</svg>`;function C(e,n){const t=document.createElement("video");t.className="background-video",t.muted=!0,t.autoplay=!0,t.playsInline=!0,t.preload="auto",t.setAttribute("aria-hidden","true"),t.src=n,e.append(t);let c=0,o=0,a=!1;function d(x){cancelAnimationFrame(c);const w=Number(t.style.opacity||0),k=performance.now(),q=E=>{const S=Math.min((E-k)/250,1);t.style.opacity=String(w+(x-w)*S),S<1&&(c=requestAnimationFrame(q))};c=requestAnimationFrame(q)}return t.addEventListener("playing",()=>{a||d(1)}),t.addEventListener("timeupdate",()=>{Number.isFinite(t.duration)&&t.duration-t.currentTime<=.55&&!a&&(a=!0,d(0))}),t.addEventListener("ended",()=>{cancelAnimationFrame(c),t.style.opacity="0",clearTimeout(o),o=setTimeout(()=>{t.currentTime=0,a=!1,t.play().catch(()=>{})},100)}),t.play().catch(()=>{}),t}const $=document.querySelector("#app");$.innerHTML=`
  <div class="video-stage" aria-hidden="true"></div>
  <header class="navigation">
    <a class="logo" href="#platform" aria-label="Logoipsum home">Logoipsum</a>
    <button class="mobile-toggle" aria-label="Open navigation" aria-expanded="false">${i("menu")}</button>
    <nav aria-label="Main navigation" class="nav-links">
      <a href="#platform">Platform</a>
      <div class="feature-wrap">
        <button class="nav-feature" aria-expanded="false" aria-controls="features-menu">Features ${i("chevron")}</button>
        <div class="nav-popover" id="features-menu" hidden>
          <button data-feature="attach">${i("attach")} Upload information</button>
          <button data-feature="prompts">${i("search")} Explore prompts</button>
          <button data-feature="voice">${i("mic")} Ask with your voice</button>
        </div>
      </div>
      <button data-info="Projects">Projects</button>
      <button data-info="Community">Community</button>
      <button data-info="Contact">Contact</button>
    </nav>
    <div class="nav-actions">
      <button class="sign-up" data-info="Sign Up">Sign Up</button>
      <button class="log-in" data-info="Log In">Log In</button>
    </div>
  </header>
  <main id="platform">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-header">
        <div class="announcement"><span class="new-label">${i("star")} New</span><span>Discover what's possible</span></div>
        <h1 id="hero-title">Transform Data Quickly</h1>
        <p class="subtitle">Upload your information and get powerful insights right away. Work smarter and achieve goals effortlessly.</p>
      </div>
      <form class="composer" aria-label="Ask about your data">
        <div class="credit-row">
          <div class="credits"><span>60/450 credits</span><button type="button" class="upgrade" data-info="Upgrade">Upgrade</button></div>
          <span class="powered">${i("ai")} Powered by GPT-4o</span>
        </div>
        <div class="input-panel">
          <div class="input-row">
            <textarea id="question" aria-label="Your question" placeholder="Type question..." maxlength="3000" rows="2"></textarea>
            <button class="submit" type="submit" aria-label="Submit question">${i("arrow")}</button>
          </div>
          <div class="input-footer">
            <div class="input-actions">
              <button type="button" id="attach">${i("attach")} Attach</button>
              <button type="button" id="voice" aria-pressed="false">${i("mic")} <span>Voice</span></button>
              <div class="prompts-wrap">
                <button type="button" id="prompts" aria-expanded="false" aria-controls="prompts-menu">${i("search")} Prompts</button>
                <div class="prompts-menu" id="prompts-menu" hidden>
                  <p>A little inspiration</p>
                  <button type="button">Summarize the key insights in my data</button>
                  <button type="button">Find trends and patterns in my information</button>
                  <button type="button">What should I focus on next?</button>
                </div>
              </div>
            </div>
            <span class="counter"><span id="character-count">0</span>/3,000</span>
          </div>
        </div>
        <input id="file-upload" type="file" accept=".csv,.json,.txt,.xlsx,.pdf" hidden />
        <div class="feedback" role="status" hidden></div>
      </form>
    </section>
  </main>
  <dialog class="info-dialog" aria-labelledby="dialog-title">
    <button class="dialog-close" aria-label="Close dialog">${i("close")}</button>
    <span class="dialog-eyebrow">Logoipsum</span>
    <h2 id="dialog-title"></h2>
    <p id="dialog-description"></p>
    <button class="dialog-done">Got it ${i("arrow")}</button>
  </dialog>
`;C(document.querySelector(".video-stage"),"/motionsites-results/transform-data/assets/transform-background.mp4");const r=document.querySelector("#question"),g=document.querySelector(".feedback"),u=e=>{g.textContent=e,g.hidden=!1};r.addEventListener("input",()=>{document.querySelector("#character-count").textContent=r.value.length.toLocaleString("en-US"),g.hidden=!0});document.querySelector(".composer").addEventListener("submit",e=>{if(e.preventDefault(),!r.value.trim()){u("Start with a question, or choose a prompt below."),r.focus();return}u("Your question is ready. Live AI analysis is not connected in this preview.")});r.addEventListener("keydown",e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),document.querySelector(".composer").requestSubmit())});const b=document.querySelector("#file-upload");document.querySelector("#attach").addEventListener("click",()=>b.click());b.addEventListener("change",()=>{b.files[0]&&u(`Attached: ${b.files[0].name}. Your file stays on this device in this preview.`)});function L(e,n){const t=n.hidden;n.hidden=!t,e.setAttribute("aria-expanded",String(t))}const m=document.querySelector("#prompts"),f=document.querySelector("#prompts-menu");m.addEventListener("click",()=>L(m,f));f.querySelectorAll("button").forEach(e=>e.addEventListener("click",()=>{r.value=e.textContent,r.dispatchEvent(new Event("input")),f.hidden=!0,m.setAttribute("aria-expanded","false"),r.focus()}));const h=document.querySelector(".nav-feature"),v=document.querySelector("#features-menu");h.addEventListener("click",()=>L(h,v));v.querySelectorAll("button").forEach(e=>e.addEventListener("click",()=>{v.hidden=!0,h.setAttribute("aria-expanded","false"),document.querySelector(".navigation").classList.remove("mobile-open"),document.querySelector(".mobile-toggle").setAttribute("aria-expanded","false"),document.querySelector("#"+e.dataset.feature).click()}));const y=document.querySelector(".mobile-toggle");y.addEventListener("click",()=>{const e=document.querySelector(".navigation").classList.toggle("mobile-open");y.setAttribute("aria-expanded",String(e))});document.addEventListener("click",e=>{e.target.closest(".prompts-wrap")||(f.hidden=!0,m.setAttribute("aria-expanded","false")),e.target.closest(".feature-wrap")||(v.hidden=!0,h.setAttribute("aria-expanded","false"))});document.addEventListener("keydown",e=>{e.key==="Escape"&&(f.hidden=!0,v.hidden=!0,m.setAttribute("aria-expanded","false"),h.setAttribute("aria-expanded","false"),document.querySelector(".navigation").classList.remove("mobile-open"),y.setAttribute("aria-expanded","false"))});let s;const p=document.querySelector("#voice");p.addEventListener("click",()=>{const e=window.SpeechRecognition||window.webkitSpeechRecognition;if(!e){u("Voice input is not supported in this browser. You can type your question instead.");return}if(s){s.stop();return}s=new e,s.lang="en-US",p.setAttribute("aria-pressed","true"),p.querySelector("span").textContent="Listening",s.onresult=n=>{r.value=(r.value+" "+n.results[0][0].transcript).trim().slice(0,3e3),r.dispatchEvent(new Event("input"))},s.onerror=()=>u("Voice input is unavailable. Check microphone access or type your question."),s.onend=()=>{s=null,p.setAttribute("aria-pressed","false"),p.querySelector("span").textContent="Voice"};try{s.start()}catch{s.onend(),u("Voice input is unavailable. Please type your question.")}});const P={Projects:"Your data projects will live here. Project storage is not connected in this preview.",Community:"A space to share ideas and discover what’s possible. The community is not connected in this preview.",Contact:"Contact details have not been provided for this preview.","Sign Up":"Account registration is not connected in this preview. You can explore the question composer without an account.","Log In":"Account access is not connected in this preview. You can explore the question composer without an account.",Upgrade:"You have 60 of 450 credits. Plans and billing are not connected in this preview."},l=document.querySelector("dialog");document.querySelectorAll("[data-info]").forEach(e=>e.addEventListener("click",()=>{document.querySelector("#dialog-title").textContent=e.dataset.info,document.querySelector("#dialog-description").textContent=P[e.dataset.info],l.showModal()}));document.querySelectorAll(".dialog-close,.dialog-done").forEach(e=>e.addEventListener("click",()=>l.close()));l.addEventListener("click",e=>{if(e.target===l){const n=l.getBoundingClientRect();(e.clientX<n.left||e.clientX>n.right||e.clientY<n.top||e.clientY>n.bottom)&&l.close()}});
