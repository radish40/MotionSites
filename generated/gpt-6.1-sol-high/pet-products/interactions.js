const phones = [...document.querySelectorAll('.phone')];
const products = [...document.querySelectorAll('.product-card')].map(card => ({
  name: card.querySelector('.product-name').textContent,
  price: Number(card.querySelector('.product-price').textContent.slice(1)),
  image: card.querySelector('img').getAttribute('src'),
}));
const cart = [{ name: 'Pet essentials', price: 21 }];
let activePanel;
const currency = value => '$' + (Number.isInteger(value) ? value : value.toFixed(2));
function closePanel() {
  if (!activePanel) return;
  activePanel.panel.hidden = true;
  activePanel.trigger.setAttribute('aria-expanded', 'false');
  activePanel.trigger.focus({ preventScroll: true });
  activePanel = undefined;
}
function goTo(index) {
  closePanel();
  phones[index].scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center', inline: 'center' });
  const target = phones[index].querySelector('h1, h3, .stats-number');
  target.tabIndex = -1;
  target.focus({ preventScroll: true });
}
function showPanel(phone, trigger, kind) {
  closePanel();
  const panel = phone.querySelector('.phone-panel');
  panel.replaceChildren();
  const top = document.createElement('div'); top.className = 'panel-top';
  const title = document.createElement('h2'); title.textContent = {menu:'CozyPaws',cart:'Your Cart',favorites:'Your Favorites'}[kind];
  title.id = `panel-title-${phones.indexOf(phone)}`; panel.setAttribute('aria-labelledby', title.id);
  const close = document.createElement('button'); close.className = 'panel-close'; close.textContent = '×'; close.setAttribute('aria-label', 'Close panel'); close.onclick = closePanel;
  top.append(title, close); panel.append(top);
  if (kind === 'menu') {
    ['Happy Pets', 'Everything Your Pets Love', 'New Arrivals'].forEach((label,index) => {
      const button = document.createElement('button'); button.className = 'panel-link'; button.textContent = label; button.onclick = () => goTo(index); panel.append(button);
    });
  } else {
    (kind === 'cart' ? cart : products).forEach(item => {
      const row = document.createElement('div'); row.className = 'panel-item';
      if (item.image) { const img = document.createElement('img'); img.src = item.image; img.alt = ''; row.append(img); }
      const name = document.createElement('span'); name.textContent = item.name;
      const price = document.createElement('strong'); price.textContent = currency(item.price);
      row.append(name, price); panel.append(row);
    });
    if (kind === 'cart') { const total = document.createElement('p'); total.className = 'panel-total'; total.textContent = 'Total ' + currency(cart.reduce((sum,item) => sum + item.price, 0)); panel.append(total); }
  }
  panel.hidden = false; trigger.setAttribute('aria-expanded','true'); activePanel = { panel, trigger }; close.focus({preventScroll:true});
}
phones.forEach((phone,index) => {
  const panel = document.createElement('section'); panel.className = 'phone-panel'; panel.hidden = true; panel.setAttribute('role','dialog'); panel.setAttribute('aria-modal','true'); panel.id = `panel-${index}`; phone.querySelector('.screen').append(panel);
  [['.menu-btn','Open navigation','menu'],['.star-btn','View four favorites','favorites'],['.cart-btn','View cart','cart']].forEach(([selector,label,kind]) => {
    const trigger = phone.querySelector(selector); trigger.setAttribute('aria-label',label); trigger.setAttribute('aria-expanded','false'); trigger.setAttribute('aria-controls',panel.id); trigger.onclick = () => showPanel(phone,trigger,kind);
  });
});
document.querySelectorAll('.product-plus').forEach((button,index) => {
  button.setAttribute('aria-label', `Add ${products[index].name} to cart`);
  button.onclick = () => {
    cart.push(products[index]);
    document.querySelectorAll('.cart-btn .badge').forEach(badge => badge.textContent = cart.length);
    document.querySelectorAll('.cart-price').forEach(price => price.textContent = currency(cart.reduce((sum,item) => sum + item.price,0)));
    button.classList.add('added'); button.setAttribute('aria-label', `${products[index].name} added. Add another`);
    button.innerHTML = '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#E86A10" stroke-width="2"><path d="m5 12 4 4L19 6"/></svg>';
  };
});
document.querySelector('.explore-btn').onclick = () => goTo(2);
const video = document.querySelector('video');
const play = document.querySelector('.play-btn button');
function syncVideo() {
  play.setAttribute('aria-label', video.paused ? 'Play pet video' : 'Pause pet video');
  play.innerHTML = video.paused ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="6 3 20 12 6 21"/></svg>' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';
}
play.onclick = () => { if (video.paused) video.play().catch(() => syncVideo()); else video.pause(); };
video.addEventListener('play',syncVideo); video.addEventListener('pause',syncVideo); syncVideo();
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closePanel();
  if (event.key === 'Tab' && activePanel) {
    const buttons = [...activePanel.panel.querySelectorAll('button')];
    const first = buttons[0], last = buttons.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
