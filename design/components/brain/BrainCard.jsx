import React from 'react';

const STYLE_ID = 'caju-braincard-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .caju-brain {
    display: flex; gap: var(--space-4); align-items: flex-start;
    background: rgba(255,255,255,.86);
    backdrop-filter: saturate(1.3) blur(18px);
    -webkit-backdrop-filter: saturate(1.3) blur(18px);
    border: 1px solid rgba(255,255,255,.7);
    border-radius: var(--r-float);
    box-shadow: var(--shadow-lg), var(--ring-hairline);
    padding: var(--space-5);
  }
  .caju-brain__body { flex: 1; min-width: 0; }
  .caju-brain__eyebrow {
    display: flex; align-items: center; gap: 6px;
    font-family: var(--font-mono); font-size: var(--t-mono-sm);
    letter-spacing: var(--tracking-caps); text-transform: uppercase;
    color: var(--caju-600); margin-bottom: 5px;
  }
  .caju-brain__msg {
    font-family: var(--font-serif); font-size: 20px; line-height: 1.24;
    color: var(--ink-900); letter-spacing: -0.01em;
  }
  .caju-brain__msg b { font-weight: 400; background: var(--caju-050);
    box-shadow: 0 0 0 3px var(--caju-050); border-radius: 3px; }
  .caju-brain__sub {
    margin-top: 6px; font-family: var(--font-sans); font-size: var(--t-sm);
    color: var(--ink-500); line-height: var(--lh-sm);
  }
  .caju-brain__actions { display: flex; gap: 8px; margin-top: var(--space-4); flex-wrap: wrap; }

  /* Brain presence mark — the recognizable-without-logo motif */
  .caju-mark {
    flex-shrink: 0; width: 38px; height: 38px; border-radius: 12px;
    background: radial-gradient(120% 120% at 30% 20%, var(--caju-400), var(--caju-600));
    display: grid; place-items: center;
    box-shadow: 0 6px 16px -6px rgba(219,67,26,.7), inset 0 1px 0 rgba(255,255,255,.35);
  }
  .caju-mark svg { width: 22px; height: 22px; }
  .caju-mark--thinking svg { animation: caju-mark-pulse 1.6s var(--ease-in-out) infinite; }
  @keyframes caju-mark-pulse { 0%,100% { opacity: .55; transform: scale(.9);} 50% { opacity: 1; transform: scale(1);} }
  `;
  document.head.appendChild(el);
}

/** The Brain's sparkle/seed mark. CajuEat's core identity motif. */
export function BrainMark({ size = 38, thinking = false, radius = 12 }) {
  ensureStyles();
  return (
    <div className={`caju-mark${thinking ? ' caju-mark--thinking' : ''}`}
         style={{ width: size, height: size, borderRadius: radius }}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2.5c.5 3.7 2.3 5.5 6 6-3.7.5-5.5 2.3-6 6-.5-3.7-2.3-5.5-6-6 3.7-.5 5.5-2.3 6-6Z"
              fill="#fff"/>
        <circle cx="18.5" cy="5.5" r="1.6" fill="#fff" opacity=".85"/>
      </svg>
    </div>
  );
}

/**
 * Brain Card — the single floating card on the Living Map. Speaks
 * in the Brain's editorial (serif) voice. Only ever ONE at a time
 * (SPEC-001). Kinds: recommendation, discovery, question, reminder.
 */
export function BrainCard({
  eyebrow = 'CAJU',
  message,
  sub = null,
  thinking = false,
  actions = null,
  icon = null,
  className = '',
  ...rest
}) {
  ensureStyles();
  return (
    <div className={`caju-brain ${className}`} {...rest}>
      <BrainMark thinking={thinking} />
      <div className="caju-brain__body">
        <div className="caju-brain__eyebrow">
          {icon}
          {eyebrow}
        </div>
        <div className="caju-brain__msg">{message}</div>
        {sub && <div className="caju-brain__sub">{sub}</div>}
        {actions && <div className="caju-brain__actions">{actions}</div>}
      </div>
    </div>
  );
}
