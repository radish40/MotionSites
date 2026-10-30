import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const cn = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(inputs));
const buttonVariants = cva('inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 disabled:pointer-events-none disabled:opacity-50', {
 variants: { variant: { hero: 'bg-gradient-to-b from-[hsl(24,100%,72%)] to-[hsl(18,98%,53%)] text-primary-foreground hover:opacity-90 rounded-lg text-lg font-medium', 'hero-outline': 'bg-secondary text-secondary-foreground hover:bg-muted rounded-lg text-lg font-medium' }, size: { default: 'h-11 px-6 py-2', xl: 'h-14 px-10 py-4' } }, defaultVariants: { variant: 'hero', size: 'default' }
});
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({className,variant,size,asChild=false,...props},ref) => { const Comp=asChild?Slot:'button'; return <Comp className={cn(buttonVariants({variant,size,className}))} ref={ref} {...props}/>; });
Button.displayName='Button';
