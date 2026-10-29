import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ReactNode, ComponentPropsWithoutRef } from 'react';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export function FadeUp({ children, delay = 0, y = 24, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return <motion.div initial={{ opacity: 0, y: y ?? 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>{children}</motion.div>;
}

export function MIcon({ name, size = 24, fill = 0, weight = 400, grade = 0, opticalSize = 24 }: { name: string; size?: number; fill?: number; weight?: number; grade?: number; opticalSize?: number }) {
  return <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: size, fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}` }}>{name}</span>;
}

export function AnimatedText({ children }: { children: ReactNode }) {
  return <span className="animated-text relative block overflow-hidden"><span className="block">{children}</span><span aria-hidden="true" className="absolute left-0 top-full block w-full">{children}</span></span>;
}

type ButtonProps = { size?: 'sm' | 'md' | 'lg'; children: ReactNode; className?: string } & (
  { as?: 'a' } & ComponentPropsWithoutRef<'a'> |
  { as: 'button' } & ComponentPropsWithoutRef<'button'>
);
export function PrimaryButton({ as = 'a', size = 'lg', children, className, ...props }: ButtonProps) {
  const classes = cn('group inline-flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-black leading-none transition-colors', { 'h-8 px-5 text-xs font-medium': size === 'sm', 'h-10 px-7 text-sm font-medium': size === 'md', 'h-12 px-9 text-sm font-medium': size === 'lg' }, className);
  return as === 'button' ? <button className={classes} {...props as ComponentPropsWithoutRef<'button'>}><AnimatedText>{children}</AnimatedText></button> : <a className={classes} {...props as ComponentPropsWithoutRef<'a'>}><AnimatedText>{children}</AnimatedText></a>;
}
