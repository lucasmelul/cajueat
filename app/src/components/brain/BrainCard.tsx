import type { HTMLAttributes, ReactNode } from 'react';
import { X } from 'lucide-react';
import { BrainMark } from './BrainMark';
import './BrainCard.css';

export interface BrainCardProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: ReactNode;
  message: ReactNode;
  sub?: ReactNode;
  thinking?: boolean;
  actions?: ReactNode;
  icon?: ReactNode;
  /** When provided, shows a close button — the card stays dismissable, never mandatory once shown once. */
  onClose?: () => void;
}

/** Brain Card — the single floating card over the Living Map. Only ever ONE at a time (SPEC-001). */
export function BrainCard({ eyebrow = 'CAJU', message, sub = null, thinking = false, actions = null, icon = null, onClose, className = '', ...rest }: BrainCardProps) {
  return (
    <div className={`caju-brain ${className}`} {...rest}>
      <BrainMark thinking={thinking} />
      <div className="caju-brain__body">
        <div className="caju-brain__eyebrow">
          {icon}
          {eyebrow}
        </div>
        <div className="caju-brain__msg">{message}</div>
        {sub && <div className="caju-brain__sub">{sub}</div>}
        {actions && <div className="caju-brain__actions">{actions}</div>}
      </div>
      {onClose && (
        <button className="caju-brain__close" onClick={onClose} aria-label="Cerrar">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
