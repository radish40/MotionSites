const paths = {
 chevron: '<path d="m6 9 6 6 6-6"/>',
 arrow: '<path d="M12 19V5m-6 6 6-6 6 6"/>',
 star: '<path fill="currentColor" stroke="none" d="m12 2 2.7 6.8L22 12l-7.3 3.2L12 22l-2.7-6.8L2 12l7.3-3.2Z"/>',
 ai: '<path d="m10 3 2.5 6.5L19 12l-6.5 2.5L10 21l-2.5-6.5L1 12l6.5-2.5L10 3Zm10-2 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z"/>',
 attach: '<path d="m8 13 6.9-6.9a3 3 0 0 1 4.2 4.2l-9.2 9.2a5 5 0 0 1-7.1-7.1l9-9a2 2 0 0 1 2.8 2.8l-8.7 8.7a1 1 0 0 0 1.4 1.4l7.8-7.8"/>',
 mic: '<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/>',
 search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
 menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
 close: '<path d="m6 6 12 12M6 18 18 6"/>'
};
export const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ''}</svg>`;
