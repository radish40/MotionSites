import { ArrowRight } from 'lucide-react';

const smallImage = `${import.meta.env.BASE_URL}assets/studio-small.webp`;
const largeImage = `${import.meta.env.BASE_URL}assets/studio-large.webp`;

export default function About() {
  const studioButton = (
    <button
      type="button"
      className="group bg-[#F26522] hover:bg-[#e05a1a] text-white text-[13px] sm:text-[14px] font-medium rounded-full pl-5 sm:pl-6 pr-2 py-2 flex items-center gap-3 transition-colors duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
    >
      <span className="overflow-hidden h-[20px]">
        <span className="flex flex-col group-hover:-translate-y-1/2 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
          <span className="h-[20px] flex items-center">About our studio</span>
          <span aria-hidden="true" className="h-[20px] flex items-center">About our studio</span>
        </span>
      </span>
      <span className="bg-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center">
        <ArrowRight size={14} aria-hidden="true" className="text-[#F26522] -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
      </span>
    </button>
  );

  return (
    <section aria-labelledby="about-heading" className="bg-white pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-[11px] sm:text-[12px] font-semibold">1</span>
          <span className="text-[12px] sm:text-[13px] font-medium rounded-full px-3 sm:px-4 py-1 sm:py-1.5">Introducing Axion</span>
        </div>

        <h2 id="about-heading" className="px-5 sm:px-8 lg:px-12 text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 mb-12 sm:mb-16 lg:mb-28">
          Strategy-led creatives, delivering<span className="sm:hidden"> </span><br className="hidden sm:block" />results in digital and beyond.
        </h2>

        <div className="lg:hidden px-5 sm:px-8">
          <p className="text-[15px] sm:text-[17px] leading-[1.6] font-medium text-gray-900 mb-6">
            Through research, creative thinking and iteration we help growing brands realize their digital full potential.
          </p>
          <div className="mb-8">{studioButton}</div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
            <div className="sm:w-[45%]">
              <img src={smallImage} alt="Axion studio creative workspace" className="w-full aspect-[438/346] rounded-xl sm:rounded-2xl object-cover" />
            </div>
            <div className="sm:w-[55%]">
              <img src={largeImage} alt="A view inside the Axion studio" className="w-full aspect-[900/600] rounded-xl sm:rounded-2xl object-cover" />
            </div>
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-[26%_1fr_48%] items-end gap-6 xl:gap-8 px-5 sm:px-8 lg:px-12">
          <div className="self-end">
            <img src={smallImage} alt="Axion studio creative workspace" className="w-full aspect-[438/346] rounded-2xl object-cover" />
          </div>
          <div className="self-start flex flex-col justify-end">
            <p className="text-[16px] xl:text-[18px] leading-[1.65] font-medium text-gray-900 whitespace-nowrap mb-6">
              Through research, creative thinking<br />and iteration we help growing brands<br />realize their digital full potential.
            </p>
            {studioButton}
          </div>
          <div className="self-end">
            <img src={largeImage} alt="A view inside the Axion studio" className="w-full aspect-[3/2] rounded-2xl object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
