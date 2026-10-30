import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useReducedMotion } from 'framer-motion';
import './styles.css';

const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;

function App() {
  const reducedMotion = useReducedMotion();
  const reel = useRef<HTMLDialogElement>(null);
  const cart = useRef<HTMLDialogElement>(null);
  const reelVideo = useRef<HTMLVideoElement>(null);
  const [quantity, setQuantity] = useState(0);
  function openReel(event?: React.MouseEvent) {
    event?.preventDefault();
    reel.current?.showModal();
    reelVideo.current?.play().catch(() => {});
  }
  function closeReel() { reel.current?.close(); reelVideo.current?.pause(); }
  function buy() { setQuantity(1); cart.current?.showModal(); }
  return <>
    <header className="navbar">
      <a href="#" className="logo-link" aria-label="Framelix 3D home"><img src={asset('logo.svg')} alt="Framelix" className="h-9 brightness-0 invert" /></a>
      <nav aria-label="Main navigation" className="desktop-nav">
        <div><a href="#reel" onClick={openReel}>Reels</a><a href="mailto:hello@framelix.com?subject=Services">Services</a></div>
        <div><a href="#reel" onClick={openReel}>Projects</a><a href="#shipping">Pipeline</a></div>
        <div><a href="mailto:hello@framelix.com?subject=Careers">Careers</a><a href="mailto:hello@framelix.com">Get In Touch</a></div>
      </nav>
      <button className="cart-button" aria-label={`Open cart, ${quantity} items`} onClick={() => cart.current?.showModal()}>
        <svg viewBox="0 0 27 30" width="27" height="30" aria-hidden="true"><path d="M1 1h25v5a4 4 0 0 0 0 8v2a4 4 0 0 0 0 8v5H1v-5a4 4 0 0 0 0-8v-2a4 4 0 0 0 0-8Z" fill="none" stroke="currentColor" strokeWidth="1.4"/></svg><span>{quantity}</span>
      </button>
    </header>
    <main>
      <section className="hero" aria-labelledby="hero-heading">
        <video className="hero-video" src={asset('hero.mp4')} autoPlay loop muted playsInline preload="auto" aria-label="Violet glass dragonflies in cinematic motion" />
        <motion.div className="hero-title" initial={{ opacity: 0, y: reducedMotion ? 0 : -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
          <p className="brand">Framelix<sup>3D</sup></p>
          <h1 id="hero-heading">Cinematic Motion Studios</h1>
        </motion.div>
        <motion.div className="hero-cta" initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .3 }}>
          <button className="reel-button" onClick={openReel}>Explore Reel</button>
          <p>Ready in 24-48 hours</p>
        </motion.div>
      </section>
      <div className="marquee" aria-label="New! 3D OS V1.2.1 out now!">
        <div className="marquee-track animate-marquee" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <span key={i}>New! 3D<sup>OS</sup> V1.2.1 out now!</span>)}</div>
      </div>
      <section id="shipping" className="shipping" aria-labelledby="shipping-heading">
        <div className="shipping-title"><p className="brand">Framelix<sup>3D</sup></p><h2 id="shipping-heading">Shipping Now</h2></div>
        <video className="shipping-video" src={asset('shipping.mp4')} autoPlay loop muted playsInline preload="auto" aria-label="Framelix 3D OS product animation" />
        <div className="shipping-actions"><button className="buy-button" onClick={buy}>Buy Now</button><a href="#reel" onClick={openReel}>Explore now</a></div>
      </section>
    </main>
    <dialog ref={reel} className="reel-dialog" onClick={e => { if (e.target === e.currentTarget) closeReel(); }} onCancel={closeReel}>
      <button className="dialog-close" onClick={closeReel} aria-label="Close reel">×</button>
      <video ref={reelVideo} src={asset('hero.mp4')} controls playsInline preload="none" aria-label="Framelix studio reel" />
    </dialog>
    <dialog ref={cart} className="cart-dialog" onClick={e => { if (e.target === e.currentTarget) cart.current?.close(); }}>
      <button className="dialog-close" onClick={() => cart.current?.close()} aria-label="Close cart">×</button>
      <h2>Your cart <span>({quantity})</span></h2>
      {quantity ? <><div className="cart-product"><div><strong>Framelix 3D<sup>OS</sup></strong><p>V1.2.1</p></div><button className="text-button" onClick={() => setQuantity(0)}>Remove</button></div><p className="cart-note">Contact the studio for pricing and availability.</p><a className="contact-button" href="mailto:hello@framelix.com?subject=Framelix%203D%20OS%20purchase%20enquiry">Get In Touch ↗</a></> : <><p className="cart-note">Your cart is empty.</p><button className="contact-button" onClick={() => { cart.current?.close(); document.getElementById('shipping')?.scrollIntoView({ behavior: 'smooth' }); }}>Explore 3D OS</button></>}
    </dialog>
  </>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
