import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ArrowRight, Menu, X } from 'lucide-react'
import { ShinyText } from './ShinyText'
import './styles.css'

const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4'
const links = ['Home', 'About Us', 'Courses', 'Instructors', 'Testimonials', 'Blog', 'Contact us']
const details: Record<string, { eyebrow: string; heading: string; body: string }> = {
  'About Us': { eyebrow: 'THE DESIGNPRO VISION', heading: 'Designed for your next chapter.', body: 'We deliver transformative programs that empower emerging product designers with cutting-edge expertise and vision to thrive globally.' },
  Courses: { eyebrow: 'LEARN WITH DESIGNPRO', heading: 'Your next step starts here.', body: 'Our next product design program is opening soon. Course details will be available with the next enrollment.' },
  Instructors: { eyebrow: 'THE PEOPLE BEHIND THE PROGRAM', heading: 'A new perspective on design.', body: 'Meet the instructors when the next program is announced.' },
  Testimonials: { eyebrow: 'THE DESIGNPRO COMMUNITY', heading: '8000+ Talented Designers Launched !', body: 'Designer stories will be shared here with our next program announcement.' },
  Blog: { eyebrow: 'IDEAS & PERSPECTIVES', heading: 'More to explore. Soon.', body: 'DesignPro articles and insights are coming soon.' },
  'Contact us': { eyebrow: 'CONNECT WITH DESIGNPRO', heading: 'Let’s take the next step.', body: 'Contact information will be available when enrollment opens. Check back for the next program announcement.' },
  Enrollment: { eyebrow: 'YOUR NEXT CHAPTER', heading: 'Great design starts with you.', body: 'Seats for Next Program Opening Soon. Enrollment is not open yet. Check back soon for the next DesignPro program.' },
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [panel, setPanel] = useState<string | null>(null)
  const [fallback, setFallback] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const trigger = useRef<HTMLElement | null>(null)
  const video = useRef<HTMLVideoElement>(null)
  const reducedMotion = useReducedMotion()
  const openPanel = (name: string) => {
    trigger.current = document.activeElement as HTMLElement
    setMenuOpen(false)
    if (name === 'Home') { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
    setPanel(name)
  }
  useEffect(() => {
    if (panel) { dialog.current?.showModal(); closeButton.current?.focus() }
    else if (dialog.current?.open) { dialog.current.close(); trigger.current?.focus() }
  }, [panel])
  useEffect(() => {
    if (reducedMotion) video.current?.pause()
    else video.current?.play().catch(() => {})
  }, [reducedMotion, fallback])
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  return <main id="home" className="hero relative isolate h-screen min-h-[700px] overflow-hidden bg-black text-white">
    <video ref={video} className="hero-video absolute inset-0 h-full w-full object-cover" src={fallback ? `${import.meta.env.BASE_URL}assets/designpro-background.mp4` : videoUrl} autoPlay loop muted playsInline aria-hidden="true" onError={() => setFallback(true)} />
    <div className="video-shade absolute inset-0" />
    <div className="page-content relative z-10 mx-auto flex h-full max-w-7xl flex-col px-6 md:px-10 xl:px-8">
      <header className="flex items-center justify-between gap-8 py-7 md:py-9">
        <a href="#home" aria-label="DesignPro home" className="brand flex shrink-0 items-center gap-2.5 text-[23px] font-semibold tracking-[-1px]">
          <span className="brand-mark flex h-9 w-9 items-center justify-center rounded-full border-2 border-white"><span className="h-3.5 w-3.5 rounded-full bg-white" /></span>DesignPro
        </a>
        <nav aria-label="Main navigation" className="hidden items-center gap-0.5 rounded-full border border-gray-700 bg-black/10 p-1.5 lg:flex">
          {links.map(link => <button key={link} onClick={() => openPanel(link)} className="nav-link flex items-center gap-2 rounded-full px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white">{link}{link === 'Contact us' && <ArrowUpRight size={16} />}</button>)}
        </nav>
        <button className="menu-button rounded-full border border-white/25 p-2.5 text-white/80 transition hover:bg-white/10 hover:text-white lg:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </header>
      <AnimatePresence>{menuOpen && <motion.nav id="mobile-navigation" aria-label="Mobile navigation" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mobile-navigation absolute left-6 right-6 top-[92px] z-30 rounded-2xl border border-white/20 bg-black/95 p-3 shadow-2xl backdrop-blur-xl lg:hidden">{links.map(link => <button className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white" key={link} onClick={() => openPanel(link)}>{link}<ArrowUpRight size={16} /></button>)}</motion.nav>}</AnimatePresence>
      <div className="intro flex flex-col justify-between gap-5 pt-9 text-sm leading-relaxed text-white/80 md:pt-12 md:text-base lg:flex-row lg:items-start">
        <p className="max-w-[425px]">We deliver transformative programs that empower emerging product designers with cutting-edge expertise and vision to thrive globally.</p>
        <p className="max-w-[235px] lg:text-right">8000+ Talented<br className="hidden lg:block" /> Designers Launched !</p>
      </div>
      <section aria-labelledby="hero-heading" className="hero-center flex flex-1 flex-col items-center justify-center pb-[108px] pt-14 text-center md:pt-16">
        <p className="announcement mb-7 text-xs uppercase tracking-[-0.015em] text-white/80 md:mb-9 md:text-sm">Seats for Next Program Opening Soon</p>
        <h1 id="hero-heading" className="hero-heading text-5xl font-medium leading-[0.85] tracking-tighter sm:text-7xl md:text-8xl xl:text-9xl"><span className="block">Become</span><ShinyText text="Product Leader." /></h1>
        <button onClick={() => openPanel('Enrollment')} className="group mt-10 flex items-center gap-5 rounded-full bg-black px-6 py-3 text-sm text-white transition-colors duration-300 hover:bg-gray-900 md:mt-12 md:px-8 md:py-4">Apply for Next Enrollment<ArrowRight size={19} strokeWidth={1.6} className="transition-transform duration-300 group-hover:translate-x-1" /></button>
      </section>
    </div>
    <dialog aria-labelledby="detail-heading" ref={dialog} className="detail-dialog rounded-3xl border border-white/20 bg-[#091118] p-0 text-white shadow-2xl" onCancel={() => setPanel(null)} onClick={event => { if (event.target === event.currentTarget) setPanel(null) }}>
      {panel && <div className="relative p-8 sm:p-12"><button ref={closeButton} aria-label="Close dialog" onClick={() => setPanel(null)} className="absolute right-4 top-4 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"><X size={20} /></button><p className="mb-6 text-xs tracking-[0.12em] text-[#64CEFB]">{details[panel].eyebrow}</p><h2 id="detail-heading" className="mb-5 text-3xl font-medium leading-tight tracking-tight sm:text-4xl">{details[panel].heading}</h2><p className="leading-relaxed text-white/70">{details[panel].body}</p><button onClick={() => setPanel(null)} className="mt-8 flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-[#64CEFB]">Back to DesignPro<ArrowRight size={16} /></button></div>}
    </dialog>
  </main>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
