import { assets, localAsset } from './assets';
import { Pin } from './Icons';
export default function Section2() {
  return <section id="approach" aria-label="Our approach" style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontFamily: "'Zimula Trial Med', sans-serif", background: `#b4b3a6 url(${localAsset('section-fallback.svg')}) center / cover` }}>
    <video src={assets.section2} autoPlay muted loop playsInline aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
    <div style={{ background: 'rgba(242, 238, 230, 0.38)', position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }} />
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', textAlign: 'center', padding: '0 24px', zIndex: 2 }}><h2 style={{ fontSize: 'clamp(32px, 5.5vw, 80px)', lineHeight: 1.18, color: '#2a2420', maxWidth: 780, letterSpacing: '-0.025em', fontWeight: 400 }}>What stands the<br />test of time is all<br />that guides the<br />work.</h2></div>
    <div style={{ position: 'absolute', bottom: 'clamp(24px, 4vh, 48px)', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px', zIndex: 2 }}><div style={{ width: 1, height: 56, background: 'rgba(42,36,32,0.25)' }} /><div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}><Pin /><p style={{ fontSize: 'clamp(11px, 1.4vw, 13px)', color: '#2a2420', letterSpacing: '0.04em', lineHeight: 1.6, maxWidth: 340, opacity: 0.75, textAlign: 'center' }}>Civic bodies and private clients trust us to shape resilient communities and purposeful places.</p></div></div>
  </section>;
}
