import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';

/**
* Hyperspeed Background Component
*
* A high-performance Three.js based warp speed effect.
* Features:
* - Customizable distortions (turbulent, mountain, xy, LongRace, deep)
* - Interactive speed-up/slow-down
* - Multiple presets for color and geometry
* - Responsive container filling
*/

export interface HyperspeedOptions {
onSpeedUp?: () => void;
onSlowDown?: () => void;
distortion?: 'turbulentDistortion' | 'mountainDistortion' | 'xyDistortion' | 'LongRaceDistortion' | 'deepDistortion' | 'none';
length?: number;
roadWidth?: number;
islandWidth?: number;
lanesPerRoad?: number;
fov?: number;
fovSpeedUp?: number;
speedUp?: number;
carLightsFade?: number;
totalSideLightSticks?: number;
lightPairsPerRoadWay?: number;
shoulderLinesWidthPercentage?: number;
brokenLinesWidthPercentage?: number;
brokenLinesLengthPercentage?: number;
lightStickWidth?: [number, number];
lightStickHeight?: [number, number];
movingAwaySpeed?: [number, number];
movingCloserSpeed?: [number, number];
carLightsLength?: [number, number];
carLightsRadius?: [number, number];
carWidthPercentage?: [number, number];
carShiftX?: [number, number];
carFloorSeparation?: [number, number];
colors?: {
roadColor: number;
islandColor: number;
background: number;
shoulderLines: number;
brokenLines: number;
leftCars: number[];
rightCars: number[];
sticks: number;
};
}

export interface HyperspeedProps {
effectOptions?: HyperspeedOptions;
className?: string;
}

const DEFAULT_OPTIONS: HyperspeedOptions = {
onSpeedUp: () => { },
onSlowDown: () => { },
distortion: 'turbulentDistortion',
length: 400,
roadWidth: 10,
islandWidth: 2,
lanesPerRoad: 4,
fov: 90,
fovSpeedUp: 150,
speedUp: 2,
carLightsFade: 0.4,
totalSideLightSticks: 20,
lightPairsPerRoadWay: 40,
shoulderLinesWidthPercentage: 0.05,
brokenLinesWidthPercentage: 0.1,
brokenLinesLengthPercentage: 0.5,
lightStickWidth: [0.12, 0.5],
lightStickHeight: [1.3, 1.7],
movingAwaySpeed: [60, 80],
movingCloserSpeed: [-120, -160],
carLightsLength: [400 * 0.03, 400 * 0.2],
carLightsRadius: [0.05, 0.14],
carWidthPercentage: [0.3, 0.5],
carShiftX: [-0.8, 0.8],
carFloorSeparation: [0, 5],
colors: {
roadColor: 0x080808,
islandColor: 0x0a0a0a,
background: 0x000000,
shoulderLines: 0xFFFFFF,
brokenLines: 0xFFFFFF,
leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
sticks: 0x03B3C3,
}
};

export const Hyperspeed = forwardRef<HTMLDivElement, HyperspeedProps>(({ effectOptions, className }, ref) => {
const containerRef = useRef<HTMLDivElement>(null);
const canvasRef = useRef<HTMLCanvasElement>(null);


useImperativeHandle(ref, () => containerRef.current!);

useEffect(() => {
if (!containerRef.current || !canvasRef.current) return;

const options = { ...DEFAULT_OPTIONS, ...effectOptions };
const colors = { ...DEFAULT_OPTIONS.colors!, ...effectOptions?.colors };

// Internal state for animation
const state = {
speed: 1,
targetSpeed: 1,
fov: options.fov || 90,
targetFov: options.fov || 90,
};

// Three.js setup
const renderer = new THREE.WebGLRenderer({
canvas: canvasRef.current,
antialias: true,
alpha: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.background = new THREE.Color(colors.background);

const camera = new THREE.PerspectiveCamera(state.fov, 1, 0.1, 10000);
camera.position.z = 10;
camera.position.y = 7;

const resize = () => {
const width = containerRef.current!.clientWidth;
const height = containerRef.current!.clientHeight;
renderer.setSize(width, height);
camera.aspect = width / height;
camera.updateProjectionMatrix();
};

window.addEventListener('resize', resize);
resize();

// Create Geometry & Materials
// The supplied design uses a stylized, colored warp tunnel.

const count = 2000;
const basePositions = new Float32Array(count * 2);
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(count * 3 * 2);
const lineColors = new Float32Array(count * 3 * 2);

for (let i = 0; i < count; i++) {
const z = Math.random() * options.length!;
const r = options.roadWidth! + Math.random() * 20;
const theta = Math.random() * Math.PI * 2;

const x = Math.cos(theta) * r;
const y = Math.sin(theta) * r;

basePositions[i * 2] = x;
basePositions[i * 2 + 1] = y;
const idx = i * 6;
positions[idx] = x;
positions[idx + 1] = y;
positions[idx + 2] = -z;

positions[idx + 3] = x;
positions[idx + 4] = y;
positions[idx + 5] = -(z + 10 + Math.random() * 50);

const colorSet = i % 2 === 0 ? colors.leftCars : colors.rightCars;
const chosenColor = new THREE.Color(colorSet[Math.floor(Math.random() * colorSet.length)]);

lineColors[idx] = chosenColor.r;
lineColors[idx + 1] = chosenColor.g;
lineColors[idx + 2] = chosenColor.b;

lineColors[idx + 3] = chosenColor.r;
lineColors[idx + 4] = chosenColor.g;
lineColors[idx + 5] = chosenColor.b;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

const material = new THREE.LineBasicMaterial({
vertexColors: true,
transparent: true,
opacity: 0.8,
blending: THREE.AdditiveBlending
});

const lines = new THREE.LineSegments(geometry, material);
scene.add(lines);

// Distortion logic (simplified for React implementation)
const applyDistortion = (time: number, delta: number) => {
const pos = geometry.attributes.position.array as Float32Array;
for (let i = 0; i < count; i++) {
const idx = i * 6;
// Moving lines
pos[idx + 2] += state.speed * 300 * delta;
pos[idx + 5] += state.speed * 300 * delta;

// Reset if passed
if (pos[idx + 2] > 50) {
const newZ = options.length!;
const length = 10 + Math.random() * 50;
pos[idx + 2] = -newZ;
pos[idx + 5] = -(newZ + length);
}

// Recompute from original positions to prevent cumulative tunnel drift.
const depth = -pos[idx + 2] / options.length!;
const t = time * 0.001;
let dx = 0, dy = 0;
switch (options.distortion) {
case 'turbulentDistortion': dx = Math.sin(t + depth * 8) * depth * 2; break;
case 'mountainDistortion': dy = Math.cos(depth * 6 + t * 0.4) * depth * 5; break;
case 'xyDistortion': dx = Math.sin(depth * 7 + t) * depth * 4; dy = Math.cos(depth * 6 + t) * depth * 3; break;
case 'LongRaceDistortion': dx = Math.sin(depth * 3 + t * 0.35) * depth * 5; break;
case 'deepDistortion': dy = Math.sin(depth * 5 + t * 0.5) * depth * 9; break;
}
pos[idx] = pos[idx + 3] = basePositions[i * 2] + dx;
pos[idx + 1] = pos[idx + 4] = basePositions[i * 2 + 1] + dy;
}
geometry.attributes.position.needsUpdate = true;
};

// Animation Loop
let animationId: number;
let previousTime = 0;
const animate = (time: number) => {
animationId = requestAnimationFrame(animate);

const delta = Math.min((time - previousTime) / 1000, 0.05);
previousTime = time;
// Speed interpolation
state.speed += (state.targetSpeed - state.speed) * 0.05;
state.fov += (state.targetFov - state.fov) * 0.05;

camera.fov = state.fov;
camera.updateProjectionMatrix();

applyDistortion(time, delta);

renderer.render(scene, camera);
};

animate(0);

// Pointer events cover mouse, pen and touch without duplicate callbacks.
let held = false;
const handleDown = (event: PointerEvent) => {
if (event.button !== 0 || (event.target as HTMLElement).closest('button, dialog, [role="dialog"]')) return;
held = true;
state.targetSpeed = options.speedUp!;
state.targetFov = options.fovSpeedUp!;
containerRef.current?.setAttribute('data-speeding', 'true');
options.onSpeedUp?.();
};
const handleUp = () => {
if (!held) return;
held = false;
state.targetSpeed = 1;
state.targetFov = options.fov!;
containerRef.current?.setAttribute('data-speeding', 'false');
options.onSlowDown?.();
};
const handleKeyDown = (event: KeyboardEvent) => {
if (event.code !== 'Space' || event.repeat || (event.target as HTMLElement).closest('button, textarea, input')) return;
event.preventDefault();
handleDown({ button: 0, target: containerRef.current } as unknown as PointerEvent);
};
const handleKeyUp = (event: KeyboardEvent) => { if (event.code === 'Space') handleUp(); };
window.addEventListener('pointerdown', handleDown);
window.addEventListener('pointerup', handleUp);
window.addEventListener('pointercancel', handleUp);
window.addEventListener('blur', handleUp);
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

// Cleanup
return () => {
window.removeEventListener('resize', resize);
window.removeEventListener('pointerdown', handleDown);
window.removeEventListener('pointerup', handleUp);
window.removeEventListener('pointercancel', handleUp);
window.removeEventListener('blur', handleUp);
window.removeEventListener('keydown', handleKeyDown);
window.removeEventListener('keyup', handleKeyUp);
cancelAnimationFrame(animationId);
geometry.dispose();
material.dispose();
renderer.dispose();
};
}, [effectOptions]);

return (
<div
ref={containerRef}
className={`hyperspeed ${className || ''}`}
data-speeding="false"
>
<canvas
ref={canvasRef}
aria-label="Animated hyperspeed tunnel"
/>
</div>
);
});

export default Hyperspeed;

export const hyperspeedPresets = {
one: {
distortion: 'turbulentDistortion',
length: 400,
roadWidth: 10,
islandWidth: 2,
lanesPerRoad: 3,
fov: 90,
fovSpeedUp: 150,
speedUp: 2,
colors: {
roadColor: 0x080808,
islandColor: 0x0a0a0a,
background: 0x000000,
shoulderLines: 0x131318,
brokenLines: 0x131318,
leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
sticks: 0x03b3c3
}
},
two: {
distortion: 'mountainDistortion',
length: 400,
roadWidth: 9,
islandWidth: 2,
lanesPerRoad: 3,
fov: 90,
fovSpeedUp: 150,
speedUp: 2,
colors: {
roadColor: 0x080808,
islandColor: 0x0a0a0a,
background: 0x000000,
shoulderLines: 0x131318,
brokenLines: 0x131318,
leftCars: [0xff102a, 0xeb383e, 0xff102a],
rightCars: [0xdadafa, 0xbebae3, 0x8f97e4],
sticks: 0xdadafa
}
},
three: {
distortion: 'xyDistortion',
length: 400,
roadWidth: 9,
islandWidth: 2,
lanesPerRoad: 3,
fov: 90,
fovSpeedUp: 150,
speedUp: 3,
colors: {
roadColor: 0x080808,
islandColor: 0x0a0a0a,
background: 0x000000,
shoulderLines: 0x131318,
brokenLines: 0x131318,
leftCars: [0x7d0d1b, 0xa90519, 0xff102a],
rightCars: [0xf1eece, 0xe6e2b1, 0xdfd98a],
sticks: 0xf1eece
}
},
four: {
distortion: 'LongRaceDistortion',
length: 400,
roadWidth: 10,
islandWidth: 5,
lanesPerRoad: 2,
fov: 90,
fovSpeedUp: 150,
speedUp: 2,
colors: {
roadColor: 0x080808,
islandColor: 0x0a0a0a,
background: 0x000000,
shoulderLines: 0x131318,
brokenLines: 0x131318,
leftCars: [0xff5f73, 0xe74d60, 0xff102a],
rightCars: [0xa4e3e6, 0x80d1d4, 0x53c2c6],
sticks: 0xa4e3e6
}
},
five: {
distortion: 'turbulentDistortion',
length: 400,
roadWidth: 9,
islandWidth: 2,
lanesPerRoad: 3,
fov: 90,
fovSpeedUp: 150,
speedUp: 2,
colors: {
roadColor: 0x080808,
islandColor: 0x0a0a0a,
background: 0x000000,
shoulderLines: 0x131318,
brokenLines: 0x131318,
leftCars: [0xdc5b20, 0xdca320, 0xdc2020],
rightCars: [0x334bf7, 0xe5e6ed, 0xbfc6f3],
sticks: 0xc5e8eb
}
},
six: {
distortion: 'deepDistortion',
length: 400,
roadWidth: 18,
islandWidth: 2,
lanesPerRoad: 3,
fov: 90,
fovSpeedUp: 150,
speedUp: 2,
colors: {
roadColor: 0x080808,
islandColor: 0x0a0a0a,
background: 0x000000,
shoulderLines: 0x131318,
brokenLines: 0x131318,
leftCars: [0xff322f, 0xa33010, 0xa81508],
rightCars: [0xfdfdf0, 0xf3dea0, 0xe2bb88],
sticks: 0xfdfdf0
}
}
} satisfies Record<string, HyperspeedOptions>;
