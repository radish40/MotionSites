import { useEffect, useRef, useState } from 'react';
import { categories, faqs, type CategoryKey } from '@/lib/faq-data';
import { cn } from '@/lib/utils';
import { FadeUp } from './FadeUp';
import { MIcon } from './MIcon';
import { SpotlightBorder, spotlightMaskStyle } from './SpotlightBorder';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';

export function FaqSection() {
  const [active, setActive] = useState<CategoryKey>('general');
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const move = (event: MouseEvent) => {
      itemRefs.current.forEach(element => {
        if (!element) return;
        const bounds = element.getBoundingClientRect();
        element.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
        element.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
      });
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return <section id="faq" aria-labelledby="faq-title" className="relative w-full bg-background py-12 sm:py-16">
    <div className="mx-auto max-w-[1080px] px-4 sm:px-6">
      <header className="mb-14 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <FadeUp delay={1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-landing-surface px-3 py-1 text-xs text-foreground/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/70" />FAQ
            </div>
          </FadeUp>
          <FadeUp delay={0.1} className="mt-6">
            <h1 id="faq-title" className="text-3xl font-normal leading-[1.05] tracking-[-0.02em] text-foreground sm:text-4xl">
              Answers to the questions<br className="hidden sm:block" /> that come up most.
            </h1>
          </FadeUp>
        </div>
        <FadeUp delay={0.2} className="max-w-sm">
          <p className="text-sm text-foreground/60 sm:text-base">Learn how UI Rocket works, what it covers, how the workflow flows, and what you can expect day to day.</p>
        </FadeUp>
      </header>
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
        <div className="flex flex-col gap-4 lg:h-full">
          <div className="lg:flex-1">
            <SpotlightBorder radius="2xl" size={280} className="flex flex-col p-2 sm:p-3 lg:sticky lg:top-24" aria-label="FAQ categories">
              {categories.map(category => <SpotlightBorder key={category.key} as="button" type="button" radius="full" size={200} intensity={0.4}
                aria-pressed={active === category.key} aria-controls="faq-questions"
                onClick={() => setActive(category.key)}
                className={cn('w-full px-5 py-3 text-center text-sm transition-colors', active === category.key
                  ? 'border border-white/10 bg-landing-surface text-foreground'
                  : 'border border-transparent text-foreground/60 hover:text-foreground')}>
                {category.label}
              </SpotlightBorder>)}
            </SpotlightBorder>
          </div>
          <SpotlightBorder radius="2xl" size={360} className="mt-8 p-2 sm:p-3 lg:mt-0">
            <SpotlightBorder radius="2xl" size={260} intensity={0.4} className="border border-white/10 bg-landing-surface p-6">
              <h3 className="text-lg font-semibold text-foreground">Got Questions?</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/60">Need help with something? Our team is here to make things easy. Don't hesitate to reach out.</p>
              <a href="mailto:hello@uirocket.com" className="mt-6 inline-flex items-center gap-1 text-sm text-foreground hover:text-foreground/80">Email us <span aria-hidden>→</span></a>
            </SpotlightBorder>
          </SpotlightBorder>
        </div>
        <SpotlightBorder radius="2xl" size={360} className="p-2 sm:p-3" id="faq-questions">
          <Accordion key={active} type="single" collapsible className="flex flex-col gap-3">
            {faqs[active].map(({ q, a }, idx) => <FadeUp delay={0.15 * idx} key={`${active}-${idx}`}>
              <AccordionItem value={`${active}-${idx}`} ref={element => { itemRefs.current[idx] = element; }}
                className="relative rounded-2xl border border-white/10 bg-landing-surface px-6 [&[data-state=open]]:bg-landing-surface-hover">
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl" style={spotlightMaskStyle(260, 0.4)} />
                <AccordionTrigger className="py-7 text-left text-sm font-medium text-foreground hover:no-underline sm:text-base [&>svg]:hidden">
                  <span className="flex-1 pr-4">{q}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-foreground/70 transition-transform duration-200 group-data-[state=open]:rotate-180">
                    <MIcon name="expand_more" size={16} />
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-7 text-sm leading-relaxed text-foreground/60">{a}</AccordionContent>
              </AccordionItem>
            </FadeUp>)}
          </Accordion>
        </SpotlightBorder>
      </div>
    </div>
  </section>;
}
