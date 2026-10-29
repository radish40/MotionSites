import React from 'react';
import ReactDOM from 'react-dom/client';
import FeaturesChess from './FeaturesChess';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <main className="bg-black"><FeaturesChess /></main>
  </React.StrictMode>,
);
