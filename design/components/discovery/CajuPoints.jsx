import React from 'react';

const STYLE_ID = 'caju-points-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .caju-pts { display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-sans); }
  .caju-pts__seed {
    display: grid; place-items: center; border-radius: 50%;
    background: radial-gradient(120% 120% at 30% 20%, var(--caju-400), var(--caju-600));
    box-shadow: inset 0 1px 0 rgba(255,255,255,.3);
  }
  .caju-pts__seed svg { width: 62%; height: 62%; }
  .caju-pts__val { font-family: var(--font-mono); font-weight: var(--w-medium); color: var(--ink-900); font-variant-numeric: tabular-nums; }
  .caju-pts__unit { font-size: var(--t-xs); color: var(--ink-400); }

  /* chip */
  .caju-pts--chip {
    padding: 5px 12px 5px 5px; border-radius: var(--r-full);
    background: var(--caju-050); box-shadow: var(--ring-hairline);
  }
  .caju-pts--chip .caju-pts__val { color: var(--caju-700); }

  /* sizes */
  .caju-pts--sm .caju-pts__seed { width: 20px; height: 20px; }
  .caju-pts--sm .caju-pts__val { font-size: 13px; }
  .caju-pts--md .caju-pts__seed { width: 26px; height: 26px; }
  .caju-pts--md .caju-pts__val { font-size: 15px; }
  .caju-pts--lg .caju-pts__seed { width: 40px; height: 40px; }
  .caju-pts--lg .caju-pts__val { font-size: 26px; letter-spacing: -0.02em; }

  .caju-pts__delta { color: var(--leaf-600); font-family: var(--font-mono); font-size: var(--t-xs); font-weight: var(--w-medium); }
  `;
  document.head.appendChild(el);
}

const Seed = () => (
  <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
    <path d="M12 2.5c.5 3.7 2.3 5.5 6 6-3.7.5-5.5 2.3-6 6-.5-3.7-2.3-5.5-6-6 3.7-.5 5.5-2.3 6-6Z"/>
  </svg>
);

/**
 * Caju Points — knowledge contributed to the Brain, never vanity.
 * `+N` delta appears after a contribution (feedback, quiz, photo).
 */
export function CajuPoints({
  value,
  delta = null,
  unit = null,
  size = 'md',
  chip = false,
  className = '',
  ...rest
}) {
  ensureStyles();
  const cls = ['caju-pts', `caju-pts--${size}`, chip ? 'caju-pts--chip' : '', className]
    .filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      <span className="caju-pts__seed"><Seed /></span>
      <span className="caju-pts__val">{typeof value === 'number' ? value.toLocaleString('es-AR') : value}</span>
      {unit && <span className="caju-pts__unit">{unit}</span>}
      {delta != null && <span className="caju-pts__delta">+{delta}</span>}
    </span>
  );
}
