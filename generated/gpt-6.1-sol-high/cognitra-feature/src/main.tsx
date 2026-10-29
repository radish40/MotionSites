import React from 'react';
import ReactDOM from 'react-dom/client';
import { FadeUp } from './FadeUp';
import './styles.css';

const words = 'WE BUILD END-TO-END AI AUTOMATION SYSTEMS.'.split(' ');

function App() {
  return (
    <>
      <video
        className="background-video"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260514_135830_bb6491d1-9b66-4aec-9722-13b4dfe3fb46.mp4"
        autoPlay muted loop playsInline
        aria-hidden="true"
      />
      <main>
        <section className="feature" aria-labelledby="feature-heading">
          <div className="flex max-w-[720px] flex-col items-start">
            <h2 id="feature-heading">
              {words.map((word, index) => (
                <FadeUp as="span" key={word} delay={0.15 + index * 0.08} y={32}>
                  {word}
                </FadeUp>
              ))}
            </h2>
            <FadeUp as="p" className="feature-description" delay={0.9}>
              We provide all-in-one AI automation services in one place.
            </FadeUp>
          </div>
        </section>
      </main>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
);
