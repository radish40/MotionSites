import React from 'react';
import { GhostCursor } from './Component';

const App = () => {
return (
<main style={{
position: 'relative',
minHeight: '100vh',
backgroundColor: '#111',
color: '#fff',
display: 'flex',
flexDirection: 'column',
justifyContent: 'center',
alignItems: 'center',
overflow: 'hidden'
}}>
<div className="z-20 text-center pointer-events-none select-none">
<h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">Ghost Cursor</h1>
<p className="text-gray-400 text-lg">Move your cursor to see the effect</p>
</div>

<GhostCursor
// Visuals
color="#B19EEF"
brightness={1.2}
edgeIntensity={0}
// Trail and motion
trailLength={20}
inertia={0.4}
// Post-processing
grainIntensity={0.05}
bloomStrength={0.5}
bloomRadius={0.7}
bloomThreshold={0}
// Fade-out behavior
fadeDelayMs={200}
fadeDurationMs={1000}
/>

{/* Background decoration */}
<div className="absolute inset-0 z-0 bg-gradient-to-tr from-purple-900/10 to-blue-900/10" />
</main>
);
};

export default App;
