import React from 'react';
import { createRoot } from 'react-dom/client';
import PrecisionSection from './components/PrecisionSection';
import './index.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><main><PrecisionSection /></main></React.StrictMode>);
