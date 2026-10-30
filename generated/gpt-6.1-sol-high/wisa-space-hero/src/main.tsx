import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

type Tool = 'notes' | 'canvas' | 'collections';
type Saved = { name: string; notes: string; ideas: string[]; collection: string[] };
const initial: Saved = { name: 'My little universe', notes: '', ideas: [], collection: [] };
function readSaved(): Saved { try { const data = JSON.parse(localStorage.getItem('wisa-workspace') || 'null'); if (data && typeof data.name === 'string' && typeof data.notes === 'string' && Array.isArray(data.ideas) && data.ideas.every((x: unknown) => typeof x === 'string') && Array.isArray(data.collection) && data.collection.every((x: unknown) => typeof x === 'string')) return data; } catch {} return initial; }
function Icon({ type, size = 24 }: {type: string; size?: number}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{type === 'arrow' ? <path d="M5 12h14m-6-6 6 6-6 6"/> : type === 'notes' ? <><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h5"/></> : type === 'canvas' ? <><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 9v12M14 14l3 3m0-3-3 3"/></> : type === 'collections' ? <><rect x="7" y="7" width="14" height="14" rx="2"/><path d="M17 7V3H3v14h4"/></> : type === 'close' ? <path d="m6 6 12 12M18 6 6 18"/> : <path d="M12 4v16M4 12h16"/>}</svg>;
}
function SpaceArt() {
  return <div className="space-art" aria-label="An illustrated lavender planet with orbiting ideas" role="img">
    <div className="art-grid"/><div className="coordinate coordinate-top">IMAGINATION HAS NO LIMITS</div>
    <svg className="planet" viewBox="0 0 650 580" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="planet" cx=".28" cy=".23" r=".82"><stop stopColor="#e2ddf4"/><stop offset=".38" stopColor="#bab0d9"/><stop offset=".72" stopColor="#8f81b2"/><stop offset="1" stopColor="#514565"/></radialGradient>
        <radialGradient id="moon" cx=".3" cy=".25" r=".8"><stop stopColor="#efffb9"/><stop offset=".5" stopColor="#d1ef8d"/><stop offset="1" stopColor="#7d9453"/></radialGradient>
        <filter id="shadow"><feGaussianBlur stdDeviation="14"/></filter>
      </defs>
      <ellipse cx="340" cy="472" rx="136" ry="17" fill="#494439" opacity=".13" filter="url(#shadow)"/>
      <g className="orbit-back"><ellipse cx="326" cy="294" rx="291" ry="94" transform="rotate(-28 326 294)" stroke="#737566" strokeWidth=".8"/><ellipse cx="326" cy="294" rx="260" ry="153" transform="rotate(48 326 294)" stroke="#939184" strokeWidth=".7" strokeDasharray="3 7"/></g>
      <circle cx="326" cy="290" r="167" fill="url(#planet)"/>
      <path d="M176 216c25-49 92-82 151-78" stroke="#f7f1ff" strokeOpacity=".23" strokeWidth="1.2"/>
      <path d="M69 327c-30 48 40 78 157 55 142-26 301-112 350-183" stroke="#626957" strokeWidth="1"/>
      <g className="moon"><circle cx="538" cy="205" r="31" fill="url(#moon)"/><circle cx="528" cy="196" r="8" fill="#f4ffd0" opacity=".18"/></g>
      <circle cx="147" cy="419" r="6" fill="#454b3c"/><circle cx="184" cy="116" r="3" fill="#7c826e"/>
      <path d="M563 361v18m-9-9h18M113 183v12m-6-6h12M434 76v13m-6-7h12" stroke="#59614d"/>
    </svg>
    <div className="idea-tag"><span className="tiny-spark">✳</span> A little space. Infinite possibilities.</div>
    <div className="orbit-label"><span/> YOUR IDEAS, IN ORBIT</div>
    <span className="art-index">FIG. 01 / A SPACE TO BEGIN</span>
  </div>;
}
const features: { tool: Tool; number: string; title: string; text: string; hint: string }[] = [
  {tool:'notes', number:'01', title:'Catch a thought.', text:'Give your ideas somewhere to land.', hint:'Open notes'},
  {tool:'canvas', number:'02', title:'See the bigger picture.', text:'Make connections. Find a new direction.', hint:'Explore canvas'},
  {tool:'collections', number:'03', title:'Keep what moves you.', text:'A home for the things that spark something.', hint:'Start a collection'}
];
function App() {
  const [saved, setSaved] = useState<Saved>(readSaved);
  const [modal, setModal] = useState<'create' | 'workspace' | 'about' | null>(null);
  const [tool, setTool] = useState<Tool>('notes');
  const [name, setName] = useState(''); const [draft, setDraft] = useState('');
  const [saveStatus, setSaveStatus] = useState('Saved on this device');
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  useEffect(() => { try { localStorage.setItem('wisa-workspace', JSON.stringify(saved)); setSaveStatus('Saved on this device'); } catch { setSaveStatus('Storage unavailable · changes last until refresh'); } }, [saved]);
  useEffect(() => { if (modal) { if (!dialog.current?.open) trigger.current = document.activeElement as HTMLElement; dialog.current?.showModal(); } else { dialog.current?.close(); trigger.current?.focus(); } }, [modal]);
  const open = (t: Tool) => { setTool(t); setDraft(''); setModal('workspace'); };
  const addItem = (e: React.FormEvent) => { e.preventDefault(); if (!draft.trim()) return; setSaved(s => ({...s, [tool === 'canvas' ? 'ideas' : 'collection']: [...(tool === 'canvas' ? s.ideas : s.collection), draft.trim()]})); setDraft(''); };
  return <>
    <div className="site-shell">
      <header className="header"><a className="brand" href="#" aria-label="WISA Space home"><span className="brand-symbol">w</span>wisa<span className="brand-light">.space</span></a><nav aria-label="Main navigation"><a href="#possibilities">The possibilities <span>↗</span></a><button onClick={() => setModal('about')}>Our little universe</button></nav><button className="workspace-button" onClick={() => open('notes')}>Your workspace <Icon type="arrow" size={17}/></button></header>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy"><p className="eyebrow"><span className="status-dot"/> A SPACE FOR WHAT'S NEXT</p><h1 id="hero-title">Big ideas.<br/>{' '}A little <span className="space-word">space<svg viewBox="0 0 300 25" aria-hidden="true"><path d="M3 19C76 0 185 3 296 10"/></svg></span>.</h1><p className="intro">Somewhere to think freely, connect the dots,<br className="desktop-break"/> and bring your next idea to life.</p><div className="hero-actions"><button className="primary" onClick={() => {setName(''); setModal('create');}}>Make yourself a space <Icon type="arrow" size={20}/></button><span className="start-note">No sign-up.<br/>Just a little curiosity.</span></div><div className="small-proof"><span className="mini-orbits"><i/><i/><i/></span><span>A quieter place for a busy mind.</span></div></div>
          <SpaceArt/>
        </section>
        <section id="possibilities" className="possibilities" aria-labelledby="possibilities-title"><div className="section-heading"><h2 id="possibilities-title">One space. All your possibilities.</h2><p>A thought, a plan, a spark. Start anywhere. <span>↙</span></p></div><div className="feature-grid">{features.map(f => <button className={'feature-card '+f.tool} key={f.tool} onClick={() => open(f.tool)} aria-label={f.hint}><div className="card-top"><span className="feature-icon"><Icon type={f.tool}/></span><span className="card-number">/ {f.number}</span></div><h3>{f.title}</h3><p>{f.text}</p><span className="card-link">{f.hint}<Icon type="arrow" size={19}/></span></button>)}</div></section>
      </main>
      <footer><span>WISA SPACE © {new Date().getFullYear()}</span><span className="footer-center">A little more room for possibility.</span><button onClick={() => setModal('about')}>An original workspace concept <span>↗</span></button></footer>
    </div>
    <dialog ref={dialog} onCancel={() => setModal(null)} onClick={e => {if(e.target === dialog.current) setModal(null);}} aria-labelledby="dialog-title"><button className="close-button" aria-label="Close dialog" onClick={() => setModal(null)}><Icon type="close"/></button>
      {modal === 'create' && <div className="create-content"><span className="dialog-eyebrow">YOUR NEXT CHAPTER</span><h2 id="dialog-title">Every idea needs<br/>a little space.</h2><p>Give yours a name. You can start small.</p><form onSubmit={e => { e.preventDefault(); if(name.trim()) {setSaved(s => ({...s, name: name.trim()})); setTool('notes'); setModal('workspace');} }}><label htmlFor="space-name">Your space name</label><input id="space-name" autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="e.g. A wonderfully wild idea" maxLength={60} required/><button className="primary" type="submit">Create my space <Icon type="arrow" size={20}/></button></form><small>Local to this browser. No account or AI service connected.</small></div>}
      {modal === 'about' && <div className="about-content"><span className="dialog-eyebrow">HELLO, CURIOUS MIND</span><h2 id="dialog-title">A little universe.<br/>Entirely yours.</h2><p>WISA Space is an original concept for a calmer creative workspace. Catch a thought, map out ideas, or gather the things that inspire you.</p><p>This interactive demo keeps your work in this browser. No account, cloud sync, or AI backend is connected.</p><div className="concept-note">Created from the WISA Space catalog brief. The original design prompt and reference were unavailable; this is an original interpretation.</div><button className="primary" onClick={() => open('notes')}>Find your space <Icon type="arrow" size={20}/></button></div>}
      {modal === 'workspace' && <div className="workspace-content"><span className="dialog-eyebrow">YOUR PERSONAL ORBIT</span><h2 id="dialog-title">{saved.name}</h2><p className="save-status"><span className="status-dot"/>{saveStatus}</p><div className="tool-tabs" role="tablist" aria-label="Workspace tools">{features.map(f => <button key={f.tool} id={'tab-'+f.tool} role="tab" aria-selected={tool === f.tool} aria-controls="tool-panel" tabIndex={tool === f.tool ? 0 : -1} onKeyDown={e => {if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') {e.preventDefault(); const index = features.findIndex(f => f.tool === tool); const next = features[(index + (e.key === 'ArrowRight' ? 1 : 2)) % 3].tool; setTool(next); setDraft(''); document.getElementById('tab-'+next)?.focus();}}} onClick={() => {setTool(f.tool); setDraft('');}}><Icon type={f.tool} size={18}/>{f.tool[0].toUpperCase()+f.tool.slice(1)}</button>)}</div><div id="tool-panel" role="tabpanel" aria-labelledby={'tab-'+tool}>
      {tool === 'notes' ? <><label className="field-label" htmlFor="note">What's on your mind?</label><textarea id="note" value={saved.notes} onChange={e => setSaved(s => ({...s, notes: e.target.value}))} placeholder="An unfinished thought is a perfect place to start…"/><span className="char-count">{saved.notes.length} characters · auto-saved locally</span></> : <><p className="tool-description">{tool === 'canvas' ? 'Let your ideas sit side by side. Add a thought to your canvas.' : 'Gather a title, a quote, or a little piece of inspiration.'}</p><form className="add-form" onSubmit={addItem}><input aria-label={tool === 'canvas' ? 'New idea' : 'New inspiration'} value={draft} onChange={e => setDraft(e.target.value)} maxLength={180} placeholder={tool === 'canvas' ? 'What if we…' : 'Something worth keeping…'} required/><button type="submit" className="add-button" aria-label={tool === 'canvas' ? 'Add idea' : 'Add inspiration'}><Icon type="plus" size={20}/></button></form>{(tool === 'canvas' ? saved.ideas : saved.collection).length === 0 ? <div className="empty-state"><Icon type={tool} size={32}/><p>{tool === 'canvas' ? 'Room for your first big “what if.”' : 'Your inspiration starts here.'}</p><span>Add something above to begin.</span></div> : <ul className={'saved-items '+tool}>{(tool === 'canvas' ? saved.ideas : saved.collection).map((item,i) => <li key={i}><span className="item-index">{String(i+1).padStart(2,'0')}</span><p>{item}</p><button aria-label={'Remove '+item} onClick={() => setSaved(s => ({...s, [tool === 'canvas' ? 'ideas' : 'collection']: (tool === 'canvas' ? s.ideas : s.collection).filter((_,j) => i !== j)}))}><Icon type="close" size={16}/></button></li>)}</ul>}</>}
      </div></div>}
    </dialog>
  </>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
