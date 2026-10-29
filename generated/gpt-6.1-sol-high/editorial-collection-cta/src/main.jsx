import React from 'react';
import { createRoot } from 'react-dom/client';
import StaySection from './StaySection.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <main><StaySection /></main>
  </React.StrictMode>,
);
