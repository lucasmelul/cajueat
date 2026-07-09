import React from 'react';

const STYLE_ID = 'lugarcito-wordmark-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .lg-wm {
    display: inline-flex; align-items: baseline; gap: 0;
    font-family: var(--font-display);
    font-weight: 700; letter-spacing: -0.03em; line-height: 1;
    font-feature-settings: "ss01" 1; white-space: nowrap; user-select: none;
  }
  .lg-wm__a { color: var(--ink-900); }
  .lg-wm__b { color: var(--caju-500); }
  .lg-wm__mark { align-self: flex-start; width: .5em; height: .5em; margin-left: .1em;
    margin-top: .03em; flex-shrink: 0; overflow: visible; }
  .lg-wm__mark .lg-pin { stroke: var(--ink-900); }
  .lg-wm__mark .lg-cup { fill: var(--caju-500); }
  .lg-wm__mark .lg-handle { stroke: var(--caju-500); }

  .lg-wm--inverse .lg-wm__a { color: #fff; }
  .lg-wm--inverse .lg-wm__b { color: var(--caju-300); }
  .lg-wm--inverse .lg-wm__mark .lg-pin { stroke: #fff; }
  .lg-wm--inverse .lg-wm__mark .lg-cup { fill: var(--caju-300); }
  .lg-wm--inverse .lg-wm__mark .lg-handle { stroke: var(--caju-300); }

  .lg-wm--mono .lg-wm__a,
  .lg-wm--mono .lg-wm__b { color: currentColor; }
  .lg-wm--mono .lg-wm__mark .lg-pin { stroke: currentColor; }
  .lg-wm--mono .lg-wm__mark .lg-cup { fill: currentColor; }
  .lg-wm--mono .lg-wm__mark .lg-handle { stroke: currentColor; }
  `;
  document.head.appendChild(el);
}

/**
 * Lugarcito wordmark — the typographic brand lockup (no logo mark).
 * Set in Bricolage Grotesque: "Lugar" in ink, "cito" in caju, with a
 * map-pin + coffee-cup glyph — the gastronomic "little place" mark.
 * This IS the identity until a real mark exists.
 */
export function Wordmark({
  size = 28,
  tone = 'ink',        // 'ink' | 'inverse' | 'mono'
  accent = true,
  as = 'span',
  className = '',
  ...rest
}) {
  ensureStyles();
  const Tag = as;
  const cls = ['lg-wm', tone !== 'ink' ? `lg-wm--${tone}` : '', className]
    .filter(Boolean).join(' ');
  return (
    <Tag className={cls} style={{ fontSize: size }} aria-label="Lugarcito" role="img" {...rest}>
      <span className="lg-wm__a">Lugar</span>
      <span className="lg-wm__b">cito</span>
      {accent && (
        <svg className="lg-wm__mark" viewBox="0 0 24 24" aria-hidden="true">
          <path className="lg-pin" d="M12 21S5 14.8 5 9.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"
                fill="none" strokeWidth="1.6" strokeLinejoin="round" />
          <rect className="lg-cup" x="8.3" y="7.6" width="6.4" height="4.6" rx="1.3" />
          <path className="lg-handle" d="M14.9 8.6c1.1 0 1.9.8 1.9 1.8s-.8 1.8-1.9 1.8"
                fill="none" strokeWidth="1.1" />
        </svg>
      )}
    </Tag>
  );
}
