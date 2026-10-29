import React, { useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import './styles.css';

const paragraph = "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!";

function FadeIn({ children, delay = 0, duration = 0.7, x = 0, y = 30, className, style, as = 'div', ...props }) {
  const Component = useMemo(() => motion.create(as), [as]);
  const reducedMotion = useReducedMotion();
  return <Component
    className={className} style={style}
    initial="hidden" whileInView="visible"
    viewport={{ once: true, margin: '50px', amount: 0 }}
    variants={{ hidden: { opacity: 0, x: reducedMotion ? 0 : x, y: reducedMotion ? 0 : y }, visible: { opacity: 1, x: 0, y: 0 } }}
    transition={{ delay: reducedMotion ? 0 : delay, duration: reducedMotion ? 0 : duration, ease: [0.25, 0.1, 0.25, 1] }}
    {...props}>{children}</Component>;
}

function Character({ character, index, total, progress, reducedMotion }) {
  const charProgress = index / total;
  const opacity = useTransform(progress, [Math.max(0, charProgress - 0.1), Math.min(1, charProgress + 0.05)], [0.2, 1]);
  const value = character === ' ' ? '\u00A0' : character;
  return <span className="relative inline-block"><span className="invisible">{value}</span><motion.span className="absolute inset-0" style={{ opacity: reducedMotion ? 1 : opacity }} data-character>{value}</motion.span></span>;
}

function AnimatedParagraph() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 0.8', 'end 0.2'] });
  const reducedMotion = useReducedMotion();
  let index = 0;
  return <p ref={containerRef} className="about-copy max-w-[560px] text-center font-medium leading-relaxed text-[#D7E2EA]" aria-label={paragraph}>
    <span aria-hidden="true">{paragraph.split(' ').map((word, wordIndex, words) => <React.Fragment key={wordIndex}>
      <span className="inline-block whitespace-nowrap">{Array.from(word).map(character => <Character key={index} character={character} index={index++} total={paragraph.length} progress={scrollYProgress} reducedMotion={reducedMotion} />)}</span>
      {wordIndex < words.length - 1 && <React.Fragment><Character character=" " index={index++} total={paragraph.length} progress={scrollYProgress} reducedMotion={reducedMotion} /><wbr /></React.Fragment>}
    </React.Fragment>)}</span>
  </p>;
}

const decorations = [
  { file: 'moon.png', className: 'top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px]', delay: 0.1, x: -80 },
  { file: 'object.png', className: 'bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]', delay: 0.25, x: -80 },
  { file: 'lego.png', className: 'top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px]', delay: 0.15, x: 80 },
  { file: 'group.png', className: 'bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px]', delay: 0.3, x: 80 },
];

function App() {
  return <main>
    <section aria-labelledby="about-heading" className="about-section relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0C0C0C] px-5 py-20 sm:px-8 md:px-10">
      {decorations.map(({ file, className, delay, x }) => <FadeIn key={file} as="img" src={`${import.meta.env.BASE_URL}assets/${file}`} alt="" aria-hidden="true" draggable="false" className={`pointer-events-none absolute z-0 h-auto select-none ${className}`} delay={delay} duration={0.9} x={x} y={0} />)}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex w-full flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn as="h1" id="about-heading" y={40} delay={0} className="hero-heading text-center font-black uppercase leading-none tracking-tight">About me</FadeIn>
          <AnimatedParagraph />
        </div>
        <FadeIn id="contact" delay={0.3} y={20}>
          <a href="#contact" className="contact-button inline-block rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white transition-opacity duration-200 hover:opacity-90 active:opacity-75 sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base">Contact Me</a>
        </FadeIn>
      </div>
    </section>
    <div className="scroll-space" aria-hidden="true" />
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
