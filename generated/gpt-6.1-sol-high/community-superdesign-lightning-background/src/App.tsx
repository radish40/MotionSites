import React from 'react';
import { Lightning } from './Component';

export default function App() {
  return (
    <main className="atmosphere">
      <div className="background">
        <Lightning hue={210} speed={0.8} intensity={1.2} size={0.9} />
      </div>
      <div className="content">
        <div className="intro">
          <h1>Lightning Discharge</h1>
          <p>Atmospheric WebGL background rendering with fluid noise dynamics.</p>
          <div className="action">
            <button onClick={() => alert('Reply Action')}>Reply</button>
          </div>
        </div>
      </div>
      <div className="frame" aria-hidden="true" />
    </main>
  );
}
