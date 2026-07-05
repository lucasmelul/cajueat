import React from 'react';

const STYLE_ID = 'caju-sheet-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .caju-sheet {
    position: absolute; left: 0; right: 0; bottom: 0;
    background: var(--surface);
    border-radius: var(--r-2xl) var(--r-2xl) 0 0;
    box-shadow: var(--elev-sheet);
    display: flex; flex-direction: column;
    transition: height var(--motion-sheet);
    will-change: height; overflow: hidden;
    padding-bottom: var(--safe-bottom);
  }
  .caju-sheet__grip {
    display: grid; place-items: center; padding: 9px 0 4px;
    flex-shrink: 0; cursor: grab;
  }
  .caju-sheet__grip::before {
    content: ''; width: var(--sheet-grip); height: 5px; border-radius: 3px;
    background: var(--line-strong);
  }
  .caju-sheet__scroll { overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 0 var(--gutter) 16px; }
  .caju-sheet__scroll::-webkit-scrollbar { width: 0; }
  `;
  document.head.appendChild(el);
}

const HEIGHTS = { peek: 'var(--sheet-peek)', half: '52%', full: '92%' };

/**
 * Bottom Sheet — the map's on-demand surface with three snap
 * states: peek / half / full (SPEC-001). Presentational shell;
 * wire the grip to your own drag/snap logic. The map stays
 * visible behind it.
 */
export function BottomSheet({
  state = 'half',
  onGrip,
  children,
  height = null,
  className = '',
  ...rest
}) {
  ensureStyles();
  return (
    <div
      className={`caju-sheet ${className}`}
      style={{ height: height || HEIGHTS[state] || HEIGHTS.half }}
      {...rest}
    >
      <div className="caju-sheet__grip" onClick={onGrip} role="button"
           aria-label="Mover panel" tabIndex={0} />
      <div className="caju-sheet__scroll">{children}</div>
    </div>
  );
}
