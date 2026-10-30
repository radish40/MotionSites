import { useEffect, useMemo, useRef, useState } from 'react';
import { Hyperspeed, hyperspeedPresets } from './Component';
import { RefreshCw, Play, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type PresetKey = keyof typeof hyperspeedPresets;
export default function App() {
  const [presetKey, setPresetKey] = useState<PresetKey>('one');
  const [isSpeeding, setIsSpeeding] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [panel, setPanel] = useState<'info' | 'reply' | null>(null);
  const [reply, setReply] = useState(() => localStorage.getItem('hyperspeed-reply') || '');
  const [saved, setSaved] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const effectOptions = useMemo(() => ({
    ...hyperspeedPresets[presetKey],
    onSpeedUp: () => setIsSpeeding(true),
    onSlowDown: () => setIsSpeeding(false),
  }), [presetKey]);
  useEffect(() => {
    if (panel) dialog.current?.showModal();
    else dialog.current?.close();
  }, [panel]);
  const selectPreset = (key: PresetKey) => { setIsSpeeding(false); setPresetKey(key); };
  return (
    <main className="simulation" aria-label="Hyperspeed simulation">
      <Hyperspeed key={generation} effectOptions={effectOptions} />
      <div className="overlay">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          <h1>Hyperspeed</h1>
          <p>Warp Speed Simulation • {presetKey.toUpperCase()}</p>
        </motion.header>
        <div className="hint-slot">
          <AnimatePresence>
            {!isSpeeding && <motion.div className="hint" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}>
              <div className="play-ring"><Play size={20} fill="white" /></div>
              <p>Press &amp; Hold to Speed Up</p>
            </motion.div>}
          </AnimatePresence>
        </div>
        <motion.nav aria-label="Simulation presets" className="presets" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
          {(Object.keys(hyperspeedPresets) as PresetKey[]).map(key => <button key={key} aria-pressed={key === presetKey} className={key === presetKey ? 'selected' : ''} onClick={() => selectPreset(key)}>{key}</button>)}
        </motion.nav>
      </div>
      <div className="telemetry">CORE_SYSTEM_01 // WARP_DRIVE_ACTIVE<br />SECTOR: 7G-ALPHA-V<br />STABILITY: 98.4%</div>
      <div className="utilities">
        <button aria-label="Restart simulation" title="Restart simulation" onClick={() => { setIsSpeeding(false); setGeneration(g => g + 1); }}><RefreshCw size={16} /></button>
        <button aria-label="Simulation information" title="Simulation information" onClick={() => setPanel('info')}><Info size={16} /></button>
      </div>
      <button className="reply-button" onClick={() => { setSaved(false); setPanel('reply'); }}>Reply</button>
      <dialog ref={dialog} onCancel={() => setPanel(null)} onClick={event => { if (event.target === dialog.current) setPanel(null); }}>
        <div className="dialog-content">
          <button className="close" aria-label="Close dialog" onClick={() => setPanel(null)}><X size={18} /></button>
          {panel === 'info' ? <>
            <h2>Hyperspeed</h2><p>Explore six color palettes and space distortions. Press and hold anywhere in the simulation, or hold Space, to engage warp speed. Release to slow down.</p><p>Use the circular arrow to restart the current preset.</p>
          </> : <>
            <h2>Reply</h2><p>Your notes stay in this browser.</p>
            <form onSubmit={event => { event.preventDefault(); localStorage.setItem('hyperspeed-reply', reply); setSaved(true); }}>
              <label htmlFor="reply">Your message</label>
              <textarea id="reply" required value={reply} onChange={event => { setReply(event.target.value); setSaved(false); }} placeholder="What did you think of the ride?" />
              <button className="save" type="submit">Save reply</button>
              {saved && <p role="status">Reply saved in this browser.</p>}
            </form>
          </>}
        </div>
      </dialog>
    </main>
  );
}
