import type { ReactNode } from 'react';
import './Badge.css';

export type BadgeTone = 'neutral' | 'brand' | 'new' | 'success' | 'danger' | 'over';

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
  className?: string;
}

/** Small status label / eyebrow. Tones follow the trust palette. */
export function Badge({ children, tone = 'neutral', dot = false, className = '' }: BadgeProps) {
  const cls = ['caju-badge', `caju-badge--${tone}`, className].filter(Boolean).join(' ');
  return (
    <span className={cls}>
      {dot && tone !== 'over' && <span className="caju-badge__dot" />}
      {children}
    </span>
  );
}
