import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowRight, ArrowLeft, Search, Home, Settings2, Share2, ChevronLeft, ChevronRight, X, Check } from 'lucide-react'
import './style.css'

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`
const categories = ['All', 'Programming', 'Design', 'Marketing', 'Business', 'Finance']
const courses = [
  { title: 'UI/UX Design', tag: 'Design', color: '#6875CA', video: 'design.mp4', category: 'Design' },
  { title: 'Advanced .Net', tag: 'Programming', color: '#C6A64F', video: 'programming.mp4', category: 'Programming' },
  { title: 'Digital art', tag: 'Design', color: '#65C4C8', video: 'art.mp4', category: 'Design' },
  { title: 'Copywriting', tag: 'Information', color: '#D282AC', video: 'copywriting.mp4', category: 'Marketing' },
]
function Video({ name, className = '' }: { name: string; className?: string }) {
  return <video poster={asset(name.replace('.mp4', '.jpg'))} style={{ backgroundImage: `url(${asset(name.replace('.mp4', '.jpg'))})`, backgroundSize: 'cover', backgroundPosition: 'center' }} className={`absolute inset-0 h-full w-full object-cover ${className}`} src={asset(name)} autoPlay muted playsInline loop crossOrigin="anonymous" aria-hidden="true" />
}
function PhoneFrame({ children, label, frameRef }: { children: React.ReactNode; label: string; frameRef?: React.RefObject<HTMLElement> }) {
  return <section ref={frameRef} aria-label={label} className="phone relative h-[650px] w-[320px] shrink-0 sm:h-[700px] sm:w-[340px] md:h-[760px] md:w-[370px]">
    <div className="relative h-full w-full overflow-hidden rounded-[50px] border-[6px] border-zinc-700/80 bg-black">
      {children}
      <div className="pointer-events-none absolute left-1/2 top-[12px] z-30 h-[28px] w-[100px] -translate-x-1/2 rounded-full bg-black" />
      <div className="pointer-events-none absolute bottom-2 left-1/2 z-20 h-[4px] w-[120px] -translate-x-1/2 rounded-full bg-white/30" />
    </div>
  </section>
}
function Background() { return <img src={asset('background.webp')} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" /> }
function Calendar() {
  const [date, setDate] = useState({ year: 2024, month: 7, day: 16 })
  const first = (new Date(date.year, date.month, 1).getDay() + 6) % 7
  const length = new Date(date.year, date.month + 1, 0).getDate()
  const previousLength = new Date(date.year, date.month, 0).getDate()
  const move = (offset: number) => {
    const next = new Date(date.year, date.month + offset, 1)
    setDate({ year: next.getFullYear(), month: next.getMonth(), day: Math.min(date.day, new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()) })
  }
  return <div className="px-6" aria-label="Lesson calendar">
    <div className="mb-5 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-white" aria-live="polite">{new Date(date.year, date.month).toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h2>
      <div className="flex gap-2">
        <button aria-label="Previous month" className="calendar-arrow" onClick={() => move(-1)}><ChevronLeft size={19} /></button>
        <button aria-label="Next month" className="calendar-arrow" onClick={() => move(1)}><ChevronRight size={19} /></button>
      </div>
    </div>
    <div className="mb-3 grid grid-cols-7 text-center text-[10px] font-medium text-zinc-500">{['MON', 'THU', 'WED', 'TUE', 'FRI', 'SAT', 'SUN'].map(day => <span key={day}>{day}</span>)}</div>
    <div className="grid grid-cols-7 gap-y-2" role="group" aria-label="Choose a lesson date">
      {Array.from({ length: 42 }, (_, index) => {
        const raw = index - first + 1
        const current = raw > 0 && raw <= length
        const day = raw <= 0 ? previousLength + raw : raw > length ? raw - length : raw
        const selected = current && day === date.day
        const highlighted = (current && day === 12) || (raw > length && day === 3)
        return <button key={index} aria-label={`${new Date(date.year, date.month + (raw <= 0 ? -1 : raw > length ? 1 : 0), day).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`} aria-pressed={selected}
          onClick={() => { const next = new Date(date.year, date.month, raw); setDate({ year: next.getFullYear(), month: next.getMonth(), day: next.getDate() }) }}
          className={`calendar-day ${selected ? 'selected' : current ? 'text-white hover:bg-white/10' : 'text-zinc-600 hover:bg-white/5'} ${highlighted ? 'highlighted' : ''}`}>{day}</button>
      })}
    </div>
  </div>
}
function App() {
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [shared, setShared] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [lesson, setLesson] = useState('Components & Variants')
  const exploreRef = useRef<HTMLElement>(null)
  const scheduleRef = useRef<HTMLElement>(null)
  const exploreScroll = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const scrollTo = (target: React.RefObject<HTMLElement>) => target.current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  const openLesson = (title: string) => { setLesson(title === 'UI/UX Design' ? 'Components & Variants' : title); scrollTo(scheduleRef) }
  const share = async () => {
    const url = new URL(window.location.href); url.hash = 'lesson-schedule'
    try { await navigator.clipboard.writeText(url.toString()); setShared('Schedule link copied') }
    catch { setShared(`Share this link: ${url.toString()}`) }
    window.setTimeout(() => setShared(''), 5000)
  }
  const filtered = courses.filter(course => (filter === 'All' || course.category === filter) && course.title.toLowerCase().includes(query.toLowerCase()))
  return <main className="relative flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-[#0a0a0f] px-4 py-10 font-sans md:flex-row md:gap-10">
    <PhoneFrame label="LearnHub onboarding">
      <Video name="onboarding.mp4" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 z-10 px-8 pb-10">
        <h1 className="mb-8 text-[36px] md:text-[42px] font-light leading-[1.15] tracking-tight text-white">Learn more &amp;<br />improve <strong className="font-medium">your</strong><br /><strong className="font-medium">skills.</strong></h1>
        <button aria-label="Start exploring" onClick={() => scrollTo(exploreRef)} className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-transform duration-300 hover:scale-110 active:scale-95"><ArrowRight size={24} strokeWidth={2.5} /></button>
      </div>
    </PhoneFrame>
    <PhoneFrame label="Explore courses" frameRef={exploreRef}>
      <Background />
      <div ref={exploreScroll} className="no-scrollbar relative z-10 h-full overflow-y-auto">
        <header className="flex items-center justify-between px-5 pb-4 pt-14">
          <div className="flex items-center gap-3"><div className="h-11 w-11 overflow-hidden rounded-full border-2 border-amber-400/50 bg-gradient-to-br from-amber-400 to-orange-500"><img src={asset('avatar.jpg')} alt="Adam William" className="h-full w-full object-cover" /></div><div><p className="text-xs text-zinc-400">Welcome back</p><p className="mt-0.5 text-sm font-medium text-white">Adam William</p></div></div>
          <button aria-label={searching ? 'Close search' : 'Search courses'} className="round-button" onClick={() => { setSearching(!searching); setQuery(''); window.setTimeout(() => searchRef.current?.focus(), 0) }}>{searching ? <X size={20} /> : <Search size={20} />}</button>
        </header>
        {searching && <div className="px-5"><input ref={searchRef} aria-label="Search course titles" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search courses…" className="w-full rounded-full border border-white/20 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-[#B8C1FF]" /></div>}
        <h2 className="px-5 pb-5 pt-12 text-[42px] font-light leading-[1.2] text-white">Let's explore<br /><strong className="font-medium">new fields</strong></h2>
        <div ref={filtersRef} className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-2" aria-label="Course categories">
          {categories.map(category => <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)} className={`shrink-0 rounded-full px-5 py-3 text-xs font-medium transition-colors ${filter === category ? 'bg-white text-black' : 'bg-[#524755] text-white hover:bg-[#6b5d6e]'}`}>{category}</button>)}
        </div>
        <div className="grid grid-cols-2 gap-3 px-6 pb-24 pt-2" aria-live="polite">
          {filtered.map(course => <button key={course.title} onClick={() => openLesson(course.title)} aria-label={`View ${course.title} lesson`} className="course-card group relative overflow-hidden rounded-[28px] text-left" style={{ paddingBottom: '100%' }}>
            <Video name={course.video} />
            <div className="absolute inset-0 flex flex-col justify-end p-3">
              <span className="mb-1 w-fit rounded-full px-2 py-0.5 text-[9px] font-medium text-white" style={{ backgroundColor: course.color }}>{course.tag}</span>
              <span className="text-sm font-semibold text-[#1F111D] drop-shadow-lg">{course.title}</span>
            </div>
            <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:rotate-45"><ArrowRight size={16} strokeWidth={2.5} className="-rotate-45" /></span>
          </button>)}
          {!filtered.length && <p className="col-span-2 py-8 text-center text-sm text-zinc-300">No courses in this field yet.</p>}
        </div>
      </div>
      <nav aria-label="Explore navigation" className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white px-2 py-2 shadow-lg">
        <button aria-label="Home" className="flex h-12 w-12 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-600" onClick={() => { setFilter('All'); setQuery(''); setSearching(false); exploreScroll.current?.scrollTo({ top: 0, behavior: 'smooth' }) }}><Home size={22} /></button>
        <button aria-label="Explore fields" className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white transition-transform hover:scale-105" onClick={() => { filtersRef.current?.scrollTo({ left: 0, behavior: 'smooth' }); setFilter('All'); exploreScroll.current?.scrollTo({ top: 90, behavior: 'smooth' }) }}><Settings2 size={23} /></button>
      </nav>
    </PhoneFrame>
    <PhoneFrame label="Lesson schedule" frameRef={scheduleRef}>
      <Background />
      <div id="lesson-schedule" className="no-scrollbar relative z-10 h-full overflow-y-auto pb-2">
        <header className="flex justify-between px-5 pb-4 pt-14">
          <button aria-label="Back to explore" className="round-button" onClick={() => scrollTo(exploreRef)}><ArrowLeft size={20} /></button>
          <button aria-label="Share lesson schedule" className="round-button" onClick={share}>{shared ? <Check size={20} /> : <Share2 size={20} />}</button>
        </header>
        {shared && <div role="status" className="absolute right-5 top-28 z-20 rounded-xl bg-white px-3 py-2 text-xs text-black">{shared}</div>}
        <h2 className="px-6 pb-6 pt-4 text-[42px] font-medium leading-[1.15] text-white">Lesson<br />schedule</h2>
        <Calendar />
        <button aria-label={`View lesson: ${lesson}`} onClick={() => setPreviewOpen(true)} className="relative mx-4 mb-6 mt-4 block w-[calc(100%-2rem)] overflow-hidden rounded-[28px] text-left">
          <Video name="lesson.mp4" />
          <div className="relative p-5 pr-16"><span className="mb-2 inline-block rounded-full bg-[#6276CA] px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">05:00 - 06:00 PM</span><h3 className="text-lg font-bold leading-tight text-[#1F111D]">{lesson === 'Components & Variants' ? <>Components &amp;<br />Variants</> : lesson}</h3><p className="mt-1 text-xs text-[#1F111D]/70">Adrian Smith</p></div>
          <span className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white"><ArrowRight size={20} className="-rotate-45 text-black" /></span>
        </button>
      </div>
      {previewOpen && <div role="dialog" aria-modal="true" aria-label="Lesson preview" className="absolute inset-0 z-40 flex flex-col justify-center bg-[#16121c] p-6" onKeyDown={event => { if (event.key === 'Escape') setPreviewOpen(false) }}>
        <button autoFocus aria-label="Close lesson preview" className="round-button absolute right-5 top-14" onClick={() => setPreviewOpen(false)}><X size={20} /></button>
        <div className="relative mb-6 aspect-square overflow-hidden rounded-[28px]"><video src={asset('lesson.mp4')} autoPlay muted playsInline loop controls className="h-full w-full object-cover" /></div>
        <p className="mb-2 text-xs text-[#B8C1FF]">05:00 - 06:00 PM</p><h2 className="text-3xl font-medium text-white">{lesson}</h2><p className="mt-3 text-sm text-zinc-400">Adrian Smith</p>
      </div>}
    </PhoneFrame>
  </main>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
