import ScrollVideo from './components/ScrollVideo';
import Navbar from './components/Navbar';
import SectionOne from './components/SectionOne';
import SectionTwo from './components/SectionTwo';
export default function App() {
  return <><ScrollVideo /><Navbar /><main><SectionOne /><div className="h-[80vh]" aria-hidden="true" /><SectionTwo /></main></>;
}
