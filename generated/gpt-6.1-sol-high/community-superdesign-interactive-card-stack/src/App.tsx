import { useMemo, useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { InteractiveCardStack } from './Component';

export default function App() {
  const [key, setKey] = useState(0);
  const cards = useMemo(() => [1, 2, 3, 4].map((number) => (
    <div className="photo" key={number}>
      <img src={`${import.meta.env.BASE_URL}images/showcase-${number}.jpg`} alt={`Showcase ${number}`} draggable={false} />
      <div className="photo-shade" />
    </div>
  )), []);
  return (
    <main className="showcase">
      <h2>Interactive Card Stack</h2>
      <div className="stack-group">
        <div className="stack-frame">
          <InteractiveCardStack key={key} cards={cards} randomRotation sendToBackOnClick autoplay={false} pauseOnHover />
        </div>
        <button className="reset" onClick={() => setKey(value => value + 1)} aria-label="Reset Animation">
          <RefreshCcw size={20} strokeWidth={2} />
        </button>
      </div>
      <p className="hint">Drag or click the top card to cycle</p>
    </main>
  );
}
