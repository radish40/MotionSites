import React from 'react';
import ReactDOM from 'react-dom/client';
import { CoreFeaturesSection } from './components/CoreFeaturesSection';
import './index.css';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><main className="bg-background text-foreground font-inter antialiased"><CoreFeaturesSection /></main></React.StrictMode>
);
