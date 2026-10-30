// Original assets are unavailable. Never probe them during a default visit.
export const ORIGINAL_HLS_URL = 'https://customer-cbeadsgr09pnsezs.cloudflarestream.com/697945ca6b876878dba3b23fbd2f1561/manifest/video.m3u8';
export const ORIGINAL_MP4_URL = '/_videos/v1/f0c78f536d5f21a047fb7792723a36f9d647daa1';
export function originalMediaEnabled() {
 return import.meta.env.VITE_ENABLE_ORIGINAL_MEDIA === 'true'
  || new URLSearchParams(window.location.search).get('media') === 'original';
}
