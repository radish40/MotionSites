import React from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Facebook, Twitter, Instagram, Youtube, Linkedin, Music2 } from 'lucide-react';
import './index.css';

const display = { fontFamily: "'Instrument Serif', serif" };
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}.mp4`;
function Step({ number, children }: { number: number; children: React.ReactNode }) {
  return <li className="flex items-start gap-5 mb-6 last:mb-0"><span className="flex-shrink-0 w-7 h-7 rounded-md bg-[#DCFF00] flex items-center justify-center text-[#0A0A0A] font-bold text-xs mt-1">{number}</span><p className="text-[17px] leading-[1.55] text-[#E8E8E8]">{children}</p></li>;
}
function Divider() { return <div aria-hidden="true" className="py-8 flex justify-center"><div className="h-px w-24 bg-white/20" /></div>; }
function PrimaryButton({ label, href = '#course-content' }: { label: string; href?: string }) {
  return <a href={href} className="inline-flex items-center gap-3 bg-[#DCFF00] text-[#0A0A0A] font-bold rounded-lg px-6 py-3 hover:bg-[#c9ea00] hover:-translate-y-0.5 transition-all duration-200">{label}<ArrowRight className="w-5 h-5" strokeWidth={2.5} /></a>;
}
function SolidButton({ label, href = '#enroll' }: { label: string; href?: string }) {
  return <a href={href} className="inline-block bg-white text-[#0A0A0A] font-bold rounded-lg px-8 py-3 hover:bg-[#E8E8E8] hover:-translate-y-0.5 transition-all duration-200">{label}</a>;
}
function VideoCard({ name, label, href }: { name: string; label: string; href: string }) {
  return <div className="video-padding px-[42px] pb-10"><a href={href} aria-label={label} className="block overflow-hidden rounded-[14px] group"><video aria-label={label} autoPlay muted loop playsInline className="card-video w-full h-[370px] object-cover rounded-[14px] transition-transform duration-700 group-hover:scale-[1.03]" src={asset(name)} /></a></div>;
}
const socials = [
  { Icon: Facebook, name: 'Facebook', href: 'https://www.facebook.com/' },
  { Icon: Twitter, name: 'Twitter', href: 'https://twitter.com/' },
  { Icon: Instagram, name: 'Instagram', href: 'https://www.instagram.com/' },
  { Icon: Youtube, name: 'YouTube', href: 'https://www.youtube.com/' },
  { Icon: Linkedin, name: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { Icon: Music2, name: 'TikTok', href: 'https://www.tiktok.com/' },
];
function App() {
  return <div className="min-h-screen bg-[#050505] py-10 px-4 font-sans">
    <main id="top" className="max-w-[640px] mx-auto shadow-2xl overflow-hidden ring-1 ring-white/5">
      <div className="bg-[#111111] text-[#F2F2F2]">
        <section className="hero relative w-full overflow-hidden" style={{ aspectRatio: '640 / 820' }} aria-labelledby="hero-title">
          <video aria-label="Abstract cinematic AI sculpture" className="absolute inset-0 w-full h-full object-cover" src={asset('hero')} autoPlay muted loop playsInline />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(17,17,17,0) 45%, rgba(17,17,17,0.45) 68%, rgba(17,17,17,0.9) 88%, rgba(17,17,17,1) 100%)' }} />
          <div className="relative z-10 h-full flex flex-col items-center text-center px-6 pt-12 pb-10">
            <div className="text-white"><div style={display} className="text-[28px] leading-[0.95] tracking-tight">Design Rocket</div><div className="text-[13px] tracking-[0.22em] font-medium mt-1">CERTIFICATES</div></div>
            <p className="mt-40 text-white text-[13px] tracking-[0.28em] font-semibold">NOW AVAILABLE</p>
            <div className="flex-1" />
            <h1 id="hero-title" style={display} className="hero-headline text-white text-[58px] leading-[1.02] tracking-tight max-w-[560px]">Learn to lead AI<br />and unlock new value</h1>
            <a href="#enroll" className="mt-10 inline-flex items-center gap-3 bg-[#D8F90A] text-[#1E1E1E] font-semibold rounded-full px-8 py-4 hover:bg-[#c9ea00] hover:-translate-y-0.5 transition-all duration-200">Enroll Now<ArrowRight className="w-5 h-5" strokeWidth={2.5} /></a>
          </div>
        </section>
        <section id="get-started" aria-label="About the certificate">
          <div className="copy-padding px-[78px] pb-8 pt-4"><p className="text-center text-[18px] leading-[1.55]">Built in collaboration with Microsoft, this certificate course gives you the toolkit to lead AI transformation across your organization. Learn to spot opportunities, launch AI pilots, and scale adoption grounded in responsible practices and proven frameworks.</p></div>
          <div className="flex justify-center pb-14"><PrimaryButton label="Get Started" /></div>
        </section>
        <Divider />
        <section id="course-content" aria-labelledby="transform-title">
          <h2 id="transform-title" style={display} className="section-heading px-9 pb-8 text-center text-[46px] leading-[1.05] tracking-tight">Transform how you lead with AI</h2>
          <VideoCard name="lead-ai" label="Explore how to lead with AI" href="#course-steps" />
          <div id="course-steps" className="steps-padding px-[76px] pb-10"><ol className="max-w-[489px] mx-auto">
            <Step number={1}>Learn how to spot AI opportunities that boost productivity across roles and deliver visible results.</Step>
            <Step number={2}>Build structures that support your team so AI efficiencies multiply across the organization.</Step>
            <Step number={3}>Gain the skills to drive culture change like securing buy-in and reducing resistance.</Step>
            <Step number={4}>Get frameworks to deliver AI pilots that prove impact fast and build credibility with measurable results.</Step>
          </ol></div>
          <div className="flex justify-center pb-14"><SolidButton label="Enroll Now" /></div>
        </section>
        <Divider />
        <section id="roadmap" aria-labelledby="roadmap-title">
          <h2 id="roadmap-title" style={display} className="section-heading pb-7 px-9 text-center text-[46px] leading-[1.05] tracking-tight">Build your AI<br />transformation roadmap</h2>
          <VideoCard name="roadmap" label="Explore your AI transformation roadmap" href="#roadmap-description" />
          <div id="roadmap-description" className="copy-padding px-[78px] pb-8"><p className="text-center text-[18px] leading-[1.55]">You'll finish this hands-on course with a personal AI Transformation Plan: your playbook for pilot proposals, data strategy and governance. Use it to help secure buy-in, guide rollout, and scale adoption responsibly.</p></div>
          <div className="flex justify-center pb-14"><SolidButton label="Learn More" href="#course-content" /></div>
        </section>
        <section id="enroll" className="cta-padding px-14 pb-12" aria-labelledby="enroll-title">
          <div className="bg-[#D8F90A] rounded-[10px] px-8 py-12 text-center">
            <h2 id="enroll-title" style={display} className="cta-heading text-[#1E1E1E] text-[52px] leading-[1.02] tracking-tight mb-3">Ready to lead AI<br />at work?</h2>
            <p className="text-[#1E1E1E] text-[18px] leading-[1.5] mb-8 px-4">Enroll now and be the leader your team has been waiting for.</p>
            <PrimaryButton label="Enroll Now" href="#get-started" />
          </div>
        </section>
      </div>
      <footer className="footer-padding bg-[#080808] text-white pt-12 px-10 text-center border-t border-white/5">
        <div className="pb-8 flex justify-center"><a href="#top" className="text-[30px] font-bold tracking-tight text-white hover:text-[#DCFF00] transition-colors">Design Rocket</a></div>
        <p className="text-[12px] text-[#83837D] leading-[1.5] pb-8">Microsoft is a collaborator on this specific course. Microsoft does not endorse<br className="hidden sm:block" /> Design Rocket generally or other Design Rocket products.</p>
        <div className="flex justify-center pb-8" aria-hidden="true"><div className="h-px w-24 bg-white/20" /></div>
        <div className="flex justify-center gap-3 sm:gap-5 pb-5">{socials.map(({ Icon, name, href }) => <a key={name} href={href} aria-label={name} target="_blank" rel="noreferrer" className="w-10 h-10 shrink-0 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#1E1E1E] hover:border-white transition-colors"><Icon className="w-[18px] h-[18px]" /></a>)}</div>
        <p className="text-[10px] text-[#83837D] pb-4 leading-[1.6]">If you no longer want to receive updates on Design Rocket Certificates,<br />you can unsubscribe at any time by clicking &quot;unsubscribe&quot; below.</p>
        <nav aria-label="Footer" className="text-[12px] pb-3 space-x-2"><a className="hover:underline" href="mailto:support@designrocket.com">Support</a><span className="text-[#8F8E88]">|</span><a className="hover:underline" href="https://designrocket.com/privacy">Privacy</a><span className="text-[#8F8E88]">|</span><a className="hover:underline" href="https://designrocket.com/terms">Terms</a><span className="text-[#8F8E88]">|</span><a className="hover:underline" href="mailto:support@designrocket.com?subject=Unsubscribe">Unsubscribe</a></nav>
        <a href="https://maps.google.com/?q=660+4th+Street+San+Francisco+CA+94107" className="text-[12px] text-white/80 hover:text-white inline-block">©2026 Design Rocket, 660 4th Street #443, San Francisco, CA 94107 USA</a>
        <div className="pb-10" />
      </footer>
    </main>
  </div>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
