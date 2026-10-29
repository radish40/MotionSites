import React from 'react';
import ReactDOM from 'react-dom/client';
import { motion, useReducedMotion } from 'framer-motion';
import './styles.css';

const services = [
  {
    video: 'process-streamlining.mp4',
    title: 'Process Streamlining',
    description: 'We automate your processes by linking together the daily tools you rely upon. Lifting throughput and improving overall output.',
  },
  {
    video: 'strategic-advisory.mp4',
    title: 'Strategic advisory',
    description: 'We craft intelligent assistants that are adaptive, grasp context, and are skilled enough to handle highly intricate customer requests.',
  },
  {
    video: 'assistant-engineering.mp4',
    title: 'Assistant engineering',
    description: 'Through our knowledge, we explore deep into your business and advise you on how AI powered automations may transform your operations.',
  },
];

function FadeUp({ children, delay = 0, y = 24, className = '' }: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
}

function App() {
  const reducedMotion = useReducedMotion();
  return (
    <main>
      <section className="services relative z-[2] flex flex-col justify-center" aria-labelledby="services-title">
        <FadeUp className="counter">003 / 005</FadeUp>
        <div className="heading-row flex items-start">
          <div className="heading-column shrink-0">
            <h2 id="services-title" className="flex flex-wrap">
              {['EXPLORE', 'WHAT', 'WE', 'OFFER'].map((word, index) => (
                <motion.span
                  key={word}
                  initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : 0.1 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >{word}</motion.span>
              ))}
            </h2>
          </div>
          <FadeUp delay={0.25} className="subtext flex-1">
            <p>We provide all-in-one AI automation services in one place.</p>
          </FadeUp>
        </div>
        <div className="cards grid items-stretch">
          {services.map((service, index) => (
            <FadeUp key={service.title} delay={0.4 + index * 0.15} className="card flex flex-col overflow-hidden">
              <div className="video-area relative overflow-hidden">
                <video
                  autoPlay muted loop playsInline
                  src={`${import.meta.env.BASE_URL}assets/${service.video}`}
                  aria-hidden="true"
                  preload="auto"
                />
              </div>
              <div className="card-copy">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
);
