import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { CSSProperties, ReactNode } from 'react'
import './index.css'

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`
const projects = [
  { title: "La ou dort l'eau", x: 42.75, y: 48.5, image: 'project-water.webp' },
  { title: 'Champ Silencieux', x: 26, y: 29.5, image: 'project-field.webp' },
  { title: 'Lisiere', x: 23.33, y: 60.88, image: 'project-edge.webp' },
  { title: 'Elan Brut', x: 68, y: 62.13, image: 'project-elan.webp' },
  { title: 'Les Silences Miroirs', x: 66.08, y: 19.63, image: 'project-mirrors.webp' },
  { title: 'Revolte douce', x: 73.92, y: 40.75, image: 'project-revolt.webp' },
]
type Project = typeof projects[number]

function useDraggable() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const drag = useRef({ dragging: false, sx: 0, sy: 0, ox: 0, oy: 0, cx: 0, cy: 0 })
  const cleanup = useRef<() => void>(() => {})
  useEffect(() => () => cleanup.current(), [])
  function start(x: number, y: number) {
    cleanup.current()
    Object.assign(drag.current, { dragging: true, sx: x, sy: y, ox: drag.current.cx, oy: drag.current.cy })
    isDraggingRef.current = false
  }
  function move(x: number, y: number) {
    const d = drag.current
    if (!d.dragging) return
    const dx = x - d.sx, dy = y - d.sy
    if (Math.hypot(dx, dy) >= 5) isDraggingRef.current = true
    if (isDraggingRef.current) {
      d.cx = d.ox + dx; d.cy = d.oy + dy
      setPos({ x: d.cx, y: d.cy })
    }
  }
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('[data-window-close]')) return
    e.preventDefault(); start(e.clientX, e.clientY)
    const onMove = (event: MouseEvent) => move(event.clientX, event.clientY)
    const onUp = () => { drag.current.dragging = false; cleanup.current() }
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp)
    cleanup.current = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }
  const onTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('[data-window-close]')) return
    start(e.touches[0].clientX, e.touches[0].clientY)
    const onMove = (event: TouchEvent) => { event.preventDefault(); move(event.touches[0].clientX, event.touches[0].clientY) }
    const onEnd = () => { drag.current.dragging = false; cleanup.current() }
    window.addEventListener('touchmove', onMove, { passive: false }); window.addEventListener('touchend', onEnd)
    window.addEventListener('touchcancel', onEnd)
    cleanup.current = () => { window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd); window.removeEventListener('touchcancel', onEnd) }
  }
  return { pos, onMouseDown, onTouchStart, isDraggingRef }
}

function ProjectCard({ project, index, mobile, onOpen }: { project: Project; index: number; mobile: boolean; onOpen: () => void }) {
  const [hover, setHover] = useState(false)
  const { pos, onMouseDown, onTouchStart, isDraggingRef } = useDraggable()
  const mobileAnchors = [[25, 39], [25, 16], [25, 62], [75, 62], [75, 16], [75, 39]]
  const [x, y] = mobile ? mobileAnchors[index] : [project.x, project.y]
  return <button aria-label={`Open ${project.title}`} data-project={index} onMouseDown={onMouseDown} onTouchStart={onTouchStart}
    onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)}
    onClick={() => { if (!isDraggingRef.current) onOpen(); isDraggingRef.current = false }}
    style={{ position: 'absolute', left: `calc(${x}% - 52px)`, top: `calc(${y}% - 64px)`, transform: `translate(${pos.x}px, ${pos.y}px)`, zIndex: hover ? 3 : 2, cursor: 'pointer', userSelect: 'none', touchAction: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 104, padding: 0, border: 0, background: 'transparent' }}>
    <span style={{ display: 'flex', padding: 12, borderRadius: 8, border: `2px solid ${hover ? 'rgba(255,255,255,0.2)' : 'transparent'}`, background: hover ? 'rgba(0,0,0,0.16)' : 'transparent', transition: 'background 0.18s ease, border-color 0.18s ease' }}>
      <img src={asset(project.image)} alt={project.title} draggable={false} style={{ width: 80, maxWidth: 'none', height: 'auto', display: 'block', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0px 1px 6px 0px rgba(0,0,0,0.08)' }} />
    </span>
    <span style={{ background: hover ? 'rgb(0,102,221)' : 'transparent', padding: hover ? '4px 8px' : '4px 0', borderRadius: 4, transition: 'background 0.18s ease, padding 0.18s ease', fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: 16, lineHeight: '1.4em', letterSpacing: '-0.04em', color: 'rgb(247,247,247)', whiteSpace: 'nowrap' }}>{project.title}</span>
  </button>
}

function DockIcon({ title, image, onClick, href }: { title: string; image: string; onClick?: () => void; href?: string }) {
  const [hover, setHover] = useState(false)
  const style: CSSProperties = { display: 'block', width: 48, height: 48, padding: 0, border: 0, borderRadius: '28%', overflow: 'hidden', background: 'transparent', cursor: 'pointer', transform: hover ? 'scale(1.12)' : 'scale(1)', transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)' }
  const content = <img src={asset(image)} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
  return <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
    <span role="tooltip" style={{ position: 'absolute', bottom: 'calc(100% + 12px)', left: '50%', transform: 'translateX(-50%)', opacity: hover ? 1 : 0, transition: 'opacity 0.15s', pointerEvents: 'none', whiteSpace: 'nowrap', background: 'white', padding: '6px 12px', borderRadius: 64, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 12, letterSpacing: '-0.04em', color: 'black' }}>{title}<span style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '8px solid white' }} /></span>
    {href ? <a aria-label={title} href={href} target="_blank" rel="noopener noreferrer" style={style}>{content}</a> : <button aria-label={title} onClick={onClick} style={style}>{content}</button>}
  </div>
}

function WindowShell({ title, wide = false, mobile, children, onClose }: { title: string; wide?: boolean; mobile: boolean; children: ReactNode; onClose: () => void }) {
  const [shown, setShown] = useState(false)
  const { pos, onMouseDown, onTouchStart } = useDraggable()
  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null
    const frame = requestAnimationFrame(() => setShown(true))
    panel.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        const buttons = panel.current?.querySelectorAll<HTMLElement>('button, a[href], [tabindex="0"]')
        if (!buttons?.length) { e.preventDefault(); return }
        const first = buttons[0], last = buttons[buttons.length - 1]
        if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && (document.activeElement === last || document.activeElement === panel.current)) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('keydown', onKey); before?.focus() }
  }, [onClose])
  return <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, pointerEvents: 'none' }}>
    <div ref={panel} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} style={{ width: mobile ? 'calc(100vw - 28px)' : wide ? '70vw' : '60vw', maxWidth: wide ? 840 : 720, maxHeight: '70vh', borderRadius: 24, background: 'white', boxShadow: '0 32px 80px rgba(0,0,0,0.28)', pointerEvents: 'all', display: 'flex', flexDirection: 'column', overflow: 'hidden', outline: 'none', transform: `translate(${pos.x}px, ${pos.y}px) scale(${shown ? 1 : 0.8})`, opacity: shown ? 1 : 0, transition: 'transform 0.4s cubic-bezier(0.34,1.28,0.64,1), opacity 0.3s ease' }}>
      <div onMouseDown={onMouseDown} onTouchStart={onTouchStart} style={{ height: 40, minHeight: 40, padding: '0 16px', borderBottom: '1px solid rgb(229,229,234)', cursor: 'grab', display: 'flex', alignItems: 'center', position: 'relative', touchAction: 'none', userSelect: 'none' }}>
        <div style={{ display: 'flex', gap: 8, zIndex: 1 }}>{['rgb(253,93,92)', 'rgb(250,201,0)', 'rgb(52,199,90)'].map((color, i) => <button key={color} data-window-close aria-label={['Close window', 'Minimize window', 'Dismiss window'][i]} onClick={onClose} style={{ width: 12, height: 12, borderRadius: '50%', padding: 0, border: 0, background: color, cursor: 'pointer' }} />)}</div>
        <span style={{ position: 'absolute', left: 90, right: 90, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 400, fontSize: 16, color: 'rgb(134,134,139)', letterSpacing: '-0.04em' }}>{title}</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, gap: 16, display: 'flex', flexDirection: 'column', overscrollBehavior: 'contain' }}>{children}</div>
    </div>
  </div>
}

function App() {
  const [mobile, setMobile] = useState(window.innerWidth < 640)
  const [windowContent, setWindowContent] = useState<Project | 'about' | 'notes' | null>(null)
  const close = React.useCallback(() => setWindowContent(null), [])
  useEffect(() => { const resize = () => setMobile(window.innerWidth < 640); window.addEventListener('resize', resize); return () => window.removeEventListener('resize', resize) }, [])
  const backgroundUrl = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_151236_784929aa-a992-4292-9938-1dd9b5296a29.png&w=1920&q=85'
  return <main aria-label="Interactive photography portfolio" style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative', background: 'white' }}>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("${asset('background.webp')}"), url("${backgroundUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(84,84,84,0) 0%, rgb(0,0,0) 100%)', opacity: 0.4 }} />
    <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '47.375%', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)', zIndex: 1, pointerEvents: 'none' }} />
    <div inert={windowContent !== null} style={{ position: 'absolute', inset: 0 }}>{projects.map((project, index) => <ProjectCard key={project.title} project={project} index={index} mobile={mobile} onOpen={() => setWindowContent(project)} />)}</div>
    <nav aria-label="Portfolio dock" inert={windowContent !== null} style={{ position: 'absolute', bottom: 64, left: '50%', transform: 'translateX(-50%)', zIndex: 4, display: 'flex', gap: 16, padding: 12, borderRadius: 24, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }}>
      <DockIcon title="About Me" image="about.webp" onClick={() => setWindowContent('about')} />
      <DockIcon title="Notes" image="notes.svg" onClick={() => setWindowContent('notes')} />
      <div style={{ width: 1, height: 48, background: 'rgba(255,255,255,0.2)', borderRadius: 64 }} />
      <DockIcon title="Instagram" image="instagram.png" href="https://www.instagram.com/" />
      <DockIcon title="X" image="x.png" href="https://www.x.com/" />
      <DockIcon title="Behance" image="behance.png" href="https://www.behance.com/" />
    </nav>
    {windowContent && <WindowShell key={typeof windowContent === 'string' ? windowContent : windowContent.title} title={windowContent === 'about' ? 'About Me' : windowContent === 'notes' ? 'Notes' : windowContent.title} wide={typeof windowContent !== 'string'} mobile={mobile} onClose={close}>
      {typeof windowContent !== 'string' ? <img src={asset(windowContent.image)} alt={windowContent.title} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12 }} /> : windowContent === 'about' ? <>
        <img src={asset('about.webp')} alt="Photographer portrait" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 24 }} />
        <h1 style={{ margin: '8px 0 0', fontFamily: "'Inter Display','Inter',sans-serif", fontWeight: 500, fontSize: 32, letterSpacing: '-0.04em' }}>A closer look.</h1>
        <p style={{ margin: 0, color: '#666', fontSize: 16, lineHeight: 1.7 }}>A collection of photographs exploring quiet places, passing gestures, and the space between them.</p>
        <p style={{ margin: '0 0 16px', color: '#666', fontSize: 16, lineHeight: 1.7 }}>Open a photograph to explore a project. Drag the images to make this space your own.</p>
      </> : <>
        <h1 style={{ margin: '8px 0', fontSize: 28, fontWeight: 500, letterSpacing: '-0.04em' }}>Notes on looking</h1>
        <p style={{ margin: 0, color: '#666', fontSize: 16, lineHeight: 1.7 }}>Water, open fields, and moments of movement. Six studies in light, texture, and stillness.</p>
        <div style={{ borderTop: '1px solid #e5e5ea', paddingTop: 16, color: '#86868b', fontSize: 14, lineHeight: 1.7 }}>Take your time. There is no particular order.</div>
      </>}
    </WindowShell>}
  </main>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
