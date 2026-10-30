import { motion } from 'framer-motion';
import { BlurIn } from './BlurIn';
import { assets, localAsset } from '../assets';
const cards = [
  { stat: '1.6M', description: 'Active members rely on us for effortless payment experiences', video: assets.members, file: 'members.mp4', overlay: 'rgba(206,223,235,0.25)', height: 'min-h-[450px]', width: 'max-w-[377px]' },
  { stat: '850К', description: 'Transfers completed each day, quick and protected', video: assets.transfers, file: 'transfers.mp4', overlay: 'rgba(247,236,233,0.6)', height: 'min-h-[350px]', width: 'max-w-[351px]' },
  { stat: '120+', description: 'Nations enabled for instant checkouts and worldwide remittance', video: assets.global, file: 'global.mp4', overlay: 'rgba(218,218,218,0.2)', height: 'min-h-[450px]', width: 'max-w-[351px]' },
];
export default function InsightsSection() {
  return <section id="insights" aria-labelledby="insights-heading" className="flex flex-col gap-[90px] bg-white px-6 py-20 md:px-12 lg:px-[60px]">
    <div className="flex max-w-[517px] flex-col gap-10"><BlurIn><h2 id="insights-heading" className="font-helvetica-neue text-4xl font-medium leading-[1] tracking-[-0.03em] text-sintra-dark md:text-5xl lg:text-6xl lg:leading-[60px]">Instant payment clarity counts</h2></BlurIn><p className="max-w-[361px] font-helvetica-neue text-base text-sintra-gray md:text-lg lg:text-xl">Real-time data powers smarter spending choices every day</p></div>
    <motion.div className="flex flex-col items-stretch gap-5 lg:flex-row lg:items-end" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
      {cards.map(card => <motion.article key={card.stat} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }} className={`relative flex flex-1 flex-col justify-end overflow-hidden rounded-[40px] bg-sintra-light p-10 ${card.height}`}>
        <video src={card.video} autoPlay loop muted playsInline aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" onError={e => { const el = e.currentTarget; if (!el.src.includes('/assets/')) { el.src = localAsset(card.file); el.load(); } }} />
        <div className="absolute inset-0" style={{ backgroundColor: card.overlay }} />
        <div className="relative z-10 flex max-w-[388px] flex-col gap-5"><h3 className="font-helvetica-neue text-5xl font-medium leading-[1] text-sintra-dark md:text-[60px] md:leading-[60px]">{card.stat}</h3><p className={`font-helvetica-neue text-lg text-sintra-gray opacity-80 md:text-[22px] ${card.width}`}>{card.description}</p></div>
      </motion.article>)}
    </motion.div>
  </section>;
}
