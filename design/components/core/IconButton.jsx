import React from 'react';

const STYLE_ID = 'caju-iconbutton-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .caju-iconbtn {
    --_bg: var(--surface); --_fg: var(--ink-700); --_bd: var(--line);
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--_bg); color: var(--_fg);
    border: 1px solid var(--_bd); border-radius: var(--r-full);
    cursor: pointer; -webkit-tap-highlight-color: transparent;
    transition: transform var(--motion-press), background var(--motion-control),
                border-color var(--motion-control), box-shadow var(--motion-control);
  }
  .caju-iconbtn:active { transform: scale(var(--press-scale)); }
  .caju-iconbtn:focus-visible { box-shadow: var(--ring-accent); outline: none; }
  .caju-iconbtn:disabled { opacity: .4; cursor: not-allowed; transform: none; }
  .caju-iconbtn svg { display: block; }

  .caju-iconbtn--sm { width: 36px; height: 36px; }
  .caju-iconbtn--md { width: 44px; height: 44px; }
  .caju-iconbtn--lg { width: 52px; height: 52px; }

  /* Floating map control — lifted paper over the map */
  .caju-iconbtn--float { --_bd: transparent; box-shadow: var(--shadow-lg); background: rgba(255,255,255,.92); backdrop-filter: saturate(1.2) blur(8px); }
  .caju-iconbtn--float:hover:not(:disabled) { background: #fff; }

  .caju-iconbtn--plain { --_bg: transparent; --_bd: transparent; }
  .caju-iconbtn--plain:hover:not(:disabled) { --_bg: var(--paper-sunk); }

  .caju-iconbtn--brand { --_bg: var(--caju-500); --_fg: #fff; --_bd: transparent; box-shadow: 0 6px 16px -8px rgba(219,67,26,.7); }
  .caju-iconbtn--brand:hover:not(:disabled) { --_bg: var(--caju-400); }
  `;
  document.head.appendChild(el);
}

/**
 * Circular icon-only control. Used for map floating buttons
 * (location, recenter), sheet close, and toolbar actions.
 */
export function IconButton({
  icon,
  label,
  variant = 'default',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  ...rest
}) {
  ensureStyles();
  const variantClass = variant === 'default' ? '' : `caju-iconbtn--${variant}`;
  const cls = ['caju-iconbtn', `caju-iconbtn--${size}`, variantClass, className]
    .filter(Boolean).join(' ');
  return (
    <button
      type="button"
      className={cls}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {icon}
    </button>
  );
}
