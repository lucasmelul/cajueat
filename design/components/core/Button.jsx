import React from 'react';

/* Inject component CSS once. Uses CajuEat tokens (styles.css). */
const STYLE_ID = 'caju-button-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .caju-btn {
    --_bg: var(--caju-500); --_fg: #fff; --_bd: transparent;
    display: inline-flex; align-items: center; justify-content: center;
    gap: var(--space-3);
    font-family: var(--font-sans); font-weight: var(--w-semibold);
    letter-spacing: var(--tracking-snug);
    border: 1px solid var(--_bd); border-radius: var(--r-control);
    background: var(--_bg); color: var(--_fg);
    cursor: pointer; white-space: nowrap; user-select: none;
    transition: transform var(--motion-press), background var(--motion-control),
                border-color var(--motion-control), box-shadow var(--motion-control),
                opacity var(--motion-control);
    -webkit-tap-highlight-color: transparent;
  }
  .caju-btn:active { transform: scale(var(--press-scale)); }
  .caju-btn:focus-visible { box-shadow: var(--ring-accent); outline: none; }
  .caju-btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }

  /* sizes */
  .caju-btn--sm { height: 36px; padding: 0 14px; font-size: var(--t-sm); border-radius: var(--r-sm); }
  .caju-btn--md { height: 44px; padding: 0 18px; font-size: var(--t-sm); }
  .caju-btn--lg { height: 52px; padding: 0 24px; font-size: var(--t-body); }
  .caju-btn--block { width: 100%; }

  /* variants */
  .caju-btn--primary { --_bg: var(--caju-500); --_fg: #fff; box-shadow: 0 1px 0 rgba(0,0,0,.04), 0 6px 16px -8px rgba(219,67,26,.6); }
  .caju-btn--primary:hover:not(:disabled) { --_bg: var(--caju-400); }
  .caju-btn--primary:active:not(:disabled) { --_bg: var(--caju-600); }

  .caju-btn--secondary { --_bg: var(--surface); --_fg: var(--ink-800); --_bd: var(--line-strong); box-shadow: var(--shadow-xs); }
  .caju-btn--secondary:hover:not(:disabled) { --_bg: var(--surface-2); --_bd: var(--ink-300); }
  .caju-btn--secondary:active:not(:disabled) { --_bg: var(--paper-sunk); }

  .caju-btn--ghost { --_bg: transparent; --_fg: var(--ink-700); }
  .caju-btn--ghost:hover:not(:disabled) { --_bg: var(--paper-sunk); }
  .caju-btn--ghost:active:not(:disabled) { --_bg: var(--line-soft); }

  .caju-btn--brandGhost { --_bg: var(--caju-050); --_fg: var(--caju-600); }
  .caju-btn--brandGhost:hover:not(:disabled) { --_bg: var(--caju-100); }

  .caju-btn__spinner { width: 15px; height: 15px; border-radius: 50%;
    border: 2px solid currentColor; border-top-color: transparent;
    animation: caju-btn-spin .6s linear infinite; }
  @keyframes caju-btn-spin { to { transform: rotate(360deg); } }
  .caju-btn__ico { display: inline-flex; width: 18px; height: 18px; }
  .caju-btn__ico svg { width: 100%; height: 100%; }
  `;
  document.head.appendChild(el);
}

/**
 * CajuEat primary control. One caju-filled primary per view — never
 * a row of identical buttons (SPEC-003).
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  loading = false,
  iconLeft = null,
  iconRight = null,
  type = 'button',
  onClick,
  className = '',
  ...rest
}) {
  ensureStyles();
  const cls = [
    'caju-btn',
    `caju-btn--${variant}`,
    `caju-btn--${size}`,
    block ? 'caju-btn--block' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button type={type} className={cls} disabled={disabled || loading} onClick={onClick} {...rest}>
      {loading && <span className="caju-btn__spinner" aria-hidden="true" />}
      {!loading && iconLeft && <span className="caju-btn__ico">{iconLeft}</span>}
      {children && <span>{children}</span>}
      {!loading && iconRight && <span className="caju-btn__ico">{iconRight}</span>}
    </button>
  );
}
