import PartnerSection from './components/PartnerSection';

const images = Array.from({ length: 8 }, (_, index) => `${import.meta.env.BASE_URL}trail/motion-${index + 1}.gif`);

export default function App() {
  return <main className="flex min-h-svh items-center px-4 py-12 md:px-12 md:py-20">
    <PartnerSection images={images} />
  </main>;
}
