import { VideoBackground } from './components/VideoBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ShowcaseSection } from './components/ShowcaseSection';
import { useScrollProgress } from './hooks/useScrollProgress';
export default function App() {
  const scrollProgress = useScrollProgress();
  return <div className="min-h-[200vh]">
    <VideoBackground zoom={1 + scrollProgress * 0.3} />
    <Navbar />
    <div className="relative" style={{ zIndex: 10 }}>
      <Hero scrollProgress={scrollProgress} />
      <ShowcaseSection scrollProgress={scrollProgress} />
    </div>
  </div>;
}
