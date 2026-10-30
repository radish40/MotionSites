import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface FolderProps {
  color?: string;
  size?: number;
  items?: React.ReactNode[];
  className?: string;
  label?: string;
}

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) color = color.split('').map(c => c + c).join('');
  const num = parseInt(color, 16);
  const r = Math.max(0, Math.min(255, Math.floor(((num >> 16) & 255) * (1 - percent))));
  const g = Math.max(0, Math.min(255, Math.floor(((num >> 8) & 255) * (1 - percent))));
  const b = Math.max(0, Math.min(255, Math.floor((num & 255) * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

export function InteractiveFolder({ color = '#5227FF', size = 1, items = [], className = '', label }: FolderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();
  const displayItems = items.slice(0, 3);
  while (displayItems.length < 3) displayItems.push(null);
  const folderBackColor = darkenColor(color, 0.12);
  const paperColors = [darkenColor('#ffffff', 0.1), darkenColor('#ffffff', 0.05), '#ffffff'];
  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    if (!isOpen || reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({x: (e.clientX - (rect.left + rect.width / 2)) * 0.2, y: (e.clientY - (rect.top + rect.height / 2)) * 0.2});
    setHoveredIndex(index);
  };
  const handleMouseLeave = () => {setMousePos({x: 0, y: 0}); setHoveredIndex(null);};
  const getPaperTransform = (index: number) => {
    if (!isOpen) return {x: '-50%', y: '10%', rotate: 0, scale: 1};
    const base = [
      {x: '-120%', y: '-75%', rotate: -15},
      {x: '10%', y: '-75%', rotate: 15},
      {x: '-50%', y: '-105%', rotate: 5}
    ][index];
    return hoveredIndex === index ? {x: `calc(${base.x} + ${mousePos.x}px)`, y: `calc(${base.y} + ${mousePos.y}px)`, rotate: base.rotate, scale: 1.1} : {...base, scale: 1};
  };
  const toggle = () => {setIsOpen(open => !open); handleMouseLeave();};
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{transform: `scale(${size})`, width: 120, height: 100}}>
      <div className="folder-control relative cursor-pointer group select-none" role="button" tabIndex={0} aria-label={label || 'Folder'} aria-expanded={isOpen}
        onClick={toggle} onKeyDown={e => {if (e.key === 'Enter' || e.key === ' ') {e.preventDefault(); toggle();}}}>
        <div className="relative w-[110px] h-[85px] transition-all duration-500 rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px]" style={{backgroundColor: folderBackColor, boxShadow: isOpen ? '0 10px 30px -5px rgba(0,0,0,0.1)' : '0 4px 12px -2px rgba(0,0,0,0.05)'}}>
          <div className="absolute bottom-full left-0 w-[35px] h-[12px] rounded-t-[6px]" style={{backgroundColor:folderBackColor}} />
          {displayItems.map((item, i) => (
            <motion.div key={i} data-paper={i} aria-hidden="true" onMouseMove={e => handleMouseMove(e, i)} onMouseLeave={handleMouseLeave}
              initial={false} animate={getPaperTransform(i)} transition={reducedMotion ? {duration:0} : {type:'spring', stiffness:260, damping:20, mass:1}}
              className="absolute left-1/2 flex items-center justify-center overflow-hidden"
              style={{zIndex:20, backgroundColor:paperColors[i], borderRadius:'8px', width:i === 0 ? '75px' : i === 1 ? '85px' : '95px', height:i === 0 ? '65px' : i === 1 ? '70px' : '75px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', border:'1px solid rgba(0,0,0,0.03)'}}>
              {item || <div className="w-full h-full p-2 flex flex-col gap-1.5 opacity-20"><div className="w-3/4 h-1 bg-current rounded-full"/><div className="w-1/2 h-1 bg-current rounded-full"/><div className="w-2/3 h-1 bg-current rounded-full"/></div>}
            </motion.div>
          ))}
          {[true, false].map(left => (
            <motion.div key={String(left)} initial={false} animate={{skewX: isOpen ? (left ? 15 : -15) : 0, scaleY:isOpen ? 0.6 : 1, translateY:isOpen ? 4 : 0}}
              transition={reducedMotion ? {duration:0} : {type:'spring', stiffness:300, damping:25}}
              className="absolute inset-0 z-30 origin-bottom" style={{backgroundColor:color, borderRadius:'6px 12px 12px 12px', clipPath:left ? 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' : 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)'}}>
            </motion.div>
          ))}
          {label && !isOpen && <div aria-hidden="true" className="pointer-events-none absolute z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/90 text-[10px] font-medium tracking-tight whitespace-nowrap px-2">{label}</div>}
        </div>
      </div>
    </div>
  );
}
export default InteractiveFolder;
