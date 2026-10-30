import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export const Route = createFileRoute('/')({ component: Features })

function LiquidButton({ children }: { children: ReactNode }) {
  return <button type="button" className="liquid-glass rounded-xl px-5 py-2.5 text-sm text-white/90 transition-transform hover:scale-[1.02]">{children}</button>
}

function CardVideo({ src }: { src: string }) {
  return <video className="absolute inset-0 h-full w-full object-cover" src={src} autoPlay muted loop playsInline aria-hidden="true" />
}

const video = (number: number) => `${import.meta.env.BASE_URL}videos/feature-${number}.mp4`

function Features() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 md:px-12 lg:px-20">
      <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <h1 className="text-2xl font-normal tracking-tight md:text-4xl lg:text-[2.75rem]">
          <span className="block text-white">Curiosity-led tools for truth-seeking minds.</span>
          <span className="mt-2 block text-white/40">Ask with confidence. Powered by AI.</span>
        </h1>
        <div className="shrink-0 md:pt-3"><LiquidButton>Start Using Nexora</LiquidButton></div>
      </header>
      <section aria-label="Nexora features" className="grid grid-cols-1 gap-5 md:grid-cols-3 md:grid-rows-2">
        <article className="feature-card flex min-h-[28rem] flex-col p-7 md:row-span-2">
          <CardVideo src={video(1)} />
          <div className="relative flex justify-between text-sm text-white/60"><span>01/</span><span>Found in Curiosity</span></div>
          <div className="flex-1" />
          <div className="relative">
            <h2 className="text-xl font-medium text-white md:text-2xl">Great Questions Unearth<br />Hidden Gems</h2>
            <div className="mt-4 h-px w-full bg-white/20" />
            <p className="mt-4 text-xs text-white/70">The best answers come from asking the right questions.<br />Start your search with purpose today.</p>
          </div>
        </article>
        <article className="feature-card-dark flex flex-col p-7 md:col-span-2">
          <CardVideo src={video(2)} />
          <div className="relative flex justify-between gap-3">
            <h2 className="text-xl font-medium text-white md:text-2xl">Where Knowledge Begins</h2>
            <span className="text-sm text-white/60">02/</span>
          </div>
          <div className="min-h-48 flex-1" />
        </article>
        <article className="feature-card flex flex-col p-7">
          <CardVideo src={video(3)} />
          <div className="relative flex justify-between text-sm text-white/60"><span>In Real Time</span><span>03/</span></div>
          <p className="relative mt-10 text-xs text-white/80">From complex topics to quick facts, trust what<br />you learn from every search you perform.</p>
          <div className="flex-1" />
          <div className="relative mt-6"><LiquidButton>Start Using Nexora</LiquidButton></div>
        </article>
        <article className="feature-card flex flex-col p-7">
          <CardVideo src={video(4)} />
          <div className="relative flex justify-between text-sm text-white/60"><span>Just Ask</span><span>04/</span></div>
          <div className="flex-1" />
          <p className="relative text-center text-xs text-white/80">Users Trust Our Search Models.</p>
        </article>
      </section>
    </main>
  )
}
