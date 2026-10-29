import { useState, useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'

const GRASS_GREEN = '#213138'
const FULL_TEXT = 'Velar.'
const HOUSE_IMG = 'https://res.cloudinary.com/dsdhxhhqh/image/upload/v1780471903/building_bzziky.png'
const BG_IMG = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260603_073200_7082add5-f1f8-4873-8696-d6f78a44089b.png&w=1920&q=85'
const GALLERY_VIDEOS = [
 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260528_154759_4cdc8175-8261-497c-b688-9477c76545d4.mp4',
 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260528_154751_39b1b9bb-2708-4211-b6a2-d39f93309e52.mp4',
 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260528_154737_eba7900c-0313-483c-a30a-632c747ccc42.mp4',
 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_144009_4348fe33-f885-4345-8e92-3fe1c2625d32.mp4',
 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_145337_e44eaa8c-6bb1-4a6e-a70f-ed0231cbaccb.mp4',
]
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`
const CHAR_INTERVAL = 140, TYPE_START = 600, LIFT_AT = TYPE_START + 6 * CHAR_INTERVAL + 700

function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
 const ref = useRef<HTMLSpanElement>(null)
 const [value, setValue] = useState(0)
 useEffect(() => {
  let frame = 0
  const observer = new IntersectionObserver(([entry]) => {
   if (!entry.isIntersecting) return
   observer.disconnect()
   const start = performance.now()
   const tick = (now: number) => {
    const t = Math.min((now - start) / 2000, 1)
    setValue(Math.round((1 - Math.pow(1 - t, 3)) * end))
    if (t < 1) frame = requestAnimationFrame(tick)
   }
   frame = requestAnimationFrame(tick)
  }, { rootMargin: '0px 0px -30% 0px' })
  if (ref.current) observer.observe(ref.current)
  return () => { observer.disconnect(); cancelAnimationFrame(frame) }
 }, [end])
 return <span ref={ref}>{value}{suffix}</span>
}

export default function App() {
 const [typed, setTyped] = useState(0)
 const [cursor, setCursor] = useState(true)
 const [lifting, setLifting] = useState(false)
 const [liftDone, setLiftDone] = useState(false)
 const [heroVisible, setHeroVisible] = useState(false)
 const [menuOpen, setMenuOpen] = useState(false)
 const [navOnDark, setNavOnDark] = useState(false)
 const heroRef = useRef<HTMLElement>(null)
 const darkRef = useRef<HTMLDivElement>(null)
 const galleryRef = useRef<HTMLElement>(null)
 const houseRef = useRef<HTMLDivElement>(null)
 const imageRef = useRef<HTMLImageElement>(null)
 const toggleRef = useRef<HTMLButtonElement>(null)
 const menuRef = useRef<HTMLDivElement>(null)

 useEffect(() => {
  const timers = FULL_TEXT.split('').map((_, i) => setTimeout(() => setTyped(i + 1), TYPE_START + i * CHAR_INTERVAL))
  timers.push(setTimeout(() => setCursor(false), LIFT_AT - 150), setTimeout(() => setLifting(true), LIFT_AT), setTimeout(() => setHeroVisible(true), LIFT_AT + 1300), setTimeout(() => setLiftDone(true), LIFT_AT + 2100))
  return () => timers.forEach(clearTimeout)
 }, [])

 const updateHousePosition = useCallback(() => {
  if (!liftDone || !heroRef.current || !darkRef.current || !houseRef.current || !imageRef.current) return
  const vw = window.innerWidth, vh = window.innerHeight, baseW = Math.max(vw, 1400)
  const hero = heroRef.current.getBoundingClientRect(), dark = darkRef.current.getBoundingClientRect()
  const triggerPoint = -(hero.height * .30), endPoint = hero.top - (dark.bottom - vh)
  const progress = Math.max(0, Math.min(1, (hero.top - triggerPoint) / (endPoint - triggerPoint)))
  const smoothstep = (t: number) => t * t * (3 - 2 * t)
  const t = smoothstep(smoothstep(progress)), imgH = imageRef.current.offsetHeight
  const startX = (vw - baseW) / 2, startY = vh - imgH
  const finalScale = 1.45, finalX = (vw - baseW * finalScale) / 2
  const mobileOffset = vw < 1024 ? -250 : 4
  const finalY = dark.bottom - imgH * finalScale + 500 + mobileOffset
  Object.assign(houseRef.current.style, progress <= 0 ? { top: 'auto', bottom: '0', left: '50%', transform: 'translateX(-50%)' } : { top: '0', bottom: 'auto', left: '0', transform: `translate(${startX + (finalX - startX) * t}px, ${startY + (finalY - startY) * t}px) scale(${1 + .45 * t})`, transformOrigin: 'top left' })
 }, [liftDone])

 useEffect(() => {
  let frame = 0
  const update = () => {
   frame = 0
   setNavOnDark([darkRef.current, galleryRef.current].some(el => { const rect = el?.getBoundingClientRect(); return rect ? rect.top <= 0 && rect.bottom > 0 : false }))
   updateHousePosition()
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
  update()
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
 }, [updateHousePosition])

 useEffect(() => {
  if (!menuOpen) return
  const previous = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  menuRef.current?.querySelector('a')?.focus()
  const handleKey = (event: KeyboardEvent) => {
   if (event.key === 'Escape') { setMenuOpen(false); toggleRef.current?.focus() }
   if (event.key === 'Tab') {
    const items = [toggleRef.current, ...Array.from(menuRef.current?.querySelectorAll('a') || [])].filter(Boolean) as HTMLElement[]
    const index = items.indexOf(document.activeElement as HTMLElement)
    if (event.shiftKey && index <= 0) { event.preventDefault(); items[items.length - 1]?.focus() }
    else if (!event.shiftKey && index === items.length - 1) { event.preventDefault(); items[0]?.focus() }
   }
  }
  document.addEventListener('keydown', handleKey)
  return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', handleKey) }
 }, [menuOpen])

 const navColor = menuOpen ? GRASS_GREEN : navOnDark ? '#ffffff' : GRASS_GREEN
 return <>
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=Inter:wght@300;400;500;600&display=swap');`}</style>
  <div className="intro-overlay" aria-hidden="true" style={{ background: GRASS_GREEN, transform: lifting ? 'translateY(-100%)' : 'translateY(0)', transition: liftDone ? 'none' : 'transform 1.5s cubic-bezier(0.45, 0, 0.15, 1)' }}>
   <div className="intro-word">{FULL_TEXT.slice(0, typed).split('').map((letter, i) => <span key={i} style={{ fontWeight: letter === '.' ? 900 : 700 }}>{letter}</span>)}{cursor && <span className="typing-cursor" />}</div>
  </div>
  <nav className="fixed top-0 inset-x-0 z-50 px-6 md:px-10 lg:px-16 py-5 md:py-6 flex items-center justify-between" aria-label="Main navigation" style={{ color: navColor, transition: 'color 0.35s ease' }}>
   <a className="brand text-xl" href="#residences" aria-label="Velar home" onClick={() => setMenuOpen(false)}>Velar<span>.</span></a>
   <button ref={toggleRef} className="menu-toggle group" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="main-menu">{menuOpen ? <X size={24} strokeWidth={1} /> : <span className="hamburger"><span /><span /></span>}</button>
  </nav>
  {menuOpen && <div id="main-menu" ref={menuRef} className="menu-overlay" role="dialog" aria-modal="true" aria-label="Explore Velar">
   {['Residences', 'Story', 'Listings', 'Inquire'].map((label, i) => <a key={label} href={['#residences', '#story', '#listings', '#inquire'][i]} onClick={() => { setMenuOpen(false); toggleRef.current?.focus() }}>{label}</a>)}
  </div>}
  <main>
   <section id="residences" ref={heroRef} className="hero" style={{ backgroundImage: `url("${asset('background.webp')}"), url("${BG_IMG}")` }}>
    <div className={`hero-text-block ${heroVisible ? 'is-visible' : ''}`}>
     <div className="hero-heading-top px-6 md:px-10 lg:px-16 flex items-end justify-between">
      <div className="hero-own-the">LIVE IN</div>
      <p className="hero-subtitle-desktop">Stately homes built with vision,<br />scope, and architectural finesse.</p>
     </div>
     <div className="overflow-hidden"><h1 className="hero-extraordinary px-6 md:px-10 lg:px-16">IRREPLACEABLE</h1></div>
     <p className="hero-subtitle-mobile px-6">Premium real estate with vision,<br />depth, and architectural clarity.</p>
    </div>
   </section>
   <div className="house-wrapper" ref={houseRef} aria-hidden="true">
    <div className="house-entrance" style={{ transform: lifting ? 'translateY(0)' : 'translateY(102vh)', transition: liftDone ? 'none' : 'transform 1.5s cubic-bezier(0.45, 0, 0.15, 1) 0.4s' }}>
     <img ref={imageRef} src={HOUSE_IMG} onError={event => { const fallback = asset('house-fallback.png'); if (!event.currentTarget.src.endsWith(fallback)) event.currentTarget.src = fallback }} onLoad={updateHousePosition} alt="" />
    </div>
   </div>
   <div className="dark-wrapper" ref={darkRef} id="story">
    <div className="dark-spacer" />
    <section className="s2-section" aria-label="Our standards">
     <div className="s2-content px-6 md:px-10 lg:px-16">
      <div className="s2-statement-wrap"><p className="s2-statement">{'Every estate we present is hand-chosen\nthrough a frame of permanence, refinement,\nand timeless detail. Standards are not\na flourish. It is our discipline.'}</p></div>
      <div className="s2-stats-row">
       {[{ end: 120, suffix: '+', label: 'Portfolio Holdings' }, { end: 12, label: 'Global Locations' }, { end: 98, suffix: '%', label: 'Patron Loyalty Rate' }].map(stat => <div className="stat" key={stat.label}><div className="stat-number"><CountUp end={stat.end} suffix={stat.suffix} /></div><div className="stat-label">{stat.label}</div></div>)}
      </div>
     </div>
    </section>
   </div>
   <section id="listings" ref={galleryRef} className="s3-gallery-section" aria-label="Explore the residences">
    <div className="s3-ticker-wrap" aria-hidden="true"><div className="ticker-track">{[0, 1].map(i => <span key={i}>{'Velar. '.repeat(8)}</span>)}</div></div>
    <div className="s3-gallery-content"><div className="gallery-expand-row">
     {GALLERY_VIDEOS.map((url, i) => <div className="gallery-expand-item" key={url} tabIndex={0} aria-label={`Residence film ${i + 1}`}><video src={asset(`gallery-${i + 1}.mp4`)} data-original-source={url} autoPlay loop muted playsInline preload="auto" aria-label={`Architectural tour ${i + 1}`} /></div>)}
    </div></div><div id="inquire" />
   </section>
  </main>
 </>
}
