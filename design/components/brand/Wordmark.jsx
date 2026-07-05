import React from 'react';

const STYLE_ID = 'caju-wordmark-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .caju-wm {
    display: inline-flex; align-items: baseline; gap: 0;
    font-family: var(--font-display);
    font-weight: 700; letter-spacing: -0.035em; line-height: 1;
    font-feature-settings: "ss01" 1; white-space: nowrap; user-select: none;
  }
  .caju-wm__a { color: var(--ink-900); }
  .caju-wm__b { color: var(--caju-500); }
  .caju-wm__seed { align-self: flex-start; width: .42em; height: .42em; margin-left: .12em;
    margin-top: .04em; flex-shrink: 0; }
  .caju-wm__seed path { fill: var(--caju-500); }

  .caju-wm--inverse .caju-wm__a { color: #fff; }
  .caju-wm--inverse .caju-wm__b { color: var(--caju-300); }
  .caju-wm--inverse .caju-wm__seed path { fill: var(--caju-300); }

  .caju-wm--mono .caju-wm__a,
  .caju-wm--mono .caju-wm__b { color: currentColor; }
  .caju-wm--mono .caju-wm__seed path { fill: currentColor; }
  `;
  document.head.appendChild(el);
}

/**
 * CajuEat wordmark — the typographic brand lockup (no logo mark).
 * Set in Bricolage Grotesque: "Caju" in ink, "Eat" in caju, with a
 * small caju seed accent. This IS the identity until a real mark exists.
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
  const cls = ['caju-wm', tone !== 'ink' ? `caju-wm--${tone}` : '', className]
    .filter(Boolean).join(' ');
  return (
    <Tag className={cls} style={{ fontSize: size }} aria-label="CajuEat" role="img" {...rest}>
      <span className="caju-wm__a">Caju</span>
      <span className="caju-wm__b">Eat</span>
      {accent && (
        <svg className="caju-wm__seed" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.5c.5 3.7 2.3 5.5 6 6-3.7.5-5.5 2.3-6 6-.5-3.7-2.3-5.5-6-6 3.7-.5 5.5-2.3 6-6Z"/>
        </svg>
      )}
    </Tag>
  );
}
