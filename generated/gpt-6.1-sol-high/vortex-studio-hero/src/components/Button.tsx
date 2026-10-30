import type { ReactNode } from 'react';
import { bookUrl } from '../assets';
export default function Button({children, href = bookUrl, variant = 'primary', className = ''}: {children: ReactNode; href?: string; variant?: 'primary'|'secondary'|'tertiary'; className?: string}) {
  return <a href={href} className={`button button-${variant} ${className}`}>{children}</a>;
}
