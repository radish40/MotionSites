import { useEffect, useRef, useState } from 'react';
import { Menu, Play, X } from 'lucide-react';

const BG_IMAGE_1 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260512_012043_9764f2d0-5c6e-4faa-94a6-a8253df08c5e.png&w=1280&q=85';
const BG_IMAGE_2 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260512_012949_6b24738e-6e5f-4b6f-93d7-5772f4d32285.png&w=1280&q=85';
const SPOTLIGHT_R = 260;
const GRID_CELL = 48;
const NAV_ITEMS = ['Device', 'Real Stories', 'Science', 'Plans', 'Reach Us'];
type Point = { x: number; y: number };

function RevealLayer({ cursorPos }: { cursorPos: Point }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Repaint on every render: the parent supplies the eased cursor every frame.
  useEffect(() => {
    const canvas = canvasRef.current;
    const layer = layerRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !layer) return;
    const { x, y } = cursorPos;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, SPOTLIGHT_R);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)');
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)');
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.arc(x, y, SPOTLIGHT_R, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    const mask = `url("${canvas.toDataURL()}")`;
    layer.style.maskImage = mask;
    layer.style.webkitMaskImage = mask;
  });

  return <>
    <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    <div ref={layerRef} aria-hidden="true" className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
      style={{ backgroundImage: `url('${BG_IMAGE_2}')`, maskSize: '100% 100%', WebkitMaskSize: '100% 100%' }} />
  </>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const initial = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const mouse = useRef<Point>(initial);
  const smooth = useRef<Point>(initial);
  const gridOffset = useRef<Point>({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const [cursorPos, setCursorPos] = useState<Point>(initial);

  useEffect(() => {
    let frame: number;
    const track = (event: MouseEvent) => { mouse.current = { x: event.clientX, y: event.clientY }; };
    const tick = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect) {
        const cx = (smooth.current.x - rect.left) / rect.width - 0.5;
        const cy = (smooth.current.y - rect.top) / rect.height - 0.5;
        gridOffset.current.x += (cx * 16 - gridOffset.current.x) * 0.06;
        gridOffset.current.y += (cy * 16 - gridOffset.current.y) * 0.06;
      }
      setCursorPos({ ...smooth.current });
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', track);
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', track);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5">
        <div className="flex items-center">
          <svg role="img" aria-label="PureFlow" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256" fill="none">
            <path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z" fill="#111111" />
          </svg>
        </div>
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-gray-900 rounded-full px-2 py-1.5 items-center gap-1">
          {NAV_ITEMS.map((item, i) => <button key={item} type="button" aria-current={i === 0 ? 'page' : undefined} className={i === 0
            ? 'bg-white text-gray-900 text-sm font-medium px-4 py-1.5 rounded-full'
            : 'text-gray-300 text-sm font-medium px-4 py-1.5 rounded-full hover:text-white transition-colors'}>{item}</button>)}
        </div>
        <button type="button" className="hidden md:flex bg-gray-900 text-white text-sm font-medium px-5 py-2 rounded-full items-center gap-2 hover:bg-gray-700 transition-colors">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />Reserve Yours
        </button>
        <button type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-900 p-1">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {menuOpen && <div id="mobile-menu" className="fixed top-0 left-0 right-0 z-40 bg-white pt-16 pb-6 px-5 shadow-lg flex flex-col gap-1 md:hidden">
        {NAV_ITEMS.map(item => <button key={item} type="button" onClick={() => setMenuOpen(false)} className="text-gray-800 text-base font-medium py-3 border-b border-gray-100 text-left hover:text-gray-500 transition-colors">{item}</button>)}
        <button type="button" className="mt-4 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-full flex items-center gap-2 justify-center hover:bg-gray-700 transition-colors">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />Reserve Yours
        </button>
      </div>}
      <section ref={sectionRef} aria-label="PureFlow One" className="relative w-full overflow-hidden" style={{ height: '100vh' }}>
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ opacity: 0.1 }}>
          <defs><pattern id="grid" width={GRID_CELL} height={GRID_CELL} patternUnits="userSpaceOnUse" x={gridOffset.current.x} y={gridOffset.current.y}>
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#64748b" strokeWidth="0.6" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div aria-hidden="true" className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10" style={{ backgroundImage: `url('${BG_IMAGE_1}')` }} />
        <RevealLayer cursorPos={cursorPos} />
        <div className="absolute bottom-12 sm:bottom-12 md:bottom-56 left-5 sm:left-8 md:left-12 max-w-[260px] sm:max-w-xs z-50">
          <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] text-gray-600 uppercase mb-2 sm:mb-3">PureFlow One</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">Clean Air, Clear<br />Mind. Anywhere.</h1>
          <div className="flex items-center gap-3 sm:gap-4">
            <button type="button" className="bg-gray-900 text-white text-xs sm:text-sm font-medium px-4 sm:px-6 py-2 sm:py-2.5 rounded-full hover:bg-gray-700 transition-colors">Discover</button>
            <button type="button" className="flex items-center gap-2 text-gray-700 text-xs sm:text-sm font-medium hover:text-gray-900 transition-colors"><Play size={12} className="fill-gray-700" />View Specs</button>
          </div>
        </div>
      </section>
    </div>
  );
}
