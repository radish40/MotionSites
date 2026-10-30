(() => {
  const burger = document.querySelector('.nav__burger');
  const menu = document.querySelector('#mobile-menu');
  const setOpen = (open) => {
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
  };
  burger.addEventListener('click', () => setOpen(menu.hidden));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
})();
