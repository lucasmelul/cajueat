import React from 'react';

const STYLE_ID = 'caju-chip-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .caju-chip {
    display: inline-flex; align-items: center; gap: var(--space-2);
    height: 36px; padding: 0 14px;
    font-family: var(--font-sans); font-size: var(--t-sm); font-weight: var(--w-medium);
    letter-spacing: var(--tracking-snug);
    color: var(--ink-700); background: rgba(255,255,255,.9);
    border: 1px solid var(--line); border-radius: var(--r-full);
    cursor: pointer; white-space: nowrap; user-select: none;
    -webkit-tap-highlight-color: transparent;
    backdrop-filter: saturate(1.15) blur(6px);
    transition: transform var(--motion-press), background var(--motion-control),
                color var(--motion-control), border-color var(--motion-control),
                box-shadow var(--motion-control);
    box-shadow: var(--shadow-xs);
  }
  .caju-chip:active { transform: scale(var(--press-scale)); }
  .caju-chip:focus-visible { box-shadow: var(--ring-accent); outline: none; }
  .caju-chip:hover { border-color: var(--ink-300); }
  .caju-chip__ico { display: inline-flex; width: 15px; height: 15px; opacity: .8; }
  .caju-chip__ico svg { width: 100%; height: 100%; }

  .caju-chip--selected {
    color: #fff; background: var(--ink-900); border-color: var(--ink-900);
  }
  .caju-chip--selected .caju-chip__ico { opacity: 1; }
  .caju-chip--selected:hover { border-color: var(--ink-900); }

  .caju-chip--brand.caju-chip--selected {
    background: var(--caju-500); border-color: var(--caju-500);
  }

  .caju-chip--static { cursor: default; }
  .caju-chip--static:active { transform: none; }
  `;
  document.head.appendChild(el);
}

/**
 * Context Chip — a selectable pill used above the map to switch
 * context ("Cerca", "Abierto ahora", "Para cita", "Guardados").
 * Also used statically as a filter/tag pill.
 */
export function Chip({
  children,
  selected = false,
  brand = false,
  icon = null,
  as = 'button',
  onClick,
  className = '',
  ...rest
}) {
  ensureStyles();
  const isButton = as === 'button';
  const cls = [
    'caju-chip',
    selected ? 'caju-chip--selected' : '',
    brand ? 'caju-chip--brand' : '',
    !isButton ? 'caju-chip--static' : '',
    className,
  ].filter(Boolean).join(' ');

  const Tag = as;
  return (
    <Tag
      className={cls}
      {...(isButton ? { type: 'button', 'aria-pressed': selected, onClick } : {})}
      {...rest}
    >
      {icon && <span className="caju-chip__ico">{icon}</span>}
      {children}
    </Tag>
  );
}
