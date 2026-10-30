import React from 'react';
import { HashRouter, useLocation } from 'react-router-dom';
import { PillNav } from './Component';
import { Rocket } from 'lucide-react';

function Showcase() {
const { pathname } = useLocation();
const navItems = [
{ label: 'Home', href: '/' },
{ label: 'Collection', href: '/collection' },
{ label: 'About', href: '/about' },
{ label: 'Contact', href: '/contact' }
];

return (

<div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center p-6 md:p-20">
<div className="w-full max-w-2xl bg-white/50 backdrop-blur-sm rounded-[40px] shadow-2xl shadow-black/5 p-4 md:p-12 flex items-center justify-center relative overflow-visible">
<PillNav
logo={<Rocket size={24} />}
logoAlt="Home"
items={navItems}
activeHref={pathname}
baseColor="#1A1A1B"
pillColor="#F9F9F9"
hoveredPillTextColor="#FFFFFF"
pillTextColor="#1A1A1B"
/>
</div>

<div className="mt-12 text-center">
<h1 className="text-2xl font-medium text-slate-900 tracking-tight">Pill Navigation</h1>
<p className="text-slate-500 mt-2 max-w-md mx-auto text-balance">
A premium navigation component with GSAP animations. Hover over the links to see the rising background effect.
</p>
</div>

{/* Replay the complete entrance animation. */}
<button
onClick={() => window.location.reload()}
className="fixed bottom-6 right-6 md:bottom-8 md:right-8 px-6 py-3 bg-slate-900 text-white rounded-full font-medium shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
>
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
<path d="M3 3v5h5" />
</svg>
Replay Animation
</button>
</div>

);
}

export default function App() { return <HashRouter><Showcase /></HashRouter>; }
