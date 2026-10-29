import { FadeUp } from './FadeUp';

export default function App() {
  return (
    <main>
      <section aria-labelledby="testimonial-heading" className="bg-[#FDF5EB] py-14 sm:py-20 px-5 sm:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 md:gap-16 items-center">
          <div>
            <FadeUp delay={0}>
              <h2 id="testimonial-heading" className="font-cooper-medium text-2xl sm:text-3xl text-[#08150C] leading-snug mb-6 sm:mb-8">
                Trusted by ambitious, fast-moving teams
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="flex items-center gap-2 mb-5 sm:mb-6">
                <div aria-hidden="true" className="w-7 h-7 rounded-md bg-[#08150C] flex items-center justify-center text-white text-xs font-bold">A</div>
                <span className="text-sm font-semibold text-stone-800">Arcvex</span>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <blockquote className="font-cooper text-stone-700 text-lg sm:text-xl md:text-2xl leading-relaxed mb-5 sm:mb-6">
                "With Kova, I have full visibility into our team's spending in real time. It feels like having a sharp financial advisor available at every hour, helping us stay on budget and make wiser calls."
              </blockquote>
            </FadeUp>
            <FadeUp delay={0.3}>
              <div className="mb-6 sm:mb-8">
                <p className="text-sm font-semibold text-[#08150C]">Maya Reeves</p>
                <p className="text-xs text-stone-500">Director, Arcvex</p>
              </div>
            </FadeUp>
            <FadeUp delay={0.4}>
              <button type="button" className="flex items-center gap-2 bg-[#08150C] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#1a2e1f] transition-colors">
                All Stories
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </FadeUp>
          </div>
          <FadeUp delay={0.15} className="flex justify-center md:justify-end">
            <div className="w-full max-w-xs sm:max-w-sm">
              <video
                aria-label="Kova customer story"
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260517_074029_c7a854bd-2d6e-4b62-96b3-ae8c16311e44.mp4"
                autoPlay loop muted playsInline
                className="w-full rounded-2xl object-cover aspect-square"
              />
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
