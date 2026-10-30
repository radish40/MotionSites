import {useCallback,useEffect,useRef,useState} from 'react';
import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import SlideControls from './components/SlideControls';
import TitleSlide from './slides/TitleSlide';
import ProblemSlide from './slides/ProblemSlide';
import CapabilitiesSlide from './slides/CapabilitiesSlide';
import WhyUsSlide from './slides/WhyUsSlide';
import StatsSlide from './slides/StatsSlide';
import TestimonialsSlide from './slides/TestimonialsSlide';
import CtaSlide from './slides/CtaSlide';
const variants={enter:(dir:number)=>({x:dir>0?'100%':'-100%',opacity:0,scale:.95}),center:{x:0,opacity:1,scale:1},exit:(dir:number)=>({x:dir>0?'-30%':'30%',opacity:0,scale:.95})};
export default function App(){const [index,setIndex]=useState(0);const [direction,setDirection]=useState(1);const current=useRef(0);const locked=useRef(0);const start=useRef({x:0,y:0});const reduced=useReducedMotion();const navigate=useCallback((next:number)=>{const now=Date.now();if(next<0||next>6||next===current.current||now-locked.current<800)return;locked.current=now;setDirection(next>current.current?1:-1);current.current=next;setIndex(next);},[]);
useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.target as HTMLElement).closest('a,button,input,textarea,select'))return;if(['ArrowRight','ArrowDown',' '].includes(e.key)){e.preventDefault();navigate(current.current+1);}else if(['ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();navigate(current.current-1);}};const wheel=(e:WheelEvent)=>{e.preventDefault();const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;if(Math.abs(delta)>30)navigate(current.current+(delta>0?1:-1));};window.addEventListener('keydown',key);window.addEventListener('wheel',wheel,{passive:false});return()=>{window.removeEventListener('keydown',key);window.removeEventListener('wheel',wheel);};},[navigate]);
const slides=[<TitleSlide onStart={()=>navigate(6)}/>,<ProblemSlide/>,<CapabilitiesSlide/>,<WhyUsSlide/>,<StatsSlide/>,<TestimonialsSlide/>,<CtaSlide/>];return <main className="relative h-[100dvh] w-full overflow-hidden bg-black font-body" onTouchStart={e=>{start.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={e=>{const dx=start.current.x-e.changedTouches[0].clientX;const dy=start.current.y-e.changedTouches[0].clientY;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy))navigate(current.current+(dx>0?1:-1));}}><AnimatePresence mode="wait" custom={direction}><motion.div key={index} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{duration:reduced?0:.65,ease:[.4,0,.2,1]}} className="absolute inset-0">{slides[index]}</motion.div></AnimatePresence><SlideControls index={index} onNavigate={navigate}/></main>}
