import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function Chevron({ open }) {
  return <svg className={`transition-transform ${open ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>;
}
function Logo() {
  return <a href="#home" aria-label="Future home" className="flex items-center gap-2.5 text-white"><svg width="30" height="33" viewBox="0 0 29 33" fill="none" aria-hidden="true"><path fill="white" d="M1.04356 6.35771L13.6437 0.666504L27.9 7.1L15.2 13.1L1.04356 6.35771ZM1.04356 10.7L13.7 16.5V31.7L1.04356 25.9V10.7ZM17.7 16.5L27.9 11.7V20.3L17.7 25.1V16.5Z"/></svg><span className="logo-word">Future</span></a>;
}
function App() {
  const [menu, setMenu] = useState(false);
  const [services, setServices] = useState(false);
  const [notice, setNotice] = useState('');
  const dialog = useRef(null);
  const mobileMenu = useRef(null);
  const menuButton = useRef(null);
  const serviceBox = useRef(null);
  useEffect(() => {
    if (notice) dialog.current.showModal();
  }, [notice]);
  useEffect(() => {
    if (menu) mobileMenu.current.querySelector('a,button')?.focus();
    const old = document.body.style.overflow;
    if (menu) document.body.style.overflow = 'hidden';
    function key(e) {
      if (e.key === 'Escape') { setMenu(false); setServices(false); menuButton.current?.focus(); }
      if (menu && e.key === 'Tab') {
        const nodes = [...mobileMenu.current.querySelectorAll('a,button'), menuButton.current];
        const i = nodes.indexOf(document.activeElement);
        e.preventDefault(); nodes[(i + (e.shiftKey ? nodes.length - 1 : 1)) % nodes.length].focus();
      }
    }
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = old; document.removeEventListener('keydown', key); };
  }, [menu]);
  useEffect(() => {
    function dismiss(e) { if (!serviceBox.current?.contains(e.target) && !mobileMenu.current?.contains(e.target)) setServices(false); }
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, []);
  function action(label) { setMenu(false); setServices(false); setNotice(label); }
  const nav = (mobile = false) => <>
    <a className="nav-link" href="#home" onClick={() => setMenu(false)}>Home</a>
    <div className="relative" ref={mobile ? undefined : serviceBox}>
      <button className="nav-link flex items-center gap-1.5" aria-expanded={services} aria-controls={mobile ? 'mobile-services' : 'desktop-services'} onClick={() => setServices(!services)}>Services <Chevron open={services}/></button>
      {services && <div id={mobile ? 'mobile-services' : 'desktop-services'} className={mobile ? 'mobile-services' : 'services-panel'}>{['Hotels', 'Resorts', 'Stays'].map(s => <button key={s} onClick={() => action(s)}>{s}</button>)}</div>}
    </div>
    <button className="nav-link" onClick={() => action('Reviews')}>Reviews</button>
    <button className="nav-link" onClick={() => action('Contact us')}>Contact us</button>
  </>;
  return <main id="home" className="relative isolate min-h-screen overflow-hidden bg-[#100e19] text-white">
    <video className="absolute inset-0 h-full min-h-screen w-full object-cover" src={`${import.meta.env.BASE_URL}assets/hero.mp4`} autoPlay loop muted playsInline aria-hidden="true"/>
    <header className={`relative ${menu ? "z-40" : "z-20"} flex items-center justify-between px-6 py-4 xl:px-[120px] lg:px-16`}>
      <div className="flex items-center gap-14"><Logo/><nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">{nav()}</nav></div>
      <div className="hidden items-center gap-3 lg:flex"><button className="nav-button sign-in" onClick={() => action('Sign In')}>Sign In</button><button className="nav-button bg-[#7b39fc] text-[#fafafa] shadow-sm hover:bg-[#8b50ff]" onClick={() => action('Get Started')}>Get Started</button></div>
      <button ref={menuButton} aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="mobile-menu" className={`menu-toggle relative z-50 lg:hidden ${menu ? 'is-open' : ''}`} onClick={() => {setMenu(!menu); setServices(false);}}><span/><span/></button>
    </header>
    {menu && <nav ref={mobileMenu} id="mobile-menu" aria-label="Mobile navigation" className="mobile-menu fixed inset-0 z-30 flex flex-col items-start justify-center gap-8 bg-black px-10 lg:hidden">{nav(true)}<div className="mt-3 flex gap-3"><button className="nav-button sign-in" onClick={() => action('Sign In')}>Sign In</button><button className="nav-button bg-[#7b39fc]" onClick={() => action('Get Started')}>Get Started</button></div></nav>}
    <section aria-labelledby="hero-title" className="hero-content relative z-10 mx-auto mt-32 flex max-w-[1200px] flex-col items-center px-6 text-center">
      <div className="announcement flex h-[38px] items-center gap-2 rounded-[10px] border border-[rgba(164,132,215,0.5)] bg-[rgba(85,80,110,0.4)] py-1 pl-1 pr-3 backdrop-blur-md"><span className="rounded-md bg-[#7b39fc] px-2.5 py-1">New</span><span>Say Hello to Datacore v3.2</span></div>
      <h1 id="hero-title" className="mt-7 text-5xl leading-[1.1] lg:text-[96px]">Book your perfect stay<br className="hidden sm:block"/> instantly <em className="px-1">and</em> hassle-free</h1>
      <p className="hero-description mt-6 max-w-[662px] text-lg font-normal leading-[1.6] text-white/70">Discover handpicked hotels, resorts, and stays across your favorite destinations. Enjoy exclusive deals, fast booking, and 24/7 support.</p>
      <div className="hero-actions mt-8 flex items-center justify-center gap-3"><button className="cta bg-[#7b39fc] hover:bg-[#8b50ff]" onClick={() => action('Book a Free Demo')}>Book a Free Demo</button><button className="cta bg-[#2b2344] text-[#f6f7f9] hover:bg-[#3b3159]" onClick={() => action('Get Started Now')}>Get Started Now</button></div>
    </section>
    <dialog ref={dialog} onClose={() => setNotice('')} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }} className="preview-dialog rounded-2xl border border-white/15 bg-[#201a31] p-8 text-white"><div className="flex items-center justify-between gap-8"><h2 className="text-2xl">{notice}</h2><button aria-label="Close dialog" className="close-dialog" onClick={() => dialog.current.close()}>×</button></div><p className="mt-5 leading-relaxed text-white/70">This is a Datacore design preview. {notice === 'Reviews' ? 'Reviews have not been provided.' : 'This destination has not been connected yet.'}</p><button className="cta mt-6 bg-[#7b39fc] hover:bg-[#8b50ff]" onClick={() => dialog.current.close()}>Back to home</button></dialog>
  </main>;
}
createRoot(document.getElementById('root')).render(<App/>);
