import { useState, type FormEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { Apple, Check, Chrome, Eye, EyeOff, Twitter } from 'lucide-react';
import './index.css';

const videoSource = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_191911_e7dc783e-a580-4974-8971-9796ecffd3bd.mp4';
function Logo({ size = 36 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 256 256" fill="#DA3F23" aria-hidden="true"><path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z"/></svg>;
}
function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState('');
  const inputClass = 'w-full bg-zinc-800/70 text-white placeholder-zinc-500 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-colors';
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('Your details are ready. Account creation is not connected in this preview.');
  }
  function previewLink(event: React.MouseEvent<HTMLAnchorElement>, feature: string) {
    event.preventDefault();
    setNotice(`${feature} is not connected in this preview.`);
  }
  return <main className="relative min-h-screen w-screen overflow-x-hidden flex items-center justify-center bg-black py-6 sm:py-0 sm:h-screen sm:overflow-hidden">
    <video className="absolute inset-0 w-full h-full object-cover" src={videoSource} autoPlay muted loop playsInline aria-hidden="true"/>
    <section aria-label="Create your NovaDesk account" className="relative z-10 flex flex-col sm:flex-row w-full max-w-4xl mx-4 rounded-2xl overflow-hidden shadow-2xl sm:h-[660px]">
      <div className="w-full sm:w-1/2 px-6 sm:px-10 py-8 sm:py-10 flex flex-col" style={{ background: 'rgba(10, 10, 10, 0.92)' }}>
        <div className="flex items-center gap-2 text-[#DA3F23]"><Logo/><span className="font-semibold tracking-tight text-lg">NovaDesk</span></div>
        <div className="flex flex-col gap-5 mt-8 sm:mt-auto">
          <div><h1 className="text-white text-2xl font-semibold tracking-tight">Sign up</h1><p className="text-zinc-400 text-sm mt-1.5 leading-relaxed">Set up your profile and jump in right now.</p></div>
          <form onSubmit={submit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <label className="sr-only" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="Input Email" required value={email} onChange={e => setEmail(e.target.value)} className={inputClass}/>
              <div className="relative">
                <label className="sr-only" htmlFor="password">Password</label>
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Choose Password" required value={password} onChange={e => setPassword(e.target.value)} className={`${inputClass} pr-11`}/>
                <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1">{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-xs leading-relaxed">
              <label className="flex items-center cursor-pointer shrink-0">
                <input type="checkbox" name="terms" aria-label="I agree to the Rules and Privacy Notice" required checked={agreed} onChange={e => setAgreed(e.target.checked)} className="peer sr-only"/>
                <span className={`flex items-center justify-center w-4 h-4 rounded border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-zinc-400 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-black ${agreed ? 'bg-white border-white' : 'border-zinc-600 bg-transparent'}`}>{agreed && <Check size={12} strokeWidth={3} className="text-black"/>}</span>
              </label>
              <span>I Agree On The <a href="#rules" onClick={e => previewLink(e, 'Rules')} className="underline text-zinc-200 hover:text-white transition-colors">Rules</a> &amp; <a href="#privacy" onClick={e => previewLink(e, 'Privacy Notice')} className="underline text-zinc-200 hover:text-white transition-colors">Privacy Notice</a></span>
            </div>
            <button type="submit" className="w-full bg-white text-black text-sm font-semibold rounded-lg py-2.5 hover:bg-zinc-100 active:bg-zinc-200 transition-colors">Launch Account</button>
          </form>
          <div className="flex items-center gap-3"><span className="flex-1 h-px bg-zinc-700/60"/><span className="text-zinc-500 text-xs">or join us via</span><span className="flex-1 h-px bg-zinc-700/60"/></div>
          <div className="flex gap-3">{[{ name: 'Google', Icon: Chrome }, { name: 'Apple', Icon: Apple }, { name: 'Twitter', Icon: Twitter }].map(({ name, Icon }) => <button key={name} type="button" onClick={() => setNotice(`${name} sign-in is not connected in this preview.`)} className="flex items-center justify-center gap-2 flex-1 bg-zinc-800/60 rounded-lg py-2 text-zinc-300 text-sm hover:bg-zinc-700/60 hover:text-white transition-colors"><Icon size={15}/>{name}</button>)}</div>
          <p className="text-zinc-500 text-xs text-center">Already Hold An Account? <a href="#enter" onClick={e => previewLink(e, 'Sign-in')} className="text-zinc-200 hover:text-white font-medium transition-colors">Enter</a></p>
        </div>
      </div>
      <div aria-hidden="true" className="hidden sm:flex w-1/2 items-center justify-center border" style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255,255,255,0.08)' }}><div style={{ marginTop: -70 }}><Logo size={34}/></div></div>
    </section>
    {notice && <div role="status" className="fixed z-20 bottom-4 left-4 right-4 mx-auto max-w-md rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 shadow-xl flex gap-4 items-center"><span className="flex-1">{notice}</span><button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')} className="text-zinc-400 hover:text-white transition-colors">Close</button></div>}
  </main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
