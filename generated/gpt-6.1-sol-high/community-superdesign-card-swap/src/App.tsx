/**
* Demo application for the CardSwap component.
* Showcases the elegant card swapping animation in a minimalist environment.
*/
import CardSwap, { Card } from './Component';

export default function App() {
const cards = [
{
id: 1,
title: "Perspective Design",
description: "Crafting interfaces with depth and intention.",
color: "bg-primary",
image: `${import.meta.env.BASE_URL}assets/photo-1618005182384-a83a8bd57fbe.jpg`
},
{
id: 2,
title: "Fluid Motion",
description: "Seamless transitions that feel natural and responsive.",
color: "bg-accent",
image: `${import.meta.env.BASE_URL}assets/photo-1633356122544-f134324a6cee.jpg`
},
{
id: 3,
title: "Minimalist Aesthetic",
description: "Less is more when every detail is refined.",
color: "bg-secondary",
image: `${import.meta.env.BASE_URL}assets/photo-1614850523296-d8c1af93d400.jpg`
},
{
id: 4,
title: "Atmospheric Loops",
description: "Creating a sense of calm through continuous motion.",
color: "bg-muted",
image: `${import.meta.env.BASE_URL}assets/photo-1620641788421-7a1c342ea42e.jpg`
}
];

return (
<div className="showcase flex min-h-screen items-center justify-center bg-background p-20 overflow-hidden">
<div className="showcase-content flex flex-col items-center gap-12">
<h1 className="text-2xl font-medium text-foreground tracking-tight opacity-80">
Card Swap Showcase
</h1>

<div className="card-stage relative w-[500px] h-[400px]">
<div className="card-scale"><CardSwap
width={400}
height={300}
cardDistance={40}
verticalDistance={40}
delay={4000}
pauseOnHover={true}
skewAmount={4}
>
{cards.map((card) => (
<Card key={card.id} className="p-0 overflow-hidden group">
<div className="relative h-full w-full flex flex-col">
<div className="flex-1 overflow-hidden">
<img
src={card.image}
alt={card.title}
className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
/>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
</div>
<div className="absolute bottom-0 left-0 right-0 p-8 text-white">
<h3 className="text-xl font-medium mb-2">{card.title}</h3>
<p className="text-sm text-white/70 leading-relaxed max-w-[80%]">
{card.description}
</p>
</div>
</div>
</Card>
))}
</CardSwap></div>
</div>

<button
onClick={() => window.location.reload()}
className="replay mt-8 px-6 py-2 rounded-full border border-border text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300"
>
Reply Animation
</button>
</div>
</div>
);
}
