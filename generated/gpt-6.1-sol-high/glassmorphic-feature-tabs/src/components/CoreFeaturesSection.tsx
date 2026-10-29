import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '../lib/utils';
import { tabs } from './assets';
import { FadeUp, MIcon, SpotlightBorder } from './primitives';
import { BackgroundsTabContent, CoursesTabContent, ExclusiveTutorialTabContent, TabDashboardMock, TemplatesTabContent } from './TabDashboardMock';

const panels = [ExclusiveTutorialTabContent, CoursesTabContent, TemplatesTabContent, BackgroundsTabContent];
export function CoreFeaturesSection() {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const interval = window.setInterval(() => { if (!pausedRef.current) setActive(a => (a + 1) % tabs.length); }, 5000);
    return () => window.clearInterval(interval);
  }, []);
  const select = (index: number) => { pausedRef.current = true; setActive(index); };
  const go = (direction: number) => { pausedRef.current = true; setActive(a => (a + direction + tabs.length) % tabs.length); };
  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault(); select(next); document.getElementById(`feature-tab-${next}`)?.focus();
  };
  return <section aria-labelledby="features-heading" className="relative w-full bg-background py-12 sm:py-16">
    <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
      <div className="mb-14 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <FadeUp delay={0}><div className="inline-flex items-center gap-2 rounded-full bg-landing-surface border border-white/10 px-3 py-1 text-xs text-foreground/80 backdrop-blur"><span className="h-1.5 w-1.5 rounded-full bg-foreground/70" />Core Features</div></FadeUp>
          <FadeUp delay={0.1} className="mt-5"><h1 id="features-heading" className="text-3xl sm:text-4xl font-normal tracking-[-0.02em] leading-[1.05] text-foreground">One platform to run your<br className="hidden sm:block" /><span className="text-foreground/55"> entire AI design journey.</span></h1></FadeUp>
        </div>
        <FadeUp delay={0.2} className="max-w-sm md:pt-2"><p className="text-sm sm:text-base leading-relaxed text-foreground/65">UI Rocket brings your lessons, templates, tools, and community into one space — so you stop switching between tabs and start shipping real AI-powered work.</p></FadeUp>
      </div>
      <SpotlightBorder radius="full" size={360} intensity={0.5} className="mx-auto mb-6 hidden w-full p-1 sm:block">
        <div role="tablist" aria-label="Core features" className="grid grid-cols-2 sm:grid-cols-4 gap-1 rounded-full p-1">{tabs.map((tab, i) => <button key={tab.label} id={`feature-tab-${i}`} role="tab" aria-selected={active === i} aria-controls={`feature-panel-${i}`} tabIndex={active === i ? 0 : -1} onKeyDown={event => handleKey(event, i)} onClick={() => select(i)} className={cn('rounded-full px-4 py-2.5 text-sm transition-colors duration-300', active === i ? 'bg-white/[0.06] text-foreground border border-white/15' : 'text-foreground/55 hover:text-foreground/80 border border-transparent')}>{tab.label}</button>)}</div>
      </SpotlightBorder>
      <SpotlightBorder radius="2xl" size={600} intensity={0.5} className="relative mx-auto w-full p-2 sm:p-3">
        <div className="relative overflow-hidden rounded-2xl border border-white/10" style={{ backgroundColor: '#0e0e0e' }}>
          <div className="relative aspect-[16/10] w-full">
            {tabs.map((tab, i) => <img key={tab.label} src={tab.image} alt="" aria-hidden="true" loading="eager" decoding="async" className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-400', active === i ? 'opacity-100' : 'opacity-0')} />)}
            {tabs.map((tab, i) => { const Panel = panels[i]; return <div key={tab.label} id={`feature-panel-${i}`} role="tabpanel" aria-label={tab.label} aria-hidden={active !== i} className={cn('absolute inset-1 flex items-center justify-center p-[3%] sm:p-[4%] transition-opacity duration-300', active === i ? 'opacity-100' : 'opacity-0 pointer-events-none')}><TabDashboardMock title={tab.title} activeNav={tab.activeNav}><Panel /></TabDashboardMock></div>; })}
          </div>
        </div>
      </SpotlightBorder>
      <SpotlightBorder radius="full" size={360} intensity={0.5} className="mx-auto mt-6 w-full p-1">
        <div className="flex items-center justify-between gap-4 rounded-full px-3 py-2">
          <button type="button" aria-label="Previous feature" onClick={() => go(-1)} className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-foreground/80 transition-colors hover:bg-white/[0.08] hover:text-foreground"><MIcon name="arrow_back" size={16} /></button>
          <div aria-live="polite" aria-atomic="true" className="min-h-[1.5rem] flex-1 overflow-hidden text-center"><AnimatePresence mode="wait"><motion.p key={tabs[active].label} initial={{ opacity: 0, y: reduced ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -6 }} transition={{ duration: 0.25 }} className="px-2 text-sm text-foreground/75"><span className="sm:hidden font-medium text-foreground">{tabs[active].label}</span><span className="hidden sm:inline">{tabs[active].caption}</span></motion.p></AnimatePresence></div>
          <button type="button" aria-label="Next feature" onClick={() => go(1)} className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-foreground/80 transition-colors hover:bg-white/[0.08] hover:text-foreground"><MIcon name="arrow_forward" size={16} /></button>
        </div>
      </SpotlightBorder>
    </div>
  </section>;
}
