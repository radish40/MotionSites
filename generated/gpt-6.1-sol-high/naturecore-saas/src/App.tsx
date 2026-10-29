import { ArrowRight, Globe, Leaf, Play } from 'lucide-react';
import { FadeDown, StaggeredFade } from './components/Animation';
import { BoomerangVideoBg } from './components/BoomerangVideoBg';

export default function App() {
  return <div className="h-screen flex flex-col bg-[#F7F7F7] relative overflow-hidden">
    <div className="fixed inset-0 z-0" style={{ top: 200 }}><BoomerangVideoBg /></div>
    <nav aria-label="Main navigation" className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 relative z-10">
      <div className="flex items-center gap-4 md:gap-8">
        <a href="#home" aria-label="LGPSM home"><img src={`${import.meta.env.BASE_URL}image.png`} alt="LGPSM" className="h-6 md:h-7" /></a>
        <span className="flex items-center gap-1.5 text-sm text-black"><Globe className="w-4 h-4" aria-hidden="true" />En</span>
      </div>
      <div className="hidden lg:flex items-center gap-8">
        {['Renewables', 'Strategies', 'Photovoltaic', 'Wind Systems', 'Packages'].map(label => <a key={label} href="#home" className="text-sm text-gray-700 hover:text-gray-900">{label}</a>)}
      </div>
      <div className="flex items-center gap-3">
        <a href="#home" className="hidden sm:block text-sm text-gray-700 hover:text-gray-900 border border-black/20 px-4 md:px-6 py-2 md:py-2.5 rounded-full transition-colors">Sign In</a>
        <a href="#home" className="px-4 md:px-6 py-2 md:py-2.5 bg-black text-white text-sm rounded-full hover:bg-gray-900 transition-colors">Clean Energy</a>
      </div>
    </nav>
    <main id="home" className="flex-1 flex flex-col items-center px-4 md:px-8 relative pt-4 md:pt-8">
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-3 px-3 md:px-4 py-1.5 md:py-2 border border-black/20 rounded-full flex items-center gap-1.5 md:gap-2 text-xs md:text-sm">
          <span className="emoji">☀️</span><ArrowRight className="w-3 h-3" aria-hidden="true" /><span className="emoji">🌎</span><span className="hidden sm:inline">Delivering power innovate</span><span className="sm:hidden">Power innovate</span><ArrowRight className="w-3 h-3" aria-hidden="true" /><span className="emoji">🌱</span>
        </div>
        <StaggeredFade text="Renewable Power For Tomorrow, Infinite Clean Solutions" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight md:leading-tight font-normal text-center max-w-5xl mb-3 md:mb-4 px-4" style={{ color: '#31463B' }} />
        <FadeDown delay={0.5}><p className="text-center text-gray-600 max-w-3xl mb-4 md:mb-5 text-sm md:text-base lg:text-lg px-4">Sustainable Energy Platform. Engineering, deploying, and servicing solar arrays for homes, businesses, and large-scale operations worldwide.</p></FadeDown>
        <FadeDown delay={0.7} className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 px-4">
          <button type="button" className="pl-4 md:pl-6 pr-2 py-2 bg-gradient-to-r from-[#3C684D] to-[#4A7144] text-white rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity text-sm md:text-base"><Leaf className="w-4 h-4" aria-hidden="true" />Explore Options<span className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(59deg, #567A5E 0%, #78A873 100%)' }}><Play className="w-3 h-3 md:w-4 md:h-4 fill-white text-white" aria-hidden="true" /></span></button>
          <button type="button" className="pl-4 md:pl-6 pr-2 py-2 bg-white text-gray-700 rounded-full flex items-center gap-2 hover:bg-gray-50 transition-colors text-sm md:text-base">Start Network<span className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(59deg, #EEEEEE 0%, #CBCBCB 100%)' }}><ArrowRight className="w-3 h-3 md:w-4 md:h-4 fill-black text-black" aria-hidden="true" /></span></button>
        </FadeDown>
      </div>
    </main>
  </div>;
}
