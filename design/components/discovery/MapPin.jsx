import React from 'react';

const STYLE_ID = 'caju-pin-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .caju-pin {
    position: relative; display: inline-flex; align-items: center; gap: 7px;
    height: 34px; padding: 0 12px 0 8px; border: 0; cursor: pointer;
    background: var(--surface); border-radius: var(--r-full);
    box-shadow: var(--elev-pin), var(--ring-hairline);
    font-family: var(--font-sans); font-size: var(--t-xs); font-weight: var(--w-semibold);
    color: var(--ink-800); white-space: nowrap; -webkit-tap-highlight-color: transparent;
    transition: transform var(--motion-card), box-shadow var(--motion-card);
  }
  .caju-pin__dot { width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0;
    display: grid; place-items: center; color: #fff; }
  .caju-pin__dot svg { width: 10px; height: 10px; }
  .caju-pin:active { transform: scale(.95); }

  /* dot-only (secondary / discovery pins) */
  .caju-pin--dot { padding: 0; width: 26px; height: 26px; justify-content: center; }
  .caju-pin--dot .caju-pin__dot { width: 14px; height: 14px; }
  .caju-pin--dot .caju-pin__label { display: none; }

  /* selected — grows, caju ring, lifts (SPEC-001 "pin crece") */
  .caju-pin--selected { transform: scale(1.06); box-shadow: var(--shadow-lg), 0 0 0 3px var(--focus-ring); }
  .caju-pin--selected:active { transform: scale(1.02); }

  /* type colors on the dot */
  .caju-pin--recommended .caju-pin__dot { background: var(--pin-recommended); }
  .caju-pin--new         .caju-pin__dot { background: var(--pin-new); }
  .caju-pin--saved       .caju-pin__dot { background: var(--pin-saved); }
  .caju-pin--visited     .caju-pin__dot { background: var(--pin-visited); }
  .caju-pin--event       .caju-pin__dot { background: var(--pin-event); }
  .caju-pin--collection  .caju-pin__dot { background: var(--pin-collection); }
  `;
  document.head.appendChild(el);
}

const GLYPH = {
  recommended: <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5L12 3Z"/>,
  new: <path d="M12 4v16M4 12h16"/>,
  saved: <path d="M7 4h10v16l-5-3-5 3V4Z"/>,
  visited: <path d="M4 12l5 5L20 6"/>,
  event: <path d="M8 3v4M16 3v4M4 9h16M5 6h14v14H5z"/>,
  collection: <path d="M4 7h16M4 12h16M4 17h10"/>,
};

/**
 * Map Pin — a typed marker. Not all pins are equal: the Brain's
 * main pick shows a label; secondary/discovery pins are dot-only
 * (SPEC-001). Types map to the contained pin palette.
 */
export function MapPin({
  type = 'recommended',
  label = null,
  selected = false,
  dotOnly = false,
  onClick,
  className = '',
  ...rest
}) {
  ensureStyles();
  const compact = dotOnly || !label;
  const cls = ['caju-pin', `caju-pin--${type}`,
    compact ? 'caju-pin--dot' : '', selected ? 'caju-pin--selected' : '', className]
    .filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} onClick={onClick}
            aria-label={label || type} {...rest}>
      <span className="caju-pin__dot">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {GLYPH[type]}
        </svg>
      </span>
      {!compact && <span className="caju-pin__label">{label}</span>}
    </button>
  );
}
