import { useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { TrendingUp, Play, Star, ArrowUpRight, Clock3, Video, X, Check } from 'lucide-react';

export const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100',
];
export interface CallItem { name: string; avatar: string; time: string; duration: string }
export interface ClientCall { id: number; day: string; date: string; items: CallItem[] }
export const CLIENT_CALLS: ClientCall[] = [
  { id: 1, day: 'MON', date: '18 JUL', items: [ { name: 'Sophie Moore', avatar: AVATARS[0], time: '9:30 AM - 10:30 AM', duration: '1hr' }, { name: 'James Wilson', avatar: AVATARS[1], time: '11:00 AM - 12:00 PM', duration: '1hr' } ] },
  { id: 2, day: 'TUE', date: '19 JUL', items: [ { name: 'Emma Thompson', avatar: AVATARS[2], time: '10:00 AM - 11:00 AM', duration: '1hr' } ] },
  { id: 3, day: 'THU', date: '25 JUL', items: [ { name: 'Alex Johnson', avatar: AVATARS[3], time: '9:30 AM - 10:30 AM', duration: '1hr' }, { name: 'Sophie Moore', avatar: AVATARS[0], time: '1:00 PM - 2:00 PM', duration: '1hr' } ] },
  { id: 4, day: 'MON', date: '25 JUL', items: [ { name: 'James Wilson', avatar: AVATARS[1], time: '11:00 AM - 12:00 PM', duration: '1hr' } ] },
  { id: 5, day: 'WED', date: '20 JUL', items: [ { name: 'Emma Thompson', avatar: AVATARS[2], time: '9:30 AM - 10:30 AM', duration: '1hr' } ] },
];
const avatarSource = (avatar: string) => `${import.meta.env.BASE_URL}assets/avatar-${AVATARS.indexOf(avatar) + 1}.jpg`;

export function DeepShadowIcon({ children }: { children: ReactNode }) {
  return <span className="relative inline-flex align-middle -rotate-6 mx-2 sm:mx-3"><span className="absolute inset-0 opacity-60 bg-[#F25C40] blur-[18px] scale-90 translate-y-1.5 rounded-2xl"/><span className="relative inline-flex p-2 rounded-2xl bg-[#F25C40] shadow-[0px_0px_5px_rgba(255,255,255,0.5)_inset,0px_8px_20px_rgba(242,92,64,0.35)]">{children}</span></span>;
}
export function DeepShadowButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <div className="relative group inline-flex"><div className="absolute inset-0 opacity-40 bg-[#212121] blur-[25px] rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:translate-y-1"/><button onClick={onClick} className="primary-button relative flex items-center justify-center gap-5 rounded-xl bg-[#202020] px-6 py-4 text-sm font-medium text-white shadow-[0px_0px_4px_rgba(255,255,255,0.25)_inset,0px_6px_19px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0">{children}</button></div>;
}
export function DeepShadowAvatar({ src, hasGlow = false, size = 'md', name }: { src: string; hasGlow?: boolean; size?: 'sm' | 'md' | 'lg'; name: string }) {
  const sizes = { sm: 'size-9', md: 'size-11', lg: 'size-[52px]' };
  return <div className={`relative ${sizes[size]}`}><div className={`absolute inset-1 translate-y-2 rounded-full ${hasGlow ? 'bg-[#F25C40] opacity-60 blur-[18px]' : 'bg-black blur-[12px] opacity-20'}`}/><img className="relative size-full rounded-full object-cover border-[3px] border-[#F7F7F7]" src={avatarSource(src)} alt={name}/></div>;
}
export function AvatarWithShadow({ src, name }: { src: string; name: string }) {
  return <div className="relative shrink-0 size-11"><div className="absolute inset-1 top-4 translate-y-1 bg-black opacity-25 blur-[10px] rounded-full"/><img src={avatarSource(src)} alt={name} className="relative size-full rounded-full object-cover border-2 border-white"/></div>;
}
export function ClientCard({ call, index }: { call: ClientCall; index: number }) {
  const reduced = useReducedMotion();
  return <motion.div initial={reduced ? false : { opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: Math.min(index, 4) * 0.09 }} className={`client-card bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${index % 2 === 0 ? 'rotate-3' : '-rotate-3'}`}>
    <div className="flex justify-between items-center border-b border-[#eeeeee] pb-4 mb-1"><span className="text-[11px] font-semibold tracking-[0.15em] text-neutral-400">{call.day}</span><span className="text-[11px] font-medium tracking-[0.08em] text-neutral-500">{call.date}</span></div>
    {call.items.map((item, i) => <div key={i} className="call-item border-b border-dotted border-neutral-200 last:border-0 py-[14px] last:pb-0"><div className="flex gap-3 items-center"><AvatarWithShadow src={item.avatar} name={item.name}/><div><p className="text-[13px] font-semibold tracking-tight">{item.name}</p><p className="text-[11px] text-neutral-400 mt-1">Growth consultation</p></div><span className="ml-auto flex size-7 items-center justify-center rounded-full bg-[#f7f7f7] text-neutral-400"><Video size={13} strokeWidth={1.6}/></span></div><div className="flex items-center justify-between mt-4 text-[10px] text-neutral-500"><span className="flex items-center gap-1.5"><Clock3 size={11}/>{item.time}</span><span className="bg-[#f5f5f5] rounded px-2 py-1 text-neutral-400">{item.duration}</span></div></div>)}
  </motion.div>;
}
function ClientMarquee() {
  const reduced = useReducedMotion();
  const cards = [...CLIENT_CALLS, ...CLIENT_CALLS, ...CLIENT_CALLS];
  const cycles = [cards.slice(0, 5), cards.slice(5, 10), cards.slice(10, 15)];
  return <div className="marquee relative overflow-hidden h-[600px] lg:h-full" aria-label="Sample client consultation agenda"><div className="absolute inset-x-0 top-0 h-20 sm:h-40 bg-gradient-to-b from-[#F7F7F7] to-transparent z-10 pointer-events-none"/><div className="absolute inset-x-0 bottom-0 h-20 sm:h-40 bg-gradient-to-t from-[#F7F7F7] to-transparent z-10 pointer-events-none"/><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-7 h-full"><motion.div className="marquee-track" animate={reduced ? undefined : { y: [0, -1200] }} transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}>{cycles.map((cycle, c) => <div className="marquee-cycle" key={c} aria-hidden={c > 0 ? true : undefined}>{cycle.map((call, i) => <ClientCard key={call.id} call={call} index={i}/>)}</div>)}</motion.div><motion.div aria-hidden="true" className="marquee-track tablet-track hidden md:flex lg:hidden" animate={reduced ? undefined : { y: [-600, -1800] }} transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}>{cycles.map((cycle, c) => <div className="marquee-cycle" key={c}>{cycle.map((call, i) => <ClientCard key={call.id} call={call} index={i + 1}/>)}</div>)}</motion.div></div></div>;
}
export default function App() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [panel, setPanel] = useState<'growth' | 'intro'>('intro');
  function openPanel(type: 'growth' | 'intro') { setPanel(type); dialog.current?.showModal(); }
  return <>
    <main className="hero grid max-w-[1440px] lg:grid-cols-[1.2fr_0.8fr] gap-12 mx-auto">
      <section className="value-prop self-center relative z-20">
        <div className="inline-flex items-center gap-2.5 border border-[#D1F2D1] bg-[#f1f9ee] rounded-full px-3.5 py-2"><span className="size-1.5 rounded-full bg-[#52D352] animate-pulse shadow-[0_0_8px_rgba(82,211,82,0.6)]"/><span className="text-[9px] sm:text-[10px] font-medium tracking-[0.13em] text-[#52D352]">BOOKING FOR SUMMER</span></div>
        <h1 className="font-heading text-[#202020] tracking-[-0.02em] mt-8">Expanding<DeepShadowIcon><TrendingUp className="trend-icon text-white" strokeWidth={1.7}/></DeepShadowIcon>reach<br/>with every lead</h1>
        <p className="subheadline text-neutral-500 mt-6 leading-[1.8]">Automating lead systems and funnels, we design scalable growth engines for your next venture.</p>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8"><DeepShadowButton onClick={() => openPanel('growth')}>Scale revenue now <ArrowUpRight size={17} strokeWidth={1.7}/></DeepShadowButton><button onClick={() => openPanel('intro')} className="flex items-center gap-2.5 bg-white border border-[#e6e6e6] text-neutral-500 rounded-xl px-5 py-4 text-sm transition-colors hover:bg-neutral-100"><Play size={15} strokeWidth={1.6}/>Start Here</button></div>
        <div className="social-proof flex items-center gap-7 sm:gap-9 mt-[70px]"><div><p className="proof-label">VERIFIED CLIENTS</p><div className="flex items-center -space-x-2.5 mt-3">{AVATARS.map((src, i) => <DeepShadowAvatar key={src} src={src} hasGlow={i === 1} size={i % 2 ? 'lg' : 'md'} name={['Sophie Moore', 'James Wilson', 'Emma Thompson', 'Alex Johnson'][i]}/>)}</div></div><div className="w-px h-14 bg-neutral-200"/><div><p className="proof-label">TOP TIER QUALITY 5/5</p><div className="flex gap-1 mt-5 pb-2" role="img" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={19} strokeWidth={1} className="text-[#FFB648] fill-[#FFB648]"/>)}</div></div></div>
      </section>
      <ClientMarquee/>
    </main>
    <dialog ref={dialog} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }} className="intro-dialog"><button className="dialog-close" aria-label="Close" onClick={() => dialog.current?.close()}><X size={20}/></button><div className="mb-7"><DeepShadowIcon><TrendingUp size={28} className="text-white"/></DeepShadowIcon></div><p className="proof-label mb-3">{panel === 'intro' ? 'YOUR NEXT CHAPTER' : 'LET’S GROW'}</p><h2 className="font-heading text-4xl tracking-tight">{panel === 'intro' ? 'More leads. More possibility.' : 'A little space for big growth.'}</h2><p className="text-neutral-500 text-sm leading-7 mt-5">{panel === 'intro' ? 'We connect the dots between your next customer and your business. From automated lead systems to conversion-focused funnels, every step is designed to help you grow.' : 'Your growth starts with a conversation. A consultation brings your goals, your audience, and your next opportunity into focus.'}</p><div className="flex items-start gap-2 mt-6 text-xs text-neutral-500"><Check size={16} className="text-[#52b74c] shrink-0"/><p>This is the BookedUp design preview. Consultation booking is not connected.</p></div><button className="mt-7 rounded-xl bg-[#202020] text-white px-5 py-3 text-sm" onClick={() => dialog.current?.close()}>Back to BookedUp</button><p className="mt-5 text-[10px] text-neutral-400">Typography by <a href="https://www.onlinewebfonts.com/fonts" target="_blank" rel="noreferrer" className="underline underline-offset-2">Web Fonts</a></p></dialog>
  </>;
}
