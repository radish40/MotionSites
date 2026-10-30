import AnimatedHeading from './components/AnimatedHeading';
import FadeIn from './components/FadeIn';

export default function App() {
  return (
    <main className="min-h-screen bg-black text-white relative">
      <video className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline preload="auto" aria-hidden="true">
        <source src={`${import.meta.env.BASE_URL}assets/hero.mp4`} type="video/mp4" />
      </video>
      <div className="relative z-10 min-h-screen">
        <header className="absolute top-0 left-0 right-0 px-6 md:px-12 lg:px-16 pt-6">
          <nav aria-label="Main navigation" className="liquid-glass rounded-xl flex items-center justify-between px-4 py-2">
            <div className="text-2xl font-semibold tracking-tight">VEX</div>
            <div className="hidden md:flex gap-8 text-sm">
              {['Story', 'Investing', 'Building', 'Advisory'].map(label => (
                <a key={label} href="#ventures" className="hover:text-gray-300 transition-colors">{label}</a>
              ))}
            </div>
            <button type="button" className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">Start a Chat</button>
          </nav>
        </header>
        <section aria-label="Introduction" className="min-h-screen px-6 md:px-12 lg:px-16 flex flex-col items-center justify-center text-center">
          <div className="w-full max-w-4xl flex flex-col items-center">
            <AnimatedHeading text={'Shaping tomorrow\nwith vision and action.'} className="-mx-2 w-[calc(100%+1rem)] md:mx-0 md:w-auto text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-4" style={{ letterSpacing: '-0.04em' }} delay={200} charDelay={30} />
            <FadeIn delay={800} duration={1000}>
              <p className="text-base md:text-lg text-gray-300 mb-5">We back visionaries and craft ventures that define what comes next.</p>
            </FadeIn>
            <FadeIn delay={1200} duration={1000}>
              <div className="flex flex-wrap gap-4 justify-center">
                <button type="button" className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">Start a Chat</button>
                <a href="#ventures" className="liquid-glass border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-colors">Explore Now</a>
              </div>
            </FadeIn>
          </div>
        </section>
        <div id="ventures" className="absolute bottom-0 left-0 right-0 px-6 md:px-12 lg:px-16 pb-12 lg:pb-16 flex justify-center">
          <FadeIn delay={1400} duration={1000}>
            <div className="liquid-glass border border-white/20 px-6 py-3 rounded-xl">
              <p className="text-lg md:text-xl lg:text-2xl font-light">Investing. Building. Advisory.</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
