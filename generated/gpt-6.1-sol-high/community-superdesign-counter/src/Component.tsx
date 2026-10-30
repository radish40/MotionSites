/**
* RollingCounter Component
*
* A high-performance, mechanical-style rolling counter using Framer Motion.
* It features smooth digit transitions, automatic place value detection,
* and customizable styling including gradient overlays for a polished look.
*/

import { MotionValue, motion, useSpring, useTransform } from 'framer-motion';
import React, { useEffect } from 'react';

type PlaceValue = number | '.';

interface NumberProps {
mv: MotionValue<number>;
number: number;
height: number;
}

function Number({ mv, number, height }: NumberProps) {
const y = useTransform(mv, latest => {
const placeValue = latest % 10;
const offset = (10 + number - placeValue) % 10;
let memo = offset * height;
if (offset > 5) {
memo -= 10 * height;
}
return memo;
});

const baseStyle: React.CSSProperties = {
position: 'absolute',
inset: 0,
display: 'flex',
alignItems: 'center',
justifyContent: 'center'
};

return <motion.span style={{ ...baseStyle, y }}>{number}</motion.span>;
}

interface DigitProps {
place: number;
value: number;
height: number;
digitStyle?: React.CSSProperties;
}

function Digit({ place, value, height, digitStyle }: DigitProps) {
// Numeric digit
const valueRoundedToPlace = Math.floor(value / place + 1e-8);
const animatedValue = useSpring(valueRoundedToPlace, {
damping: 20,
stiffness: 100,
mass: 1
});

useEffect(() => {
animatedValue.set(valueRoundedToPlace);
}, [animatedValue, valueRoundedToPlace]);

const defaultStyle: React.CSSProperties = {
height,
position: 'relative',
width: '1ch',
fontVariantNumeric: 'tabular-nums'
};

return (
<span className="relative inline-flex overflow-hidden" style={{ ...defaultStyle, ...digitStyle }}>
{Array.from({ length: 10 }, (_, i) => (
<Number key={i} mv={animatedValue} number={i} height={height} />
))}
</span>
);
}

export interface RollingCounterProps {
/** The numeric value to display */
value: number;
/** Font size in pixels (default: 100) */
fontSize?: number;
/** Vertical padding inside each digit container (default: 0) */
padding?: number;
/**
* Custom array of place values (e.g., [100, 10, 1, '.', 0.1]).
* If omitted, it's automatically detected from value.
*/
places?: PlaceValue[];
/** Gap between digits (default: 8) */
gap?: number;
/** Border radius of the counter container (default: 4) */
borderRadius?: number;
/** Horizontal padding of the counter container (default: 8) */
horizontalPadding?: number;
/** Text color (default: 'inherit') */
textColor?: string;
/** Font weight (default: 'inherit') */
fontWeight?: React.CSSProperties['fontWeight'];
/** Style object for the outer container */
containerStyle?: React.CSSProperties;
/** Style object for the inner counter wrapper */
counterStyle?: React.CSSProperties;
/** Style object for each individual digit span */
digitStyle?: React.CSSProperties;
/** Height of the gradient overlay (default: 16) */
gradientHeight?: number;
/** Start color of the gradient (default: 'black') */
gradientFrom?: string;
/** End color of the gradient (default: 'transparent') */
gradientTo?: string;
/** Custom style for the top gradient */
topGradientStyle?: React.CSSProperties;
/** Custom style for the bottom gradient */
bottomGradientStyle?: React.CSSProperties;
}

/**
* A reusable rolling counter component with smooth mechanical motion.
*/
export function RollingCounter({
value,
fontSize = 100,
padding = 0,
places,
gap = 8,
borderRadius = 4,
horizontalPadding = 8,
textColor = 'inherit',
fontWeight = 'inherit',
containerStyle,
counterStyle,
digitStyle,
gradientHeight = 16,
gradientFrom = 'hsl(var(--background))',
gradientTo = 'transparent',
topGradientStyle,
bottomGradientStyle
}: RollingCounterProps) {
const height = fontSize + padding;

// Automatic place detection if none provided
const derivedPlaces = places || [...value.toString()].map((ch, i, a) => {
if (ch === '.') return '.';
const dotIndex = a.indexOf('.');
const isInteger = dotIndex === -1;
const exponent = isInteger ? a.length - i - 1 : i < dotIndex ? dotIndex - i - 1 : -(i - dotIndex);
return 10 ** exponent;
});

const defaultContainerStyle: React.CSSProperties = {
position: 'relative',
display: 'inline-block'
};

const defaultCounterStyle: React.CSSProperties = {
fontSize,
display: 'flex',
gap,
overflow: 'hidden',
borderRadius,
paddingLeft: horizontalPadding,
paddingRight: horizontalPadding,
lineHeight: 1,
color: textColor,
fontWeight
};

const gradientContainerStyle: React.CSSProperties = {
pointerEvents: 'none',
position: 'absolute',
inset: 0,
display: 'flex',
flexDirection: 'column',
justifyContent: 'space-between'
};

const defaultTopGradientStyle: React.CSSProperties = {
height: gradientHeight,
background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
zIndex: 10
};

const defaultBottomGradientStyle: React.CSSProperties = {
height: gradientHeight,
background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
zIndex: 10
};

return (
<span role="img" aria-label={String(value)} data-testid="rolling-counter" style={{ ...defaultContainerStyle, ...containerStyle }}>
<span style={{ ...defaultCounterStyle, ...counterStyle }}>
{derivedPlaces.map((place, idx) => place === '.' ? (
<span key={`decimal-${idx}`} style={{ height, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...digitStyle }}>.</span>
) : (
<Digit
key={`${place}-${idx}`}
place={place}
value={value}
height={height}
digitStyle={digitStyle}
/>
))}
</span>
<span style={gradientContainerStyle}>
<span style={topGradientStyle ?? defaultTopGradientStyle} />
<span style={bottomGradientStyle ?? defaultBottomGradientStyle} />
</span>
</span>
);
}

export default RollingCounter;
