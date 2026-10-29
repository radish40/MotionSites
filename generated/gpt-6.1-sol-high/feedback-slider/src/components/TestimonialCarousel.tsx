import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useInViewAnimation } from '../hooks/useInViewAnimation';

const testimonials = [
  { id: 1, quote: "With very little guidance team delivered designs that were consistently spot on. We've received so much positive feedback about the design, our community loves it.", author: 'Marcus Anderson', role: 'CEO', company: 'Data.storage', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2' },
  { id: 2, quote: 'Viktor led the creation of our best fundraising deck to date! Knows how to merge sophisticated UX with simple cryptonative design', author: 'alexwu', role: 'Founder', company: 'Nexgate', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2' },
  { id: 3, quote: 'Working with Viktor transformed our product vision into something truly exceptional. The attention to detail and strategic thinking was outstanding.', author: 'James Mitchell', role: 'VP Product', company: 'LaunchPad', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2' },
  { id: 4, quote: 'The design quality exceeded our expectations. Viktor brought a level of polish and professionalism that elevated our entire brand.', author: 'Rachel Foster', role: 'Co-founder', company: 'Nexus Labs', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2' },
  { id: 5, quote: "Incredible work from start to finish. The team's ability to understand our vision and execute flawlessly was remarkable.", author: 'David Zhang', role: 'Head of Design', company: 'Paradigm Labs', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2' },
];

export default function TestimonialCarousel() {
  const { ref, isInView } = useInViewAnimation();
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const isMobile = viewportWidth < 768;
  const cardWidth = isMobile ? viewportWidth - 48 : 427.5;
  const gap = 24;
  const cardWithGap = cardWidth + gap;
  const loopWidth = cardWithGap * testimonials.length;

  useEffect(() => {
    const resize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    // Preserve the active testimonial when crossing a responsive breakpoint.
    setOffset(previous => Math.round(previous / cardWithGap) % testimonials.length * cardWithGap);
  }, [cardWithGap]);

  useEffect(() => {
    if (isPaused) return;
    const interval = window.setInterval(() => {
      setOffset(previous => previous + cardWithGap >= loopWidth ? 0 : previous + cardWithGap);
    }, 3000);
    return () => window.clearInterval(interval);
  }, [isPaused, cardWithGap, loopWidth]);

  const move = (direction: number) => setOffset(previous => {
    const next = previous + direction * cardWithGap;
    return next < 0 ? loopWidth - cardWithGap : next >= loopWidth ? 0 : next;
  });
  const animation = isInView ? 'animate-fade-in-up' : 'opacity-0';
  const delay = (seconds: string) => ({ animationDelay: isInView ? seconds : '0s' });

  return (
    <section ref={ref} aria-labelledby="testimonial-heading" className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="w-full md:pr-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-16 md:max-w-4xl md:ml-auto gap-6 md:gap-0">
            <h1 id="testimonial-heading" className={`flex-1 text-[32px] md:text-[40px] lg:text-[44px] leading-[1.1] text-[#0D212C] tracking-tight font-normal ${animation}`} style={delay('0.1s')}>
              What <span style={{ fontFamily: "'PP Mondwest', serif" }}>builders</span> say
            </h1>
            <div className={`flex flex-col items-start md:items-end gap-2 ${animation}`} style={delay('0.2s')}>
              <div className="flex" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, index) => <Star key={index} className="w-5 h-5 fill-black text-black" aria-hidden="true" />)}
              </div>
              <div className="flex items-center gap-2"><span className="text-xl font-semibold text-[#0D212C]">Clutch</span><span className="text-base text-[#273C46]">5/5</span></div>
            </div>
          </div>
          <div
            className={`relative overflow-hidden md:max-w-4xl md:ml-auto py-6 md:pl-6 -mx-6 md:mx-0 ${animation}`}
            style={delay('0.3s')}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-roledescription="carousel"
            aria-label="Builder testimonials"
          >
            <div className="flex gap-6 pl-6 md:pl-0" data-testid="testimonial-track" data-offset={offset} style={{ transform: `translateX(-${offset}px)`, transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => {
                const distanceFromEdge = offset % loopWidth;
                const cardPosition = index * cardWithGap;
                const relativePosition = cardPosition - distanceFromEdge;
                let opacity = 1;
                let scale = 1;
                if (relativePosition < -cardWidth / 2) {
                  const exitProgress = Math.min(1, Math.abs(relativePosition) / cardWidth);
                  opacity = Math.max(0, 1 - exitProgress * 2);
                  scale = Math.max(0.85, 1 - exitProgress * 0.15);
                }
                return (
                  <article key={`${testimonial.id}-${index}`} aria-hidden={index >= testimonials.length || opacity === 0} className="bg-white rounded-[32px] md:rounded-[40px] px-6 md:pl-10 md:pr-24 py-8 md:pt-[2.36rem] md:pb-[2.63rem] flex flex-col justify-between flex-shrink-0 shadow-[0_4px_16px_rgba(0,0,0,0.08)]" style={{ width: cardWidth, opacity, transform: `scale(${scale})`, transition: 'opacity 0.4s ease-out, transform 0.4s ease-out' }}>
                    <div>
                      <svg className="w-8 h-8 text-[#0D212C] mb-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                      <p className="text-base text-[#0D212C] leading-relaxed mb-8">{testimonial.quote}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <img src={testimonial.avatar} alt={testimonial.author} className="w-12 h-12 rounded-full object-cover" width="48" height="48" />
                      <div>
                        <p className="font-semibold text-[#0D212C] text-sm">{testimonial.author}</p>
                        <p className="text-sm text-[#273C46] flex items-center gap-1"><span className="text-xs" aria-hidden="true">↳</span>{testimonial.role}, {testimonial.company}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
          <div className={`flex gap-4 mt-8 md:max-w-4xl md:ml-auto md:pl-6 ${animation}`} style={delay('0.4s')}>
            <button type="button" onClick={() => move(-1)} aria-label="Previous testimonial" className="w-12 h-12 rounded-full border border-[#0D212C]/20 flex items-center justify-center hover:bg-[#0D212C]/5 transition-colors"><ChevronLeft className="w-5 h-5 text-[#0D212C]" /></button>
            <button type="button" onClick={() => move(1)} aria-label="Next testimonial" className="w-12 h-12 rounded-full border border-[#0D212C]/20 flex items-center justify-center hover:bg-[#0D212C]/5 transition-colors"><ChevronRight className="w-5 h-5 text-[#0D212C]" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
