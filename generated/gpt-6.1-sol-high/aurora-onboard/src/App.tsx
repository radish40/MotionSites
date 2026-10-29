import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Chrome, Circle, Eye, EyeOff, Github } from 'lucide-react';

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const reduceMotion = useReducedMotion();
  const reveal = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setMessage('Your profile details are ready. This preview does not create an account.');
  }

  return (
    <main className="flex min-h-screen w-full bg-black selection:bg-white/30 p-2 transition-all duration-500 lg:h-screen lg:overflow-hidden lg:p-4">
      <section aria-label="Welcome to Aurora" className="relative hidden w-[52%] flex-col items-center justify-end pb-32 px-12 rounded-3xl overflow-hidden shadow-2xl h-full lg:flex">
        <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline aria-hidden="true">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4" type="video/mp4" />
        </video>
        <motion.div className="z-10 w-full max-w-xs space-y-8" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } } }}>
          <motion.div variants={reveal} className="flex items-center justify-center gap-2.5">
            <Circle size={22} strokeWidth={0} className="fill-white text-white" />
            <span className="text-xl font-semibold tracking-tight">Aurora</span>
          </motion.div>
          <motion.div variants={reveal} className="space-y-3 text-center">
            <h2 className="text-4xl font-medium tracking-tight whitespace-nowrap">Join Aurora</h2>
            <p className="text-white/60 text-sm leading-relaxed px-4">Follow these 3 quick phases to activate your space.</p>
          </motion.div>
          <motion.div variants={reveal} className="space-y-3">
            <StepItem number={1} text="Register your identity" active />
            <StepItem number={2} text="Configure your studio" />
            <StepItem number={3} text="Finalize your profile" />
          </motion.div>
        </motion.div>
      </section>

      <section aria-labelledby="signup-title" className="flex-1 flex flex-col items-center justify-center py-12 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto lg:overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 0.8, ease: 'easeOut' }} className="w-full max-w-xl space-y-8 lg:space-y-6 sm:space-y-10">
          <header className="space-y-3">
            <h1 id="signup-title" className="text-3xl font-medium tracking-tight">Create New Profile</h1>
            <p className="text-white/40 text-sm leading-relaxed">Input your basic details to begin the journey.</p>
          </header>
          <div className="grid grid-cols-2 gap-4">
            <SocialButton icon={<Chrome size={19} />} label="Google" onClick={() => setMessage('Google sign up is unavailable in this preview. Use the form below to try the experience.')} />
            <SocialButton icon={<Github size={19} />} label="Github" onClick={() => setMessage('Github sign up is unavailable in this preview. Use the form below to try the experience.')} />
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-x-0 border-t border-white/10" />
            <span className="relative bg-black px-4 text-xs font-medium text-white/40 uppercase tracking-widest">Or</span>
          </div>
          <form onSubmit={handleSubmit} onChange={() => { if (submitted) { setSubmitted(false); setMessage(''); } }} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="First Name" placeholder="John" type="text" autoComplete="given-name" />
              <InputGroup label="Last Name" placeholder="Doe" type="text" autoComplete="family-name" />
            </div>
            <InputGroup label="Email" placeholder="john@example.com" type="email" autoComplete="email" />
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" required minLength={8} autoComplete="new-password" aria-describedby="password-help" className="w-full bg-brand-gray border-none rounded-xl h-11 pl-4 pr-12 text-sm text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-white/20" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} className="absolute right-0 top-0 flex h-11 w-12 items-center justify-center rounded-xl text-white/40 transition-colors hover:text-white">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p id="password-help" className="text-xs text-white/40">Requires at least 8 symbols.</p>
            </div>
            <button type="submit" disabled={submitted} className="w-full h-14 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] mt-4 transition-all disabled:bg-white/80">{submitted ? 'Details Submitted' : 'Create Account'}</button>
          </form>
          <p className="text-center text-sm text-white/40">Member of the team?{' '}<button type="button" className="font-medium text-white underline-offset-4 hover:underline" onClick={() => setMessage('Log in is unavailable in this signup preview.')}>Log in</button></p>
          {message && <p role="status" className="text-center text-xs leading-relaxed text-white/60">{message}</p>}
        </motion.div>
      </section>
    </main>
  );
}

function StepItem({ number, text, active = false }: { number: number; text: string; active?: boolean }) {
  return (
    <div aria-current={active ? 'step' : undefined} className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium ${active ? 'bg-white text-black border border-white' : 'bg-brand-gray text-white border-none'}`}>
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${active ? 'bg-black text-white' : 'bg-white/10 text-white/40'}`}>{number}</span>
      <span>{text}</span>
    </div>
  );
}

function SocialButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick?: () => void }) {
  return <button type="button" onClick={onClick} className="flex h-12 items-center justify-center gap-2.5 bg-black border border-white/10 rounded-xl text-sm font-medium transition-colors hover:bg-white/5">{icon}{label}</button>;
}

function InputGroup({ label, placeholder, type, autoComplete }: { label: string; placeholder: string; type: string; autoComplete?: string }) {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-white">{label}</label>
      <input id={id} name={label.toLowerCase().replaceAll(' ', '-')} type={type} placeholder={placeholder} required autoComplete={autoComplete} className="w-full bg-brand-gray border-none rounded-xl h-11 px-4 text-sm text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-white/20" />
    </div>
  );
}
