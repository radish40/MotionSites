import { BlurIn } from './BlurIn';
import { assets, localAsset } from '../assets';
export default function Hero() {
  return <main className="relative flex flex-1 flex-col items-center justify-between px-6 pb-12 md:px-12 md:pb-16">
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-32 bg-gradient-to-t from-white to-transparent" />
    <div className="relative z-10 mt-[9vh] md:mt-[8vh]">
      <BlurIn><h1 className="max-w-2xl text-center font-helvetica-neue font-medium leading-tight text-[#010828]"><span className="text-4xl tracking-[-0.03em] md:text-6xl lg:text-7xl">Fast payments, your way at </span><span className="bg-gradient-to-r from-[#B56939] via-[#5C3779] to-[#454BBB] bg-clip-text text-4xl tracking-[-0.03em] text-transparent md:text-6xl lg:text-7xl">lightspeed.</span></h1></BlurIn>
    </div>
    <div id="get-app" className="relative z-30 flex scroll-mt-20 flex-col items-center gap-6">
      <p className="text-center font-helvetica-neue text-base text-sintra-gray md:text-lg">Handle finances with ease and power</p>
      <div className="flex items-center justify-center gap-3">
        <a href="https://play.google.com/store/search?q=veloce&c=apps" target="_blank" rel="noreferrer" aria-label="Find veloce on Google Play" className="flex items-center gap-2 rounded-lg border border-sintra-dark px-3 py-2 text-sintra-dark transition-colors hover:bg-gray-50"><img src={assets.google} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = localAsset('google-play.png'); }} alt="" className="h-7 w-6 object-contain" /><span className="flex flex-col font-product-sans"><span className="text-[10px] uppercase leading-tight">GET IT ON</span><span className="text-sm font-bold leading-tight">Google Play</span></span></a>
        <a href="https://www.apple.com/app-store/" target="_blank" rel="noreferrer" aria-label="Visit the App Store" className="flex items-center gap-2 rounded-lg border border-sintra-dark px-3 py-2 text-sintra-dark transition-colors hover:bg-gray-50"><img src={assets.apple} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = localAsset('app-store.png'); }} alt="" className="h-7 w-6 object-contain" /><span className="flex flex-col font-sf-compact"><span className="text-[10px] leading-tight">Download on the</span><span className="text-sm font-medium leading-tight">App Store</span></span></a>
      </div>
    </div>
  </main>;
}
