import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const cn=(...inputs: Parameters<typeof clsx>)=>twMerge(clsx(inputs));
const variants=cva('inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full font-body text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black disabled:opacity-50',{variants:{variant:{glass:'liquid-glass-strong text-white hover:bg-white/10',white:'bg-white text-black hover:bg-neutral-200',ghost:'text-white/85 hover:text-white hover:bg-white/5'},size:{default:'h-12 px-6',sm:'h-10 px-5'}},defaultVariants:{variant:'glass',size:'default'}});
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,VariantProps<typeof variants>{asChild?:boolean}
export const Button=React.forwardRef<HTMLButtonElement,ButtonProps>(({className,variant,size,asChild=false,...props},ref)=>{const Comp=asChild?Slot:'button';return <Comp className={cn(variants({variant,size,className}))} ref={ref} {...props}/>});
Button.displayName='Button';
