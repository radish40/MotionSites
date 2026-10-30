import { Layers, Lock, BarChart3 } from 'lucide-react';
import { Logo } from './Logo';
const cards = [
  { icon: <Logo size={24} />, text: 'Your All-in-One Content Studio', from: '#F59E0B', to: '#3B82F6' },
  { icon: <Layers className="w-6 h-6 text-emerald-600 flex-shrink-0" />, text: 'Multi-Channel Publishing Hub', from: '#10B981', to: '#06B6D4' },
  { icon: <Lock className="w-6 h-6 text-blue-600 flex-shrink-0" />, text: 'Role-Based Access & Approvals', from: '#3B82F6', to: '#0EA5E9' },
  { icon: <BarChart3 className="w-6 h-6 text-amber-600 flex-shrink-0" />, text: 'Advanced Content Analytics', from: '#F59E0B', to: '#EF4444' },
];
export function PopupCard() {
  return <div className="flex flex-col items-center gap-3 mt-10 sm:mt-16 w-full px-4 sm:px-0">
    {cards.map((card, i) => <div key={card.text} className="popup-card-animate flex items-center gap-3 sm:gap-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 px-4 sm:px-6 py-3 sm:py-4 w-full max-w-[380px]" style={{ animationDelay: `${i * 150}ms` }}>
      {card.icon}<span className="text-xs sm:text-sm font-medium text-gray-700 flex-1 whitespace-nowrap">{card.text}</span>
      <svg width="28" height="28" viewBox="0 0 28 28" className="spin-ring flex-shrink-0" aria-hidden="true"><defs><linearGradient id={`ring-${i}`} gradientUnits="userSpaceOnUse" x1="14" y1="3" x2="25" y2="14"><stop stopColor={card.from} /><stop offset="1" stopColor={card.to} /></linearGradient></defs><circle cx="14" cy="14" r="11" fill="none" stroke="#E5E7EB" strokeWidth="3" /><path d="M14 3 A11 11 0 0 1 25 14" fill="none" stroke={`url(#ring-${i})`} strokeWidth="3" strokeLinecap="round" /></svg>
    </div>)}
  </div>;
}
