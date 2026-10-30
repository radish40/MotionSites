import { InteractiveFolder } from './Component';
import { FileText, Image as ImageIcon, Music, Code, Mail } from 'lucide-react';

export default function App() {
  return (
    <main className="w-full min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center px-6 pt-40 pb-24 sm:p-20 gap-20 sm:gap-24">
      <div className="hero-showcase relative group">
        <div aria-hidden="true" className="pointer-events-none absolute -inset-16 sm:-inset-20 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 rounded-full blur-3xl opacity-50" />
        <InteractiveFolder size={2} color="#5227FF" label="RESOURCES" items={[
          <FileText key="1" className="w-6 h-6 text-slate-400" />,
          <ImageIcon key="2" className="w-6 h-6 text-slate-400" />,
          <Code key="3" className="w-6 h-6 text-slate-400" />
        ]} />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-20 max-w-full">
        <InteractiveFolder color="#FF3366" label="ARTSETS" items={[
          <ImageIcon key="1" className="w-5 h-5 text-pink-400" />,
          <ImageIcon key="2" className="w-5 h-5 text-pink-300" />
        ]} />
        <InteractiveFolder color="#00D1FF" label="TUNES" items={[<Music key="1" className="w-5 h-5 text-cyan-400" />]} />
        <InteractiveFolder color="#1A1A1B" label="MAILS" items={[<Mail key="1" className="w-5 h-5 text-slate-500" />]} />
      </div>
      <footer className="mt-8 text-center">
        <h1 className="text-xl font-medium text-foreground tracking-tight">Interactive Folder</h1>
        <p className="text-muted-foreground text-sm mt-1">Click to reveal and hover to drift</p>
      </footer>
    </main>
  );
}
