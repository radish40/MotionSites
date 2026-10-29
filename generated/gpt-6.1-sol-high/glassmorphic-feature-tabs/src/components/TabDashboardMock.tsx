import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';
import { MIcon } from './primitives';
import { covers, playIcon, tabs, videos } from './assets';

const nav = [['Dashboard', 'grid_view'], ['Courses', 'school'], ['Templates', 'dashboard'], ['Tutorials', 'play_circle'], ['Backgrounds', 'auto_awesome'], ['Pricing', 'sell']];
export function TabDashboardMock({ title, activeNav, children }: { title: string; activeNav: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current!;
    const measure = () => setScale(Math.min(el.clientWidth / 900, el.clientHeight / 562));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="relative h-full w-full overflow-hidden flex items-center justify-center">
    <div data-dashboard={title} className="flex flex-shrink-0 overflow-hidden rounded-2xl bg-white/[0.04] backdrop-blur-xl shadow-2xl" style={{ width: 900, height: 562, transform: `scale(${scale})`, transformOrigin: 'center center' }}>
      <aside className="w-[210px] flex-shrink-0 flex flex-col gap-1 p-3">
        <div className="mb-3 flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: 'linear-gradient(135deg, rgb(158,103,250), rgb(254,106,187) 50%, rgb(255,156,101))' }}><MIcon name="rocket_launch" size={14} className="text-white" /></span><span className="text-[13px] font-semibold text-white">UI Rocket</span></div>
          <MIcon name="search" size={14} className="text-white/40" />
        </div>
        <div className="flex flex-col gap-0.5">{nav.map(([label, icon]) => <div key={label} data-active={label === activeNav} className={cn('flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12px] transition-colors', label === activeNav ? 'bg-white/[0.08] text-white' : 'text-white/55 hover:text-white/80')}><MIcon name={icon} size={14} />{label}</div>)}</div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col p-3">
        <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-black/20">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2.5"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-[rgb(59,130,246)] text-white"><MIcon name="add" size={16} /></span><span className="text-base font-semibold text-white">{title}</span></div>
            <div className="flex items-center gap-2.5"><MIcon name="notifications" size={16} className="text-white/60" /><span className="rounded-full bg-[rgb(59,130,246)] px-2.5 py-1 text-[11px] font-medium text-white">Invite</span><span className="h-7 w-7 rounded-full bg-cover bg-center ring-1 ring-white/10" style={{ backgroundImage: 'url(https://i.pravatar.cc/64?img=12)' }} /></div>
          </div>
          <div className="flex-1 overflow-hidden px-4 pb-4">{children}</div>
        </div>
      </div>
    </div>
  </div>;
}

const courseTitles = ['AI Design Foundations', 'Build with AI', 'The Art of Prompting', 'Design Systems, Reimagined', 'From Idea to Interface', 'Ship Your First Project'];
const templateTitles = ['Orbit — SaaS Landing', 'Forma — Portfolio', 'Studio — Creative Agency', 'Canvas — Design System', 'Launch — Startup Kit', 'Aura — Personal Brand'];
const card = 'overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]';
// Keep the exact requested source first; recover with a working supplied cover.
function CoverImage({ source, index, className }: { source: string; index: number; className: string }) {
  const [failed, setFailed] = useState(false);
  return <img src={failed ? covers[index % 2] : source} alt="" className={className} onError={() => setFailed(true)} />;
}
export function CoursesTabContent() {
  return <div className="grid h-full grid-cols-2 grid-rows-3 gap-3">{covers.map((cover, i) => <div key={cover} className={cn(card, 'flex min-h-0 items-center gap-3 p-2')}><CoverImage source={cover} index={i} className="aspect-video w-[46%] rounded-lg object-cover" /><div className="min-w-0"><h3 className="text-[13px] font-medium text-white">{courseTitles[i]}</h3><p className="mt-2 text-[10px] text-white/50">{6 + i * 2} lessons · {24 + i * 7} min</p></div></div>)}</div>;
}
export function TemplatesTabContent() {
  return <div className="grid h-full grid-cols-3 grid-rows-2 gap-3">{covers.map((cover, i) => <div key={cover} className={cn(card, 'flex min-h-0 flex-col')}><div className="flex gap-1 border-b border-white/10 px-2 py-2">{[0, 1, 2].map(dot => <span key={dot} className="h-1 w-1 rounded-full bg-white/25" />)}</div><CoverImage source={cover} index={i} className="min-h-0 flex-1 w-full object-cover" /><div className="p-2.5"><h3 className="text-[13px] font-medium text-white">{templateTitles[i]}</h3><span className="mt-2 inline-block rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">Premium</span></div></div>)}</div>;
}
function BackgroundTile({ source, index }: { source: string; index: number }) {
  const [failed, setFailed] = useState(false);
  return <div className={cn(card, 'relative')}>
    {failed ? <img src={tabs[index % 4].image} alt={`Background ${index + 1} poster`} className="h-full w-full object-cover" /> : <video src={source} poster={tabs[index % 4].image} autoPlay muted loop playsInline onError={() => setFailed(true)} className="h-full w-full object-cover" />}
    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" /><span className="absolute bottom-3 left-3 text-[11px] text-white/80">{['Chromatic Flow', 'Liquid Light', 'Soft Focus', 'Prismatic', 'Aurora', 'Dreamscape'][index]}</span><img src={playIcon} alt="" className="absolute bottom-3 right-3 h-6 w-6" />
  </div>;
}
export function BackgroundsTabContent() {
  return <div className="grid h-full grid-cols-3 grid-rows-2 gap-3">{videos.map((source, i) => <BackgroundTile key={source} source={source} index={i} />)}</div>;
}
export function ExclusiveTutorialTabContent() {
  return <div className="grid h-full grid-cols-[3fr_2fr] gap-3">
    <div className={cn(card, 'flex min-h-0 flex-col')}>
      <div className="relative min-h-0 flex-1"><img src={tabs[0].image} alt="AI design tutorial preview" className="h-full w-full object-cover" /><span className="absolute inset-0 flex items-center justify-center"><img src={playIcon} alt="" className="h-12 w-12 drop-shadow-xl" /></span></div>
      <div className="p-4"><span className="mb-2 inline-block text-[10px] text-white/50">EXCLUSIVE TUTORIAL</span><h3 className="text-[13px] font-medium text-white">Turn your ideas into extraordinary interfaces</h3><p className="mt-2 text-[11px] leading-relaxed text-white/60">Your next great design starts here. Follow along and bring it to life with AI.</p><p className="mt-4 text-[10px] text-white/50">12 min · Pro</p></div>
    </div>
    <div className="flex flex-col gap-3">{['Build your first AI-powered website', 'Create visuals that stand out', 'From prompt to production'].map((title, i) => <div key={title} className={cn(card, 'flex flex-1 items-center gap-3 p-3')}><img src={tabs[i + 1].image} alt="" className="h-10 w-16 flex-shrink-0 rounded-md object-cover" /><div><h3 className="text-[13px] font-medium leading-snug text-white">{title}</h3><p className="mt-2 text-[10px] text-white/50">{8 + i * 3} min · Pro</p></div></div>)}</div>
  </div>;
}
