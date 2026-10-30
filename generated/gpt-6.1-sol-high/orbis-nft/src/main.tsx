import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Mail, Twitter, Github, ChevronRight, X } from 'lucide-react';
import './style.css';

const root = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/';
const films = {
  hero: 'hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4',
  about: 'hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4',
  final: 'hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4',
};
const objects = [
  { video: 'hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4', score: '8.7/10' },
  { video: 'hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4', score: '9/10' },
  { video: 'hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4', score: '8.2/10' },
];
const description = 'A digital object fixed beyond time and place. An exploration of distance, form, and silence in space';
function Film({ file, className = '' }: { file: string; className?: string }) {
  return <video className={className} src={root + file} autoPlay loop muted playsInline preload="auto" aria-hidden="true" />;
}
function Socials({ className = '' }: { className?: string }) {
  return <div className={`socials ${className}`}>
    <a className="liquid-glass" href="mailto:?subject=Orbis.Nft" aria-label="Email about Orbis.Nft"><Mail size={20} /></a>
    <a className="liquid-glass" href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter"><Twitter size={20} /></a>
    <a className="liquid-glass" href="https://github.com/" target="_blank" rel="noreferrer" aria-label="Github"><Github size={20} /></a>
  </div>;
}
function App() {
  const [dialog, setDialog] = useState<'faq' | number | null>(null);
  const modal = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (dialog !== null) modal.current?.showModal(); else modal.current?.close(); }, [dialog]);
  return <>
    <div className="texture" aria-hidden="true" />
    <main>
      <section id="home" className="hero relative min-h-screen overflow-hidden rounded-b-[32px]">
        <Film file={films.hero} className="background-video" />
        <div className="hero-shade" />
        <div className="site-container relative h-full">
          <header className="header">
            <a href="#home" className="logo font-grotesk uppercase">Orbis.Nft</a>
            <nav className="liquid-glass hidden lg:block rounded-[28px] px-[52px] py-[24px]" aria-label="Main navigation">
              <a href="#home">Homepage</a><a href="#gallery">Gallery</a><a href="#gallery">Buy NFT</a>
              <button onClick={() => setDialog('faq')}>FAQ</button><a href="#contact">Contact</a>
            </nav>
          </header>
          <div className="hero-content lg:ml-32">
            <div className="hero-heading relative">
              <h1 className="font-grotesk uppercase">Beyond earth<br />and ( its ) familiar<br />boundaries</h1>
              <span className="script hero-script">Nft collection</span>
            </div>
            <Socials className="mobile-socials lg:hidden" />
          </div>
          <Socials className="desktop-socials hidden lg:flex" />
        </div>
      </section>
      <section id="about" className="about relative min-h-screen overflow-hidden">
        <Film file={films.about} className="background-video" />
        <div className="site-container about-content relative">
          <div className="intro-top">
            <div className="intro-title relative"><h2>Hello!<br />I'm orbis</h2><span className="script intro-script">Orbis</span></div>
            <p className="description">{description}</p>
          </div>
          <div className="intro-bottom" aria-hidden="true">
            <div><p>{description}</p><p>{description}</p></div>
            <div className="hidden lg:block"><p>{description}</p><p>{description}</p></div>
          </div>
        </div>
      </section>
      <section id="gallery" className="collection site-container">
        <div className="collection-header">
          <h2>Collection of<br /><span className="collection-line"><span className="script">Space</span> objects</span></h2>
          <a className="creators" href="#about" aria-label="See all creators"><span className="creators-type"><span className="see">See</span><span className="all">All<br />Creators</span></span><span className="neon-bar" /></a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {objects.map((object, i) => <article className="nft-card liquid-glass rounded-[32px] p-[18px] transition-colors hover:bg-white/10" key={object.video}>
            <div className="nft-image relative rounded-[24px] overflow-hidden">
              <Film file={object.video} className="background-video" />
              <div className="score liquid-glass rounded-[20px] px-5 py-4">
                <div><span className="score-label">Rarity score:</span><span className="score-value">{object.score}</span></div>
                <button onClick={() => setDialog(i)} className="object-button" aria-label={`View space object ${i + 1}, rarity ${object.score}`}><ChevronRight size={24} /></button>
              </div>
            </div>
          </article>)}
        </div>
      </section>
      <section id="contact" className="final relative">
        <Film file={films.final} className="final-video" />
        <div className="final-copy"><span className="script final-script">Go beyond</span><h2><span className="join">Join us.</span>Reveal what's hidden.<br />Define what's next.<br />Follow the signal.</h2></div>
        <Socials className="footer-socials liquid-glass" />
      </section>
    </main>
    <dialog ref={modal} onCancel={() => setDialog(null)} onClick={e => { if (e.target === modal.current) setDialog(null); }} onClose={() => setDialog(null)} className="detail-dialog">
      <button className="close-dialog" onClick={() => setDialog(null)} aria-label="Close dialog"><X /></button>
      {dialog === 'faq' ? <><h2>FAQ</h2><h3>What is Orbis?</h3><p>{description}.</p><h3>What's in the collection?</h3><p>Three space objects. Explore the gallery to view each object and its rarity score.</p><a className="dialog-link" href="#gallery" onClick={() => setDialog(null)}>Explore the collection <ChevronRight size={18} /></a></> : typeof dialog === 'number' ? <><Film file={objects[dialog].video} className="detail-video" /><h2>Space object {String(dialog + 1).padStart(2, '0')}</h2><p>Rarity score: {objects[dialog].score}</p><p>{description}.</p></> : null}
    </dialog>
  </>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
