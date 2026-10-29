import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Check, ChevronRight, Timer } from 'lucide-react';
import './styles.css';

const background = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260704_143500_a76b8e64-2c69-4683-80e7-2bb060a921d6.png&w=1280&q=85';
const options = ['Sleep quality', 'Stress', 'Weight', 'Skin'];

function App() {
  const [selected, setSelected] = useState([2, 4]);
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState('');
  const [dragging, setDragging] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const start = useRef(0);
  const distance = useRef(0);
  const recognition = useRef<{stop: () => void} | null>(null);

  function toggle(id: number) {
    setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
    setConfirmed(false);
    setProgress(0);
  }

  function finish() {
    setConfirmed(true);
    setProgress(1);
  }

  function voice() {
    if (voiceActive) {
      recognition.current?.stop();
      setVoiceActive(false);
      return;
    }
    // Speech recognition is progressive enhancement; unavailable browsers give clear feedback.
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceMessage('Voice is unavailable in this browser. Tap your choices above.');
      return;
    }
    const listener = new SpeechRecognition();
    recognition.current = listener;
    listener.lang = 'en-US';
    listener.onresult = (event: any) => {
      const words = String(event.results[0][0].transcript).toLowerCase();
      const ids = options.flatMap((option, i) => words.includes(option.toLowerCase().split(' ')[0]) ? [i + 1] : []);
      if (ids.length) {
        setSelected(current => [...new Set([...current, ...ids])]);
        setConfirmed(false);
        setProgress(0);
        setVoiceMessage('Your choices have been updated.');
      } else setVoiceMessage('Try saying sleep, stress, weight, or skin.');
    };
    listener.onerror = () => { setVoiceActive(false); setVoiceMessage('Voice could not connect. Tap your choices above.'); };
    listener.onend = () => setVoiceActive(false);
    try { listener.start(); setVoiceActive(true); setVoiceMessage('Listening… Say sleep, stress, weight, or skin.'); }
    catch { setVoiceMessage('Voice is unavailable. Tap your choices above.'); }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-white">
      <section className="phone relative isolate overflow-hidden" aria-label="Vitaforge daily wellness quiz">
        <img className="backdrop-image" src={background} alt="" onError={event => {
          const image = event.currentTarget;
          if (!image.dataset.fallback) { image.dataset.fallback = 'true'; image.src = `${import.meta.env.BASE_URL}assets/wellness-background.webp`; }
        }} />
        <div className="backdrop-tint" />
        <div className="dynamic-island" aria-hidden="true" />
        <div className="content relative z-10 flex h-full flex-col">
          <header className="fade-up badge liquid-glass flex items-center self-start gap-1.5" style={{ animationDelay: '0.1s' }}>
            <Timer size={12} className="text-white/80" aria-hidden="true" />
            <span className="text-xs font-medium text-white/90">Vitaforge Daily</span>
          </header>

          <div className="title-section fade-up" style={{ animationDelay: '0.25s' }}>
            <p className="mb-2 text-sm text-white/60">Choose all that apply</p>
            <h1 className="text-[28px] font-normal leading-[1.12] tracking-[-0.8px] text-white">What aspects of your wellness would you like to boost?</h1>
          </div>

          <div className="selection-area flex-1">
            <div className="grid grid-cols-2 gap-3" role="group" aria-label="Wellness aspects">
              {options.map((option, index) => {
                const active = selected.includes(index + 1);
                return <button key={option} type="button" aria-pressed={active} onClick={() => toggle(index + 1)}
                  className={`option-card fade-up flex h-[100px] flex-col items-start justify-between rounded-[32px] p-4 text-left ${active ? 'liquid-glass-selected' : 'liquid-glass'}`}
                  style={{ animationDelay: `${0.4 + index * 0.08}s` }}>
                  <span className="text-[11px] font-medium text-white/50">0{index + 1}</span>
                  <span className="text-base font-medium text-white">{option}</span>
                </button>;
              })}
            </div>
          </div>

          <div className="voice-area fade-up relative flex flex-col items-center" style={{ animationDelay: '0.7s' }}>
            <div className="voice-glow" aria-hidden="true" />
            <button className={`voice-button liquid-glass relative flex h-16 w-16 items-center justify-center rounded-full ${voiceActive ? 'listening' : ''}`} type="button" onClick={voice} aria-label={voiceActive ? 'Stop listening' : 'Choose wellness aspects by voice'} aria-pressed={voiceActive}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M5 11v4M9 7v12M13 3v20M17 8v10M21 11v4" />
              </svg>
            </button>
            <span className="relative mt-2 text-xs text-white/70">{voiceActive ? 'listening' : 'voice'}</span>
            <p className="voice-feedback" role="status">{voiceMessage}</p>
          </div>

          <div className="fade-up" style={{ animationDelay: '0.85s' }}>
            <div ref={track} className={`confirm-track liquid-glass relative flex h-14 items-center justify-center rounded-full ${confirmed ? 'confirmed' : ''}`}>
              <span className="text-sm font-medium text-white/60" aria-live="polite">{confirmed ? 'Done ✓' : 'Done'}</span>
              <div className="absolute right-4 flex" aria-hidden="true">
                <ChevronRight size={14} className="text-white/40" /><ChevronRight size={14} className="-ml-1 text-white/50" /><ChevronRight size={14} className="-ml-1 text-white/60" />
              </div>
              <button type="button" className="slider-thumb absolute left-1.5 top-1.5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-800"
                aria-label={confirmed ? 'Wellness choices confirmed' : 'Slide to confirm wellness choices'}
                role="slider" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-valuetext={confirmed ? 'Confirmed' : 'Slide right to confirm'}
                style={{ left: `calc(6px + ${progress} * (100% - 56px))`, transition: dragging ? 'none' : 'left 300ms cubic-bezier(0.22, 1, 0.36, 1)' }}
                onPointerDown={event => {
                  if (confirmed) return;
                  start.current = event.clientX;
                  distance.current = 0;
                  setDragging(true);
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={event => {
                  if (!dragging || !track.current) return;
                  const next = Math.min(1, Math.max(0, (event.clientX - start.current) / (track.current.clientWidth - 56)));
                  distance.current = next;
                  setProgress(next);
                }}
                onPointerUp={() => { if (!dragging) return; setDragging(false); if (distance.current > 0.85) finish(); else setProgress(0); }}
                onPointerCancel={() => { setDragging(false); setProgress(confirmed ? 1 : 0); }}
                onKeyDown={event => { if (['ArrowRight', 'End', 'Enter', ' '].includes(event.key)) { event.preventDefault(); finish(); } }}>
                {confirmed ? <Check size={20} aria-hidden="true" /> : <ArrowRight size={20} aria-hidden="true" />}
              </button>
            </div>
            <span className="sr-only" role="status">{confirmed ? `Confirmed: ${options.filter((_, i) => selected.includes(i + 1)).join(', ') || 'No aspects selected'}.` : ''}</span>
          </div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
