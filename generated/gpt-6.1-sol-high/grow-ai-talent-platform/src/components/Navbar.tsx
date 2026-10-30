import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import logo from '../assets/logo.png';
export function Navbar() {
  return <>
    <nav aria-label="Main navigation" className="flex flex-wrap items-center justify-between gap-y-5 px-5 py-5 sm:px-8">
      <a href={import.meta.env.BASE_URL} aria-label="Grow home" className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><img src={logo} alt="Grow" className="h-8 w-8" /></a>
      <div className="order-3 flex w-full items-center justify-center gap-1 sm:order-none sm:w-auto">
        {['Features', 'Solutions', 'Plans', 'Learning'].map(label => <button key={label} type="button" className="flex items-center gap-1 rounded-md px-2 py-2 text-sm text-foreground/90 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4 sm:text-base">{label}{(label === 'Features' || label === 'Learning') && <ChevronDown className="h-4 w-4" strokeWidth={1.5} />}</button>)}
      </div>
      <Button variant="heroSecondary" size="sm" className="rounded-full px-4 py-2">Sign Up</Button>
    </nav>
    <div className="mt-[3px] h-px w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
  </>;
}
