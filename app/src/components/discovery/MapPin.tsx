import './MapPin.css';

export type PinType = 'recommended' | 'new' | 'saved' | 'visited' | 'event' | 'collection';

export interface MapPinProps {
  type?: PinType;
  label?: string;
  /** Selected → grows + caju ring (SPEC-001 "pin crece"). */
  selected?: boolean;
  /** Force the compact dot form even with a label. */
  dotOnly?: boolean;
  onClick?: () => void;
  className?: string;
}

const GLYPH: Record<PinType, React.ReactNode> = {
  recommended: <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5L12 3Z" />,
  new: <path d="M12 4v16M4 12h16" />,
  saved: <path d="M7 4h10v16l-5-3-5 3V4Z" />,
  visited: <path d="M4 12l5 5L20 6" />,
  event: <path d="M8 3v4M16 3v4M4 9h16M5 6h14v14H5z" />,
  collection: <path d="M4 7h16M4 12h16M4 17h10" />,
};

/**
 * Map Pin — a typed marker. Not all pins are equal: the Brain's main pick
 * shows a label; secondary/discovery pins are dot-only (SPEC-001).
 */
export function MapPin({ type = 'recommended', label, selected = false, dotOnly = false, onClick, className = '' }: MapPinProps) {
  const compact = dotOnly || !label;
  const cls = ['caju-pin', `caju-pin--${type}`, compact ? 'caju-pin--dot' : '', selected ? 'caju-pin--selected' : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <button type="button" className={cls} onClick={onClick} aria-label={label || type}>
      <span className="caju-pin__dot">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {GLYPH[type]}
        </svg>
      </span>
      {!compact && <span className="caju-pin__label">{label}</span>}
    </button>
  );
}
