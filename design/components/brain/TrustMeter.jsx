import React from 'react';

const STYLE_ID = 'caju-trust-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .caju-trust { display: inline-flex; align-items: center; gap: 9px; }
  .caju-trust__bars { display: inline-flex; gap: 3px; align-items: flex-end; }
  .caju-trust__bars i { width: 4px; border-radius: 2px; background: var(--line-strong); display: block; }
  .caju-trust__bars i:nth-child(1) { height: 8px; }
  .caju-trust__bars i:nth-child(2) { height: 12px; }
  .caju-trust__bars i:nth-child(3) { height: 16px; }
  .caju-trust__label {
    font-family: var(--font-sans); font-size: var(--t-xs); font-weight: var(--w-medium);
    color: var(--ink-600); letter-spacing: var(--tracking-snug);
  }
  .caju-trust--high  .caju-trust__bars i.on { background: var(--leaf-600); }
  .caju-trust--high  .caju-trust__label { color: var(--leaf-700); }
  .caju-trust--mid   .caju-trust__bars i.on { background: var(--amber-500); }
  .caju-trust--mid   .caju-trust__label { color: var(--amber-600); }
  .caju-trust--low   .caju-trust__bars i.on { background: var(--clay-500); }
  .caju-trust--low   .caju-trust__label { color: var(--clay-600); }

  /* pill variant */
  .caju-trust--pill {
    padding: 5px 10px 5px 9px; border-radius: var(--r-full);
    background: var(--surface); box-shadow: var(--ring-hairline);
  }
  .caju-trust--pill.caju-trust--high { background: var(--leaf-050); }
  .caju-trust--pill.caju-trust--mid  { background: var(--amber-050); }
  .caju-trust--pill.caju-trust--low  { background: var(--clay-050); }
  `;
  document.head.appendChild(el);
}

const LABELS = { high: 'Confianza alta', mid: 'Confianza media', low: 'Señales en conflicto' };
const FILLED = { high: 3, mid: 2, low: 1 };

/**
 * Trust Meter — the visual language of the Trust Engine. Shows how
 * sure the Brain is about a recommendation, in natural language +
 * a 3-bar meter. `low` means contradictory signals, not "bad".
 */
export function TrustMeter({
  level = 'high',
  label = null,
  pill = false,
  className = '',
  ...rest
}) {
  ensureStyles();
  const filled = FILLED[level] || 0;
  const cls = ['caju-trust', `caju-trust--${level}`, pill ? 'caju-trust--pill' : '', className]
    .filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      <span className="caju-trust__bars" aria-hidden="true">
        {[0, 1, 2].map((i) => <i key={i} className={i < filled ? 'on' : ''} />)}
      </span>
      <span className="caju-trust__label">{label ?? LABELS[level]}</span>
    </span>
  );
}
