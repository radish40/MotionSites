import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const assets = `${import.meta.env.BASE_URL}assets/`
const items = ['Device', 'Real Stories', 'Science', 'Plans', 'Reach Us']
const logoPath = 'M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z'

function Reserve({ onClick }: { onClick?: () => void }) {
  return <button type="button" onClick={onClick} className="liquid-glass reserve rounded-full text-sm font-medium text-white"><span className="h-2 w-2 rounded-full bg-green-400" />Reserve Yours</button>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const hero = useRef<HTMLElement>(null)
  const reveal = useRef<HTMLDivElement>(null)
  const grid = useRef<SVGSVGElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const section = hero.current!
    const mask = canvas.current!
    const ctx = mask.getContext('2d')!
    const target = { x: -520, y: -520 }
    const smooth = { ...target }
    const offset = { x: 0, y: 0 }
    const destination = { x: 0, y: 0 }
    let frame = 0
    let dirty = true
    const resize = () => {
      mask.width = section.clientWidth
      mask.height = section.clientHeight
      dirty = true
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const rect = section.getBoundingClientRect()
      target.x = event.clientX - rect.left
      target.y = event.clientY - rect.top
      destination.x = (target.x / rect.width - 0.5) * 16
      destination.y = (target.y / rect.height - 0.5) * 16
    }
    const leave = () => { target.x = -520; target.y = -520; destination.x = 0; destination.y = 0 }
    const draw = () => {
      const moving = Math.abs(target.x - smooth.x) + Math.abs(target.y - smooth.y) > 0.1
      if (moving || dirty) {
        smooth.x += (target.x - smooth.x) * 0.1
        smooth.y += (target.y - smooth.y) * 0.1
        ctx.clearRect(0, 0, mask.width, mask.height)
        const gradient = ctx.createRadialGradient(smooth.x, smooth.y, 0, smooth.x, smooth.y, 260)
        for (const [stop, alpha] of [[0, 1], [0.4, 1], [0.6, 0.75], [0.75, 0.4], [0.88, 0.12], [1, 0]]) {
          gradient.addColorStop(stop, `rgba(255,255,255,${alpha})`)
        }
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, mask.width, mask.height)
        const url = `url("${mask.toDataURL()}")`
        reveal.current!.style.maskImage = url
        reveal.current!.style.webkitMaskImage = url
        dirty = false
      }
      offset.x += (destination.x - offset.x) * 0.06
      offset.y += (destination.y - offset.y) * 0.06
      grid.current!.style.transform = `translate(${offset.x}px, ${offset.y}px)`
      frame = requestAnimationFrame(draw)
    }
    resize()
    frame = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    section.addEventListener('pointermove', move)
    section.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      section.removeEventListener('pointermove', move)
      section.removeEventListener('pointerleave', leave)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const buttons = menu.current!.querySelectorAll<HTMLButtonElement>('button')
    buttons[0].focus()
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
      if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons[buttons.length - 1].focus() }
        else if (!event.shiftKey && document.activeElement === buttons[buttons.length - 1]) { event.preventDefault(); buttons[0].focus() }
      }
    }
    const resize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('keydown', keydown)
    window.addEventListener('resize', resize)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', keydown)
      window.removeEventListener('resize', resize)
      opener.current?.focus()
    }
  }, [menuOpen])

  return <main className="bg-white">
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8" inert={menuOpen}>
      <a href="#device" aria-label="Measured home" className="logo"><svg width="28" height="28" viewBox="0 0 256 256" fill="white" aria-hidden="true"><path d={logoPath} /></svg></a>
      <nav aria-label="Main navigation" className="liquid-glass desktop-nav absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full p-1.5 md:flex">
        {items.map(item => <button type="button" key={item} className="rounded-full px-5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:text-white">{item}</button>)}
      </nav>
      <div className="hidden md:block"><Reserve /></div>
      <button ref={opener} type="button" className="liquid-glass menu-toggle flex flex-col justify-center gap-1.5 rounded-full md:hidden" aria-label="Open menu" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(true)}>
        <span className="h-[1.5px] w-5 bg-white" /><span className="h-[1.5px] w-3.5 bg-white" />
      </button>
    </header>
    {menuOpen && <div id="mobile-menu" ref={menu} role="dialog" aria-modal="true" aria-label="Navigation menu" className="mobile-menu fixed inset-0 flex flex-col items-center justify-center">
      <button className="liquid-glass close-menu absolute right-6 top-6 rounded-full sm:right-10 sm:top-8" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}><span /><span /></button>
      <nav aria-label="Mobile navigation" className="flex flex-col items-center gap-7">
        {items.map((item, index) => <button key={item} type="button" className="menu-item text-3xl font-medium text-white/90 sm:text-4xl" style={{ animationDelay: `${100 + index * 60}ms` }} onClick={() => setMenuOpen(false)}>{item}</button>)}
      </nav>
      <div className="menu-reserve absolute bottom-10" style={{ animationDelay: '400ms' }}><Reserve onClick={() => setMenuOpen(false)} /></div>
    </div>}
    <section id="device" ref={hero} aria-label="Measured wellness wearable" className="font-helvetica-neue relative isolate h-screen overflow-hidden bg-neutral-950">
      <svg ref={grid} className="hero-grid absolute z-0 opacity-10" aria-hidden="true"><defs><pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="#64748b" strokeWidth="0.6" /></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
      <div className="absolute inset-0 z-10 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url("${assets}background.webp")` }} />
      <h1 className="hero-title absolute inset-x-0 top-20 z-20 m-0 text-center text-[4.5rem] uppercase leading-[0.9] text-white xs:text-[5.5rem] sm:top-28 sm:text-[10rem] md:top-32 md:text-[13rem] lg:text-[16rem]">Measured</h1>
      <img src={`${assets}overlay.png`} alt="" aria-hidden="true" className="hero-overlay pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <div ref={reveal} className="spotlight pointer-events-none absolute inset-0 z-30" aria-hidden="true">
        <video src={`${assets}front.mp4`} autoPlay loop muted playsInline preload="auto" className="h-full w-full object-cover" style={{ clipPath: 'inset(40% 0 0 0)' }} />
      </div>
      <canvas ref={canvas} hidden aria-hidden="true" />
    </section>
  </main>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
