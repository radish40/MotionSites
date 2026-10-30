import { motion, type Variants } from 'framer-motion'
import { BlurIn } from './BlurIn'

const rowVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const cards = [
  {
    stat: '1.6M',
    description: 'Active members rely on us for effortless payment experiences',
    height: 'min-h-[450px]',
    overlay: 'bg-[rgba(206,223,235,0.25)]',
    width: 'max-w-[377px]',
    video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_143605_bc7bd6c0-9c68-49ff-a9d3-073a10759fa4.mp4',
    local: 'members.mp4',
  },
  {
    stat: '850K',
    description: 'Transfers completed each day, quick and protected',
    height: 'min-h-[350px]',
    overlay: 'bg-[rgba(247,236,233,0.6)]',
    width: 'max-w-[351px]',
    video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_145119_f4ec4d9f-3ecd-4116-baa3-26e8cf2df976.mp4',
    local: 'transfers.mp4',
  },
  {
    stat: '120+',
    description: 'Nations enabled for instant checkouts and worldwide remittance',
    height: 'min-h-[450px]',
    overlay: 'bg-[rgba(218,218,218,0.2)]',
    width: 'max-w-[351px]',
    video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_140728_ae719193-f10b-4105-82fc-c989610b3aa6.mp4',
    local: 'nations.mp4',
  },
]

export function InsightsSection() {
  return (
    <div className="px-6 md:px-12 lg:px-[60px] flex flex-col gap-[90px] py-20 bg-white">
      <div className="max-w-[517px] flex flex-col gap-10">
        <BlurIn>
          <h1 className="text-[#00041F] text-4xl md:text-5xl lg:text-6xl font-helvetica-neue font-medium leading-[1] lg:leading-[60px] tracking-[-0.03em]">
            Instant payment clarity counts
          </h1>
        </BlurIn>
        <p className="text-[#49484F] text-base md:text-lg lg:text-xl font-helvetica-neue max-w-[361px]">
          Real-time data powers smarter spending choices every day
        </p>
      </div>

      <motion.div
        className="flex flex-col lg:flex-row items-stretch lg:items-end gap-5"
        variants={rowVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {cards.map((card) => (
          <motion.div
            key={card.stat}
            variants={cardVariants}
            className={`flex-1 p-10 rounded-[40px] relative overflow-hidden flex flex-col justify-end ${card.height}`}
          >
            <video autoPlay loop muted playsInline aria-hidden="true" className="absolute inset-0 w-full h-full object-cover">
              <source src={card.video} type="video/mp4" />
              <source src={`${import.meta.env.BASE_URL}assets/${card.local}`} type="video/mp4" />
            </video>
            <div className={`absolute inset-0 ${card.overlay}`} />
            <div className="relative z-10 max-w-[388px] flex flex-col gap-5">
              <p className="text-[#00041F] text-5xl md:text-[60px] font-helvetica-neue font-medium leading-[1] md:leading-[60px]">{card.stat}</p>
              <p className={`text-[#49484F] text-lg md:text-[22px] font-helvetica-neue opacity-80 ${card.width}`}>{card.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
