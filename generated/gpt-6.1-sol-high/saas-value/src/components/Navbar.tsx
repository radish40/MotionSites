import {useState} from 'react';
import {ChevronDown,Menu,X} from 'lucide-react';
import Logo from './Logo';
export default function Navbar({onAction}:{onAction:(action:string)=>void}){
 const [open,setOpen]=useState(false);const [toolkit,setToolkit]=useState(false);
 return <nav aria-label="Main navigation" className="animate-fade-down relative z-20 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5 lg:px-10">
 <a href="#" aria-label="Questly home" className="text-gray-900"><Logo className="h-5 w-5 sm:h-6 sm:w-6"/></a>
 <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-[13px] text-gray-700 md:flex">
 <div className="relative"><button aria-expanded={toolkit} onClick={()=>setToolkit(!toolkit)} className="flex items-center gap-1.5 hover:text-gray-900">Toolkit<ChevronDown className="h-3.5 w-3.5"/></button>{toolkit&&<div className="absolute left-1/2 top-8 w-48 -translate-x-1/2 rounded-2xl bg-white/90 p-2 shadow-lg backdrop-blur-xl">{['AI search insights','Content generation','Citation tracking'].map(t=><button key={t} className="block w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100" onClick={()=>{onAction(t);setToolkit(false)}}>{t}</button>)}</div>}</div>
 {['Plans','News'].map(t=><button key={t} onClick={()=>onAction(t)} className="hover:text-gray-900">{t}</button>)}</div>
 <div className="flex items-center gap-2"><button onClick={()=>onAction('Try It Free')} className="rounded-full bg-gray-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-gray-800 sm:px-5">Try it free</button><button aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)} className="flex h-9 w-9 items-center justify-center rounded-full text-gray-900 hover:bg-gray-900/10 md:hidden">{open?<X className="h-5 w-5"/>:<Menu className="h-5 w-5"/>}</button></div>
 {open&&<div className="animate-fade-up absolute left-4 right-4 top-full rounded-2xl bg-white/80 px-5 py-3 ring-1 ring-gray-200 backdrop-blur-xl md:hidden">{['Toolkit','Plans','News'].map(t=><button key={t} onClick={()=>{onAction(t);setOpen(false)}} className="block w-full border-b border-gray-200 py-3 text-left text-[15px] text-gray-700 last:border-b-0 hover:text-gray-900">{t}</button>)}</div>}
 </nav>
}
