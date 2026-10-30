import { useEffect, useRef } from 'react';
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const values = [18000, 22000, 19000, 25000, 21000, 32000, 28000];
const width = 400, height = 180, padTop = 10, padBottom = 30, left = 30;
const baseline = height - padBottom;
const points = values.map((v, i) => ({ x: left + i * (width - left - 10) / 6, y: padTop + (1 - v / 40000) * (baseline - padTop) }));
function smooth() {
  return points.reduce((path, p, i) => {
    if (!i) return `M${p.x},${p.y}`;
    const prev = points[i - 1], mid = (prev.x + p.x) / 2;
    return `${path} C${mid},${prev.y} ${mid},${p.y} ${p.x},${p.y}`;
  }, '');
}
export function AnimatedChart() {
  const line = useRef<SVGPathElement>(null);
  useEffect(() => {
    const path = line.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.transition = 'none';
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => { path.style.transition = 'stroke-dashoffset 1.8s ease-out'; path.style.strokeDashoffset = '0'; }); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, []);
  const path = smooth(), highlight = points[5];
  return <svg viewBox="0 0 400 180" className="w-full overflow-visible" role="img" aria-label="Weekly content reach, Monday 18,000, Tuesday 22,000, Wednesday 19,000, Thursday 25,000, Friday 21,000, Saturday 32,000, Sunday 28,000">
    <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#1F2937" stopOpacity="0.08" /><stop offset="1" stopColor="#1F2937" stopOpacity="0" /></linearGradient></defs>
    {[0, 10000, 20000, 30000, 40000].map(v => { const y = padTop + (1 - v / 40000) * (baseline - padTop); return <g key={v}><text x="23" y={y + 3} textAnchor="end" fill="#9CA3AF" fontSize="9">{v ? `${v / 1000}k` : '0'}</text><line x1={left} x2="390" y1={y} y2={y} stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="4 3" /></g>; })}
    <path className="chart-area" d={`${path} L${points[6].x},${baseline} L${points[0].x},${baseline} Z`} fill="url(#chartGrad)" />
    <path ref={line} d={path} fill="none" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
    <line x1={highlight.x} x2={highlight.x} y1={highlight.y} y2={baseline} stroke="#1F2937" strokeDasharray="3 2" />
    <circle className="chart-dot" cx={highlight.x} cy={highlight.y} r="5" fill="white" stroke="#1F2937" strokeWidth="2" style={{ transformOrigin: `${highlight.x}px ${highlight.y}px` }} />
    <g className="chart-tooltip"><rect x={highlight.x - 48} y={highlight.y - 32} width="96" height="22" rx="6" fill="#1F2937" /><text x={highlight.x - 39} y={highlight.y - 18} fill="white" fontSize="9">32,104</text><text x={highlight.x + 2} y={highlight.y - 18} fill="#34D399" fontSize="9">+6,488</text></g>
    {points.map((p, i) => <text key={days[i]} x={p.x} y={height - 8} textAnchor="middle" fill={i === 5 ? '#111827' : '#9CA3AF'} fontSize="9" fontWeight={i === 5 ? 600 : 400}>{days[i]}</text>)}
  </svg>;
}
