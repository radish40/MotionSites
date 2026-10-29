import React from 'react';
import ReactDOM from 'react-dom/client';
import CtaFooter from './CtaFooter';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <main className="min-h-screen bg-black flex flex-col justify-center">
      <CtaFooter />
    </main>
  </React.StrictMode>,
);
