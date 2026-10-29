import { useId, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MIcon } from "@/components/landing/icons/MIcon";
import { SpotlightBorder } from "@/components/landing/effects/SpotlightBorder";
import { FadeUp } from "@/components/landing/primitives/FadeUp";

type Module = { title: string; subtitle: string; lessons: string[] };

const modules: Module[] = [
{ title: "Module 1", subtitle: "Foundations of AI Design",
lessons: [
"Intro to The Future of Design and Building, how it started and where it's going.",
"AI Design Philosophy / Why and what makes good AI design",
"What is Claude and 10+ other best AI tools for design",
"Setting up Claude",
]},
{ title: "Module 2", subtitle: "Building with AI",
lessons: [
"Creating the Branding/Logo with AI",
"Pitch Deck Build",
"Landing Page wireframes",
"Design a Landing Page with AI",
"Building High-end web app",
"GitHub & Vercel Deploy",
"Creating social media design with AI",
]},
{ title: "Module 3", subtitle: "Launch & Growth",
lessons: [
"Getting Seen, Launch Videos",
"Building a portfolio",
"X (Twitter) Strategy for Designers",
"Making money selling digital products as a designer",
]},
{ title: "Module 4", subtitle: "Making Money as an AI Designer",
lessons: [
"Finding Clients + Making Money",
"How to Make Clients Find You",
"Selling AI Powered templates",
]},
];


const ModuleAccordion = ({ module, isOpen, onToggle }:{
module: Module; isOpen: boolean; onToggle: () => void;
}) => {
const panelId = useId();
const reducedMotion = useReducedMotion();
return (
<div>
<button type="button" id={`${panelId}-trigger`} aria-expanded={isOpen} aria-controls={panelId} onClick={onToggle} className="flex w-full items-center justify-between gap-4 py-6 text-left">
<div>
<div className="text-[11px] uppercase tracking-[0.2em] text-foreground/50">{module.title}</div>
<div className="mt-2 text-lg sm:text-xl font-normal text-foreground">{module.subtitle}</div>
</div>
<div className={cn("flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] transition-transform duration-300", isOpen && "rotate-180")}>
<MIcon name="expand_more" size={16} className="text-foreground/80" />
</div>
</button>
<AnimatePresence initial={false}>
{isOpen && (
<motion.div id={panelId} role="region" aria-labelledby={`${panelId}-trigger`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeInOut" }} className="overflow-hidden">
<ul className="pb-6">
{module.lessons.map((lesson, i) => (
<li key={i} className="flex items-center gap-3 border-t border-white/10 py-4 text-sm text-foreground/85">
<span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.06]">
<MIcon name="check" size={12} className="text-foreground" />
</span>
{lesson}
</li>
))}
</ul>
</motion.div>
)}
</AnimatePresence>
</div>
);
};

export const CurriculumSection = () => {
const [openIndex, setOpenIndex] = useState<number | null>(0);
return (
<section className="relative w-full bg-background py-12 sm:py-16">
<div className="mx-auto max-w-[1080px] px-4 sm:px-6">
<div className="mb-12 flex flex-col items-center text-center">
<FadeUp delay={0}>
<span className="mb-6 inline-flex items-center gap-2 rounded-full bg-landing-surface border border-white/10 px-3 py-1 text-xs text-foreground/80 backdrop-blur">
<span className="h-1.5 w-1.5 rounded-full bg-foreground/70" />
Course Curriculum
</span>
</FadeUp>
<FadeUp delay={0.1}>
<h2 className="text-3xl sm:text-4xl font-normal tracking-[-0.02em] leading-[1.05] text-foreground">
A fully modern curriculum.
</h2>
</FadeUp>
</div>
<SpotlightBorder radius="2xl" size={520} intensity={0.5} className="mx-auto w-full p-2 sm:p-3">
<div className="rounded-2xl border border-white/10 px-6 sm:px-8" style={{ backgroundColor: "#161616" }}>
{modules.map((m, i) => (
<FadeUp key={m.title} delay={0.15 * i} className="border-b border-white/10 last:border-b-0">
<ModuleAccordion module={m} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} />
</FadeUp>
))}
</div>
</SpotlightBorder>
</div>
</section>
);
};
