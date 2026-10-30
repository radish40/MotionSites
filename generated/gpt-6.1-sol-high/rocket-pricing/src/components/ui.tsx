import { useRef, type ReactNode, type CSSProperties, type AnchorHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function MIcon({ name, size = 20, weight = 400, fill = 0, grade = 0, opticalSize = 24, className }: {
  name: string; size?: number; weight?: number; fill?: number; grade?: number; opticalSize?: number; className?: string;
}) {
  return <span aria-hidden="true" className={cn('material-symbols-outlined select-none leading-none', className)} style={{
    fontSize: size, fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
  }}>{name}</span>;
}

export function FadeUp({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export function SpotlightBorder({ children, className, radius = '2xl', size = 520, intensity = 0.5 }: {
  children: ReactNode; className?: string; radius?: '2xl'; size?: number; intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return <div ref={ref} className={cn('spotlight group/spotlight relative border border-white/10', radius === '2xl' && 'rounded-2xl', className)}
    style={{ '--spot-x': '-9999px', '--spot-y': '-9999px', '--size': `${size}px`, '--intensity': intensity } as CSSProperties}
    onPointerMove={event => {
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
      event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    }} onPointerLeave={() => {
      ref.current?.style.setProperty('--spot-x', '-9999px');
      ref.current?.style.setProperty('--spot-y', '-9999px');
    }}>
    <div aria-hidden="true" className="spotlight-ring" />
    <div aria-hidden="true" className="spotlight-ring spotlight-ring-inner" />
    {children}
  </div>;
}

function AnimatedText({ children }: { children: ReactNode }) {
  return <span className="animated-text"><span>{children}</span><span aria-hidden="true">{children}</span></span>;
}
type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & { size?: 'sm' };
export function PrimaryButton({ children, className, size = 'sm', ...props }: ButtonProps) {
  return <a {...props} className={cn('pricing-button inline-flex items-center justify-center rounded-full bg-white/80 font-inter leading-none text-black transition-colors hover:bg-white', size === 'sm' && 'h-8 px-4 text-sm', className)}><AnimatedText>{children}</AnimatedText></a>;
}
export function SecondaryButton({ children, className, size = 'sm', ...props }: ButtonProps) {
  return <a {...props} className={cn('pricing-button inline-flex items-center justify-center rounded-full border border-landing-border bg-landing-surface font-inter font-medium leading-none text-foreground backdrop-blur-[2.5px] transition-colors hover:bg-landing-surface-hover', size === 'sm' && 'h-8 px-4 text-sm', className)}><AnimatedText>{children}</AnimatedText></a>;
}
