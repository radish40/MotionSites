import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Menu, X } from 'lucide-react'
import './styles.css'

const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_091828_e240eb17-6edc-4129-ad9d-98678e3fd238.mp4'
const links = ['Start', 'Story', 'Rates', 'Benefits', 'FAQ']

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <section id="start" className="relative h-screen overflow-hidden" aria-label="SkyElite private jets">
        <video className="absolute inset-0 h-full w-full object-cover" src={videoUrl} autoPlay muted loop playsInline aria-hidden="true" />
        <div className="relative flex h-full flex-col">
          <header className="relative z-20 mx-auto w-full max-w-7xl px-8 py-6">
            <nav className="flex items-center justify-between" aria-label="Main navigation">
              <a href="#start" className="text-2xl font-semibold text-gray-900 transition-colors hover:text-gray-700" onClick={() => setMenuOpen(false)}>SkyElite</a>
              <div className="hidden items-center gap-8 md:flex">
                {links.map(link => <a key={link} href={`#${link.toLowerCase()}`} className="text-gray-900 transition-colors hover:text-gray-700">{link}</a>)}
              </div>
              <button type="button" className="rounded-md p-1 text-gray-900 transition-colors hover:text-gray-700 md:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </nav>
            {menuOpen && (
              <nav id="mobile-menu" aria-label="Mobile navigation" className="absolute left-8 right-8 top-full flex flex-col rounded-2xl bg-white/95 p-3 shadow-lg backdrop-blur-md md:hidden" onKeyDown={event => { if (event.key === 'Escape') setMenuOpen(false) }}>
                {links.map(link => <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-gray-900 transition-colors hover:bg-gray-100 hover:text-gray-700">{link}</a>)}
              </nav>
            )}
          </header>
          <main className="flex flex-1 items-center justify-center px-6">
            <div className="hero-content -mt-80 text-center">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-600">Private Jets</p>
              <h1 className="mb-6 text-6xl font-normal leading-none tracking-tighter md:text-7xl lg:text-8xl">
                <span className="block text-gray-500">Premium.</span>
                <span className="-mt-3 block text-[#202A36]">Accessible.</span>
              </h1>
              <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-600 md:text-xl">Your dedication deserves recognition.</p>
              <div className="flex justify-center gap-4">
                <button type="button" className="rounded-full bg-gray-300 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-400">Discover</button>
                <button type="button" className="rounded-full bg-[#202A36] px-4 py-2 font-medium text-white transition-colors hover:bg-[#1a2229]">Book Now</button>
              </div>
            </div>
          </main>
        </div>
      </section>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
