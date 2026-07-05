import type { MouseEvent, ReactNode } from 'react';
import './Chip.css';

export interface ChipProps {
  children: ReactNode;
  selected?: boolean;
  brand?: boolean;
  icon?: ReactNode;
  as?: 'button' | 'span';
  onClick?: (e: MouseEvent) => void;
  className?: string;
}

/** Context Chip — selectable pill for switching map/query context (SPEC-001). */
export function Chip({ children, selected = false, brand = false, icon = null, as = 'button', onClick, className = '' }: ChipProps) {
  const isButton = as === 'button';
  const cls = [
    'caju-chip',
    selected ? 'caju-chip--selected' : '',
    brand ? 'caju-chip--brand' : '',
    !isButton ? 'caju-chip--static' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (isButton) {
    return (
      <button type="button" className={cls} aria-pressed={selected} onClick={onClick}>
        {icon && <span className="caju-chip__ico">{icon}</span>}
        {children}
      </button>
    );
  }

  return (
    <span className={cls}>
      {icon && <span className="caju-chip__ico">{icon}</span>}
      {children}
    </span>
  );
}
