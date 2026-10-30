import { cn } from '@/lib/utils';
import { FadeUp, MIcon, PrimaryButton, SecondaryButton, SpotlightBorder } from './ui';

type Feature = { text: string; included: boolean };
type Plan = {
  name: string; price: string; originalPrice?: string; description: string;
  features: Feature[]; featured?: boolean; badge?: string; bg: string;
};

const plans: Plan[] = [
  {
    name: 'Course', price: '159', originalPrice: '497', description: 'Once. Lifetime. 68% off.', bg: '#161616',
    features: [
      { text: 'All courses and videos', included: true },
      { text: 'All modules. Lifetime access.', included: true },
      { text: 'AI Builder', included: true },
      { text: 'Unlimited Templates', included: false },
      { text: 'Unlimited Motion Videos', included: false },
    ],
  },
  {
    name: 'Course + Lovable Templates', price: '239', originalPrice: '697', description: 'Once. Lifetime. Best deal.', bg: '#252525',
    features: [
      { text: 'All courses and videos', included: true },
      { text: 'All modules. Lifetime access.', included: true },
      { text: 'AI Builder', included: true },
      { text: 'Unlimited Templates', included: true },
      { text: 'Unlimited Motion Videos', included: true },
    ],
    featured: true, badge: 'Best Value',
  },
];

function PricingCard({ plan }: { plan: Plan }) {
  return <SpotlightBorder radius="2xl" size={460} intensity={0.5} className="relative h-full p-2 sm:p-3">
    <div className="relative flex h-full flex-col rounded-2xl border border-white/10 p-7 sm:p-8" style={{ backgroundColor: plan.bg }}>
      {plan.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-white px-3 py-1 text-xs font-medium text-black">{plan.badge}</div>}
      <FadeUp delay={0}><div className="text-[11px] uppercase tracking-[0.2em] text-foreground/60">{plan.name}</div></FadeUp>
      <div className="mt-3 border-t border-white/10" />
      <FadeUp delay={0.1}>
        <div className="mt-10 flex items-baseline gap-2">
          <span className="text-[2.75rem] font-normal leading-none tracking-tight text-foreground">${plan.price}</span>
          {plan.originalPrice && <span className="text-lg text-foreground/40 line-through">${plan.originalPrice}</span>}
        </div>
      </FadeUp>
      <FadeUp delay={0.2}><p className="mt-4 text-sm leading-relaxed text-foreground/60">{plan.description}</p></FadeUp>
      <FadeUp delay={0.3}><div className="mt-7">
        {plan.featured
          ? <PrimaryButton href="/auth?mode=signup" size="sm">Get Started</PrimaryButton>
          : <SecondaryButton href="/auth?mode=signup" size="sm">Get Started</SecondaryButton>}
      </div></FadeUp>
      <FadeUp delay={0.4}>
        <ul className="mt-7 flex flex-1 flex-col gap-2">
          {plan.features.map((f, i) => <li key={f.text} className={cn('flex items-center gap-3 py-4 text-sm', i !== 0 && 'border-t border-white/10', f.included ? 'text-foreground/85' : 'text-foreground/40')}>
            <span className={cn('flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border', f.included ? 'border-white/20 bg-white/[0.06]' : 'border-white/10 bg-transparent')}>
              {f.included ? <MIcon name="check" size={12} className="text-foreground" /> : <MIcon name="close" size={12} className="text-foreground/50" />}
            </span>{f.text}
          </li>)}
        </ul>
      </FadeUp>
    </div>
  </SpotlightBorder>;
}

export function PricingSection() {
  return <section id="pricing" className="relative w-full bg-background py-12 sm:py-16">
    <div className="mx-auto max-w-[1080px] px-4 sm:px-6">
      <div className="mb-14 flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <FadeUp><span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-landing-surface px-3 py-1 text-xs text-foreground/80 backdrop-blur"><span className="h-1.5 w-1.5 rounded-full bg-foreground/70" />Pricing</span></FadeUp>
          <FadeUp delay={0.1}><h2 className="text-3xl font-normal leading-[1.05] tracking-[-0.02em] text-foreground sm:text-4xl">Clear pricing plans<br className="hidden sm:block" /> that scale with you.</h2></FadeUp>
        </div>
        <FadeUp delay={0.2}><p className="max-w-sm text-sm text-foreground/60 sm:text-base">One-time payment. Lifetime access. Pick the plan that fits how far you want to go.</p></FadeUp>
      </div>
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
        {plans.map(plan => <PricingCard key={plan.name} plan={plan} />)}
      </div>
    </div>
  </section>;
}
