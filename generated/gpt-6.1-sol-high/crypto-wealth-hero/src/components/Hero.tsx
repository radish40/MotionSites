import { PopupCard } from './PopupCard';
export function Hero({ scrollProgress }: { scrollProgress: number }) {
  const opacity = Math.max(1 - scrollProgress * 2.5, 0);
  return <section id="home" className="relative flex flex-col items-center justify-start px-4 sm:px-6 pt-32 sm:pt-36 md:pt-40 text-center min-h-screen will-change-transform" style={{ opacity, transform: `translateY(${scrollProgress * -60}px)`, zIndex: 10, pointerEvents: opacity < 0.1 ? 'none' : 'auto' }}>
    <h1 className="text-[2.25rem] sm:text-[3rem] md:text-[3.75rem] leading-none tracking-tighter font-medium text-gray-900 max-w-2xl"><span className="text-zinc-400">A New Way</span><br />to Manage Your<br />Content Flow</h1>
    <p className="mt-8 text-base text-gray-500 max-w-sm leading-relaxed">Take full control of your publishing workflow<br />with our unified content management platform.</p>
    <PopupCard />
  </section>;
}
