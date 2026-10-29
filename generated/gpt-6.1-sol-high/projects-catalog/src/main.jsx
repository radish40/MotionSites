import React, { useRef, useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import './style.css';

const elements = new Map();
function FadeIn({ children, delay = 0, duration = 0.7, x = 0, y = 30, className, style, as = 'div' }) {
  if (!elements.has(as)) elements.set(as, motion.create(as));
  const Element = elements.get(as);
  const reduced = useReducedMotion();
  return <Element className={className} style={style}
    initial="hidden" whileInView="visible"
    viewport={{ once: true, margin: '50px', amount: 0 }}
    variants={{ hidden: { opacity: 0, x: reduced ? 0 : x, y: reduced ? 0 : y }, visible: { opacity: 1, x: 0, y: 0 } }}
    transition={{ delay, duration: reduced ? 0 : duration, ease: [0.25, 0.1, 0.25, 1] }}>
    {children}
  </Element>;
}
const projects = [
  { name: 'Nextlevel Studio', category: 'Client', images: [1, 2, 3], descriptions: ['A lush garden of colorful summer flowers', 'Purple and pink flowers among fresh green foliage', 'Sunlight and floating pollen in a vibrant flower garden'] },
  { name: 'Aura Brand Identity', category: 'Personal', images: [4, 5, 6], descriptions: ['Aura brand visual, first composition', 'Aura brand visual, second composition', 'Aura brand identity feature composition'] },
  { name: 'Solaris Digital', category: 'Client', images: [7, 8, 9], descriptions: ['Solaris digital visual, first composition', 'Solaris digital visual, second composition', 'Solaris digital feature composition'] },
];
function ProjectCard({ project, index, progress }) {
  const scale = useTransform(progress, [index / projects.length, 1], [1, 1 - (projects.length - 1 - index) * 0.03]);
  const reduced = useReducedMotion();
  const cardRef = useRef(null);
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => setHeight(entry.borderBoxSize[0].blockSize));
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);
  const asset = n => `${import.meta.env.BASE_URL}assets/project-${n}.png`;
  return <div className="project-wrapper sticky top-6 md:top-8 flex items-start justify-center h-[85vh]" style={{ '--card-height': `${height}px`, '--card-offset': `${index * 28}px` }}>
    <motion.article ref={cardRef} aria-labelledby={`project-${index}`} className="project-card absolute w-full max-w-[1760px] origin-top bg-[#0C0C0C] border-2 border-[#D7E2EA] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] p-4 sm:p-6 md:p-8 flex flex-col gap-6 sm:gap-8 md:gap-10"
      style={{ top: index * 28, scale: reduced ? 1 : scale }}>
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-4">
        <div className="flex items-center gap-6 sm:gap-8 md:gap-10">
          <span className="project-number font-black uppercase leading-none">{String(index + 1).padStart(2, '0')}</span>
          <div className="flex flex-col gap-2 sm:gap-4 md:gap-6">
            <p className="project-category font-medium uppercase leading-none">{project.category}</p>
            <h2 id={`project-${index}`} className="project-name font-light tracking-wide leading-none">{project.name}</h2>
          </div>
        </div>
        <a href="#" target="_blank" rel="noopener noreferrer" aria-label={`Live Project — ${project.name}`} className="live-project self-start sm:self-auto rounded-full border-2 border-[#D7E2EA] px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base font-medium uppercase tracking-widest hover:bg-[#D7E2EA]/10 active:bg-[#D7E2EA]/20 transition-colors duration-200">Live Project</a>
      </header>
      <div className="project-grid flex flex-col md:flex-row gap-4 md:gap-5 w-full">
        <div className="flex flex-col gap-4 md:gap-5 w-full md:w-[40%] shrink-0 md:shrink">
          <img src={asset(project.images[0])} alt={project.descriptions[0]} className="first-image w-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]" />
          <img src={asset(project.images[1])} alt={project.descriptions[1]} className="second-image w-full object-cover rounded-[30px] sm:rounded-[40px] md:rounded-[60px]" />
        </div>
        <img src={asset(project.images[2])} alt={project.descriptions[2]} className="feature-image w-full md:w-[60%] object-cover rounded-[30px] sm:rounded-[40px] md:rounded-[60px] self-stretch" />
      </div>
    </motion.article>
  </div>;
}
function App() {
  const section = useRef(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  return <main>
    <div className="previous-section h-10 sm:h-12 md:h-14 bg-white" aria-hidden="true" />
    <section ref={section} aria-label="Projects" className="projects relative z-10 -mt-10 sm:-mt-12 md:-mt-14 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] bg-[#0C0C0C] px-5 sm:px-8 md:px-10">
      <div className="flex flex-col items-center py-20 sm:py-24 md:py-32">
        <FadeIn as="h1" delay={0} y={40} className="hero-heading font-black uppercase leading-none tracking-tight text-center w-full">Project</FadeIn>
      </div>
      {projects.map((project, index) => <ProjectCard key={project.name} project={project} index={index} progress={scrollYProgress} />)}
    </section>
  </main>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
