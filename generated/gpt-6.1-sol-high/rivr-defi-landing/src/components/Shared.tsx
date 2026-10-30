import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
export type OpenPanel = (panel: string) => void;
export const fade = {hidden:{opacity:0,y:20,scale:.98},visible:{opacity:1,y:0,scale:1}};
export function Reveal({children,className='',delay=0}:{children:ReactNode,className?:string,delay?:number}) {return <motion.div className={className} initial="hidden" whileInView="visible" viewport={{once:true,amount:.15}} variants={fade} transition={{duration:.65,delay,ease:[.22,1,.36,1]}}>{children}</motion.div>}
export function Arrow({className=''}:{className?:string}) {return <span className={`arrow-pill ${className}`}><ArrowUpRight size={17} strokeWidth={1.5}/></span>}
export const heroVideo='https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4';
export const ctaVideo='https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260427_104731_bfd355f7-1f84-4f81-ad88-52c2bca70bad.mp4';
