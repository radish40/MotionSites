import { Button } from './ui/button'
const links = ['Services', 'About Us', 'Projects', 'Team', 'Contacts']
export function Navbar() {
  return (
    <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16 py-5">
      <a href="#" aria-label="Sentinel home" className="text-foreground text-xl font-semibold tracking-tight">SENTINEL</a>
      <div className="hidden md:flex gap-8">
        {links.map(link => <a key={link} href={`#${link.toLowerCase().replaceAll(' ', '-')}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">{link}</a>)}
      </div>
      <Button variant="navCta" size="lg" className="hidden md:inline-flex rounded-lg uppercase text-xs tracking-widest px-6">Get Quote</Button>
    </nav>
  )
}
