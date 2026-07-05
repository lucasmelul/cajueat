import React from 'react';
import { BrainMark } from './BrainCard.jsx';

const STYLE_ID = 'caju-chatbubble-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .caju-msg { display: flex; gap: var(--space-3); max-width: 100%; }
  .caju-msg__mark { margin-top: 2px; }

  /* Brain message — no bubble; text sits on the canvas, editorial */
  .caju-msg--brain .caju-msg__content {
    font-family: var(--font-sans); font-size: var(--t-body);
    line-height: 1.5; color: var(--ink-800); padding-top: 2px;
  }
  .caju-msg--brain .caju-msg__content b { font-weight: var(--w-semibold); color: var(--ink-900); }

  /* User message — a compact caju-tinted bubble, right aligned */
  .caju-msg--user { justify-content: flex-end; }
  .caju-msg--user .caju-msg__content {
    background: var(--ink-900); color: #fff;
    font-family: var(--font-sans); font-size: var(--t-sm);
    padding: 10px 14px; border-radius: 16px 16px 4px 16px;
    max-width: 82%; line-height: 1.4;
  }

  /* Thinking indicator */
  .caju-msg__dots { display: inline-flex; gap: 4px; padding-top: 6px; }
  .caju-msg__dots span { width: 6px; height: 6px; border-radius: 50%;
    background: var(--ink-300); animation: caju-think 1.1s var(--ease-in-out) infinite; }
  .caju-msg__dots span:nth-child(2) { animation-delay: .15s; }
  .caju-msg__dots span:nth-child(3) { animation-delay: .3s; }
  @keyframes caju-think { 0%,100% { opacity: .3; transform: translateY(0);} 50% { opacity: 1; transform: translateY(-2px);} }
  `;
  document.head.appendChild(el);
}

/**
 * ChatBubble — one conversation turn. The Brain answers on the
 * canvas (no bubble, editorial), the user speaks in a compact ink
 * bubble. Rich payloads (restaurant cards, comparisons) render as
 * `children` under a Brain turn.
 */
export function ChatBubble({
  from = 'brain',
  children,
  thinking = false,
  className = '',
  ...rest
}) {
  ensureStyles();
  if (from === 'brain') {
    return (
      <div className={`caju-msg caju-msg--brain ${className}`} {...rest}>
        <div className="caju-msg__mark"><BrainMark size={30} radius={10} thinking={thinking} /></div>
        <div className="caju-msg__content">
          {thinking
            ? <span className="caju-msg__dots"><span/><span/><span/></span>
            : children}
        </div>
      </div>
    );
  }
  return (
    <div className={`caju-msg caju-msg--user ${className}`} {...rest}>
      <div className="caju-msg__content">{children}</div>
    </div>
  );
}
