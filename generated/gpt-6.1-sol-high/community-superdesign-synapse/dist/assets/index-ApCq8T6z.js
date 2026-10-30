(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function o(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=o(r);fetch(r.href,s)}})();const d=[["AVG. LATENCY","24ms","cyan-text"],["UPTIME","99.99%","green-text"],["TOKENS PROCESSED","12.8B+",""],["GLOBAL REGIONS","32",""],["DEVELOPER FIRST","Always.","violet-text"]],u=document.querySelector(".ticker-track");for(let t=0;t<2;t++){const e=document.createElement("div");e.className="ticker-group",t&&e.setAttribute("aria-hidden","true"),e.innerHTML=d.map(([o,n,r])=>`<div class="metric"><span class="metric-cross">✳</span><span>${o}</span><strong class="${r}">${n}</strong></div>`).join(""),u.append(e)}const i={javascript:`import { Synapse } from '@synapse/sdk';

// Your next big idea starts here.
const synapse = new Synapse({
  apiKey: process.env.SYNAPSE_API_KEY,
});

const response = await synapse.generate({
  model: 'synapse-2',
  prompt: 'Let’s build something extraordinary.',
  stream: true,
});

for await (const token of response) {
  process.stdout.write(token.text);
}`,python:`from synapse import Synapse
import os

# Your next big idea starts here.
synapse = Synapse(
    api_key=os.environ['SYNAPSE_API_KEY']
)

response = synapse.generate(
    model='synapse-2',
    prompt='Let’s build something extraordinary.',
    stream=True,
)

for token in response:
    print(token.text, end='')`};let a="javascript";const m=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");function p(){document.querySelector("#snippet").innerHTML=i[a].split(`
`).map((t,e)=>{const o=t.match(/(['"]).*?\1|\/\/.*|#.*|\b(?:import|from|const|await|for|of|in|True|true)\b|\b(?:Synapse|generate|print)\b|[^'"\w/#]+|\w+|./g)||[];return`<span class="code-line"><span class="line-number" aria-hidden="true">${e+1}</span><span>${o.map(n=>`<span class="${/^['"]/.test(n)?"token-string":/^(\/\/|#)/.test(n)?"token-comment":/^(import|from|const|await|for|of|in|true|True)$/.test(n)?"token-keyword":/^(Synapse|generate|print)$/.test(n)?"token-class":""}">${m(n)}</span>`).join("")}</span></span>`}).join("")}p();document.querySelectorAll("[data-lang]").forEach(t=>t.addEventListener("click",()=>{a=t.dataset.lang,document.querySelectorAll("[data-lang]").forEach(e=>e.setAttribute("aria-selected",String(e===t))),document.querySelector("#filename").textContent=a==="python"?"quickstart.py":"quickstart.ts",p()}));document.querySelector("#copy-code").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(i[a]),document.querySelector("#copy-status").textContent="Copied to clipboard.",setTimeout(()=>document.querySelector("#copy-status").textContent="Ready when you are.",2500)}catch{document.querySelector("#copy-status").textContent="Select the code to copy it."}});const l=new IntersectionObserver(t=>t.forEach(e=>{e.isIntersecting&&(e.target.classList.add("visible"),l.unobserve(e.target))}),{threshold:.1});document.querySelectorAll(".reveal").forEach((t,e)=>{t.style.setProperty("--delay",`${e%3*100}ms`),l.observe(t)});
