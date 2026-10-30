import Header from './components/Header';
import Hero from './components/Hero';
import InsightsSection from './components/InsightsSection';
import TextFillSection from './components/TextFillSection';
import { assets, localAsset } from './assets';
export default function App() {
  return <div className="min-h-screen"><div id="home" className="relative flex h-screen min-h-[620px] flex-col bg-[#EFF4FF]">
    <video src={assets.hero} autoPlay loop muted playsInline aria-hidden="true" className="absolute inset-0 z-0 h-full w-full object-cover object-[10%_center] md:object-center" onError={e => { const el = e.currentTarget; if (!el.src.includes('/assets/')) { el.src = localAsset('hero.mp4'); el.load(); } }} />
    <Header /><Hero />
  </div><InsightsSection /><TextFillSection /></div>;
}
