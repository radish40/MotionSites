import React from 'react';
import { createRoot } from 'react-dom/client';
import { Mail, Twitter, Github } from 'lucide-react';
import './styles.css';

const originalVideo = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4';
const localVideo = `${import.meta.env.BASE_URL}assets/orbis.mp4`;
const socials = [{ Icon: Mail, label: 'Mail' }, { Icon: Twitter, label: 'Twitter' }, { Icon: Github, label: 'GitHub' }];

export function OrbisCTA() {
  return (
    <section className="relative overflow-hidden" aria-label="Join Orbis">
      <div className="relative w-full">
        <video className="w-full h-auto block" autoPlay loop muted playsInline aria-hidden="true"
          onError={(event) => {
            const video = event.currentTarget;
            if (!video.dataset.fallback) {
              video.dataset.fallback = 'true';
              video.src = localVideo;
              video.load();
            }
          }}>
          <source src={originalVideo} type="video/mp4" onError={(event) => {
            const video = event.currentTarget.parentElement;
            if (!video.dataset.fallback) {
              video.dataset.fallback = 'true';
              video.src = localVideo;
              video.load();
            }
          }} />
        </video>
        <div className="absolute inset-0 max-w-[1831px] mx-auto px-4 sm:px-6 md:px-8 flex items-start pt-12 sm:pt-16 md:pt-20 lg:pt-20 -translate-y-[10%] md:-translate-y-[10%] lg:translate-y-0">
          <div className="w-full flex flex-col gap-16 sm:gap-24">
            <div className="flex justify-end lg:pr-[20%] lg:pl-[15%] relative">
              <div className="text-left max-w-[600px] relative">
                <h2 className="font-grotesk text-[16px] sm:text-[20px] md:text-[30px] lg:text-[60px] font-normal uppercase leading-[1.05] sm:leading-[1] md:leading-[1]">
                  <span className="inline-block mb-4 sm:mb-6 md:mb-8 lg:mb-12">JOIN US.</span><br />
                  REVEAL WHAT'S HIDDEN.<br />
                  DEFINE WHAT'S NEXT.<br />
                  FOLLOW THE SIGNAL.
                </h2>
                <span className="font-condiment text-neon text-[17px] sm:text-[24px] md:text-[34px] lg:text-[68px] font-normal normal-case absolute top-[8px] sm:top-[11px] md:top-[18px] lg:top-[37px] left-0 mix-blend-exclusion opacity-90">Go beyond</span>
              </div>
            </div>
            <div className="absolute left-[8%] bottom-[12%] sm:bottom-[14%] md:bottom-[16%] lg:bottom-[18%] xl:bottom-[20%]">
              <div className="liquid-glass rounded-[0.5rem] sm:rounded-[1.25rem] p-[0.25rem] sm:p-[0.75rem] md:p-[0.5625rem] lg:p-[0.98rem] w-fit flex flex-col gap-[0.0625rem] sm:gap-[0.125rem] md:gap-[0.09375rem] lg:gap-[0.16rem]">
                {socials.map(({ Icon, label }, index) => (
                  <button key={label} type="button" aria-label={label}
                    className={`w-[14vw] sm:w-[14.375rem] md:w-[10.78125rem] lg:w-[16.77rem] h-[1.8vh] sm:h-[3.5rem] md:h-[2.625rem] lg:h-[4.09rem] min-w-[3.5rem] sm:min-w-[8rem] md:min-w-[6rem] lg:min-w-[9.33rem] min-h-[0.75rem] sm:min-h-[2.5rem] md:min-h-[1.875rem] lg:min-h-[2.92rem] flex items-center justify-center hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon ${index < 2 ? 'border-b border-white/10' : ''}`}>
                    <Icon className="w-[0.625rem] h-[0.625rem] sm:w-[1.25rem] sm:h-[1.25rem] md:w-[0.9375rem] md:h-[0.9375rem] lg:w-[1.46rem] lg:h-[1.46rem] text-cream" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

createRoot(document.getElementById('root')).render(<main><OrbisCTA /></main>);
