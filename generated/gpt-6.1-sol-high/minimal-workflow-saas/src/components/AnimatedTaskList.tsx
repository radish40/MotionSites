import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export const tasks = [
  'How to code an app in Python',
  'How to build charts with data in Excel',
  'How to edit profile of users on GitHub',
  'How to set up a custom task rule in Asana',
  'How to design a form in Sheets',
  'How to build a custom webhook in Slack',
  'How to sync a dashboard in Excel',
  'How to create a team member in Canva',
  'How to link a custom project page in Jira',
];
const N = tasks.length;
const duplicatedTasks = [...tasks, ...tasks, ...tasks];
export default function AnimatedTaskList() {
  const [index, setIndex] = useState(N);
  const [animate, setAnimate] = useState(true);
  useEffect(() => {
    const timer = setInterval(() => setIndex(i => i < N * 2 ? i + 1 : i), 4500);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (index === N * 2) {
      const timer = setTimeout(() => { setAnimate(false); setIndex(N); }, 1000);
      return () => clearTimeout(timer);
    }
  }, [index]);
  useEffect(() => {
    if (index === N && !animate) {
      const timer = setTimeout(() => setAnimate(true), 50);
      return () => clearTimeout(timer);
    }
  }, [index, animate]);
  return (
    <div aria-label="Workflow learning steps" className="relative w-full max-w-[340px] md:max-w-[420px] h-[220px] select-none mx-auto text-left font-sans overflow-hidden">
      <div aria-hidden="true" className="absolute top-0 left-0 w-full h-[54px] rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex items-center px-4 pointer-events-none">
        <div className="w-[30px] h-[30px] bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-white/40">
          <div className="flex flex-col gap-[1.5px] rotate-[-15deg]">
            <span className="w-2.5 h-[1.5px] bg-[#0c101d] rounded-full" />
            <span className="w-1.8 h-[1.5px] bg-[#0c101d] rounded-full translate-x-[0.8px]" />
            <span className="w-2.2 h-[1.5px] bg-[#475569] rounded-full translate-x-[1.6px]" />
          </div>
        </div>
      </div>
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        {duplicatedTasks.map((task, i) => {
          const distance = i - index;
          const active = distance === 0;
          const y = active ? 0 : distance < 0 ? -35 : 68 + (distance - 1) * 22;
          const opacity = active ? 1 : distance > 0 ? ([0, 0.55, 0.36, 0.22, 0.11, 0.04][distance] ?? 0) : 0;
          const blur = distance > 0 && distance <= 5 ? [0, 0.2, 0.4, 0.6, 0.8, 1.1][distance] : 0;
          return (
            <motion.div key={i} data-active={active} aria-hidden={!active} className="absolute left-0 w-full flex items-center select-none justify-start" animate={{ y, opacity }} style={{ height: active ? 54 : distance < 0 ? 30 : 22, filter: `blur(${blur}px)` }} transition={animate ? { duration: 1, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}>
              {active ? <div className="pl-[58px] flex flex-col justify-center text-left"><span className="text-[7.5px] text-white/50 font-bold uppercase tracking-wider leading-none mb-1">Learn the step</span><span className="text-[12.5px] md:text-[13px] font-medium tracking-tight text-white leading-none">{task}</span></div> : <div className="pl-[58px] flex items-center text-left"><span className="text-[11.5px] md:text-[12px] font-normal tracking-tight text-white/70 leading-none">{task}</span></div>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
