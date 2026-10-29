import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
export default function App() {
  const [splashComplete, setSplashComplete] = useState(false);
  return <>
    {!splashComplete && <SplashScreen onComplete={() => setSplashComplete(true)} />}
    <Navbar isActive={splashComplete} />
    <HeroSection isActive={splashComplete} />
  </>;
}
