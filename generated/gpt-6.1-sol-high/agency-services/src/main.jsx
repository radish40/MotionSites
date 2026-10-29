import React from 'react';
import { createRoot } from 'react-dom/client';
import FadeIn from './FadeIn';
import './styles.css';

const services = [
  {
    name: '3D Modeling',
    description: 'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.',
  },
  {
    name: 'Rendering',
    description: 'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.',
  },
  {
    name: 'Motion Design',
    description: 'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.',
  },
  {
    name: 'Branding',
    description: 'Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence.',
  },
  {
    name: 'Web Design',
    description: 'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.',
  },
];

function App() {
  return (
    <main>
      <section aria-labelledby="services-heading" className="flex flex-col rounded-t-[40px] bg-white px-5 py-20 text-[#0C0C0C] sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
        <FadeIn as="h1" y={40} delay={0} className="mb-16 w-full text-center text-[clamp(3rem,12vw,160px)] leading-none font-black tracking-tight uppercase sm:mb-20 md:mb-28">
          <span id="services-heading">Services</span>
        </FadeIn>
        <ol className="mx-auto w-full max-w-5xl list-none p-0">
          {services.map((service, i) => (
            <FadeIn key={service.name} as="li" delay={i * 0.1} y={30} className={i > 0 ? 'border-t border-[#0C0C0C]/15' : ''}>
              <div className="flex w-full items-start gap-6 py-8 sm:gap-8 sm:py-10 md:gap-10 md:py-12">
                <span aria-hidden="true" className="shrink-0 text-[clamp(3rem,10vw,140px)] leading-none font-black uppercase">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex min-w-0 flex-col gap-2 pt-1 sm:gap-4 md:gap-5">
                  <h2 className="text-[clamp(1rem,2.2vw,2.1rem)] leading-normal font-medium uppercase">{service.name}</h2>
                  <p className="max-w-2xl text-[clamp(0.85rem,1.6vw,1.25rem)] leading-relaxed font-light opacity-60">{service.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </ol>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
