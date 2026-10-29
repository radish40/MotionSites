import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(element);
      }
    }, { threshold });
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

const asset = (number) => `${import.meta.env.BASE_URL}assets/product-${number}.png`;
const products = [
  { category: 'ILLUMINATE', name: 'Illuminating cleansing gel', price: '36,00', image: 1 },
  { category: 'UNIFY', subcategory: 'TIGHTEN PORES', name: 'Unifying serum spray', price: '34,00', image: 2 },
  { category: 'NATURAL GLOW', name: 'Super glow set', price: '92,00', oldPrice: '99,00', image: 3, isSet: true },
  { category: 'PROTECT', subcategory: 'ILLUMINATE', name: 'Radiance day oil', price: '59,00', image: 4 },
  { category: 'HYDRATE', subcategory: 'NOURISH', name: 'Deep moisture cream', price: '48,00', image: 1 },
  { category: 'RENEW', name: 'Night repair elixir', price: '72,00', oldPrice: '79,00', image: 2 },
  { category: 'SMOOTH', subcategory: 'REFINE', name: 'Gentle exfoliating toner', price: '42,00', image: 3 },
];

function App() {
  const [activeTab, setActiveTab] = useState('best sellers');
  const [scrollProgress, setScrollProgress] = useState(0);
  const carousel = useRef(null);
  const drag = useRef(null);
  const { ref, isVisible } = useInView(0.1);
  const visibleProducts = activeTab === 'sets' ? products.filter(product => product.isSet) : products;

  useEffect(() => {
    const el = carousel.current;
    const updateProgress = () => {
      const available = el.scrollWidth - el.clientWidth;
      setScrollProgress(available > 0 ? Math.max(0, Math.min(1, el.scrollLeft / available)) : 0);
    };
    const onWheel = (event) => {
      if (el.scrollWidth <= el.clientWidth || event.ctrlKey) return;
      event.preventDefault();
      el.scrollLeft += event.deltaY || event.deltaX;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('scroll', updateProgress, { passive: true });
    const resizeObserver = new ResizeObserver(updateProgress);
    resizeObserver.observe(el);
    updateProgress();
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('scroll', updateProgress);
      resizeObserver.disconnect();
    };
  }, [activeTab]);

  function selectTab(tab) {
    setActiveTab(tab);
    carousel.current.scrollLeft = 0;
    setScrollProgress(0);
  }

  return (
    <main ref={ref} className="min-h-screen flex flex-col justify-center bg-[#F9F4F0] text-black px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
      <div role="tablist" aria-label="Product collections" className={`flex gap-4 sm:gap-6 mb-8 sm:mb-12 transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {['best sellers', 'sets'].map(tab => (
          <button key={tab} role="tab" id={`tab-${tab.replace(' ', '-')}`} aria-selected={activeTab === tab} aria-controls="products" onClick={() => selectTab(tab)} onKeyDown={event => {
            if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
              event.preventDefault();
              const next = event.key === 'Home' ? 'best sellers' : event.key === 'End' ? 'sets' : activeTab === 'sets' ? 'best sellers' : 'sets';
              selectTab(next);
              document.getElementById(`tab-${next.replace(' ', '-')}`).focus();
            }
          }} className="group flex items-center gap-3 sm:gap-4 text-2xl sm:text-4xl md:text-5xl font-medium focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#1a1a1a] rounded-sm">
            {activeTab === tab && <span aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 rounded-full bg-[#1a1a1a] animate-scale-in" />}
            <span className={`transition-colors duration-300 ${activeTab === tab ? 'text-[#1a1a1a]' : 'text-gray-400 group-hover:text-gray-600'}`}>{tab}</span>
          </button>
        ))}
      </div>
      <div ref={carousel} id="products" role="tabpanel" aria-labelledby={`tab-${activeTab.replace(' ', '-')}`} tabIndex={0} className="flex overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1a1a1a]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', touchAction: 'pan-x pan-y' }}
        onPointerDown={event => {
          if (event.pointerType !== 'mouse' || event.button !== 0) return;
          drag.current = { x: event.clientX, scrollLeft: carousel.current.scrollLeft };
          carousel.current.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          if (drag.current) carousel.current.scrollLeft = drag.current.scrollLeft - (event.clientX - drag.current.x);
        }}
        onPointerUp={() => { drag.current = null; }}
        onPointerCancel={() => { drag.current = null; }}
        onLostPointerCapture={() => { drag.current = null; }}>
        {visibleProducts.map((product, index) => (
          <article key={product.name} className={`group flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] lg:w-[calc(25%-1px)] border border-gray-200 -ml-[1px] first:ml-0 pt-4 pb-6 transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${200 + index * 80}ms` }}>
            <div className="px-4 h-12">
              <p className="text-xs font-medium tracking-wider uppercase">{product.category}</p>
              {product.subcategory && <p className="text-xs text-gray-500 uppercase mt-0.5">{product.subcategory}</p>}
            </div>
            <div className="mx-4 aspect-[3/4] rounded-lg overflow-hidden bg-[#F9F4F0]">
              <img src={asset(product.image)} alt={product.name} draggable="false" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="mt-4 text-center px-2">
              <h2 className="text-sm transition-colors duration-300 group-hover:text-[#1a1a1a]">{product.name}</h2>
              <div className="flex justify-center gap-2 mt-1">
                <span className="text-sm">{product.price}</span>
                {product.oldPrice && <del className="text-sm text-gray-400">{product.oldPrice}</del>}
              </div>
            </div>
          </article>
        ))}
      </div>
      <div aria-hidden="true" className="mt-8 sm:mt-10 mx-auto w-full max-w-[280px] h-[2px] bg-gray-300 rounded-full relative overflow-hidden">
        <div className="absolute h-full bg-[#1a1a1a] rounded-full transition-transform duration-150 ease-out" style={{ width: '30%', transform: `translateX(${scrollProgress * (100 / 0.3)}%)` }} />
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
