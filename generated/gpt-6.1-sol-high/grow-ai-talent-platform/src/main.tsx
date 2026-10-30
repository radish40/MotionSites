import React from 'react';
import ReactDOM from 'react-dom/client';
import { HeroSection } from './components/HeroSection';
import { SocialProofSection } from './components/SocialProofSection';
import './index.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><HeroSection /><SocialProofSection /></React.StrictMode>);
