import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Check } from 'lucide-react';
import { HlsVideo } from './HlsVideo';
import './index.css';

const media = {
  hero: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4',
  feature: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4',
  statement: 'https://stream.mux.com/9njY8qDfS02Uvbll018C8CK39p5EksK7mn02DDC1zYvppI.m3u8',
  join: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260306_074215_04640ca7-042c-45d6-bb56-58b1e8a42489.mp4'
};
const tabs = [{ label: 'Living Electric', id: 'electric' }, { label: 'Charge Faster', id: 'charge' }, { label: 'Sleep Well', id: 'sleep' }, { label: 'Acoustic Comfort', id: 'acoustic' }, { label: '5+ Seasons', id: 'seasons' }];
const glass = 'liquid-glass rounded-full text-foreground transition-transform hover:scale-[1.03] inline-flex items-center justify-center';
type Modal = 'preorder' | 'tour' | 'subscribe' | 'privacy' | 'terms' | null;
function App() {
  const [activeTab, setActiveTab] = useState('electric');
  const [modal, setModal] = useState<Modal>(null);
  const [saved, setSaved] = useState(false);
  const open = (type: Modal) => { setSaved(false); setModal(type); };
  const legal = modal === 'privacy' || modal === 'terms';
  const modalTitle = modal === 'preorder' ? 'Your journey starts here.' : modal === 'tour' ? 'Meet your next adventure.' : modal === 'subscribe' ? 'A little closer to the road.' : modal === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions';
  return <>
    <main>
      <section id="home" className="relative min-h-screen overflow-hidden">
        <video src={media.hero} autoPlay loop muted playsInline aria-hidden="true" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black via-black/60 to-transparent z-[1]" />
        <nav aria-label="Main navigation" className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <a href="#home" aria-label="Velorah home" className="font-serif text-3xl tracking-tight">Velorah<sup className="text-[10px] top-[-1em] relative ml-0.5">®</sup></a>
          <div className="hidden md:flex items-center gap-10 text-sm text-white">
            {[['Home','home'],['Studio','studio'],['About','about'],['Journal','journal'],['Reach Us','reach-us']].map(([label,id]) => <a key={id} href={`#${id}`} className="hover:text-white/80 transition-colors">{label}</a>)}
          </div>
          <a href="#join" className={`${glass} px-6 py-2.5 text-sm`}>Begin Journey</a>
        </nav>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-[28px] pb-40">
          <h1 className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl">Where <em className="not-italic text-white">dreams</em> rise<br className="hidden sm:block" /> <em className="not-italic text-white">through the silence.</em></h1>
          <p className="animate-fade-rise-delay text-white text-base sm:text-lg max-w-2xl mt-8 leading-relaxed">We're designing tools for deep thinkers, bold creators, and quiet rebels. Amid the chaos, we build digital spaces for sharp focus and inspired work.</p>
          <a href="#studio" className={`animate-fade-rise-delay-2 ${glass} px-14 py-5 text-base mt-12`}>Begin Journey</a>
        </div>
      </section>
      <section id="studio" className="flex items-center justify-center min-h-[70vh] px-6 bg-black">
        <h2 className="text-4xl sm:text-6xl md:text-7xl leading-[1.05] tracking-[-1.5px] text-center max-w-4xl">So you can feel at home,<br />anywhere.</h2>
      </section>
      <section id="about" className="px-6 md:px-12 max-w-7xl mx-auto py-0">
        <div className="grid md:grid-cols-2 gap-4 rounded-2xl overflow-hidden min-h-[520px]">
          <div className="bg-card rounded-2xl p-10 md:p-14 flex flex-col justify-between gap-12">
            <div><span className="inline-block w-8 h-8 rounded-full border border-border mb-8" aria-hidden="true" /><h2 className="text-3xl sm:text-5xl tracking-[-1px] mb-6">100% Electric</h2><p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-sm">No more fossil fuels, buzzing generators, and propane tanks. Velorah has power for days.</p></div>
            <div><div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Velorah features">{tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} aria-pressed={activeTab === tab.id} className={`text-xs px-4 py-2 rounded-full border transition-colors ${activeTab === tab.id ? 'bg-foreground text-primary-foreground border-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>)}</div><div className="w-full h-0.5 bg-border rounded-full mb-6" aria-hidden="true"><div className="h-full bg-foreground rounded-full w-[35%]" /></div><a href="#journal" className={`${glass} px-8 py-3 text-sm`}>Explore the Velorah Flow</a></div>
          </div>
          <div className="relative rounded-2xl overflow-hidden min-h-[400px]"><video src={media.feature} className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline aria-hidden="true" /></div>
        </div>
      </section>
      <section id="journal" className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 py-20 overflow-hidden">
        <HlsVideo src={media.statement} />
        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl">
          <p className="text-muted-foreground text-xs sm:text-sm tracking-[0.3em] uppercase mb-6">Intelligent Companion</p>
          <h2 className="text-4xl sm:text-6xl md:text-7xl leading-[1.05] tracking-[-1.5px]">Adventure inspired.<br />App driven.</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed">One app to control climate, lighting, navigation, and energy. Monitor every system in real time, automate your routines, and let Velorah learn how you live on the road.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 mt-14">{[['OTA','Over-the-air updates'],['360°','System visibility'],['AI','Adaptive routines'],['24/7','Remote monitoring']].map(([value,label]) => <div key={value}><div className="font-serif text-3xl sm:text-4xl font-light">{value}</div><p className="text-muted-foreground text-xs sm:text-sm mt-2">{label}</p></div>)}</div>
          <a href="#join" className={`${glass} px-10 py-4 text-sm mt-12`}>Discover the App</a>
        </div>
      </section>
      <section id="join" className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden">
        <video src={media.join} className="absolute inset-0 w-full h-full object-cover z-0" autoPlay loop muted playsInline aria-hidden="true" />
        <div className="relative z-10 flex flex-col items-center max-w-4xl">
          <p className="text-muted-foreground text-xs sm:text-sm tracking-[0.3em] uppercase mb-4">Starting at $99,000</p>
          <h2 className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2px]">Join the ride</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mt-6 leading-relaxed">Reserve your Velorah today with a fully refundable $500 deposit. Early adopters receive priority delivery and exclusive founding-member benefits.</p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10"><button onClick={() => open('preorder')} className={`${glass} px-10 py-4 text-sm`}>Preorder Now</button><button onClick={() => open('tour')} className="rounded-full px-10 py-4 text-sm text-muted-foreground border border-border hover:text-foreground hover:border-foreground/30 transition-colors">Schedule a Tour</button></div>
        </div>
      </section>
    </main>
    <footer id="reach-us" className="bg-black border-t border-border px-6 md:px-12 py-16 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <h2 className="text-2xl sm:text-3xl leading-tight">Where home<br />meets the road.</h2>
        <div className="flex flex-col items-start gap-3">{[['product','about'],['app','journal'],['company','studio'],['community','reach-us'],['press','reach-us'],['preorder','join']].map(([label,id]) => <a key={label} href={`#${id}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize">{label}</a>)}</div>
        <div><p className="text-sm text-muted-foreground mb-4">Subscribe for the latest<br />Velorah updates.</p><button onClick={() => open('subscribe')} className={`${glass} px-6 py-2.5 text-sm`}>Subscribe</button></div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border text-xs text-muted-foreground"><a href="#home" className="text-foreground text-xl tracking-tight font-serif">Velorah<sup className="text-[8px]">®</sup></a><div className="flex gap-6"><button onClick={() => open('privacy')} className="hover:text-foreground transition-colors">Privacy Policy</button><button onClick={() => open('terms')} className="hover:text-foreground transition-colors">Terms &amp; Conditions</button></div></div>
    </footer>
    <Dialog.Root open={modal !== null} onOpenChange={value => { if (!value) setModal(null); }}><Dialog.Portal><Dialog.Overlay className="dialog-overlay fixed inset-0 z-40" /><Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-48px)] max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl">
      <Dialog.Close aria-label="Close dialog" className="absolute right-4 top-4 text-muted-foreground hover:text-white"><X size={18} /></Dialog.Close>
      <Dialog.Title className="font-serif text-4xl leading-tight pr-4">{modalTitle}</Dialog.Title>
      <Dialog.Description className="text-sm text-muted-foreground leading-relaxed mt-5">{legal ? 'This is a demonstration of the Velorah landing page. No payments are accepted and no personal data is sent to a server. External media and fonts are loaded from their respective providers.' : 'Explore what comes next. This preview saves your interest for this visit only; no reservation, tour, or subscription is submitted.'}</Dialog.Description>
      {!legal && (saved ? <div role="status" className="mt-8 flex gap-3 items-center text-sm"><Check size={20} />Your interest is noted for this visit.</div> : <form className="mt-7" onSubmit={event => { event.preventDefault(); setSaved(true); }}><label htmlFor="email" className="block text-xs text-muted-foreground mb-2">Email address</label><input id="email" required type="email" placeholder="you@example.com" className="w-full rounded-lg border border-border bg-black p-3 text-sm" /><button className={`${glass} px-7 py-3 text-sm mt-5 w-full`} type="submit">{modal === 'tour' ? 'Register tour interest' : modal === 'preorder' ? 'Register preorder interest' : 'Register interest'}</button></form>)}
    </Dialog.Content></Dialog.Portal></Dialog.Root>
  </>;
}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
