import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Star, ChevronDown, ArrowRight, ArrowUpRight, BarChart3, BookOpen, Users, Rocket, Check, X, SlidersHorizontal, Database, Sparkles, CircleCheck, ShieldCheck, Activity, Globe, Zap } from 'lucide-react';
import './index.css';

const tabs = [{ id: 'analyse', label: 'Analyse', icon: BarChart3 }, { id: 'train', label: 'Train', icon: BookOpen }, { id: 'testing', label: 'Testing', icon: Users }, { id: 'deploy', label: 'Deploy', icon: Rocket }];
const entrance = delay => ({ opacity: 0, animationDelay: `${delay}s` });
const blackButton = 'rounded-full bg-black text-white font-medium hover:bg-gray-800 transition-colors';

function App() {
  const [active, setActive] = useState('analyse');
  const [menu, setMenu] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [deployed, setDeployed] = useState(false);
  const [paused, setPaused] = useState(false);
  const workspace = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (paused || dialog) return;
    const timer = setInterval(() => setActive(current => tabs[(tabs.findIndex(t => t.id === current) + 1) % 4].id), 4000);
    return () => clearInterval(timer);
  }, [paused, dialog, active]);
  useEffect(() => {
    if (!dialog) return;
    const previous = document.activeElement;
    dialogRef.current?.querySelector('input, button')?.focus();
    const handler = event => {
      if (event.key === 'Escape') setDialog(null);
      if (event.key === 'Tab') {
        const elements = [...dialogRef.current.querySelectorAll('button, input')];
        const first = elements[0], last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; previous?.focus(); };
  }, [dialog]);
  useEffect(() => {
    const close = e => { if (!e.target.closest('[data-navigation]')) setMenu(null); };
    const key = e => { if (e.key === 'Escape') setMenu(null); };
    document.addEventListener('click', close); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('click', close); document.removeEventListener('keydown', key); };
  }, []);
  function openDialog(type) { setSubmitted(false); setMenu(null); setDialog(type); }
  function selectTab(id, scroll = false) {
    setActive(id); setMenu(null);
    if (scroll) workspace.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return <div className="min-h-screen bg-white text-black">
    <nav className="relative z-30 max-w-7xl mx-auto px-6 py-4 flex items-center justify-between animate-fade-in-up" style={entrance(.1)} aria-label="Main navigation">
      <a href="#" className="flex items-center gap-2 text-lg font-semibold tracking-tight" aria-label="Stellar.ai home"><Star className="w-5 h-5 fill-black" strokeWidth={1.5}/>Stellar.ai</a>
      <div className="hidden md:flex items-center gap-8" data-navigation>
        {['Solutions', 'For Teams', 'About Us', 'Learn Hub'].map(label => <div className="relative" key={label}>
          <button className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-black transition-colors py-2" onClick={() => setMenu(menu === label ? null : label)} aria-expanded={menu === label}>{label}{['Solutions','For Teams'].includes(label) && <ChevronDown className={`w-3.5 h-3.5 transition-transform ${menu === label ? 'rotate-180' : ''}`}/>}</button>
          {menu === label && <div className="nav-menu animate-fade-in-overlay">
            {label === 'Solutions' ? tabs.map(({id,label,icon: Icon}) => <button key={id} onClick={() => selectTab(id,true)}><Icon size={16}/>{label}<ArrowUpRight size={13} className="ml-auto"/></button>) : label === 'For Teams' ? ['Operations', 'Product & Engineering', 'Marketing'].map(team => <button key={team} onClick={() => openDialog('trial')}><Users size={16}/>{team}<ArrowUpRight size={13} className="ml-auto"/></button>) : <><p className="font-semibold text-black mb-2">{label === 'About Us' ? 'A little more possibility.' : 'Your next step, simplified.'}</p><p className="text-xs leading-relaxed text-gray-500">{label === 'About Us' ? 'Stellar.ai helps teams turn everyday work into extraordinary progress with intelligent automation.' : 'Explore the workflow: analyse your data, train your model, test with confidence, and deploy.'}</p><button onClick={() => selectTab('analyse',true)} className="mt-3">Explore Stellar<ArrowRight size={15}/></button></>}
          </div>}
        </div>)}
      </div>
      <div className="flex items-center gap-6"><button onClick={() => openDialog('login')} className="text-sm text-gray-700 hover:text-black">Login</button><button onClick={() => openDialog('trial')} className={`${blackButton} px-5 py-2.5 text-sm`}>Get started free</button></div>
    </nav>

    <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
      <div className="inline-flex items-center gap-2 mb-8 animate-fade-in-up" style={entrance(.2)}><span className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center"><Star size={15} className="fill-black" strokeWidth={1.5}/></span><span className="text-sm font-medium">4.9 rating from 18.3K+ users</span></div>
      <h1 className="text-6xl md:text-7xl lg:text-[80px] font-normal leading-[1.1] tracking-tight mb-5 animate-fade-in-up" style={entrance(.3)}>Work Smarter. Move Faster.<br/><span className="bg-gradient-to-r from-black via-gray-500 to-gray-400 bg-clip-text text-transparent">AI Powers You Up.</span></h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={entrance(.4)}>Intelligent automation syncs with the tools you love to streamline tasks, boost output, and save time.</p>
      <div className="animate-fade-in-up" style={entrance(.5)}><button onClick={() => openDialog('trial')} className={`${blackButton} px-8 py-3 text-base mb-12`}>Begin Free Trial</button></div>
      <div className="animate-fade-in-up mb-8" style={entrance(.6)}>
        <div className="tab-bar mx-auto bg-gray-100 rounded-lg p-1 grid grid-cols-2 md:inline-flex md:items-center" role="tablist" aria-label="AI workflow" onKeyDown={e => { if (['ArrowRight','ArrowLeft','Home','End'].includes(e.key)) { e.preventDefault(); const index = tabs.findIndex(t => t.id === active); const next = e.key === 'Home' ? 0 : e.key === 'End' ? 3 : (index + (e.key === 'ArrowRight' ? 1 : 3)) % 4; selectTab(tabs[next].id); document.getElementById(`tab-${tabs[next].id}`).focus(); } }}>
          {tabs.map(({id,label,icon:Icon}, index) => <React.Fragment key={id}>{index > 0 && <span aria-hidden="true" className="hidden md:block w-px h-5 bg-gray-300 mx-1"/>}<button id={`tab-${id}`} role="tab" aria-selected={active === id} aria-controls="workflow-panel" tabIndex={active === id ? 0 : -1} onClick={() => selectTab(id)} className={`flex items-center justify-center gap-2 px-7 py-2.5 text-sm rounded-md transition-all ${active === id ? 'bg-white text-black shadow-sm' : 'text-gray-600 hover:text-black hover:bg-white/50'}`}><Icon size={16} strokeWidth={1.7}/>{label}</button></React.Fragment>)}
        </div>
      </div>
      <section ref={workspace} className="workspace relative rounded-3xl overflow-hidden h-[400px] md:h-[500px] animate-fade-in-up" style={entrance(.7)} aria-label="Interactive AI workspace demonstration" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}>
        <video src={`${import.meta.env.BASE_URL}assets/stellar-workspace.mp4`} autoPlay loop muted playsInline className="w-full h-full object-cover" aria-label="Dreamlike purple garden with flowering trees and mountains"/>
        <div key={active} className="absolute inset-0 animate-fade-in-overlay bg-black/[0.03]" id="workflow-panel" role="tabpanel" aria-labelledby={`tab-${active}`}>
          <div className="workspace-card animate-slide-up-overlay">
            {active === 'analyse' && <>
              <div className="card-heading"><span className="panel-icon purple"><Sparkles size={19}/></span><span className="text-xs text-gray-400">Step {step} of 4</span><button aria-label="Restart workspace setup" onClick={() => setStep(1)} className="text-gray-400 hover:text-black"><SlidersHorizontal size={17}/></button></div>
              <h2>Set Up Your AI Workspace</h2><p className="card-description">A smarter way to work starts here.</p>
              <div className="progress-track"><div className="bg-violet-500 transition-all duration-500" style={{width:`${step * 25}%`}}/></div>
              <div className="setup-steps">{[{icon:Database,label:'Connect your data',sub:'Bring your tools together'},{icon:SlidersHorizontal,label:'Customize your workspace',sub:'Make it work your way'},{icon:Sparkles,label:'Choose your AI model',sub:'Find your perfect fit'},{icon:Users,label:'Invite your team',sub:'Better, together'}].map(({icon:Icon,label,sub},i) => <button className={`setup-row ${i + 1 === step ? 'selected' : ''}`} key={label} onClick={() => setStep(i+1)}><span className={`step-icon ${i+1 < step ? 'complete' : ''}`}>{i+1 < step ? <Check size={15}/> : <Icon size={16}/>}</span><span className="flex-1"><span className="block text-xs font-medium">{label}</span><span className="text-[10px] text-gray-400">{sub}</span></span>{i+1 < step ? <Check size={14} className="text-violet-500"/> : <span className={`step-number ${i+1===step ? 'current' : ''}`}>{i+1}</span>}</button>)}</div>
              <div className="card-footer"><span className="text-[10px] text-gray-400">Just a few steps to something great.</span><button onClick={() => step < 4 ? setStep(step+1) : selectTab('train')} className="mini-button">Continue<ArrowRight size={12}/></button></div>
            </>}
            {active === 'train' && <>
              <div className="card-heading"><span className="panel-icon orange"><BookOpen size={19}/></span><span className="status-pill orange"><span className="status-dot"/>Training in progress</span></div>
              <h2>AI Model Training</h2><p className="card-description">Learning your workflow. Unlocking your potential.</p>
              <div className="training-progress flex justify-between mt-6 mb-2 text-xs"><span className="text-gray-500">Training progress</span><span className="font-semibold">67<span className="text-gray-400">%</span></span></div>
              <div className="progress-track !mt-0"><div className="bg-orange-400 w-[67%]"/></div>
              <div className="training-metrics grid grid-cols-2 gap-3 my-5">{[['Accuracy','98.4%','+2.1%'],['Epochs','24 / 36','On track'],['Training loss','0.024','−0.018'],['Time remaining','~2 min','Almost there']].map(([label,value,detail]) => <div key={label} className="metric"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>)}</div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 border-t pt-4"><Activity size={13} className="text-orange-400"/>Your model is getting smarter with every step.</div>
            </>}
            {active === 'testing' && <>
              <div className="card-heading"><span className="panel-icon green"><ShieldCheck size={19}/></span><span className="status-pill green"><Check size={11}/>All systems passed</span></div>
              <h2>Test Suite Results</h2><p className="card-description">Tested thoroughly. Ready for what’s next.</p>
              <div className="test-success"><CircleCheck size={32} strokeWidth={1.5}/><strong>127<span className="text-gray-400 font-normal text-lg"> / 127</span></strong><span>Tests passed successfully</span></div>
              <div className="testing-metrics space-y-3 my-5">{[['Model accuracy','99.2%'],['Response time','142 ms'],['Security checks','Passed']].map(([label,value]) => <div key={label} className="flex items-center justify-between text-xs"><span className="text-gray-500">{label}</span><span className="flex items-center gap-2 font-medium">{value}<CircleCheck size={13} className="text-emerald-500"/></span></div>)}</div>
              <div className="card-footer"><span className="text-[10px] text-gray-400">Looking good. Let’s go live.</span><button className="mini-button" onClick={() => selectTab('deploy')}>Next step<ArrowRight size={12}/></button></div>
            </>}
            {active === 'deploy' && <>
              <div className="card-heading"><span className="panel-icon blue"><Rocket size={19}/></span><span className={`status-pill ${deployed ? 'green' : 'blue'}`}>{deployed ? 'Live' : 'Ready to launch'}</span></div>
              <h2>{deployed ? 'You’re Live!' : 'Deploy to Production'}</h2><p className="card-description">{deployed ? 'Your AI workspace is ready for your team.' : 'Your next chapter starts with one click.'}</p>
              <div className="deployment-checklist my-6 space-y-4">{[[Database,'Model trained and optimized'],[ShieldCheck,'All tests passed'],[Globe,'Production environment ready'],[Zap,'Auto-scaling enabled']].map(([Icon,label]) => <div key={label} className="flex items-center gap-3 text-xs"><span className="p-2 rounded-lg bg-gray-50 text-gray-500"><Icon size={15}/></span><span className="flex-1">{label}</span><CircleCheck className="text-emerald-500" size={16}/></div>)}</div>
              <button disabled={deployed} onClick={() => setDeployed(true)} className="w-full bg-black text-white rounded-lg py-3 text-xs font-medium flex gap-2 justify-center items-center hover:bg-gray-800 disabled:bg-emerald-600">{deployed ? <Check size={14}/> : <Rocket size={14}/>} {deployed ? 'Deployment Complete' : 'Deploy Now'}</button>
              <p className="text-[10px] text-gray-400 text-center mt-3">{deployed ? 'Interactive preview · no live services connected' : 'Secure, seamless, and ready when you are.'}</p>
            </>}
          </div>
        </div>
      </section>
      <div className="company-logos mt-24 flex flex-wrap items-center justify-between gap-8 animate-fade-in-up" style={entrance(.8)} aria-label="Trusted by forward-thinking teams">
        <span className="interscope">INTERSCOPE<span className="block text-[7px] tracking-[.35em] mt-1">RECORDS</span></span>
        <span className="flex items-center gap-2 text-[25px] font-semibold tracking-tight"><svg width="29" height="29" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="currentColor"/><path d="M7 12c6-2 13-1.5 18 1M8.5 16.5c5-1.5 10.5-1 15 1M10 21c4-1 8-1 12 1" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>Spotify</span>
        <span className="flex items-center gap-2 text-[25px] font-medium tracking-tight"><DotGrid/>Nexera</span>
        <span className="m3">M3</span>
        <span className="flex items-center gap-2.5"><span className="lc-mark">LC</span><span className="text-[12px] font-semibold tracking-[.12em]">LAURA COLE</span></span>
        <span className="flex items-center gap-2 text-[26px] font-semibold tracking-tight"><DotGrid vertex/>vertex</span>
      </div>
    </main>
    {dialog && <div className="fixed z-50 inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-5 animate-fade-in-overlay" onClick={e => { if (e.target === e.currentTarget) setDialog(null); }}><div role="dialog" aria-modal="true" aria-labelledby="dialog-title" ref={dialogRef} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative text-left"><button className="absolute right-4 top-4 text-gray-400 hover:text-black" aria-label="Close dialog" onClick={() => setDialog(null)}><X size={18}/></button><Star className="fill-black mb-6" size={25}/><h2 id="dialog-title" className="text-2xl tracking-tight mb-3">{submitted ? 'You’re on the list.' : dialog === 'trial' ? 'Make room for smarter work.' : 'Welcome back.'}</h2>{submitted ? <><p className="text-sm text-gray-500 leading-relaxed mb-6">This is a Stellar.ai preview. Your details haven’t been sent or saved. Explore your AI workspace below.</p><button onClick={() => { setDialog(null); selectTab('analyse',true); }} className={`${blackButton} w-full py-3 text-sm`}>Explore workspace</button></> : <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}><p className="text-sm text-gray-500 mb-6">{dialog === 'trial' ? 'Start your journey with Stellar.ai.' : 'Enter your email to continue to your workspace.'}</p><label htmlFor="email" className="block text-xs font-medium mb-2">Work email</label><input id="email" type="email" placeholder="you@company.com" required className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm mb-4 outline-none focus:border-black"/><button className={`${blackButton} w-full py-3 text-sm`}>{dialog === 'trial' ? 'Get started free' : 'Continue with email'}</button><p className="text-[10px] text-gray-400 text-center mt-4">Interactive preview. No account will be created.</p></form>}</div></div>}
  </div>;
}
function DotGrid({vertex=false}) { return <span className={`dot-grid ${vertex ? 'vertex-grid' : ''}`} aria-hidden="true">{Array.from({length:9},(_,i)=><i key={i}/>)}</span>; }

createRoot(document.getElementById('root')).render(<App/>);
