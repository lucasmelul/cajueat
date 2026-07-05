import React from 'react';

const STYLE_ID = 'caju-badge-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .caju-badge {
    display: inline-flex; align-items: center; gap: 5px;
    height: 22px; padding: 0 9px;
    font-family: var(--font-sans); font-size: var(--t-caption);
    font-weight: var(--w-semibold); letter-spacing: var(--tracking-snug);
    border-radius: var(--r-full); white-space: nowrap;
    --_bg: var(--paper-sunk); --_fg: var(--ink-600);
    background: var(--_bg); color: var(--_fg);
  }
  .caju-badge__dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .caju-badge--solid { border: 0; }

  .caju-badge--neutral { --_bg: var(--paper-sunk); --_fg: var(--ink-600); }
  .caju-badge--brand   { --_bg: var(--caju-100);  --_fg: var(--caju-700); }
  .caju-badge--new     { --_bg: var(--amber-100); --_fg: var(--amber-600); }
  .caju-badge--success { --_bg: var(--leaf-100);  --_fg: var(--leaf-700); }
  .caju-badge--danger  { --_bg: var(--clay-100);  --_fg: var(--clay-600); }

  /* Overline variant — uppercase mono eyebrow, no fill */
  .caju-badge--over {
    height: auto; padding: 0; background: transparent;
    font-family: var(--font-mono); font-size: var(--t-mono-sm);
    font-weight: var(--w-medium); letter-spacing: var(--tracking-caps);
    text-transform: uppercase; color: var(--ink-400);
  }
  `;
  document.head.appendChild(el);
}

/**
 * Small status label. Tones map to the trust palette
 * (`success` = leaf, `danger` = clay). `over` renders a mono
 * uppercase eyebrow used above section titles.
 */
export function Badge({
  children,
  tone = 'neutral',
  dot = false,
  className = '',
  ...rest
}) {
  ensureStyles();
  const cls = ['caju-badge', `caju-badge--${tone}`, className].filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      {dot && tone !== 'over' && <span className="caju-badge__dot" />}
      {children}
    </span>
  );
}
