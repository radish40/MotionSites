import Button from './Button';
import {Reveal} from './Reveal';
export default function PricingSection(){
 return <section id="services" className="py-12 px-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:max-w-4xl md:ml-auto">
 <Reveal delay={0.1} className="pricing-card rounded-[40px] pl-10 pr-10 md:pr-24 pt-3 pb-10 bg-ink text-[#F6FCFF] shadow-[inset_0_2px_8px_rgba(255,255,255,0.15)]"><h2 className="text-[22px] font-medium mt-5 mb-4">Monthly Partnership</h2><p className="text-sm leading-relaxed text-[#E0EBF0]">A dedicated creative design team.<br/>You work directly with Viktor.</p><div className="mt-10 mb-7"><p className="text-2xl">$5,000</p><p className="text-sm text-[#E0EBF0] mt-1">Monthly</p></div><div className="flex flex-wrap gap-3"><Button>Start a chat</Button><Button variant="secondary">How it works</Button></div></Reveal>
 <Reveal delay={0.2} className="pricing-card rounded-[40px] pl-10 pr-10 md:pr-24 pt-3 pb-10 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)]"><h2 className="text-[22px] font-medium mt-5 mb-4">Custom Project</h2><p className="text-sm leading-relaxed">Fixed scope, fixed timeline.<br/>Same team, same standards.</p><div className="mt-10 mb-7"><p className="text-2xl text-heading">$5,000</p><p className="text-sm mt-1">Minimum</p></div><Button variant="tertiary">Start a chat</Button></Reveal>
 </div></section>;
}
