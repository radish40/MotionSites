import './style.css';
import { icon } from './icons';
import { VideoBackground } from './video';

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="video-stage" aria-hidden="true"></div>
  <header class="navigation">
    <a class="logo" href="#platform" aria-label="Logoipsum home">Logoipsum</a>
    <button class="mobile-toggle" aria-label="Open navigation" aria-expanded="false">${icon('menu')}</button>
    <nav aria-label="Main navigation" class="nav-links">
      <a href="#platform">Platform</a>
      <div class="feature-wrap">
        <button class="nav-feature" aria-expanded="false" aria-controls="features-menu">Features ${icon('chevron')}</button>
        <div class="nav-popover" id="features-menu" hidden>
          <button data-feature="attach">${icon('attach')} Upload information</button>
          <button data-feature="prompts">${icon('search')} Explore prompts</button>
          <button data-feature="voice">${icon('mic')} Ask with your voice</button>
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
        <div class="announcement"><span class="new-label">${icon('star')} New</span><span>Discover what's possible</span></div>
        <h1 id="hero-title">Transform Data Quickly</h1>
        <p class="subtitle">Upload your information and get powerful insights right away. Work smarter and achieve goals effortlessly.</p>
      </div>
      <form class="composer" aria-label="Ask about your data">
        <div class="credit-row">
          <div class="credits"><span>60/450 credits</span><button type="button" class="upgrade" data-info="Upgrade">Upgrade</button></div>
          <span class="powered">${icon('ai')} Powered by GPT-4o</span>
        </div>
        <div class="input-panel">
          <div class="input-row">
            <textarea id="question" aria-label="Your question" placeholder="Type question..." maxlength="3000" rows="2"></textarea>
            <button class="submit" type="submit" aria-label="Submit question">${icon('arrow')}</button>
          </div>
          <div class="input-footer">
            <div class="input-actions">
              <button type="button" id="attach">${icon('attach')} Attach</button>
              <button type="button" id="voice" aria-pressed="false">${icon('mic')} <span>Voice</span></button>
              <div class="prompts-wrap">
                <button type="button" id="prompts" aria-expanded="false" aria-controls="prompts-menu">${icon('search')} Prompts</button>
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
    <button class="dialog-close" aria-label="Close dialog">${icon('close')}</button>
    <span class="dialog-eyebrow">Logoipsum</span>
    <h2 id="dialog-title"></h2>
    <p id="dialog-description"></p>
    <button class="dialog-done">Got it ${icon('arrow')}</button>
  </dialog>
`;
VideoBackground(document.querySelector('.video-stage'), `${import.meta.env.BASE_URL}assets/transform-background.mp4`);

const question = document.querySelector('#question');
const feedback = document.querySelector('.feedback');
const showFeedback = message => { feedback.textContent = message; feedback.hidden = false; };
question.addEventListener('input', () => {
  document.querySelector('#character-count').textContent = question.value.length.toLocaleString('en-US');
  feedback.hidden = true;
});
document.querySelector('.composer').addEventListener('submit', event => {
  event.preventDefault();
  if (!question.value.trim()) { showFeedback('Start with a question, or choose a prompt below.'); question.focus(); return; }
  showFeedback('Your question is ready. Live AI analysis is not connected in this preview.');
});
question.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); document.querySelector('.composer').requestSubmit(); }
});
const fileInput = document.querySelector('#file-upload');
document.querySelector('#attach').addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) showFeedback(`Attached: ${fileInput.files[0].name}. Your file stays on this device in this preview.`);
});
function togglePopover(button, menu) {
  const open = menu.hidden;
  menu.hidden = !open;
  button.setAttribute('aria-expanded', String(open));
}
const prompts = document.querySelector('#prompts');
const promptsMenu = document.querySelector('#prompts-menu');
prompts.addEventListener('click', () => togglePopover(prompts, promptsMenu));
promptsMenu.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
  question.value = button.textContent;
  question.dispatchEvent(new Event('input'));
  promptsMenu.hidden = true;
  prompts.setAttribute('aria-expanded', 'false');
  question.focus();
}));
const features = document.querySelector('.nav-feature');
const featuresMenu = document.querySelector('#features-menu');
features.addEventListener('click', () => togglePopover(features, featuresMenu));
featuresMenu.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
  featuresMenu.hidden = true; features.setAttribute('aria-expanded', 'false');
  document.querySelector('.navigation').classList.remove('mobile-open');
  document.querySelector('.mobile-toggle').setAttribute('aria-expanded', 'false');
  document.querySelector('#' + button.dataset.feature).click();
}));
const mobileToggle = document.querySelector('.mobile-toggle');
mobileToggle.addEventListener('click', () => {
  const open = document.querySelector('.navigation').classList.toggle('mobile-open');
  mobileToggle.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', event => {
  if (!event.target.closest('.prompts-wrap')) { promptsMenu.hidden = true; prompts.setAttribute('aria-expanded', 'false'); }
  if (!event.target.closest('.feature-wrap')) { featuresMenu.hidden = true; features.setAttribute('aria-expanded', 'false'); }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    promptsMenu.hidden = true; featuresMenu.hidden = true;
    prompts.setAttribute('aria-expanded', 'false'); features.setAttribute('aria-expanded', 'false');
    document.querySelector('.navigation').classList.remove('mobile-open'); mobileToggle.setAttribute('aria-expanded', 'false');
  }
});
let recognition;
const voice = document.querySelector('#voice');
voice.addEventListener('click', () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { showFeedback('Voice input is not supported in this browser. You can type your question instead.'); return; }
  if (recognition) { recognition.stop(); return; }
  recognition = new SpeechRecognition(); recognition.lang = 'en-US';
  voice.setAttribute('aria-pressed', 'true'); voice.querySelector('span').textContent = 'Listening';
  recognition.onresult = event => {
    question.value = (question.value + ' ' + event.results[0][0].transcript).trim().slice(0, 3000);
    question.dispatchEvent(new Event('input'));
  };
  recognition.onerror = () => showFeedback('Voice input is unavailable. Check microphone access or type your question.');
  recognition.onend = () => { recognition = null; voice.setAttribute('aria-pressed', 'false'); voice.querySelector('span').textContent = 'Voice'; };
  try { recognition.start(); } catch { recognition.onend(); showFeedback('Voice input is unavailable. Please type your question.'); }
});
const descriptions = {
  Projects: 'Your data projects will live here. Project storage is not connected in this preview.',
  Community: 'A space to share ideas and discover what’s possible. The community is not connected in this preview.',
  Contact: 'Contact details have not been provided for this preview.',
  'Sign Up': 'Account registration is not connected in this preview. You can explore the question composer without an account.',
  'Log In': 'Account access is not connected in this preview. You can explore the question composer without an account.',
  Upgrade: 'You have 60 of 450 credits. Plans and billing are not connected in this preview.'
};
const dialog = document.querySelector('dialog');
document.querySelectorAll('[data-info]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#dialog-title').textContent = button.dataset.info;
  document.querySelector('#dialog-description').textContent = descriptions[button.dataset.info];
  dialog.showModal();
}));
document.querySelectorAll('.dialog-close,.dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
