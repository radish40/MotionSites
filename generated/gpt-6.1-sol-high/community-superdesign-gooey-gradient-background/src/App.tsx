import { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { GooeyGradientBackground } from './Component';

export default function App() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [exploring, setExploring] = useState(false);
  return (
    <main>
      <GooeyGradientBackground>
        <div className="hero">
          <h1>Bubbles</h1>
          <p>Move your mouse to interact with the gradient field.</p>
          <div className="actions">
            <button className="primary" onClick={() => setExploring(value => !value)}>{exploring ? 'Keep Exploring' : 'Get Started'}</button>
            <button onClick={() => dialogRef.current?.showModal()}>Learn More</button>
          </div>
          <div className="interaction-hint" role="status">{exploring ? 'Move, touch, explore. The colors follow you.' : ''}</div>
        </div>
      </GooeyGradientBackground>
      <dialog ref={dialogRef} onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>
        <div className="dialog-content">
          <button className="close" aria-label="Close" onClick={() => dialogRef.current?.close()}><X size={20} /></button>
          <h2>A little liquid magic.</h2>
          <p>Five flowing gradients blend into a living field of color. Move your mouse or drag your finger to add your own ripple.</p>
          <p>Made with animated gradients, an SVG gooey filter, and a glow that follows you.</p>
          <button className="primary" onClick={() => { dialogRef.current?.close(); setExploring(true); }}>Let’s explore</button>
        </div>
      </dialog>
    </main>
  );
}
