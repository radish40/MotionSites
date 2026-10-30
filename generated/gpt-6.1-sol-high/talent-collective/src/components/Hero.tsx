import { useState } from 'react'
import slides from './slides.json'

export default function Hero() {
  const [active, setActive] = useState(0)
  const slide = slides[active]

  return (
    <section aria-label="Meet Kollektiva" className="relative h-screen w-full overflow-hidden font-geist text-white">
      {slides.map((person, index) => (
        <div
          key={person.name}
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-out"
          style={{ backgroundImage: `url("${person.image}")`, opacity: active === index ? 1 : 0 }}
        />
      ))}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/25" />
      <div className="relative z-10 flex h-full flex-col justify-between px-6 pb-6 pt-10 sm:px-10 sm:pb-8 sm:pt-14 lg:px-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-16">
          <h1 className="max-w-xl text-3xl font-normal leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl">
            Kollektiva is the talent you build with each&nbsp;day
          </h1>
          <p key={slide.name} className="max-w-xs animate-[fadeIn_0.5s_ease] text-sm font-medium leading-relaxed text-white/80 sm:text-base md:pt-2">
            {slide.description}
          </p>
        </div>
        <div className="flex flex-col gap-8">
          <div aria-label="Choose a team member" className="flex items-end gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:gap-3 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
            {slides.map((person, index) => (
              <button key={person.name} type="button" aria-label={`Show ${person.name}`} aria-pressed={active === index} onClick={() => setActive(index)} className="flex shrink-0 flex-col items-center gap-2">
                <span aria-hidden="true" className={`h-1 w-1 rounded-full bg-white transition-opacity duration-300 ${active === index ? 'opacity-100' : 'opacity-0'}`} />
                <span className="block h-10 w-10 overflow-hidden rounded-full sm:h-14 sm:w-14">
                  <img src={person.image} alt={person.name} className="h-full w-full object-cover" />
                </span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-5 text-sm font-medium">
            <span key={slide.name} className="animate-[fadeIn_0.5s_ease]" aria-live="polite">{slide.name}</span>
            <span key={slide.role} className="hidden text-white/70 sm:block">{slide.role}</span>
            <span className="hidden text-white/70 md:block">In the business since 2020</span>
            <a href="#" className="underline underline-offset-4 transition-colors hover:text-white/70">WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  )
}
