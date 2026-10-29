import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Calendar, ChevronDown, FileText, Home, MoreHorizontal, User, X, Check } from 'lucide-react'
import './styles.css'

const trips = [
  { name: 'Tokyo', moments: 23, image: 'tokyo.webp', description: 'Snow-capped mountain beneath a blue sky' },
  { name: 'Seoul', moments: 18, image: 'seoul.webp', description: 'Rolling green hills beneath a pale sky' },
  { name: 'Bali', moments: 29, image: 'bali.webp', description: 'Sunlit orange desert dunes' },
  { name: 'Rome', moments: 15, image: 'rome.webp', description: 'Purple hills beneath a blue sky' },
]

function DestinationCard({ trip, index, onMore }: { trip: typeof trips[number], index: number, onMore: () => void }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 150 + index * 120)
    return () => clearTimeout(timer)
  }, [index])
  return <article aria-label={`${trip.name}, ${trip.moments} moments`} className={`relative h-[200px] w-full shrink-0 overflow-hidden rounded-2xl transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
    <img className="absolute inset-0 h-full w-full object-cover" src={`${import.meta.env.BASE_URL}assets/${trip.image}`} alt={trip.description} />
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    <div className="absolute left-3 top-3"><span className="liquid-glass inline-block rounded-full px-3 py-1 text-xs font-normal text-white/90">{trip.moments} moments</span></div>
    <div className="absolute right-3 top-3"><button aria-label={`More options for ${trip.name}`} onClick={onMore} className="liquid-glass flex h-8 w-8 items-center justify-center rounded-full text-white/80"><MoreHorizontal size={16} /></button></div>
    <div className="absolute bottom-0 left-0 h-20 w-full overflow-hidden text-center"><h2 className="mt-0.5 text-[96px] font-bold leading-none tracking-tight text-white/[0.55]">{trip.name}</h2></div>
  </article>
}

function App() {
  const [panel, setPanel] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('Trips')
  const [saved, setSaved] = useState<string[]>([])
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setPanel(null) }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])
  return <main className="flex h-screen w-screen items-center justify-center overflow-hidden bg-white">
    <section className="phone relative h-[780px] w-[375px] shrink-0 overflow-hidden rounded-[52px] bg-[#0a0a0c] text-white" aria-label="Travel Journal app">
      <div className="absolute left-1/2 top-0 z-50 h-7 w-[120px] -translate-x-1/2 rounded-b-2xl bg-black" aria-hidden="true" />
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between bg-[#0a0a0c]/75 px-6 pb-4 pt-14 backdrop-blur-[12px]">
        <button className="flex items-center gap-1.5 text-lg font-semibold" aria-expanded={panel === 'region'} onClick={() => setPanel(panel === 'region' ? null : 'region')}>Asia <ChevronDown size={18} className="text-white/70" /></button>
        <button aria-label="Open calendar" aria-expanded={panel === 'calendar'} className="text-white/70" onClick={() => setPanel(panel === 'calendar' ? null : 'calendar')}><Calendar size={22} /></button>
      </header>
      <div className="scrollbar-hide h-full space-y-4 overflow-y-auto px-6 pb-24 pt-28" aria-label="Destination journals" tabIndex={0}>
        {trips.map((trip, index) => <DestinationCard key={trip.name} trip={trip} index={index} onMore={() => setPanel(trip.name)} />)}
      </div>
      <nav aria-label="Main navigation" className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2">
        <div className="liquid-glass flex gap-6 rounded-full px-6 py-2">
          {[{label: 'Feed', Icon: Home}, {label: 'Account', Icon: User}, {label: 'Trips', Icon: FileText}].map(({label, Icon}) => <button key={label} aria-current={activeTab === label ? 'page' : undefined} onClick={() => { setActiveTab(label); setPanel(label === 'Trips' ? null : label) }} className={`flex flex-col items-center gap-0.5 ${activeTab === label ? 'text-white' : 'text-white/50'}`}><Icon size={20} /><span className="text-[10px] font-medium">{label}</span></button>)}
        </div>
      </nav>
      {panel && <div className="absolute inset-0 z-40 flex items-end bg-black/30" onClick={() => setPanel(null)}>
        <section role="dialog" aria-modal="true" aria-label={panel === 'region' ? 'Region' : panel} className="relative mb-24 mx-6 w-full rounded-2xl border border-white/10 bg-[#1a1a1e]/95 p-5 shadow-xl backdrop-blur-xl" onClick={event => event.stopPropagation()}>
          <button autoFocus aria-label="Close panel" className="absolute right-4 top-4 text-white/60" onClick={() => setPanel(null)}><X size={18} /></button>
          <h2 className="mb-3 pr-6 text-lg font-semibold">{panel === 'region' ? 'Your destinations' : panel === 'calendar' ? 'Travel calendar' : panel}</h2>
          {panel === 'region' ? <button className="flex w-full items-center justify-between py-2 text-sm" onClick={() => setPanel(null)}>Asia <Check size={16} /></button>
            : panel === 'calendar' ? <p className="text-sm leading-relaxed text-white/60">Your trips are ready to explore. No upcoming travel dates added.</p>
            : panel === 'Feed' ? <p className="text-sm leading-relaxed text-white/60">Your next story starts with a trip. Explore your destination journals in Trips.</p>
            : panel === 'Account' ? <p className="text-sm leading-relaxed text-white/60">Your travel journal · 4 destinations · 85 moments</p>
            : <button className="w-full rounded-xl bg-white/10 px-4 py-3 text-left text-sm" onClick={() => { setSaved(saved.includes(panel) ? saved.filter(name => name !== panel) : [...saved, panel]); }}>{saved.includes(panel) ? 'Saved to favorites ✓' : 'Save to favorites'}</button>}
        </section>
      </div>}
    </section>
  </main>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
