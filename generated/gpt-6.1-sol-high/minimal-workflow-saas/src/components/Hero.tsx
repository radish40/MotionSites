import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import AnimatedTaskList from './AnimatedTaskList';

const fadeUp = { opacity: 0, y: 20 };
const visible = { opacity: 1, y: 0 };
export default function Hero() {
  return (
    <section className="relative pt-10 pb-6 flex flex-col justify-center items-center w-full select-none">
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center flex flex-col items-center w-full">
        <motion.h1 initial={fadeUp} animate={visible} transition={{ duration: 0.8, ease: 'easeOut' }} className="text-4xl md:text-[45px] tracking-tight text-slate-900 mb-5 max-w-4xl mx-auto leading-[1.12]">
          Guide everyone on teams<br />tech manuals<br />— with a total ease of mind
        </motion.h1>
        <motion.p initial={fadeUp} animate={visible} transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }} className="text-xs md:text-[13px] text-slate-500 max-w-xl mx-auto mb-6 leading-relaxed font-normal">
          Script offers the best path to register your workflow steps<br />and optimize training on your setup systems
        </motion.p>
        <motion.div initial={fadeUp} animate={visible} transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }} className="mb-14">
          <button type="button" className="bg-gradient-to-b from-[#252a38] to-[#1a1e29] hover:from-[#1d212c] hover:to-[#12151e] text-white px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 mx-auto transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_1px_2px_rgba(0,0,0,0.15)] border border-slate-900/80 active:scale-95 duration-150">
            Register Now! <ChevronRight size={14} aria-hidden="true" />
          </button>
        </motion.div>
        <div className="relative w-full flex flex-col items-center max-w-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.6 }} className="relative z-20 w-full"><AnimatedTaskList /></motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="mt-14 text-[10px] font-medium tracking-wide text-white/50">All people aligned.</motion.p>
        </div>
      </div>
    </section>
  );
}
