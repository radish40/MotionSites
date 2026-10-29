import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, ShoppingCart, Star, ArrowUpRight, Play, ArrowRight, Plus, X, Minus, Check } from 'lucide-react';
import './styles.css';

const base = 'https://polo-pecan-73837341.figma.site/_assets/v11/';
const assets = {
  logo: base + '0ae29d6d9628bede667f90d57bebe81b8f1ec2bf.svg',
  avatar: base + 'e62173d41f91350a59628e8a9a55ae078a886fb9.png?w=128',
  product: base + '3e5158dad63d392ade022e81890edc9f54d750bc.png',
  video: base + '76be6ec3a93a703b15e9cc01e764a4e3f9d7d2c0.png',
  left: base + '8d44b25186ef45a5789c74668fb781cea4e1ff49.png',
  center: base + '96745c4e72ad5c5208e53a885df797fd82cd854a.png?h=1024',
  right: base + '81bd2e7a66b58f3d8f3ad78fd1ebf01af8dfdee1.png',
};
type Panel = 'search' | 'favorites' | 'cart' | 'product' | 'reviews' | 'delivery' | 'brands' | 'account' | null;

function App() {
  const [panel, setPanel] = useState<Panel>(null);
  const [query, setQuery] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [saved, setSaved] = useState(true);
  const dialog = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (panel) {
      if (!dialog.current?.open) previousFocus.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
      previousFocus.current?.focus();
    }
  }, [panel]);
  const explore = () => setPanel('product');
  const title = <><span className="inline-block animate-word-pop delay-200">Everything</span><br /><span className="inline-block animate-word-pop delay-300">Your</span>{' '}<span className="inline-block animate-word-pop delay-400">Pets</span>{' '}<span className="inline-block animate-word-pop delay-500">Love</span></>;
  const cta = (extra = '') => <button onClick={explore} className={'explore-button ' + extra}>Explore Products <ArrowRight size={19} strokeWidth={1.7} /></button>;
  const stats = <div className="community"><div className="avatar-stack"><img src={assets.avatar} alt="Happy CozyPaws customer" /><span><Plus size={21} strokeWidth={1.6} /></span></div><span>98K+</span></div>;
  const rating = <div className="rating"><Star fill="#E86A10" stroke="#E86A10" /><span>4.6</span></div>;
  const productCard = (mobile = false) => <article className={mobile ? 'mobile-product' : 'product-card animate-slide-in-left delay-600'}>
    <div className="product-photo"><img src={assets.product} alt="Orange carpeted Cozy Cat House" /><button className="round-button product-arrow" aria-label="View Cozy Cat House" onClick={explore}><ArrowUpRight size={23} strokeWidth={1.6} /></button></div>
    <div className="product-caption"><span>Cozy Cat House</span><strong>$49.99</strong></div>
  </article>;
  const videoCard = (mobile = false) => <article className={mobile ? 'mobile-video' : 'video-card animate-slide-in-right delay-700'}>
    <div className="video-photo"><img src={assets.video} alt="A pet enjoying a cozy home" /><div className="video-overlay"><button className="round-button play-button" aria-label="Watch product reviews" onClick={() => setPanel('reviews')}><Play size={19} fill="currentColor" /></button><p>Watch Product Reviews<br />on TikTok and YouTube</p></div></div>
  </article>;
  const photos = (mobile = false) => <div className={'photo-panels ' + (mobile ? 'mobile-photos' : '')} aria-label="Happy pets at home">
    <div className="photo-panel photo-left animate-photo-reveal delay-700"><img src={assets.left} alt="A dachshund peeking over a mint green panel" />{!mobile && <div className="photo-overlay left-overlay animate-scale-in delay-1100">{stats}</div>}</div>
    <div className="photo-panel photo-center animate-photo-reveal delay-600"><img src={assets.center} alt="A golden retriever resting its paws on a dark green panel" />{!mobile && <div className="photo-overlay center-overlay animate-fade-up delay-1000"><h2>Best Products<br />for Your Pet</h2>{cta()}</div>}</div>
    <div className="photo-panel photo-right animate-photo-reveal delay-800"><img src={assets.right} alt="An orange cat peeking over a mint green panel" />{!mobile && <div className="photo-overlay right-overlay animate-scale-in delay-1200">{rating}</div>}</div>
  </div>;
  return <div className="app h-screen flex flex-col overflow-hidden bg-mint text-forest">
    <header className="site-header relative z-30 shrink-0 flex items-center justify-between animate-fade-in delay-100">
      <a href="#home" aria-label="CozyPaws home" onClick={() => setPanel(null)}><img className="logo" src={assets.logo} alt="CozyPaws" /></a>
      <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
        <a href="#home" className="text-gray-900">Home</a><button onClick={explore}>Shop</button><button onClick={() => setPanel('delivery')}>Delivery and payment</button><button onClick={() => setPanel('brands')}>Brands</button><button onClick={() => setPanel('reviews')}>Blog</button>
      </nav>
      <div className="header-actions flex items-center">
        <button className="header-icon hidden sm:flex" aria-label="Search products" onClick={() => setPanel('search')}><Search size={19} strokeWidth={1.6} /></button>
        <button className="header-icon favorite-button" aria-label={`Favorites, ${saved ? 4 : 3} items`} onClick={() => setPanel('favorites')}><Star size={19} strokeWidth={1.6} /><span className="badge">{saved ? 4 : 3}</span></button>
        <button className="header-icon" aria-label={`Shopping cart, ${quantity} items`} onClick={() => setPanel('cart')}><ShoppingCart size={19} strokeWidth={1.6} /><span className="badge">{quantity}</span></button>
        <button className="avatar-button" aria-label="Your account" onClick={() => setPanel('account')}><img src={assets.avatar} alt="" /></button>
      </div>
    </header>
    <main id="home" className="relative flex-1 flex flex-col overflow-hidden">
      <section className="desktop-hero hidden lg:flex flex-1 relative" aria-label="Everything your pets love">
        <h1 className="hero-heading font-serif-display">{title}</h1>{productCard()}{videoCard()}{photos()}
      </section>
      <section className="tablet-hero hidden md:flex lg:hidden flex-1 relative" aria-label="Everything your pets love">
        <h1 className="hero-heading font-serif-display">{title}</h1>{productCard()}{videoCard()}{photos()}
      </section>
      <section className="mobile-hero flex md:hidden flex-col flex-1 relative" aria-label="Everything your pets love">
        <div className="mobile-intro"><h1 className="font-serif-display">{title}</h1><p className="animate-fade-up delay-500">Best Products for Your Pet</p>{cta('animate-fade-up delay-600')}</div>
        <div className="mobile-cards animate-fade-up delay-700">{productCard(true)}{videoCard(true)}</div>
        <div className="mobile-stats animate-fade-in delay-1000">{stats}<span className="stats-divider" />{rating}</div>
        {photos(true)}
      </section>
    </main>
    <dialog ref={dialog} className="detail-dialog" onCancel={() => setPanel(null)} onClick={e => { if (e.target === e.currentTarget) setPanel(null); }}>
      <div className="dialog-content"><button className="dialog-close" aria-label="Close dialog" onClick={() => setPanel(null)}><X size={21}/></button>
        {panel === 'search' ? <><p className="eyebrow">FIND THEIR NEW FAVORITE</p><h2>What does your pet love?</h2><label className="search-field"><Search size={20}/><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products…" aria-label="Search products" /></label>{!query || /cat|house|cozy/i.test(query) ? <button className="mini-product" onClick={explore}><img src={assets.product} alt="Cozy Cat House"/><span>Cozy Cat House<strong>$49.99</strong></span><ArrowUpRight/></button> : <p className="dialog-copy">No matches for “{query}”. Try “cat house”.</p>}</> : null}
        {(panel === 'product' || panel === 'favorites' || panel === 'cart') && <>
          <p className="eyebrow">{panel === 'favorites' ? 'SAVED WITH LOVE' : panel === 'cart' ? 'A LITTLE SOMETHING FOR THEM' : 'THEIR NEW FAVORITE SPOT'}</p>
          <h2>{panel === 'favorites' ? 'Your favorites' : panel === 'cart' ? 'Your cart' : 'Cozy Cat House'}</h2>
          <img className="dialog-product-image" src={assets.product} alt="Cozy Cat House"/>
          <div className="dialog-product-heading"><h3>Cozy Cat House</h3><strong>$49.99</strong></div>
          {panel === 'cart' ? <><div className="cart-controls"><span>Quantity</span><div><button aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity(n => n - 1)}><Minus size={16}/></button><span>{quantity}</span><button aria-label="Increase quantity" onClick={() => setQuantity(n => n + 1)}><Plus size={16}/></button></div></div><div className="cart-total"><span>Subtotal</span><strong>${(quantity * 49.99).toFixed(2)}</strong></div><p className="dialog-copy small">Your cart is saved for this visit.</p></> : <><p className="dialog-copy">A cozy little hideaway for their everyday naps.</p><div className="dialog-product-actions"><button className="explore-button" onClick={() => {setQuantity(n => n + 1); setAdded(true);}}>{added ? <><Check size={18}/> Added to cart</> : <>Add to cart <Plus size={18}/></>}</button><button className={'save-button ' + (saved ? 'is-saved' : '')} aria-label={saved ? 'Remove from favorites' : 'Save to favorites'} onClick={() => setSaved(s => !s)}><Star size={20} fill={saved ? 'currentColor' : 'none'}/></button></div></>}
        </>}
        {panel === 'reviews' && <><p className="eyebrow">HAPPY PETS, HAPPY PEOPLE</p><h2>See the cozy side.</h2><img className="review-image" src={assets.video} alt="CozyPaws product review preview"/><p className="dialog-copy">Watch Product Reviews on TikTok and YouTube</p><div className="review-links"><a href="https://www.tiktok.com/" target="_blank" rel="noreferrer">TikTok <ArrowUpRight size={16}/></a><a href="https://www.youtube.com/" target="_blank" rel="noreferrer">YouTube <ArrowUpRight size={16}/></a></div></>}
        {panel === 'delivery' && <><p className="eyebrow">FROM OUR HOME TO YOURS</p><h2>Delivery and payment</h2><p className="dialog-copy">Delivery options and payment details are provided at checkout. This storefront preview does not accept payments or place orders.</p><button className="explore-button" onClick={explore}>Explore Products <ArrowRight size={18}/></button></>}
        {panel === 'brands' && <><p className="eyebrow">MADE FOR THEIR EVERYDAY</p><h2>Meet CozyPaws</h2><p className="dialog-copy">Comfort for your companions. Discover the Cozy Cat House, a little place to call their own.</p><button className="explore-button" onClick={explore}>Discover CozyPaws <ArrowRight size={18}/></button></>}
        {panel === 'account' && <><p className="eyebrow">WELCOME TO COZYPAWS</p><h2>Make yourself at home.</h2><p className="dialog-copy">All your pet’s favorite things, in one cozy place.</p><button className="account-link" onClick={() => setPanel('favorites')}>Your favorites <Star size={19}/></button><button className="account-link" onClick={() => setPanel('cart')}>Your cart <ShoppingCart size={19}/></button></>}
      </div>
    </dialog>
  </div>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
