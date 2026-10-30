import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Hls from 'hls.js';
import YogaCard from './components/YogaCard';
import { POSTER,HERO,CARDS } from './media';
const ease=[0.16,1,0.3,1] as const;
export default function App(){
 const video=useRef<HTMLVideoElement>(null);
 const [isLoaded,setLoaded]=useState(false),[isPlaying,setPlaying]=useState(false),[showSecondScreen,setSecond]=useState(false);
 const [parallax,setParallax]=useState({x:0,y:0});
 const [playError,setPlayError]=useState(false);
 const [poster,setPoster]=useState(POSTER);
 useEffect(()=>{const image=new Image();image.onerror=()=>setPoster(`${import.meta.env.BASE_URL}assets/poster.webp`);image.src=POSTER;return()=>{image.onerror=null;};},[]);
 useEffect(()=>{const el=video.current!;if(Hls.isSupported()){const hls=new Hls({enableWorker:false});hls.loadSource(HERO);hls.attachMedia(el);hls.on(Hls.Events.MANIFEST_PARSED,()=>setLoaded(true));return()=>hls.destroy();}el.src=HERO;el.addEventListener('loadedmetadata',()=>setLoaded(true),{once:true});},[]);
 async function play(){setPlayError(false);setPlaying(true);try{await video.current!.play();}catch{setPlaying(false);setPlayError(true);}}
 function back(){const el=video.current!;el.pause();el.currentTime=0;setSecond(false);setPlaying(false);}
 return <main className="font-anton relative w-screen h-dvh bg-black overflow-hidden select-none uppercase" onMouseMove={e=>setParallax({x:(e.clientX-innerWidth/2)/(innerWidth/2)*20,y:(e.clientY-innerHeight/2)/(innerHeight/2)*20})}>
 <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage:`url("${import.meta.env.BASE_URL}assets/poster.webp")`,transform:`scale(1.08) translate(${parallax.x}px, ${parallax.y}px)`}}/>
 <video ref={video} poster={poster} muted playsInline preload="auto" onEnded={()=>{setPlaying(false);setSecond(true);}} style={{transform:`scale(1.08) translate(${parallax.x}px, ${parallax.y}px)`}} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out origin-center ${isLoaded?'opacity-100':'opacity-0'}`}/>
 <div className="absolute inset-0 bg-black/10 pointer-events-none"/>
 <div inert={isPlaying||showSecondScreen} className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 sm:p-12 md:p-16">
 <div className="max-w-xs sm:max-w-sm md:max-w-md pointer-events-auto overflow-hidden"><motion.p animate={isPlaying?{y:250,opacity:0}:{y:0,opacity:1}} transition={{duration:1,ease}} className="text-white text-xl sm:text-2xl md:text-3xl lg:text-[2.2rem] leading-[0.95] tracking-wide">FIND YOUR FOCUS,<br/>ARRANGE PRIVATE<br/>YOGA SESSIONS, AND LIVE<br/>THE MINDFUL WAY</motion.p></div>
 <div className="hero-bottom w-full flex flex-col md:flex-row md:items-end justify-between">
 <div className="pointer-events-auto overflow-hidden"><motion.h1 animate={isPlaying?{y:'150%',opacity:0}:{y:0,opacity:1}} transition={{duration:1.1,ease}} className="hero-title text-white text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[11rem] leading-none tracking-tight">HEY, I AM<br/>JESSICA</motion.h1></div>
 <div className="pointer-events-auto overflow-hidden text-left md:text-right"><motion.p animate={isPlaying?{y:'150%',opacity:0}:{y:0,opacity:1}} transition={{duration:1.1,ease}} className="hero-title text-white text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[11rem] leading-none tracking-tight">YOGA<br/>COACH</motion.p></div>
 </div>
 <AnimatePresence>{!isPlaying&&<motion.div className="start-position absolute left-1/2 bottom-[15%] md:bottom-2 -translate-x-1/2 z-20 pointer-events-auto" exit={{scale:0,opacity:0}} transition={{duration:0.8,ease:[0.34,1.56,0.64,1]}}><button onClick={play} className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-black/90 hover:bg-black text-white text-xs sm:text-sm tracking-widest flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-300 border border-white/20 hover:border-white/40 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-sm relative overflow-hidden group focus-visible:outline-2 focus-visible:outline-white"><span className="absolute inset-0 bg-radial from-white/10 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300"/><span className="relative z-10 font-bold tracking-wider">LET'S START</span></button></motion.div>}</AnimatePresence>
 {playError&&<p role="status" className="absolute top-1/2 left-1/2 -translate-x-1/2 text-white text-center">VIDEO UNAVAILABLE. PLEASE TRY AGAIN.</p>}
 </div>
 <motion.section aria-label="Yoga collection" inert={!showSecondScreen} initial={{y:'100%'}} animate={{y:showSecondScreen?0:'100%'}} transition={{type:'spring',damping:32,stiffness:220}} className="absolute inset-0 w-full h-full z-30 flex flex-col items-center justify-start p-6 pt-24 sm:p-12 md:p-16 bg-gradient-to-b from-[#d5effd] via-[#aedcf9] to-[#8cd0f7]">
 <button onClick={back} className="back-button absolute top-[56px] left-1/2 -translate-x-1/2 z-40 flex items-center whitespace-nowrap text-black hover:text-black/70 text-lg sm:text-xl border border-black/20 hover:border-black/40 px-8 py-3 rounded-full bg-white/40 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">BACK TO START</button>
 <div className="w-full flex-1 flex flex-col items-center justify-center relative select-none mt-20 sm:mt-16 min-h-0">
 <h2 className="select-none pointer-events-none uppercase text-[13.5vw] sm:text-[16.9vw] leading-none text-center w-full absolute z-10 whitespace-nowrap bg-gradient-to-b from-white via-white/70 to-white/0 bg-clip-text text-transparent translate-y-4 filter drop-shadow-[0_2px_15px_rgba(255,255,255,0.1)]">COLLECTION #451</h2>
 <div className="card-deck flex items-center justify-center relative z-20 w-full max-w-5xl mt-6">
 <YogaCard src={CARDS[0]} initialRotation={-8} hoverOffset={{x:-60,y:-25,rotate:-12,scale:1.04}} zIndexClass="z-20 hover:z-40" className="-mr-14 sm:-mr-22 md:-mr-28 lg:-mr-32" index={1} active={showSecondScreen}/>
 <YogaCard src={CARDS[1]} initialRotation={0} hoverOffset={{x:0,y:-15,rotate:0,scale:1.08}} zIndexClass="z-30 hover:z-40" className="scale-105" index={2} active={showSecondScreen}/>
 <YogaCard src={CARDS[2]} initialRotation={8} hoverOffset={{x:60,y:-25,rotate:12,scale:1.04}} zIndexClass="z-20 hover:z-40" className="-ml-14 sm:-ml-22 md:-ml-28 lg:-ml-32" index={3} active={showSecondScreen}/>
 </div></div>
 </motion.section>
 </main>;
}
