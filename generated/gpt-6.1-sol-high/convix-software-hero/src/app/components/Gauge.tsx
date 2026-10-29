type Props = { value: number; color?: string; showLabels?: boolean; min?: string; max?: string };
export default function Gauge({ value, color='#ef4d23', showLabels=false, min, max }:Props) {
 const active = Math.round(value/100*40);
 return <div className="gauge"><svg viewBox="0 0 200 120" role="img" aria-label={`${value}% target achieved`}>
 {Array.from({length:40},(_,i)=>{const angle=Math.PI+i/39*Math.PI;return <line key={i} x1={100+70*Math.cos(angle)} y1={100+70*Math.sin(angle)} x2={100+80*Math.cos(angle)} y2={100+80*Math.sin(angle)} stroke={i<active?color:'#d4d4d8'} strokeWidth="2.5" strokeLinecap="round"/>;})}
 <text x="100" y="105" textAnchor="middle" fontSize="22" fontWeight="600" fill="currentColor">{value}%</text></svg>{showLabels&&<div className="gauge-labels"><span>{min}</span><span>{max}</span></div>}</div>;
}
