import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Typewriter from './Typewriter';

const feedbacks = [
  {
    quote: '«Working with the Acreage Ag team gave us a competitive edge in bringing our crops to market. Their technical expertise, machinery, and customer service are outstanding. We consider them a key partner for all our harvesting needs»',
    author: 'Maranda Walsh',
    title: 'Operations Manager, GreenAcres Farms',
    avatar: 'https://picsum.photos/seed/maranda/100/100',
  },
  {
    quote: "«The team's dedication and innovative approach transformed our farm operations. They delivered a high-quality harvest on time and within budget. We highly recommend their services.»",
    author: 'John Doe',
    title: 'Owner, Valley Wheat Producers',
    avatar: 'https://picsum.photos/seed/john/100/100',
  },
  {
    quote: '«Exceptional service and outstanding yields. The operators were highly skilled and integrated seamlessly with our in-house farm hands. A truly remarkable partnership.»',
    author: 'Sarah Smith',
    title: 'Chief Agronomist, HarvestYield Co.',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
  },
];

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const line = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.8, ease: 'easeOut' } },
};
const variants = {
  enter: direction => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: direction => ({ zIndex: 0, x: direction < 0 ? 100 : -100, opacity: 0 }),
};

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex(index => (index + 1) % feedbacks.length);
  };
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(index => (index - 1 + feedbacks.length) % feedbacks.length);
  };
  const feedback = feedbacks[currentIndex];

  return (
    <main className="min-h-screen bg-black font-sans text-white">
      <section id="feedback" aria-labelledby="feedback-title" className="w-full bg-white text-black py-8 md:py-24 px-6 md:px-12 lg:px-[120px] flex flex-col justify-center overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
          className="w-full"
        >
          <motion.h2 id="feedback-title" variants={reveal} className="text-sm md:text-base mb-6 font-medium tracking-wide">
            <Typewriter text="Customer Feedback" delay={0} speed={0.012} />
          </motion.h2>
          <motion.div variants={line} className="w-full h-[1px] bg-[#D9D9D9] mb-12 md:mb-20 origin-left" />
          <motion.div variants={reveal} className="relative overflow-hidden min-h-[300px] md:min-h-[250px] flex items-center" aria-live="polite" aria-atomic="true">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="w-full"
              >
                <p className="text-2xl md:text-4xl lg:text-[44px] font-light leading-snug md:leading-tight text-right tracking-tight">
                  <Typewriter text={feedback.quote} delay={0.2} speed={0.012} />
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
          <motion.div variants={line} className="w-full h-[1px] bg-[#D9D9D9] mt-12 md:mt-20 mb-8 origin-left" />
          <motion.div variants={reveal} className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-4 w-full sm:w-auto"
              >
                <img src={feedback.avatar} alt={feedback.author} className="w-14 h-14 rounded-full object-cover" referrerPolicy="no-referrer" />
                <div>
                  <h3 className="font-medium text-lg"><Typewriter text={feedback.author} delay={0.4} speed={0.012} /></h3>
                  <p className="text-gray-500 text-sm"><Typewriter text={feedback.title} delay={0.5} speed={0.012} /></p>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button type="button" onClick={prevSlide} aria-label="Previous feedback" className="w-14 h-14 bg-[#D9D9D9] hover:bg-[#c9c9c9] transition-colors flex items-center justify-center rounded-full">
                <ArrowLeft className="w-6 h-6 text-black" strokeWidth={1.5} />
              </button>
              <button type="button" onClick={nextSlide} aria-label="Next feedback" className="w-14 h-14 bg-[#D9D9D9] hover:bg-[#c9c9c9] transition-colors flex items-center justify-center rounded-full">
                <ArrowRight className="w-6 h-6 text-black" strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
