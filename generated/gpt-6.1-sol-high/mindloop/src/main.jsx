import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function App() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <video
        className="hero-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={`${import.meta.env.BASE_URL}assets/hero.mp4`} type="video/mp4" />
      </video>
      <header className="navbar">
        <a className="brand" href="#home" aria-label="Velorah home">Velorah<sup>®</sup></a>
        <nav aria-label="Main navigation">
          {['Home', 'Studio', 'About', 'Journal', 'Reach Us'].map(label => (
            <a key={label} href="#home">{label}</a>
          ))}
        </nav>
        <a className="liquid-glass nav-cta" href="#home">Begin Journey</a>
      </header>
      <main className="hero-content">
        <h1 id="hero-title" className="animate-fade-rise">Focus in a Distracted World</h1>
        <p className="animate-fade-rise-delay">We're designing tools for deep thinkers, bold creators, and quiet rebels. Amid the chaos, we build digital spaces for sharp focus and inspired work.</p>
        <a className="liquid-glass hero-cta animate-fade-rise-delay-2" href="#home">Begin Journey</a>
      </main>
    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
