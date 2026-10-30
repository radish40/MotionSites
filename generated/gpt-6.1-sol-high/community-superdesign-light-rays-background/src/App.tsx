import { LightRays } from './Component';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

/**
* Demo application for LightRays component.
* Showcases a high-end atmospheric background with a minimalist interface.
*/

export default function App() {
return (
<main className="relative w-full h-screen bg-[#1A1A1B] flex items-center justify-center overflow-hidden">
{/* The background effect */}
<LightRays
raysOrigin="top-center"
raysColor="#00ffff"
raysSpeed={1.5}
lightSpread={1.2}
rayLength={1.8}
followMouse={true}
mouseInfluence={0.3}
noiseAmount={0.03}
distortion={0.08}
/>

{/* Minimalist Overlay */}
<div className="relative z-10 flex flex-col items-center text-center px-6">
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
className="space-y-6"
>
<h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white/90">
LightRays
</h1>

<div className="h-px w-24 bg-gradient-to-r from-transparent via-[#00ffff]/50 to-transparent mx-auto" />

<p className="text-white/40 text-lg md:text-xl font-light max-w-md mx-auto">
High-end WebGL atmospheric lighting. Interactive, lightweight, and cinematic.
</p>
</motion.div>
</div>

{/* Required Reply Button as per instructions */}
<motion.button
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ delay: 1 }}
onClick={() => window.history.back()}
className="fixed bottom-12 right-12 z-20 flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md group"
>
<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
<span className="text-sm font-medium">Reply</span>
</motion.button>

{/* Subtle floating shadow container as per style guide */}
<div className="fixed inset-24 pointer-events-none rounded-[40px] shadow-[0_0_80px_rgba(0,0,0,0.2)] border border-white/5" />
</main>
);
}
