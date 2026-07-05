import type { ReactNode } from 'react';
import type { TrustLevel } from '../../types';
import './TrustMeter.css';

export interface TrustMeterProps {
  level?: TrustLevel;
  label?: ReactNode;
  pill?: boolean;
  className?: string;
}

const LABELS: Record<TrustLevel, string> = { high: 'Confianza alta', mid: 'Confianza media', low: 'Señales en conflicto' };
const FILLED: Record<TrustLevel, number> = { high: 3, mid: 2, low: 1 };

/**
 * Trust Meter — visual expression of the Trust Engine. `low` = contradictory/
 * insufficient signals (honesty), never "bad place" (SPEC-007).
 */
export function TrustMeter({ level = 'high', label, pill = false, className = '' }: TrustMeterProps) {
  const filled = FILLED[level] ?? 0;
  const cls = ['caju-trust', `caju-trust--${level}`, pill ? 'caju-trust--pill' : '', className].filter(Boolean).join(' ');
  return (
    <span className={cls}>
      <span className="caju-trust__bars" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <i key={i} className={i < filled ? 'on' : ''} />
        ))}
      </span>
      <span className="caju-trust__label">{label ?? LABELS[level]}</span>
    </span>
  );
}
