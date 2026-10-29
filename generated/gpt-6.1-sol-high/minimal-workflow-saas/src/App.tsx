import Navbar from './components/Navbar';
import Hero from './components/Hero';

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#f8fafc] selection:bg-slate-200 overflow-x-hidden flex flex-col justify-between">
      <div className="absolute inset-x-0 top-0 bottom-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <video autoPlay muted loop playsInline src={`${import.meta.env.BASE_URL}assets/workflow-background.mp4`} className="w-full h-full object-cover object-bottom opacity-[0.98]" />
        <div className="absolute inset-0 bg-white/[0.05] backdrop-blur-[2px]" />
      </div>
      <div className="relative z-10 flex-grow flex flex-col">
        <Navbar />
        <main><Hero /></main>
      </div>
    </div>
  );
}
