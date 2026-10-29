import React from 'react';
import { createRoot } from 'react-dom/client';
import { useInView } from './useInView';
import './styles.css';

const categories = [
  {
    name: 'face',
    video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_203023_87a26602-2898-4acc-a396-c7a2b5ad84fd.mp4',
  },
  {
    name: 'beauty tools',
    video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_203415_b86e3f19-2aec-46cd-9a86-b64c40118e38.mp4',
  },
  {
    name: 'body',
    video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_203051_85fee398-ea01-4aa0-972b-137a74213be5.mp4',
  },
];

function Categories() {
  const { ref, isVisible } = useInView(0.1);

  return (
    <main>
      <section aria-label="Categories" className="flex min-h-screen w-full flex-col justify-center bg-white text-white">
        <div
          ref={ref}
          className={`grid grid-cols-1 transition-all duration-1000 ease-out md:grid-cols-3 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
        >
          {categories.map((category, index) => (
            <article
              key={category.name}
              aria-labelledby={`category-${index}`}
              className="group relative flex min-h-[400px] flex-col items-start justify-between overflow-hidden p-6 sm:min-h-[500px] sm:p-8 md:min-h-[750px] md:p-12"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <video
                src={category.video}
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/20" />
              <h2
                id={`category-${index}`}
                className="category-name relative z-10 text-5xl font-medium transition-transform duration-500 group-hover:-translate-y-2 sm:text-6xl md:text-7xl lg:text-8xl"
                style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}
              >
                {category.name}
              </h2>
              <button type="button" className="btn-primary relative z-10 mt-auto rounded-full bg-white px-8 py-3 text-sm text-black">
                shop {category.name}
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<Categories />);
