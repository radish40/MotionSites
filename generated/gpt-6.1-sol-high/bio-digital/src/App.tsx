import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;
const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_061107_6567e617-ee84-4c3e-ac81-f2d9dda9121a.mp4';

export default function App() {
  return (
    <div className="experience relative min-h-screen w-full flex flex-col justify-between bg-white text-black font-sans antialiased selection:bg-black selection:text-white overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none select-none" aria-hidden="true">
        <motion.div className="absolute inset-0" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.8, ease }}>
          <video src={videoUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        </motion.div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 relative z-10">
        <div className="text-center w-full max-w-7xl px-4 mt-24 md:mt-0 translate-y-10 md:translate-y-14">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, ease, delay: 0.2 }} className="flex flex-col items-center justify-center select-none">
            <h1 className="font-display text-[7.5vw] md:text-[5.8vw] lg:text-[4.6vw] font-medium tracking-tight text-black leading-[0.9]">NeuralKinetics</h1>
            <h2 className="font-display text-[7.5vw] md:text-[5.8vw] lg:text-[4.6vw] leading-[0.9] mt-1 md:mt-1.5 whitespace-nowrap"><span className="text-black/25 font-light tracking-tight mr-1.5 md:mr-2">cybernetics</span><span className="text-black font-medium tracking-tight">made organic</span></h2>
          </motion.div>
        </div>
      </main>

      <motion.nav aria-label="Main navigation" initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease }} className="fixed top-0 left-0 w-full p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 z-50 pointer-events-none">
        <div className="flex flex-wrap items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-1">
            <svg viewBox="0 0 40 40" fill="currentColor" aria-hidden="true" className="w-10 h-10 text-black translate-y-[1px]"><rect x="7" y="19" width="15" height="5.5" rx="2.75" transform="rotate(-35 7 19)" /><rect x="17.5" y="24" width="15" height="5.5" rx="2.75" transform="rotate(-35 17.5 24)" /></svg>
            <span className="font-display font-medium tracking-tight text-[18px] text-black">NeuralKinetics</span>
          </div>
          <button type="button" className="flex items-center bg-black hover:bg-zinc-800 text-white p-1 pr-5 gap-2.5 rounded-full transition-all duration-200 cursor-pointer text-[12px] font-medium border border-black/[0.03]">
            <span className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center"><Plus size={13} strokeWidth={3} aria-hidden="true" /></span><span className="text-[11.5px] pr-1">Menu</span>
          </button>
          <div className="hidden md:flex items-center bg-[#F4F4F6] border border-black/[0.03] rounded-full px-6 h-11 select-none text-[11.5px] font-normal text-black/60 gap-5"><span>Advanced Bionics</span><span>Cognitive AI</span></div>
        </div>
        <div className="pointer-events-auto flex items-center">
          <div className="flex items-center bg-[#F4F4F6] hover:bg-[#EAEAEF] transition-colors rounded-full p-1 pr-6 gap-3.5 border border-black/[0.03]">
            <button type="button" aria-label="Adaptive Systems" className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center cursor-pointer">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1" opacity="0.6" /><circle cx="12" cy="5" r="2.5" /><circle cx="19" cy="12" r="2.5" /><circle cx="12" cy="19" r="2.5" /><circle cx="5" cy="12" r="2.5" /><circle cx="12" cy="12" r="2.3" fill="black" stroke="currentColor" /></svg>
            </button>
            <span className="text-[11px] font-medium text-black/70 select-none">Adaptive Systems</span>
          </div>
        </div>
      </motion.nav>

      <footer className="w-full relative z-30 px-8 py-10 md:px-16 md:py-14 bg-gradient-to-t from-white via-white/80 to-transparent">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 1, ease }} className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="max-w-[300px] md:max-w-[340px]">
            <p className="text-[11.5px] font-medium text-black/50 mb-3">Autonomous Dynamics</p>
            <p className="text-[19px] md:text-[21px] font-normal text-black leading-[1.15] tracking-tight">Unifying biological grace with machine intelligence to design the next era of fusion</p>
          </div>
          <div className="hidden lg:block w-px h-16 bg-black/[0.08]" aria-hidden="true" />
          <div className="flex flex-wrap gap-2.5">
            {['Neuromorphic', 'AGI', 'Cybernetics'].map(tag => <button key={tag} type="button" className="px-6 py-3.5 border border-black/15 hover:border-black text-black text-[11.5px] font-normal rounded-full bg-white hover:bg-black hover:text-white transition-all duration-300 cursor-pointer active:scale-95">{tag}</button>)}
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
