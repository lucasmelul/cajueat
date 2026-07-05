import React from 'react';
import { TrustMeter } from '../brain/TrustMeter.jsx';

const STYLE_ID = 'caju-restcard-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .caju-rest {
    display: flex; flex-direction: column;
    background: var(--surface); border-radius: var(--r-lg);
    box-shadow: var(--shadow-md), var(--ring-hairline);
    overflow: hidden; cursor: pointer; text-align: left; width: 100%;
    border: 0; padding: 0; font-family: var(--font-sans);
    transition: transform var(--motion-card), box-shadow var(--motion-card);
  }
  .caju-rest:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg), var(--ring-hairline); }
  .caju-rest:active { transform: translateY(0) scale(.995); }
  .caju-rest__media {
    position: relative; aspect-ratio: 16 / 10; background: var(--paper-sunk);
    background-size: cover; background-position: center;
  }
  .caju-rest__media--ph { background:
    radial-gradient(140% 120% at 20% 0%, var(--caju-100), transparent 60%),
    radial-gradient(120% 120% at 100% 100%, var(--amber-100), var(--paper-sunk)); }
  .caju-rest__ph { position:absolute; inset:0; display:grid; place-items:center; color: var(--caju-300); }
  .caju-rest__ph svg { width: 34px; height: 34px; }
  .caju-rest__badges { position: absolute; top: 10px; left: 10px; display: flex; gap: 6px; }
  .caju-rest__save {
    position: absolute; top: 8px; right: 8px; width: 34px; height: 34px; border-radius: 50%;
    border: 0; display: grid; place-items: center; cursor: pointer;
    background: rgba(255,255,255,.9); backdrop-filter: blur(6px); color: var(--ink-600);
    box-shadow: var(--shadow-sm); transition: transform var(--motion-press), color var(--motion-control);
  }
  .caju-rest__save:active { transform: scale(.88); }
  .caju-rest__save.on { color: var(--caju-500); }
  .caju-rest__save svg { width: 18px; height: 18px; }
  .caju-rest__body { padding: 14px 15px 15px; }
  .caju-rest__top { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
  .caju-rest__name { font-size: var(--t-title); font-weight: var(--w-semibold); color: var(--ink-900); letter-spacing: -0.01em; }
  .caju-rest__price { font-family: var(--font-mono); font-size: var(--t-xs); color: var(--ink-400); flex-shrink: 0; }
  .caju-rest__meta { font-size: var(--t-xs); color: var(--ink-500); margin-top: 1px; }
  .caju-rest__why {
    margin-top: 9px; font-family: var(--font-serif); font-size: 16px; line-height: 1.3;
    color: var(--ink-700); letter-spacing: -0.005em;
  }
  .caju-rest__foot { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; gap: 10px; }
  .caju-rest__tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .caju-rest__tag {
    font-size: 11px; font-weight: var(--w-medium); color: var(--ink-600);
    background: var(--paper-sunk); padding: 3px 8px; border-radius: var(--r-full);
  }
  /* compact (map peek / chat) */
  .caju-rest--compact { flex-direction: row; align-items: stretch; }
  .caju-rest--compact .caju-rest__media { width: 108px; aspect-ratio: auto; flex-shrink: 0; }
  .caju-rest--compact .caju-rest__body { padding: 12px 14px; flex: 1; min-width: 0; }
  .caju-rest--compact .caju-rest__why { display: none; }
  .caju-rest--compact .caju-rest__save { display: none; }
  `;
  document.head.appendChild(el);
}

const Utensils = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 2v7a3 3 0 0 0 6 0V2M6 9v13M18 2c-2 0-3 2-3 5s1 4 3 4 3 0 3 0V2Z"/><path d="M18 11v11"/>
  </svg>
);
const Bookmark = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>
  </svg>
);

/**
 * Restaurant Card — a decision, not a directory row. Leads with the
 * Brain's one-line "why", not stars. Compact form is used on the map
 * peek and inside chat; full form in lists and collections.
 */
export function RestaurantCard({
  name,
  cuisine,
  neighborhood,
  price = '$$',
  why = null,
  image = null,
  tags = [],
  badge = null,
  trust = 'high',
  saved = false,
  onSave,
  onClick,
  compact = false,
  className = '',
  ...rest
}) {
  ensureStyles();
  const meta = [cuisine, neighborhood].filter(Boolean).join(' · ');
  return (
    <div className={`caju-rest ${compact ? 'caju-rest--compact' : ''} ${className}`}
         role="button" tabIndex={0} onClick={onClick} {...rest}>
      <div className={`caju-rest__media ${image ? '' : 'caju-rest__media--ph'}`}
           style={image ? { backgroundImage: `url(${image})` } : undefined}>
        {!image && <div className="caju-rest__ph"><Utensils /></div>}
        {badge && <div className="caju-rest__badges">{badge}</div>}
        {!compact && (
          <button className={`caju-rest__save ${saved ? 'on' : ''}`} type="button"
                  aria-label={saved ? 'Guardado' : 'Guardar'}
                  onClick={(e) => { e.stopPropagation(); onSave && onSave(!saved); }}>
            <Bookmark filled={saved} />
          </button>
        )}
      </div>
      <div className="caju-rest__body">
        <div className="caju-rest__top">
          <span className="caju-rest__name">{name}</span>
          <span className="caju-rest__price">{price}</span>
        </div>
        {meta && <div className="caju-rest__meta">{meta}</div>}
        {why && !compact && <div className="caju-rest__why">{why}</div>}
        <div className="caju-rest__foot">
          {tags.length > 0 ? (
            <div className="caju-rest__tags">
              {tags.slice(0, 3).map((t, i) => <span className="caju-rest__tag" key={i}>{t}</span>)}
            </div>
          ) : <span />}
          {trust && <TrustMeter level={trust} />}
        </div>
      </div>
    </div>
  );
}
