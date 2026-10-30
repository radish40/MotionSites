import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
export interface TaskCardProps {
  icon: LucideIcon;
  title: string;
  tagText: string;
  tagColor: 'green' | 'yellow' | 'red';
  details: { label: string; value: string }[];
  bottomLeftContent: ReactNode;
  buttonText: string;
  buttonVariant: 'dark' | 'light' | 'black';
  buttonIcon?: ReactNode;
  onAction?: () => void;
}
const tagColors = { green: 'bg-green-500 text-white', yellow: 'bg-yellow-400 text-gray-900', red: 'bg-red-500 text-white' };
const buttonColors = { dark: 'bg-[#ECECEC] text-gray-900 hover:bg-gray-200', light: 'bg-gray-100 text-gray-900 hover:bg-gray-200', black: 'bg-black text-white hover:bg-gray-800' };
export default function TaskCard({ icon: Icon, title, tagText, tagColor, details, bottomLeftContent, buttonText, buttonVariant, buttonIcon, onAction }: TaskCardProps) {
  return <article className="task-card bg-white rounded-[20px] sm:rounded-[28px] px-4 sm:px-6 py-4 sm:py-5 shadow-sm">
    <div className="flex items-center justify-between gap-2 border-b border-black/10 pb-4">
      <h3 className="flex items-center gap-2.5 text-[15px] sm:text-[17px] font-medium tracking-[-0.025em]"><Icon size={19} strokeWidth={1.7} className="shrink-0" />{title}</h3>
      <span className={`rounded-full px-3 py-1 text-[11px] sm:text-xs ${tagColors[tagColor]}`}>{tagText}</span>
    </div>
    <div className="flex gap-3 border-b border-black/10 py-4">
      {details.map((detail, i) => <div key={detail.label} className={`${i === 2 ? 'flex-[0.5] max-w-[120px]' : 'flex-1'} min-w-0`}><p className="text-[11px] sm:text-xs text-gray-500 mb-1.5">{detail.label}</p><p className="text-[11px] sm:text-xs leading-[1.55] font-medium text-gray-900">{detail.value}</p></div>)}
    </div>
    <div className="task-footer flex items-center justify-between gap-2 pt-4">
      <div className="min-w-0 flex items-center gap-2 text-[10px] sm:text-[11px] text-gray-500">{bottomLeftContent}</div>
      <button onClick={onAction} className={`shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2.5 text-[10px] sm:text-[11px] font-medium transition-colors ${buttonColors[buttonVariant]}`}>{buttonIcon}{buttonText}</button>
    </div>
  </article>;
}
