import { Navbar } from './Navbar';
import { Button } from './ui/button';
export function HeroSection() {
  return <section className="relative overflow-hidden bg-background" aria-labelledby="hero-heading">
    <Navbar />
    <div className="flex flex-col items-center px-4 pt-14 sm:pt-20">
      <h1 id="hero-heading" className="hero-title m-0 bg-clip-text text-[clamp(110px,25vw,230px)] font-normal leading-[1.02] tracking-[-0.024em] text-transparent">Grow</h1>
      <p className="mt-4 max-w-md text-center text-lg leading-8 text-hero-sub opacity-80">The most powerful AI ever deployed<br />in talent acquisition</p>
      <div className="mb-[66px] mt-8"><Button variant="heroSecondary" className="px-[29px] py-[24px]">Schedule a Consult</Button></div>
    </div>
  </section>;
}
