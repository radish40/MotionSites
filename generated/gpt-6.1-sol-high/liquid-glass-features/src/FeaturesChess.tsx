import { ArrowUpRight } from "lucide-react";

const FEATURE_1_GIF = "https://motionsites.ai/assets/hero-grow-ai-preview-BlQ8tAQ-.gif";
const FEATURE_2_GIF = "https://motionsites.ai/assets/hero-glassmorphism-agency-preview-CGqeRoqP.gif";

const FeaturesChess = () => {
return (
<section className="py-24 px-6 md:px-16 lg:px-24">
{/* Section header */}
<div className="text-center mb-20">
<span className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-4">
Capabilities
</span>
<h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
Pro features. Zero complexity.
</h2>
</div>

{/* Row 1: Content left, Image right */}
<div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-24">
<div className="flex-1 space-y-6">
<h3 className="text-3xl md:text-4xl font-heading italic text-white leading-[0.9] tracking-tight">
Designed to convert. Built to perform.
</h3>
<p className="text-white/70 font-body font-light leading-relaxed text-sm md:text-base max-w-lg">
Every pixel is intentional. Our AI studies what works across thousands of top sites—then builds yours to outperform them all.
</p>
<button className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium text-white flex items-center gap-2 hover:bg-white/10 transition-all font-body">
Learn more
<ArrowUpRight className="h-4 w-4" />
</button>
</div>
<div className="flex-1">
<div className="liquid-glass rounded-2xl overflow-hidden">
<img src={FEATURE_1_GIF} alt="AI-designed website preview" className="w-full h-auto" />
</div>
</div>
</div>

{/* Row 2: Image left, Content right */}
<div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
<div className="flex-1 space-y-6">
<h3 className="text-3xl md:text-4xl font-heading italic text-white leading-[0.9] tracking-tight">
It gets smarter. Automatically.
</h3>
<p className="text-white/70 font-body font-light leading-relaxed text-sm md:text-base max-w-lg">
Your site evolves on its own. AI monitors every click, scroll, and conversion—then optimizes in real time. No manual updates. Ever.
</p>
<button className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium text-white flex items-center gap-2 hover:bg-white/10 transition-all font-body">
See how it works
<ArrowUpRight className="h-4 w-4" />
</button>
</div>
<div className="flex-1">
<div className="liquid-glass rounded-2xl overflow-hidden">
<img src={FEATURE_2_GIF} alt="Adaptive AI system" className="w-full h-auto" />
</div>
</div>
</div>
</section>
);
};

export default FeaturesChess;
