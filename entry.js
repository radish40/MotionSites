/* Temporary entry for the currently deployed toolbox navigation. */
(() => {
  function mount() {
    const nav = document.querySelector('nav.top-navigation');
    if (!nav || nav.querySelector('a[href="/motionsites-preview/"]')) return;
    const link = document.createElement('a');
    link.className = 'nav-item';
    link.href = '/motionsites-preview/';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.title = 'MotionSites 合集（新标签页）';
    const icon = document.createElement('span');
    icon.textContent = '✦';
    icon.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.textContent = 'MotionSites 合集';
    link.append(icon, label);
    nav.prepend(link);
  }
  new MutationObserver(mount).observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
  mount();
})();
