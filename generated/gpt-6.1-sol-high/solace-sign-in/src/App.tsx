import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Eye, EyeOff } from 'lucide-react';
import LiquidGlassCanvas from './LiquidGlass';
import FadeUp from './FadeUp';
import './index.css';

const fieldStyle = 'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/30 focus:bg-white/10';

export default function App() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div ref={sceneRef} className="relative min-h-screen w-full overflow-hidden">
      <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline crossOrigin="anonymous" src={`${import.meta.env.BASE_URL}assets/solace-background.mp4`} aria-hidden="true" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div ref={cardRef} className="relative w-full max-w-lg overflow-hidden rounded-2xl p-6 shadow-2xl sm:p-10 md:p-14">
          <LiquidGlassCanvas videoRef={videoRef} sceneRef={sceneRef} cardRef={cardRef} />
          <div className="relative z-[1]">
            <FadeUp delay={0}>
              <svg className="mx-auto mb-6" width="48" height="48" viewBox="0 0 256 256" fill="white" role="img" aria-label="Solace">
                <path d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z" />
              </svg>
            </FadeUp>
            <FadeUp delay={100}>
              <h1 className="mb-2 text-center text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl"><span className="bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">Step back in!</span></h1>
            </FadeUp>
            <FadeUp delay={200}>
              <p className="mb-6 text-center text-xs leading-relaxed text-white/60 sm:mb-8 sm:text-sm md:text-base">Log in to continue your mindful exercises,<br className="hidden sm:inline" /> calm routines, and wellness pathway</p>
            </FadeUp>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <FadeUp delay={300}>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/70">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" className={fieldStyle} placeholder="Your email address" />
              </FadeUp>
              <FadeUp delay={400}>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/70">Password</label>
                <div className="relative">
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" className={`${fieldStyle} pr-12`} placeholder="Type your password" />
                  <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FadeUp>
              <FadeUp delay={500}>
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2">
                    <span className="relative flex">
                      <input type="checkbox" name="remember" className="peer sr-only" />
                      <span className="h-5 w-5 rounded border border-white/20 bg-white/5 peer-checked:border-purple-400 peer-checked:bg-purple-500 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white" />
                      <svg className="absolute left-0.5 top-0.5 hidden h-4 w-4 peer-checked:block" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" aria-hidden="true"><path d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <span className="text-sm text-white/70">Stay signed in</span>
                  </label>
                  <button type="button" className="text-sm text-white/70 hover:text-white">Reset password?</button>
                </div>
              </FadeUp>
              <FadeUp delay={600}>
                <button type="submit" className="w-full rounded-full bg-white py-3.5 text-base font-semibold text-gray-900 transition hover:bg-white/90 active:scale-[0.98]">Sign In</button>
              </FadeUp>
              <FadeUp delay={700}>
                <div className="my-6 flex items-center gap-4"><span className="h-px flex-1 bg-white/15" /><span className="text-sm text-white/40">Or</span><span className="h-px flex-1 bg-white/15" /></div>
              </FadeUp>
              <FadeUp delay={800}>
                <button type="button" className="flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 py-3.5 text-sm font-medium text-white transition hover:bg-white/10 active:scale-[0.98]">
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.89-1.74 2.98-4.3 2.98-7.36Z" />
                    <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.12H3.05v2.59A10 10 0 0 0 12 22Z" />
                    <path fill="#FBBC05" d="M6.4 13.92a6 6 0 0 1 0-3.84V7.49H3.05a10 10 0 0 0 0 9.02l3.35-2.59Z" />
                    <path fill="#EA4335" d="M12 5.96c1.47 0 2.79.51 3.82 1.51l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.95 5.49l3.35 2.59C7.19 7.72 9.4 5.96 12 5.96Z" />
                  </svg>
                  Continue with Google
                </button>
              </FadeUp>
              <FadeUp delay={900}>
                <p className="mt-6 text-center text-sm text-white/50">New to this platform? <button type="button" className="font-medium text-white hover:text-purple-300">Join Now</button></p>
              </FadeUp>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
