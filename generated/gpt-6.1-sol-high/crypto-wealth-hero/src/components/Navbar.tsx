import { Logo } from './Logo';
export function Navbar() {
  return <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-6">
    <div className="flex items-center gap-4 md:gap-8 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-full pl-4 pr-2.5 md:pl-5 md:pr-2.5 py-2.5 shadow-sm">
      <a href="#home" aria-label="ContentFlow home"><Logo /></a>
      <div className="hidden md:flex items-center gap-7">
        {['Features', 'Workflows', 'Resources', 'Pricing'].map(label => <a key={label} href="#showcase" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-150">{label}</a>)}
      </div>
      <a href="#showcase" className="gradient-border-btn text-sm font-semibold text-gray-900 rounded-full px-5 py-2 hover:bg-gray-50 shadow-sm">Get started</a>
    </div>
  </nav>;
}
