import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Menu, ShoppingBag, X, Minus, Plus, Wifi, Check } from 'lucide-react';
import './style.css';

const products = [
  { id: 1, name: 'Herbix 60', subtitle: 'Vitamin Complex', dosage: '250 mg', price: 30, image: 'product-1.webp' },
  { id: 2, name: 'Herbix 30', subtitle: 'Immunity Boost', dosage: '500 mg', price: 25, image: 'product-2.webp' },
  { id: 3, name: 'Herbix 90', subtitle: 'Joint Support', dosage: '300 mg', price: 35, image: 'product-3.webp' },
];
const mod = n => (n + products.length * 10) % products.length;
const money = n => `$${n.toFixed(2)}`;
const ITEM_WIDTH = 105, CENTER_WIDTH = 160, GAP = 12;
const offsets = [-2, -1, 0, 1, 2];
function App() {
  const [active, setActive] = useState(0), [quantity, setQuantity] = useState(1);
  const [motion, setMotion] = useState(0), [phase, setPhase] = useState(false);
  const [category, setCategory] = useState('Capsules'), [menu, setMenu] = useState(false);
  const [panel, setPanel] = useState(null), [cartCount, setCartCount] = useState(10), [added, setAdded] = useState(null);
  const timer = useRef(), moving = useRef(false), closeRef = useRef(), menuRef = useRef(), directionRef = useRef(0);
  const product = products[active];
  const finishMove = useCallback(() => {
    if (!moving.current) return;
    clearTimeout(timer.current);
    setActive(a => mod(a + directionRef.current)); setQuantity(1); setPhase(false); setMotion(0); moving.current = false;
  }, []);
  const move = useCallback(direction => {
    if (moving.current) return;
    moving.current = true; directionRef.current = direction; setMotion(direction); setPhase(true);
    timer.current = setTimeout(finishMove, 500);
  }, [finishMove]);
  useEffect(() => {
    if (menu || panel || added) return;
    const interval = setInterval(() => move(1), 3000);
    return () => clearInterval(interval);
  }, [move, menu, panel, added, category]);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if(menu) closeRef.current?.focus(); }, [menu]);
  useEffect(() => {
    const handle = e => {
      if(e.key === 'Escape') { setMenu(false); setPanel(null); setAdded(null); menuRef.current?.focus(); }
    };
    window.addEventListener('keydown', handle); return () => window.removeEventListener('keydown', handle);
  }, []);
  function closeMenu() { setMenu(false); menuRef.current?.focus(); }
  function buy() { setAdded({ ...product, quantity }); setCartCount(n => n + quantity); }
  function chooseCategory(tab) { setCategory(tab); setQuantity(1); }
  return <main className="min-h-screen bg-neutral-100 flex items-center justify-center p-2 sm:p-8">
    <div className="phone relative w-[375px] h-[812px] bg-white border-[8px] border-neutral-900 rounded-[50px] overflow-hidden" aria-label="TerraElix supplement shop">
      <div className="island absolute top-[3px] left-1/2 -translate-x-1/2 w-[120px] h-[32px] rounded-full bg-black z-50" aria-hidden="true" />
      <div className="screen">
        <div className="status flex items-center justify-between px-[25px] pt-1 text-[14px] font-semibold">
          <span>9:41</span><div className="flex items-center gap-[5px]" aria-label="Full signal, WiFi, battery charged">
            <svg width="17" height="13" viewBox="0 0 17 13" fill="currentColor" aria-hidden="true"><rect x="0" y="8" width="3" height="5" rx=".7"/><rect x="4.5" y="5.5" width="3" height="7.5" rx=".7"/><rect x="9" y="3" width="3" height="10" rx=".7"/><rect x="13.5" width="3" height="13" rx=".7"/></svg>
            <Wifi size={17} strokeWidth={2.5}/><svg width="25" height="13" viewBox="0 0 25 13" fill="none" aria-hidden="true"><rect x=".5" y="1" width="21" height="11" rx="3" stroke="currentColor" strokeOpacity=".4"/><rect x="2.5" y="3" width="17" height="7" rx="1.5" fill="currentColor"/><path d="M23 4v5c2-1 2-4 0-5" fill="currentColor" opacity=".5"/></svg>
          </div>
        </div>
        <header className="reveal flex items-center justify-between px-6" style={{'--delay':'0ms'}}>
          <button ref={menuRef} className="icon-button -ml-2" aria-label="Open menu" onClick={() => setMenu(true)}><Menu size={22} strokeWidth={1.5}/></button>
          <span className="font-display text-[23px] font-medium tracking-[-0.03em]">TerraElix</span>
          <button className="icon-button relative -mr-2" aria-label={`Open shopping bag, ${cartCount} items`} onClick={() => setPanel('Shopping bag')}><ShoppingBag size={22} strokeWidth={1.5}/><span className="absolute top-0 right-0 w-[18px] h-[18px] rounded-full bg-black text-white text-[9px] flex items-center justify-center">{cartCount}</span></button>
        </header>
        <section className="reveal px-6 flex items-center" style={{'--delay':'100ms'}}><h1 className="font-display font-normal text-[42px] leading-none tracking-[-0.035em]">Supplements</h1></section>
        <nav className="reveal tabs scrollbar-hide flex gap-6 mx-6 overflow-x-auto" aria-label="Supplement categories" style={{'--delay':'200ms'}}>
          {['All', 'Capsules', 'Tablets', 'Functional Powders'].map(tab => <button key={tab} onClick={() => chooseCategory(tab)} aria-pressed={category===tab} className={`shrink-0 text-sm tracking-[-0.01em] pb-[12px] border-b-2 ${category===tab ? 'font-semibold border-black text-black' : 'border-transparent text-neutral-400'}`}>{tab}</button>)}
        </nav>
        <section className="carousel reveal relative" aria-label="Product carousel" aria-roledescription="carousel" style={{'--delay':'300ms'}} onKeyDown={e => { if(e.key==='ArrowLeft') move(-1); if(e.key==='ArrowRight') move(1); }}>
          {offsets.map(slot => {
            const pos = slot - motion, p = products[mod(active + slot)];
            const center = pos===0, near=Math.abs(pos)===1;
            const x = pos===0 ? 0 : Math.sign(pos) * ((CENTER_WIDTH + ITEM_WIDTH)/2 + GAP + (Math.abs(pos)-1)*(ITEM_WIDTH+GAP));
            return <button key={`${active}-${slot}`} aria-label={slot===0 ? `${p.name}, selected` : `View ${p.name}`} tabIndex={Math.abs(slot)<2 ? 0 : -1} onTransitionEnd={e => { if(e.propertyName === 'transform') finishMove(); }} className={`product-slot ${phase ? 'in-motion' : ''}`} onClick={() => slot && move(Math.sign(slot))} style={{width:center?CENTER_WIDTH:ITEM_WIDTH,height:center?260:200,opacity:center?1:near?.7:.3,zIndex:center?10:0,transform:`translate(-50%, -50%) translateX(${x}px)`}}>
              <img src={`${import.meta.env.BASE_URL}assets/${p.image}`} alt={`${p.name} supplement bottle`} draggable="false" />
            </button>;
          })}
        </section>
        <section className={`reveal text-center product-info ${phase?'fading':''}`} style={{'--delay':'400ms'}} aria-live="polite">
          <h2 className="font-display text-2xl font-normal tracking-[-0.025em] leading-[29px]">{product.name}</h2>
          <p className="text-sm text-neutral-500 mt-[3px]">{product.subtitle}</p>
          <p className="text-xs text-neutral-400 mt-[4px]">{product.dosage}</p>
        </section>
        <div className="reveal flex items-center justify-between px-6" style={{'--delay':'500ms'}}>
          <span className={`price font-display font-medium text-2xl tracking-[-0.02em] ${phase?'fading':''}`} aria-live="polite">{money(product.price * quantity)}</span>
          <div className="flex items-center gap-[17px]" aria-label="Quantity"><button className="quantity-button disabled:opacity-40" aria-label="Decrease quantity" disabled={quantity===1} onClick={() => setQuantity(q=>Math.max(1,q-1))}><Minus size={16} strokeWidth={1.5}/></button><span className="text-lg font-medium min-w-3 text-center" data-testid="quantity">{quantity}</span><button className="quantity-button" aria-label="Increase quantity" onClick={() => setQuantity(q=>q+1)}><Plus size={16} strokeWidth={1.5}/></button></div>
        </div>
        <div/>
        <button onClick={buy} className="reveal mx-6 h-14 bg-black text-white rounded-xl font-medium text-sm hover:bg-neutral-800 active:scale-[0.97] transition-transform" style={{'--delay':'600ms'}}>Buy Now</button>
      </div>
      <div className="absolute bottom-[7px] left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-black rounded-full z-50" aria-hidden="true"/>
      <div className={`menu-layer absolute inset-0 z-40 ${menu?'is-open':''}`} inert={!menu ? true : undefined}>
        <button className="absolute inset-0 bg-black/40" aria-label="Close menu overlay" onClick={closeMenu}/>
        <aside className="menu-panel absolute inset-y-0 left-0 w-[260px] bg-white px-5 pt-[52px]" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="flex items-center justify-between mb-9"><span className="font-display text-[23px] font-medium tracking-[-0.03em]">TerraElix</span><button ref={closeRef} className="icon-button" aria-label="Close menu" onClick={closeMenu}><X size={22} strokeWidth={1.5}/></button></div>
          <nav className="flex flex-col gap-2">{['About','Products','Promotions','Contact'].map(item=><button key={item} className="text-left p-3 rounded-lg hover:bg-neutral-100 text-[15px]" onClick={()=>{closeMenu(); if(item!=='Products') setPanel(item);}}>{item}</button>)}</nav>
        </aside>
      </div>
      {(panel || added) && <div className="absolute inset-0 bg-black/40 z-40 flex items-end" onClick={()=>{setPanel(null);setAdded(null);}}><section role="dialog" aria-modal="true" aria-label={added?'Added to bag':panel} className="sheet bg-white rounded-t-[26px] w-full px-6 pt-6 pb-12" onClick={e=>e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5"><h2 className="font-display text-2xl">{added?'Added to your bag':panel}</h2><button autoFocus className="icon-button" aria-label="Close dialog" onClick={()=>{setPanel(null);setAdded(null);}}><X size={20}/></button></div>
        {added ? <><div className="flex items-center gap-3 mb-6"><span className="rounded-full bg-neutral-100 p-2"><Check size={20}/></span><div><p>{added.quantity} × {added.name}</p><p className="text-sm text-neutral-500">{money(added.price*added.quantity)}</p></div></div><button className="w-full h-12 rounded-xl bg-black text-white text-sm" onClick={()=>{setAdded(null);setPanel('Shopping bag');}}>View bag · {cartCount} items</button></> : <p className="text-sm text-neutral-500 leading-6">{panel==='Shopping bag' ? `Your bag has ${cartCount} items. Continue exploring your daily essentials.` : panel==='About' ? 'TerraElix. Everyday supplements, thoughtfully selected for your daily routine.' : panel==='Promotions' ? 'Explore our collection for your next daily essential. New offers are coming soon.' : 'Have a question about TerraElix? We’re here to help you find your daily essentials.'}</p>}
      </section></div>}
    </div>
  </main>;
}
createRoot(document.getElementById('root')).render(<App/>);
