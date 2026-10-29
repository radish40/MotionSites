import React from 'react';
import { motion } from 'framer-motion';

export const blurUp = {
  initial: { opacity: 0, y: 40, filter: 'blur(20px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 1, ease: 'easeOut' },
};

export default function StaySection() {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden" aria-label="Stay in the collection">
      <video
        className="absolute inset-x-0 bottom-0 w-full object-cover object-bottom pointer-events-none"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260603_202301_db51e299-b2f4-4cea-80de-8a6465b7532a.mp4"
          type="video/mp4"
        />
      </video>

      <div className="relative max-w-[1480px] mx-auto px-8 md:px-16 pt-20 md:pt-24 pb-20 md:pb-24 min-h-screen flex flex-col gap-[32px]">
        <motion.div {...blurUp} role="heading" aria-level={1}>
          <div className="font-serif leading-[0.95]" style={{ fontSize: 'clamp(60px, 11vw, 160px)' }}>
            Stay <span className="italic">in</span>
          </div>
          <div className="font-sans font-normal leading-[0.95]" style={{ fontSize: 64, letterSpacing: '-0.02em' }}>
            the collection
          </div>
        </motion.div>

        <motion.div {...blurUp} transition={{ ...blurUp.transition, delay: 0.2 }} className="max-w-md">
          <p className="font-sans mb-6" style={{ fontSize: 15, lineHeight: 1.55, color: 'rgba(0,0,0,0.78)' }}>
            Editions and invitations from the Bentley fragrance studio, sent twice a season.
          </p>
          <form className="flex items-center border-b border-black/40 pb-2 gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              aria-label="Email address"
              className="bg-transparent font-sans text-[15px] flex-1 outline-none placeholder:text-black/40"
            />
            <button type="submit" className="font-sans text-[11px] font-medium uppercase text-black whitespace-nowrap cursor-pointer" style={{ letterSpacing: '0.25em' }}>
              Subscribe →
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
