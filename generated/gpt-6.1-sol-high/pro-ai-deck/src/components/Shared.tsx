import {motion} from 'motion/react';
import type {ReactNode} from 'react';
import HlsVideo from './HlsVideo';
export const assets={title:'hf_20260411_104229_49794008-3d16-4cb6-9a8c-73d7751b0e79.mp4',why:'hf_20260411_104032_69319010-2458-492b-b04d-b40a5dfa4482.mp4',proof:'hf_20260406_094145_4a271a6c-3869-4f1c-8aa7-aeb0cb227994.mp4',cta:'hf_20260324_024928_1efd0b0d-6c02-45a8-8847-1030900c4f63.mp4',card:'hf_20260302_085844_21a8f4b3-dea5-4ede-be16-d53f6973bb14.mp4'};
export function local(name:string){return `${import.meta.env.BASE_URL}assets/${name}`;}
export function Background({src,opacity=1,grayscale=false}:{src:string;opacity?:number;grayscale?:boolean}){return <HlsVideo src={src} className="absolute inset-0 h-full w-full object-cover" style={{opacity,filter:grayscale?'saturate(0)':undefined}}/>}
export function Reveal({children,delay=.1,className='',x=0,y=0}:{children:ReactNode;delay?:number;className?:string;x?:number;y?:number}){return <motion.div className={className} initial={{opacity:0,x,y}} animate={{opacity:1,x:0,y:0}} transition={{duration:.65,delay,ease:'easeOut'}}>{children}</motion.div>}
export function Label({children}:{children:ReactNode}){return <Reveal x={-15}><p className="section-label">{children}</p></Reveal>}
