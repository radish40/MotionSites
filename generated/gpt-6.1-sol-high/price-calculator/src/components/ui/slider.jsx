import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Shadcn Slider: Radix's accessible slider primitives with project styling.
const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root ref={ref} className={twMerge(clsx('slider', className))} {...props}>
    <SliderPrimitive.Track className="slider-track">
      <SliderPrimitive.Range className="slider-range" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="slider-thumb" aria-label="Number of pages" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName
export { Slider }
