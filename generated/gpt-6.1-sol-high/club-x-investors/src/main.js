import './style.css';
const info = document.querySelector('#info-dialog');
const journey = document.querySelector('#journey-dialog');
const panels = {
  studio: ['Built around opportunity.', 'A private space for tech professionals to explore investments and build connections with fellow investors.'],
  about: ['Finance. Freedom. Fellows.', 'ClubX brings together 410+ tech professionals. €11M invested across 14 deals in 2.5 years on the market.'],
  journal: ['Inside the club.', 'Ideas, perspectives, and conversations from a community of tech investors.'],
  contact: ['Let’s connect.', 'Interested in joining ClubX? Begin your journey with an introduction.'],
};
document.querySelectorAll('[data-panel]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  const [title, description] = panels[link.dataset.panel];
  document.querySelector('#dialog-title').textContent = title;
  document.querySelector('#dialog-description').textContent = description;
  info.showModal();
}));
document.querySelectorAll('[data-journey]').forEach(button => button.addEventListener('click', () => {
  if (info.open) info.close();
  journey.showModal();
}));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if(event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close(); } });
});
const video = document.querySelector('video');
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  video.removeAttribute('autoplay');
  video.pause();
  video.addEventListener('loadeddata', () => video.pause(), { once:true });
}
