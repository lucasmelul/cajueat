import './CajuPoints.css';

export type CajuPointsSize = 'sm' | 'md' | 'lg';

export interface CajuPointsProps {
  value: number | string;
  delta?: number | null;
  unit?: string | null;
  size?: CajuPointsSize;
  chip?: boolean;
  className?: string;
}

function Seed() {
  return (
    <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
      <path d="M12 2.5c.5 3.7 2.3 5.5 6 6-3.7.5-5.5 2.3-6 6-.5-3.7-2.3-5.5-6-6 3.7-.5 5.5-2.3 6-6Z" />
    </svg>
  );
}

/** Caju Points — value contributed to the Brain (knowledge, not vanity). */
export function CajuPoints({ value, delta, unit, size = 'md', chip = false, className = '' }: CajuPointsProps) {
  const cls = ['caju-pts', `caju-pts--${size}`, chip ? 'caju-pts--chip' : '', className].filter(Boolean).join(' ');
  return (
    <span className={cls}>
      <span className="caju-pts__seed">
        <Seed />
      </span>
      <span className="caju-pts__val">{typeof value === 'number' ? value.toLocaleString('es-AR') : value}</span>
      {unit && <span className="caju-pts__unit">{unit}</span>}
      {delta != null && <span className="caju-pts__delta">+{delta}</span>}
    </span>
  );
}
