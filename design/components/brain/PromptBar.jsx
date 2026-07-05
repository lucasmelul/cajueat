import React from 'react';
import { BrainMark } from './BrainCard.jsx';

const STYLE_ID = 'caju-promptbar-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .caju-prompt {
    display: flex; align-items: center; gap: var(--space-3);
    height: 56px; padding: 0 8px 0 10px;
    background: rgba(255,255,255,.9);
    backdrop-filter: saturate(1.4) blur(20px);
    -webkit-backdrop-filter: saturate(1.4) blur(20px);
    border: 1px solid rgba(255,255,255,.8);
    border-radius: var(--r-full);
    box-shadow: var(--shadow-lg), var(--ring-hairline);
    transition: box-shadow var(--motion-control), border-color var(--motion-control);
  }
  .caju-prompt:focus-within { box-shadow: var(--shadow-lg), 0 0 0 3px var(--focus-ring); }
  .caju-prompt__input {
    flex: 1; min-width: 0; border: 0; outline: 0; background: transparent;
    font-family: var(--font-sans); font-size: var(--t-body); color: var(--ink-900);
    letter-spacing: var(--tracking-snug);
  }
  .caju-prompt__input::placeholder { color: var(--ink-400); }
  .caju-prompt__btn {
    flex-shrink: 0; width: 40px; height: 40px; border: 0; border-radius: 50%;
    display: grid; place-items: center; cursor: pointer; background: transparent;
    color: var(--ink-500); -webkit-tap-highlight-color: transparent;
    transition: background var(--motion-control), color var(--motion-control), transform var(--motion-press);
  }
  .caju-prompt__btn:hover { background: var(--paper-sunk); color: var(--ink-700); }
  .caju-prompt__btn:active { transform: scale(.92); }
  .caju-prompt__send {
    background: var(--caju-500); color: #fff;
    box-shadow: 0 6px 14px -6px rgba(219,67,26,.7);
  }
  .caju-prompt__send:hover { background: var(--caju-400); color: #fff; }
  .caju-prompt__send:disabled { opacity: .45; box-shadow: none; }
  .caju-prompt svg { width: 20px; height: 20px; }
  `;
  document.head.appendChild(el);
}

const MicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>
  </svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>
  </svg>
);

/**
 * Prompt Bar — the always-present conversational input on the map
 * (SPEC-001: "nunca desaparece"). Leading Brain mark, free-text
 * field, voice (Knowledge Capture entry) and send.
 */
export function PromptBar({
  value,
  onChange,
  onSend,
  onVoice,
  placeholder = 'Preguntá dónde comer…',
  showMark = true,
  className = '',
  ...rest
}) {
  ensureStyles();
  const hasText = value && value.trim().length > 0;
  const submit = () => { if (hasText && onSend) onSend(value); };
  return (
    <div className={`caju-prompt ${className}`} {...rest}>
      {showMark && <BrainMark size={36} radius={11} />}
      <input
        className="caju-prompt__input"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        placeholder={placeholder}
        aria-label="Hablar con el Brain"
      />
      {!hasText && (
        <button className="caju-prompt__btn" onClick={onVoice} aria-label="Aportar por voz" type="button">
          <MicIcon />
        </button>
      )}
      <button
        className="caju-prompt__btn caju-prompt__send"
        onClick={submit}
        disabled={!hasText}
        aria-label="Enviar"
        type="button"
      >
        <SendIcon />
      </button>
    </div>
  );
}
