import Reveal from './Reveal';
export default function Navbar() {
  return <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5 md:px-12" aria-label="Main navigation">
    <Reveal><a href="#top" aria-label="AETHER_X home" className="block transition-opacity hover:opacity-70"><svg className="h-8 w-8 sm:h-9 sm:w-9" viewBox="0 0 256 256" fill="white" aria-hidden="true"><path d="M 160 88 L 194 34 L 216 0 L 256 0 L 256 40 L 221.5 93.5 L 200 128 L 256 128 L 256 256 L 96 256 L 96 168 L 64.246 220 L 40 256 L 0 256 L 0 216 L 34 162 L 56 128 L 0 128 L 0 0 L 160 0 Z" /></svg></a></Reveal>
    <Reveal delay={150}><a href="#precision" className="pill bg-white text-xs uppercase tracking-wider text-black hover:scale-105 hover:bg-white/90 sm:text-sm">Join The Fleet <span aria-hidden="true">↗</span></a></Reveal>
  </nav>;
}
