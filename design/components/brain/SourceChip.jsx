import React from 'react';

const STYLE_ID = 'caju-source-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .caju-source {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 5px 12px 5px 5px; border-radius: var(--r-full);
    background: var(--surface); border: 1px solid var(--line);
    font-family: var(--font-sans);
  }
  .caju-source__av {
    width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
    display: grid; place-items: center;
    font-family: var(--font-mono); font-size: 11px; font-weight: var(--w-medium);
    color: #fff; background: var(--ink-700); text-transform: uppercase;
    background-size: cover; background-position: center;
  }
  .caju-source__meta { display: flex; flex-direction: column; line-height: 1.1; }
  .caju-source__name { font-size: var(--t-xs); font-weight: var(--w-semibold); color: var(--ink-800); }
  .caju-source__kind { font-size: 10px; color: var(--ink-400); letter-spacing: .02em; }
  .caju-source__weight {
    margin-left: 2px; width: 7px; height: 7px; border-radius: 50%;
    background: var(--line-strong);
  }
  .caju-source__weight--strong { background: var(--leaf-500); }
  .caju-source__weight--medium { background: var(--amber-500); }
  .caju-source__weight--weak   { background: var(--ink-300); }
  `;
  document.head.appendChild(el);
}

const KIND_LABEL = { curator: 'Curador', community: 'Comunidad', visit: 'Tu visita', press: 'Prensa', menu: 'Menú' };

/**
 * Source Chip — one signal feeding the Trust Engine (a curator,
 * the community, the user's own visit…). The dot encodes signal
 * weight: strong / medium / weak (trust-engine.md).
 */
export function SourceChip({
  name,
  kind = 'curator',
  weight = 'medium',
  avatar = null,
  className = '',
  ...rest
}) {
  ensureStyles();
  const initials = (name || '?').replace('@', '').slice(0, 2);
  return (
    <span className={`caju-source ${className}`} {...rest}>
      <span
        className="caju-source__av"
        style={avatar ? { backgroundImage: `url(${avatar})` } : undefined}
      >
        {!avatar && initials}
      </span>
      <span className="caju-source__meta">
        <span className="caju-source__name">{name}</span>
        <span className="caju-source__kind">{KIND_LABEL[kind] || kind}</span>
      </span>
      <span className={`caju-source__weight caju-source__weight--${weight}`}
            title={`Señal ${weight}`} aria-hidden="true" />
    </span>
  );
}
