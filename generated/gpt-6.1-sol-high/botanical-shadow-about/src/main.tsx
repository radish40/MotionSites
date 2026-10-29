import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import About from './about';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main>
      <About />
    </main>
  </StrictMode>,
);
