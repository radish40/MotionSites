import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
// shadcn Sheet, composed on the Radix Dialog accessibility primitives.
export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;
export const SheetTitle = Dialog.Title;
export const SheetDescription = Dialog.Description;
export const SheetContent = React.forwardRef<React.ElementRef<typeof Dialog.Content>, React.ComponentPropsWithoutRef<typeof Dialog.Content>>(({ children, className = '', ...props }, ref) => (
  <Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"/><Dialog.Content ref={ref} className={`sheet-panel fixed inset-y-0 right-0 z-[70] w-[min(85vw,360px)] border-l border-white/10 bg-[#100b18]/95 p-7 text-white shadow-2xl font-inter ${className}`} {...props}>{children}<Dialog.Close className="absolute right-6 top-6 rounded-sm text-white/70 hover:text-white" aria-label="Close menu"><X size={22}/></Dialog.Close></Dialog.Content></Dialog.Portal>
));
SheetContent.displayName = 'SheetContent';
