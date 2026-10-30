import { cn } from '@/lib/utils';

type Props = { name: string; size?: number; className?: string; fill?: 0 | 1; weight?: number; grade?: number; opsz?: number };
export const MIcon = ({ name, size = 20, className, fill = 0, weight = 400, grade = 0, opsz = 24 }: Props) => (
  <span aria-hidden="true" className={cn('material-symbols-outlined leading-none', className)}
    style={{ fontSize: size, fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opsz}` }}>
    {name}
  </span>
);
