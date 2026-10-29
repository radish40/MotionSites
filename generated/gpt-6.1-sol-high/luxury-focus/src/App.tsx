import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowUpRight, Minus, Plus, ShoppingBag, User } from 'lucide-react';

const assets = {
  first: 'https://res.cloudinary.com/dbfd996z4/video/upload/q_auto/f_auto/v1781009724/11111111_gvewuj.mp4',
  second: 'https://res.cloudinary.com/dbfd996z4/video/upload/q_auto/f_auto/v1781009724/2222222_x4qpet.mp4',
  hero: 'https://res.cloudinary.com/dbfd996z4/image/upload/q_auto/f_auto/v1781009782/rng_awymkj.png',
  earrings: 'https://res.cloudinary.com/dbfd996z4/image/upload/q_auto/f_auto/v1781017114/202606091756_msbh8b.jpg',
  ring: 'https://res.cloudinary.com/dbfd996z4/image/upload/q_auto/f_auto/v1781019866/2606091843_kfonxp.jpg',
};

export default function App() {
  const [progress, setProgress] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const secondVideoRef = useRef<HTMLVideoElement>(null);
  const targetScrollFractionRef = useRef(0);
  const currentScrollFractionRef = useRef(0);
  const targetVideoRatioRef = useRef(0);
  const currentVideoTimeRef = useRef(0);
  const targetVideoSecondRatioRef = useRef(0);
  const currentVideoSecondTimeRef = useRef(0);
  const targetFrameRef = useRef(1);
  const currentFrameRef = useRef(1);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const totalFrames = 480;
  const isSecondCard = progress >= 0.90;
  const sheetOpen = (progress >= 0.40 && progress < 0.50) || isSecondCard;
  const product = isSecondCard ? {
    category: 'Atelier Core Edition', title: 'Sterling Silver Sculpture Ring', price: 1350, image: assets.ring,
    description: 'A study in fluid form. Sculptural sterling silver wraps the hand in an organic silhouette, polished by light and shaped for a lifetime.'
  } : {
    category: 'Aura Fine Earrings', title: '18K White Gold & Pink Sapphire', price: 1850, image: assets.earrings,
    description: 'Delicate drop-stud earrings in 18K white gold. Luminous pink sapphires meet a precise diamond setting, catching the light with every movement.'
  };
  const scrollToFraction = (fraction: number) => window.scrollTo({ top: (document.documentElement.scrollHeight - window.innerHeight) * fraction, behavior: 'smooth' });

  useEffect(() => {
    setQuantity(1);
    if (statusRef.current) statusRef.current.textContent = '';
    if (addButtonRef.current) addButtonRef.current.textContent = 'ADD TO ATELIER BAG';
  }, [product.title]);

  useEffect(() => {
    let animationId = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      targetScrollFractionRef.current = Math.min(1, Math.max(0, max ? window.scrollY / max : 0));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    const timer = window.setTimeout(onScroll, 500);
    const scrub = (video: HTMLVideoElement | null, ratio: number, current: {current:number}) => {
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0 || video.seeking) return;
      const target = ratio * Math.max(0, video.duration - 0.035);
      current.current += (target - current.current) * 0.08;
      if (Math.abs(video.currentTime - current.current) > 0.008) video.currentTime = current.current;
    };
    const smoothUpdate = () => {
      const diff = targetScrollFractionRef.current - currentScrollFractionRef.current;
      currentScrollFractionRef.current = Math.abs(diff) < 0.00001 ? targetScrollFractionRef.current : currentScrollFractionRef.current + diff * 0.05;
      const p = currentScrollFractionRef.current;
      setProgress(p);
      if (p <= 0.40) {
        const ratio = p / 0.40;
        targetVideoRatioRef.current = ratio;
        targetVideoSecondRatioRef.current = 0;
        targetFrameRef.current = 1 + ratio * 239;
      } else if (p <= 0.50) {
        targetVideoRatioRef.current = 1;
        targetVideoSecondRatioRef.current = 0;
        targetFrameRef.current = 240;
      } else if (p <= 0.90) {
        const ratio = (p - 0.50) / 0.40;
        targetVideoRatioRef.current = 1;
        targetVideoSecondRatioRef.current = ratio;
        targetFrameRef.current = 241 + ratio * 239;
      } else {
        targetVideoRatioRef.current = 1;
        targetVideoSecondRatioRef.current = 1;
        targetFrameRef.current = totalFrames;
      }
      scrub(videoRef.current, targetVideoRatioRef.current, currentVideoTimeRef);
      scrub(secondVideoRef.current, targetVideoSecondRatioRef.current, currentVideoSecondTimeRef);
      currentFrameRef.current = Math.min(totalFrames, Math.max(1, currentFrameRef.current + (targetFrameRef.current - currentFrameRef.current) * 0.08));
      animationId = requestAnimationFrame(smoothUpdate);
    };
    animationId = requestAnimationFrame(smoothUpdate);
    return () => { cancelAnimationFrame(animationId); clearTimeout(timer); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  const getStaggerStyle = (start: number, end: number): CSSProperties => {
    const ratio = Math.max(0, Math.min(1, (progress - start) / (end - start)));
    return { opacity: 1 - ratio, transform: `translateY(${-75 * ratio}px)`, filter: `blur(${ratio * 16}px)`, willChange: 'transform, opacity, filter', transition: 'opacity .35s cubic-bezier(0.16,1,0.3,1), transform .35s cubic-bezier(0.16,1,0.3,1), filter .35s cubic-bezier(0.16,1,0.3,1)', pointerEvents: ratio > 0.85 ? 'none' : undefined };
  };

  return <div className="h-[650vh] bg-[#020202] overflow-x-hidden antialiased font-sans text-white">
    <style>{`
      @keyframes scrollLine {0%{transform:scaleY(0);transform-origin:top}45%{transform:scaleY(1);transform-origin:top}55%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
      ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#020202}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:8px}::-webkit-scrollbar-thumb:hover{background:rgba(251,255,141,.4)}
      @media(max-height:780px) and (min-width:1024px){#sculpted-title{margin-bottom:22px}#product-image-card{padding:6px;max-height:240px}}
      @media(max-width:639px){#sculpted-title{font-size:clamp(2.5rem,10.8vw,4.2rem)!important}.hero-product{display:grid;grid-template-columns:1fr 112px;column-gap:12px;max-width:none;width:100%;align-items:center}.hero-product-caption{grid-column:1;grid-row:1}.hero-product #product-image-card{grid-column:2;grid-row:1/3;height:125px}.hero-product .hero-price{grid-column:1;grid-row:2;text-align:left;margin-top:10px}.manifesto{font-size:9px;line-height:1.6}.editorial-main{gap:26px}.product-sheet{padding:26px 24px}.product-sheet h2{font-size:34px}.sheet-image{max-height:38svh}.sheet-footer{flex-wrap:wrap;margin-left:-24px;margin-right:-24px;padding-left:24px;padding-right:24px}.sheet-footer .add-button{width:100%;order:3}.sheet-footer .sheet-price{margin-left:auto}}
    `}</style>
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <video ref={videoRef} src={assets.first} muted playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out" style={{opacity:progress < 0.48 ? 0.85 : 0}} />
      <video ref={secondVideoRef} src={assets.second} muted playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out" style={{opacity:progress >= 0.48 ? 0.85 : 0}} />
      <canvas className="hidden" />
      <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-black/85 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-56 bg-gradient-to-t from-black/90 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-black/40 to-transparent hidden lg:block" />
    </div>
    <div role="progressbar" aria-label="Journey progress" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100} className="fixed top-0 left-0 h-[2.5px] bg-[#FBFF8D] z-50 transition-all duration-75 pointer-events-none" style={{width:`${progress * 100}%`}} />
    <div className="fixed inset-0 z-10 flex flex-col justify-between p-6 md:p-10 lg:p-12" style={{pointerEvents: progress > .45 ? 'none' : undefined, visibility:progress >= .45 ? 'hidden' : 'visible'}}>
      <header className="flex justify-between items-start gap-5">
        <div className="flex flex-col gap-5 sm:gap-10">
          <a href="#" aria-label="Sculpted by Time — home" className="block w-12 h-12" style={getStaggerStyle(0,.12)} onClick={e=>{e.preventDefault();scrollToFraction(0)}}>
            <svg viewBox="0 0 48 48" width="48" height="48" fill="currentColor" aria-hidden="true">
              <path d="M24 24C14 16 15 1 24 1s10 15 0 23Z"/><path d="M24 24C29 12 44 9 47 18s-10 15-23 6Z"/><path d="M24 24c13 1 21 14 14 20s-16-5-14-20Z"/><path d="M24 24c2 15-7 26-14 20S11 25 24 24Z"/><path d="M24 24C11 33-2 27 1 18S19 12 24 24Z"/>
            </svg>
          </a>
          <div className="max-w-[260px]" style={getStaggerStyle(.06,.18)}>
            <h3 className="text-[12px] md:text-[13px] font-semibold tracking-[-.03em] leading-[1.5]">Contemporary Luxury For The /<br/>Discerning Minimalist</h3>
            <p className="mt-3 text-[10px] sm:text-[11px] leading-[1.8] text-white/50 max-w-[260px]">Exclusive creations tailored for true aesthetes. We forge more than simple ornaments; we build tactile artifacts of your personal legacy.</p>
          </div>
        </div>
        <nav aria-label="Main navigation" className="flex flex-wrap justify-end items-center gap-x-4 gap-y-5 md:gap-8 text-[10px] md:text-[13px] text-white/70 max-w-[150px] sm:max-w-none pt-3" style={getStaggerStyle(.03,.15)}>
          {(['Collections','Atelier','Our story','Contact'] as const).map((label,index)=><a key={label} href={['#collections','#atelier','#story','mailto:atelier@sculptedbytime.com'][index]} onClick={index < 3 ? e=>{e.preventDefault();scrollToFraction([.44,.94,.22][index])}:undefined} className="relative transition-all hover:text-white hover:scale-105 after:absolute after:bottom-[-5px] after:left-0 after:h-px after:w-0 after:bg-[#FBFF8D] after:transition-all hover:after:w-full">{label}</a>)}
          <span className="h-4 w-px bg-white/25" aria-hidden="true" />
          <a href="#atelier" onClick={e=>{e.preventDefault();scrollToFraction(.94)}} aria-label="Your atelier" className="hover:text-[#FBFF8D] transition-colors"><User size={17} strokeWidth={1.4}/></a>
          <button onClick={()=>scrollToFraction(1)} aria-label="Open atelier bag" className="relative hover:text-[#FBFF8D] transition-colors"><ShoppingBag size={18} strokeWidth={1.4}/><span className="absolute -right-1 -top-1 h-[6.5px] w-[6.5px] rounded-full bg-[#FBFF8D] animate-pulse"/></button>
        </nav>
      </header>
      <main className="editorial-main grid grid-cols-1 lg:grid-cols-12 items-end gap-7 lg:gap-10">
        <div className="lg:col-span-7">
          <h1 id="sculpted-title" className="font-serif text-[#FBFF8D] uppercase leading-[.88] tracking-[-.025em] mb-7 md:mb-10" style={{fontSize:'clamp(2.5rem, 5.6vw, 7.5rem)'}}>
            <div style={getStaggerStyle(.09,.20)} className="italic pl-[.8em]">Sculpted</div>
            <div style={getStaggerStyle(.12,.23)}>By time. Worn</div>
            <div style={getStaggerStyle(.15,.26)}>By <em>You</em></div>
          </h1>
          <div className="flex gap-5 md:gap-10 manifesto text-[11px] leading-[1.8] text-white/50">
            <p className="max-w-[260px]" style={getStaggerStyle(.18,.29)}>We craft modern jewelry that speaks volumes through silence. Stripped of excess, each form is an exploration of balance, texture, and the beauty of restraint.</p>
            <p className="max-w-[260px]" style={getStaggerStyle(.21,.32)}>Every piece acts as a personal manifesto. A quiet rebellion against the ordinary, designed to become an inseparable part of who you are.</p>
          </div>
          <div className="flex items-center gap-3 mt-7 text-[8px] tracking-[.2em] uppercase text-white/40" style={getStaggerStyle(0,.08)}><span className="h-6 w-px bg-[#FBFF8D]/60 origin-top" style={{animation:'scrollLine 2.5s ease-in-out infinite'}}/>Scroll to discover</div>
        </div>
        <div className="hero-product lg:col-span-5 lg:justify-self-end w-full max-w-[240px] group">
          <div className="hero-product-caption" style={getStaggerStyle(.14,.25)}>
            <p className="text-[10px] tracking-[.03em] text-white/60 mb-2">Abyssal Silver Ring</p>
            <h2 className="text-[12px] font-medium mb-2">18K White Gold &amp; Rough Onyx</h2>
            <p className="text-[10.5px] leading-[1.8] text-white/45">An elemental contrast. Raw, untamed onyx held in a flowing embrace of precious metal.</p>
          </div>
          <a href="#atelier" onClick={e=>{e.preventDefault();scrollToFraction(.94)}} id="product-image-card" aria-label="Explore the ring collection" className="block aspect-[4/5] transition-transform duration-700 hover:scale-[1.04] p-3" style={getStaggerStyle(.18,.29)}><img src={assets.hero} alt="Sculptural white gold ring with rough black onyx" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"/></a>
          <p className="hero-price text-center font-serif text-[28px] transition-colors duration-500 group-hover:text-[#FBFF8D]" style={getStaggerStyle(.20,.31)}>$1,850</p>
        </div>
      </main>
    </div>
    <aside aria-label={product.title} aria-hidden={!sheetOpen} inert={!sheetOpen} className={`product-sheet fixed top-0 left-0 h-full w-full sm:w-[600px] lg:w-[648px] bg-[#FAF9F5] text-[#121212] z-30 transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto px-10 pt-10 pb-6 flex flex-col ${sheetOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{boxShadow:'12px 0 45px rgba(0,0,0,0.22)'}}>
      <button onClick={()=>scrollToFraction(isSecondCard ? .82 : .35)} className="flex items-center gap-3 text-[10px] tracking-[.16em] uppercase w-fit hover:opacity-50 transition-opacity shrink-0"><ArrowLeft size={15} strokeWidth={1.3}/>Back to series</button>
      <div className="text-center mt-auto pt-9 sm:pt-12">
        <p className="text-[10px] uppercase tracking-[.15em] text-[#8E8B84] mb-4">{product.category}</p>
        <h2 className="font-serif text-[43px] leading-[1.05] max-w-[440px] mx-auto">{product.title}</h2>
        <p className="text-[12px] text-[#73716C] leading-[1.8] max-w-[370px] mx-auto mt-5">{product.description}</p>
      </div>
      <img src={product.image} alt={product.title} className="sheet-image w-full max-w-[460px] min-h-0 object-contain mx-auto my-auto py-4 mix-blend-multiply" style={{maxHeight:'47vh'}}/>
      <div className="sheet-footer flex items-center gap-4 border-t border-[#E5E5E2] -mx-10 px-10 pt-6 mt-4 shrink-0">
        <button ref={addButtonRef} className="add-button bg-[#121212] text-white hover:bg-[#34342c] transition-colors h-[50px] px-5 text-[9px] tracking-[.15em] uppercase flex-1 whitespace-nowrap" onClick={()=>{if(statusRef.current)statusRef.current.textContent=`${quantity} ${quantity===1?'piece':'pieces'} added to your atelier bag.`;if(addButtonRef.current)addButtonRef.current.textContent='ADDED TO YOUR BAG';}}>Add to atelier bag</button>
        <div className="flex h-[50px] items-center gap-2 bg-[#E5E5E2] px-2 text-[12px]" aria-label="Quantity">
          <button aria-label="Decrease quantity" disabled={quantity<=1} onClick={()=>setQuantity(q=>Math.max(1,q-1))} className="p-1 disabled:opacity-25"><Minus size={13}/></button><span className="min-w-3 text-center" data-testid="quantity">{quantity}</span><button aria-label="Increase quantity" onClick={()=>setQuantity(q=>q+1)} className="p-1"><Plus size={13}/></button>
        </div>
        <p className="sheet-price font-serif text-[31px] whitespace-nowrap" data-testid="price">${(product.price*quantity).toLocaleString('en-US')}</p>
      </div>
      <p ref={statusRef} role="status" className="text-[10px] text-[#73716C] text-center min-h-4 mt-3 shrink-0"/>
    </aside>
  </div>;
}
