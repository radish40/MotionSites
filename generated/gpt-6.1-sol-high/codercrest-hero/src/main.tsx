import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import HeroSection from './components/HeroSection';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main><HeroSection /></main>
  </StrictMode>,
);
