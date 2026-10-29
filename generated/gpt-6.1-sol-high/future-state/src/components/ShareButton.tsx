import { useEffect, useRef, useState } from 'react';
import { Share2 } from 'lucide-react';
export default function ShareButton() {
  const [message, setMessage] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function share() {
    try {
      const data = { title: document.title, url: window.location.href.split('#')[0] };
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); setMessage('Link copied'); }
    } catch (error) { if ((error as Error).name !== 'AbortError') setMessage('Copy the page URL to share'); }
    clearTimeout(timer.current); timer.current = setTimeout(() => setMessage(''), 3000);
  }
  return <div className="relative"><button type="button" onClick={share} aria-label="Share" className="text-white/80 transition-colors hover:text-white"><Share2 size={18} /></button><span role="status" className="absolute bottom-8 left-0 whitespace-nowrap text-xs text-white/80">{message}</span></div>;
}
