/* @ds-bundle: {"format":4,"namespace":"CajuEatDesignSystem_dbeea0","components":[{"name":"BrainMark","sourcePath":"components/brain/BrainCard.jsx"},{"name":"BrainCard","sourcePath":"components/brain/BrainCard.jsx"},{"name":"ChatBubble","sourcePath":"components/brain/ChatBubble.jsx"},{"name":"PromptBar","sourcePath":"components/brain/PromptBar.jsx"},{"name":"SourceChip","sourcePath":"components/brain/SourceChip.jsx"},{"name":"TrustMeter","sourcePath":"components/brain/TrustMeter.jsx"},{"name":"Wordmark","sourcePath":"components/brand/Wordmark.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"BottomSheet","sourcePath":"components/discovery/BottomSheet.jsx"},{"name":"CajuPoints","sourcePath":"components/discovery/CajuPoints.jsx"},{"name":"MapPin","sourcePath":"components/discovery/MapPin.jsx"},{"name":"RestaurantCard","sourcePath":"components/discovery/RestaurantCard.jsx"}],"sourceHashes":{"components/brain/BrainCard.jsx":"e018272bc28e","components/brain/ChatBubble.jsx":"3dc00b86a901","components/brain/PromptBar.jsx":"0a58bcb70af7","components/brain/SourceChip.jsx":"a1828219fe71","components/brain/TrustMeter.jsx":"d0d107d65fb3","components/brand/Wordmark.jsx":"e207a93b51e2","components/core/Badge.jsx":"b5f3ed8a4010","components/core/Button.jsx":"e17a69ba716a","components/core/Chip.jsx":"860a0926f590","components/core/IconButton.jsx":"7c224e1c8738","components/discovery/BottomSheet.jsx":"8bd94f870162","components/discovery/CajuPoints.jsx":"2ca0a0d712bd","components/discovery/MapPin.jsx":"d642cd46e125","components/discovery/RestaurantCard.jsx":"cbd571946076","ui_kits/pwa/CheckIn.jsx":"1b8389157244","ui_kits/pwa/Conversation.jsx":"f5c4e1b1eed7","ui_kits/pwa/Feedback.jsx":"d6bd345fbc39","ui_kits/pwa/KnowledgeCapture.jsx":"5b6a9c5ed6a6","ui_kits/pwa/LivingMap.jsx":"de2cf0f1db4d","ui_kits/pwa/MapCanvas.jsx":"674160d575a9","ui_kits/pwa/Passport.jsx":"11ba7ddaab20","ui_kits/pwa/Profile.jsx":"5a7869a4380a","ui_kits/pwa/Restaurant.jsx":"ac245b8f36f0","ui_kits/pwa/Shell.jsx":"3c6aa56e3e83","ui_kits/pwa/data.js":"279c8440675f","ui_kits/pwa/kit.jsx":"88351dc8e26c"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CajuEatDesignSystem_dbeea0 = window.CajuEatDesignSystem_dbeea0 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brain/BrainCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function BrainMark({
  size = 38,
  thinking = false,
  radius = 12
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("div", {
    className: `caju-mark${thinking ? ' caju-mark--thinking' : ''}`,
    style: {
      width: size,
      height: size,
      borderRadius: radius
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2.5c.5 3.7 2.3 5.5 6 6-3.7.5-5.5 2.3-6 6-.5-3.7-2.3-5.5-6-6 3.7-.5 5.5-2.3 6-6Z",
    fill: "#fff"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18.5",
    cy: "5.5",
    r: "1.6",
    fill: "#fff",
    opacity: ".85"
  })));
}

/**
 * Brain Card — the single floating card on the Living Map. Speaks
 * in the Brain's editorial (serif) voice. Only ever ONE at a time
 * (SPEC-001). Kinds: recommendation, discovery, question, reminder.
 */
function BrainCard({
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
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `caju-brain ${className}`
  }, rest), /*#__PURE__*/React.createElement(BrainMark, {
    thinking: thinking
  }), /*#__PURE__*/React.createElement("div", {
    className: "caju-brain__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "caju-brain__eyebrow"
  }, icon, eyebrow), /*#__PURE__*/React.createElement("div", {
    className: "caju-brain__msg"
  }, message), sub && /*#__PURE__*/React.createElement("div", {
    className: "caju-brain__sub"
  }, sub), actions && /*#__PURE__*/React.createElement("div", {
    className: "caju-brain__actions"
  }, actions)));
}
Object.assign(__ds_scope, { BrainMark, BrainCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brain/BrainCard.jsx", error: String((e && e.message) || e) }); }

// components/brain/ChatBubble.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function ChatBubble({
  from = 'brain',
  children,
  thinking = false,
  className = '',
  ...rest
}) {
  ensureStyles();
  if (from === 'brain') {
    return /*#__PURE__*/React.createElement("div", _extends({
      className: `caju-msg caju-msg--brain ${className}`
    }, rest), /*#__PURE__*/React.createElement("div", {
      className: "caju-msg__mark"
    }, /*#__PURE__*/React.createElement(__ds_scope.BrainMark, {
      size: 30,
      radius: 10,
      thinking: thinking
    })), /*#__PURE__*/React.createElement("div", {
      className: "caju-msg__content"
    }, thinking ? /*#__PURE__*/React.createElement("span", {
      className: "caju-msg__dots"
    }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null)) : children));
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `caju-msg caju-msg--user ${className}`
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "caju-msg__content"
  }, children));
}
Object.assign(__ds_scope, { ChatBubble });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brain/ChatBubble.jsx", error: String((e && e.message) || e) }); }

// components/brain/PromptBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
const MicIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.8",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("rect", {
  x: "9",
  y: "2",
  width: "6",
  height: "12",
  rx: "3"
}), /*#__PURE__*/React.createElement("path", {
  d: "M5 11a7 7 0 0 0 14 0"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 18v3"
}));
const SendIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M12 19V5"
}), /*#__PURE__*/React.createElement("path", {
  d: "m5 12 7-7 7 7"
}));

/**
 * Prompt Bar — the always-present conversational input on the map
 * (SPEC-001: "nunca desaparece"). Leading Brain mark, free-text
 * field, voice (Knowledge Capture entry) and send.
 */
function PromptBar({
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
  const submit = () => {
    if (hasText && onSend) onSend(value);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `caju-prompt ${className}`
  }, rest), showMark && /*#__PURE__*/React.createElement(__ds_scope.BrainMark, {
    size: 36,
    radius: 11
  }), /*#__PURE__*/React.createElement("input", {
    className: "caju-prompt__input",
    value: value,
    onChange: e => onChange && onChange(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') submit();
    },
    placeholder: placeholder,
    "aria-label": "Hablar con el Brain"
  }), !hasText && /*#__PURE__*/React.createElement("button", {
    className: "caju-prompt__btn",
    onClick: onVoice,
    "aria-label": "Aportar por voz",
    type: "button"
  }, /*#__PURE__*/React.createElement(MicIcon, null)), /*#__PURE__*/React.createElement("button", {
    className: "caju-prompt__btn caju-prompt__send",
    onClick: submit,
    disabled: !hasText,
    "aria-label": "Enviar",
    type: "button"
  }, /*#__PURE__*/React.createElement(SendIcon, null)));
}
Object.assign(__ds_scope, { PromptBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brain/PromptBar.jsx", error: String((e && e.message) || e) }); }

// components/brain/SourceChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
const KIND_LABEL = {
  curator: 'Curador',
  community: 'Comunidad',
  visit: 'Tu visita',
  press: 'Prensa',
  menu: 'Menú'
};

/**
 * Source Chip — one signal feeding the Trust Engine (a curator,
 * the community, the user's own visit…). The dot encodes signal
 * weight: strong / medium / weak (trust-engine.md).
 */
function SourceChip({
  name,
  kind = 'curator',
  weight = 'medium',
  avatar = null,
  className = '',
  ...rest
}) {
  ensureStyles();
  const initials = (name || '?').replace('@', '').slice(0, 2);
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `caju-source ${className}`
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "caju-source__av",
    style: avatar ? {
      backgroundImage: `url(${avatar})`
    } : undefined
  }, !avatar && initials), /*#__PURE__*/React.createElement("span", {
    className: "caju-source__meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "caju-source__name"
  }, name), /*#__PURE__*/React.createElement("span", {
    className: "caju-source__kind"
  }, KIND_LABEL[kind] || kind)), /*#__PURE__*/React.createElement("span", {
    className: `caju-source__weight caju-source__weight--${weight}`,
    title: `Señal ${weight}`,
    "aria-hidden": "true"
  }));
}
Object.assign(__ds_scope, { SourceChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brain/SourceChip.jsx", error: String((e && e.message) || e) }); }

// components/brain/TrustMeter.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'caju-trust-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .caju-trust { display: inline-flex; align-items: center; gap: 9px; }
  .caju-trust__bars { display: inline-flex; gap: 3px; align-items: flex-end; }
  .caju-trust__bars i { width: 4px; border-radius: 2px; background: var(--line-strong); display: block; }
  .caju-trust__bars i:nth-child(1) { height: 8px; }
  .caju-trust__bars i:nth-child(2) { height: 12px; }
  .caju-trust__bars i:nth-child(3) { height: 16px; }
  .caju-trust__label {
    font-family: var(--font-sans); font-size: var(--t-xs); font-weight: var(--w-medium);
    color: var(--ink-600); letter-spacing: var(--tracking-snug);
  }
  .caju-trust--high  .caju-trust__bars i.on { background: var(--leaf-600); }
  .caju-trust--high  .caju-trust__label { color: var(--leaf-700); }
  .caju-trust--mid   .caju-trust__bars i.on { background: var(--amber-500); }
  .caju-trust--mid   .caju-trust__label { color: var(--amber-600); }
  .caju-trust--low   .caju-trust__bars i.on { background: var(--clay-500); }
  .caju-trust--low   .caju-trust__label { color: var(--clay-600); }

  /* pill variant */
  .caju-trust--pill {
    padding: 5px 10px 5px 9px; border-radius: var(--r-full);
    background: var(--surface); box-shadow: var(--ring-hairline);
  }
  .caju-trust--pill.caju-trust--high { background: var(--leaf-050); }
  .caju-trust--pill.caju-trust--mid  { background: var(--amber-050); }
  .caju-trust--pill.caju-trust--low  { background: var(--clay-050); }
  `;
  document.head.appendChild(el);
}
const LABELS = {
  high: 'Confianza alta',
  mid: 'Confianza media',
  low: 'Señales en conflicto'
};
const FILLED = {
  high: 3,
  mid: 2,
  low: 1
};

/**
 * Trust Meter — the visual language of the Trust Engine. Shows how
 * sure the Brain is about a recommendation, in natural language +
 * a 3-bar meter. `low` means contradictory signals, not "bad".
 */
function TrustMeter({
  level = 'high',
  label = null,
  pill = false,
  className = '',
  ...rest
}) {
  ensureStyles();
  const filled = FILLED[level] || 0;
  const cls = ['caju-trust', `caju-trust--${level}`, pill ? 'caju-trust--pill' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "caju-trust__bars",
    "aria-hidden": "true"
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("i", {
    key: i,
    className: i < filled ? 'on' : ''
  }))), /*#__PURE__*/React.createElement("span", {
    className: "caju-trust__label"
  }, label ?? LABELS[level]));
}
Object.assign(__ds_scope, { TrustMeter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brain/TrustMeter.jsx", error: String((e && e.message) || e) }); }

// components/brand/Wordmark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Wordmark({
  size = 28,
  tone = 'ink',
  // 'ink' | 'inverse' | 'mono'
  accent = true,
  as = 'span',
  className = '',
  ...rest
}) {
  ensureStyles();
  const Tag = as;
  const cls = ['caju-wm', tone !== 'ink' ? `caju-wm--${tone}` : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    style: {
      fontSize: size
    },
    "aria-label": "CajuEat",
    role: "img"
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "caju-wm__a"
  }, "Caju"), /*#__PURE__*/React.createElement("span", {
    className: "caju-wm__b"
  }, "Eat"), accent && /*#__PURE__*/React.createElement("svg", {
    className: "caju-wm__seed",
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2.5c.5 3.7 2.3 5.5 6 6-3.7.5-5.5 2.3-6 6-.5-3.7-2.3-5.5-6-6 3.7-.5 5.5-2.3 6-6Z"
  })));
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'caju-badge-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .caju-badge {
    display: inline-flex; align-items: center; gap: 5px;
    height: 22px; padding: 0 9px;
    font-family: var(--font-sans); font-size: var(--t-caption);
    font-weight: var(--w-semibold); letter-spacing: var(--tracking-snug);
    border-radius: var(--r-full); white-space: nowrap;
    --_bg: var(--paper-sunk); --_fg: var(--ink-600);
    background: var(--_bg); color: var(--_fg);
  }
  .caju-badge__dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .caju-badge--solid { border: 0; }

  .caju-badge--neutral { --_bg: var(--paper-sunk); --_fg: var(--ink-600); }
  .caju-badge--brand   { --_bg: var(--caju-100);  --_fg: var(--caju-700); }
  .caju-badge--new     { --_bg: var(--amber-100); --_fg: var(--amber-600); }
  .caju-badge--success { --_bg: var(--leaf-100);  --_fg: var(--leaf-700); }
  .caju-badge--danger  { --_bg: var(--clay-100);  --_fg: var(--clay-600); }

  /* Overline variant — uppercase mono eyebrow, no fill */
  .caju-badge--over {
    height: auto; padding: 0; background: transparent;
    font-family: var(--font-mono); font-size: var(--t-mono-sm);
    font-weight: var(--w-medium); letter-spacing: var(--tracking-caps);
    text-transform: uppercase; color: var(--ink-400);
  }
  `;
  document.head.appendChild(el);
}

/**
 * Small status label. Tones map to the trust palette
 * (`success` = leaf, `danger` = clay). `over` renders a mono
 * uppercase eyebrow used above section titles.
 */
function Badge({
  children,
  tone = 'neutral',
  dot = false,
  className = '',
  ...rest
}) {
  ensureStyles();
  const cls = ['caju-badge', `caju-badge--${tone}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), dot && tone !== 'over' && /*#__PURE__*/React.createElement("span", {
    className: "caju-badge__dot"
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Button({
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
  const cls = ['caju-btn', `caju-btn--${variant}`, `caju-btn--${size}`, block ? 'caju-btn--block' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: cls,
    disabled: disabled || loading,
    onClick: onClick
  }, rest), loading && /*#__PURE__*/React.createElement("span", {
    className: "caju-btn__spinner",
    "aria-hidden": "true"
  }), !loading && iconLeft && /*#__PURE__*/React.createElement("span", {
    className: "caju-btn__ico"
  }, iconLeft), children && /*#__PURE__*/React.createElement("span", null, children), !loading && iconRight && /*#__PURE__*/React.createElement("span", {
    className: "caju-btn__ico"
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Chip({
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
  const cls = ['caju-chip', selected ? 'caju-chip--selected' : '', brand ? 'caju-chip--brand' : '', !isButton ? 'caju-chip--static' : '', className].filter(Boolean).join(' ');
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, isButton ? {
    type: 'button',
    'aria-pressed': selected,
    onClick
  } : {}, rest), icon && /*#__PURE__*/React.createElement("span", {
    className: "caju-chip__ico"
  }, icon), children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'caju-iconbutton-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .caju-iconbtn {
    --_bg: var(--surface); --_fg: var(--ink-700); --_bd: var(--line);
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--_bg); color: var(--_fg);
    border: 1px solid var(--_bd); border-radius: var(--r-full);
    cursor: pointer; -webkit-tap-highlight-color: transparent;
    transition: transform var(--motion-press), background var(--motion-control),
                border-color var(--motion-control), box-shadow var(--motion-control);
  }
  .caju-iconbtn:active { transform: scale(var(--press-scale)); }
  .caju-iconbtn:focus-visible { box-shadow: var(--ring-accent); outline: none; }
  .caju-iconbtn:disabled { opacity: .4; cursor: not-allowed; transform: none; }
  .caju-iconbtn svg { display: block; }

  .caju-iconbtn--sm { width: 36px; height: 36px; }
  .caju-iconbtn--md { width: 44px; height: 44px; }
  .caju-iconbtn--lg { width: 52px; height: 52px; }

  /* Floating map control — lifted paper over the map */
  .caju-iconbtn--float { --_bd: transparent; box-shadow: var(--shadow-lg); background: rgba(255,255,255,.92); backdrop-filter: saturate(1.2) blur(8px); }
  .caju-iconbtn--float:hover:not(:disabled) { background: #fff; }

  .caju-iconbtn--plain { --_bg: transparent; --_bd: transparent; }
  .caju-iconbtn--plain:hover:not(:disabled) { --_bg: var(--paper-sunk); }

  .caju-iconbtn--brand { --_bg: var(--caju-500); --_fg: #fff; --_bd: transparent; box-shadow: 0 6px 16px -8px rgba(219,67,26,.7); }
  .caju-iconbtn--brand:hover:not(:disabled) { --_bg: var(--caju-400); }
  `;
  document.head.appendChild(el);
}

/**
 * Circular icon-only control. Used for map floating buttons
 * (location, recenter), sheet close, and toolbar actions.
 */
function IconButton({
  icon,
  label,
  variant = 'default',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  ...rest
}) {
  ensureStyles();
  const variantClass = variant === 'default' ? '' : `caju-iconbtn--${variant}`;
  const cls = ['caju-iconbtn', `caju-iconbtn--${size}`, variantClass, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick
  }, rest), icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/discovery/BottomSheet.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
const HEIGHTS = {
  peek: 'var(--sheet-peek)',
  half: '52%',
  full: '92%'
};

/**
 * Bottom Sheet — the map's on-demand surface with three snap
 * states: peek / half / full (SPEC-001). Presentational shell;
 * wire the grip to your own drag/snap logic. The map stays
 * visible behind it.
 */
function BottomSheet({
  state = 'half',
  onGrip,
  children,
  height = null,
  className = '',
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `caju-sheet ${className}`,
    style: {
      height: height || HEIGHTS[state] || HEIGHTS.half
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "caju-sheet__grip",
    onClick: onGrip,
    role: "button",
    "aria-label": "Mover panel",
    tabIndex: 0
  }), /*#__PURE__*/React.createElement("div", {
    className: "caju-sheet__scroll"
  }, children));
}
Object.assign(__ds_scope, { BottomSheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/discovery/BottomSheet.jsx", error: String((e && e.message) || e) }); }

// components/discovery/CajuPoints.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'caju-points-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .caju-pts { display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-sans); }
  .caju-pts__seed {
    display: grid; place-items: center; border-radius: 50%;
    background: radial-gradient(120% 120% at 30% 20%, var(--caju-400), var(--caju-600));
    box-shadow: inset 0 1px 0 rgba(255,255,255,.3);
  }
  .caju-pts__seed svg { width: 62%; height: 62%; }
  .caju-pts__val { font-family: var(--font-mono); font-weight: var(--w-medium); color: var(--ink-900); font-variant-numeric: tabular-nums; }
  .caju-pts__unit { font-size: var(--t-xs); color: var(--ink-400); }

  /* chip */
  .caju-pts--chip {
    padding: 5px 12px 5px 5px; border-radius: var(--r-full);
    background: var(--caju-050); box-shadow: var(--ring-hairline);
  }
  .caju-pts--chip .caju-pts__val { color: var(--caju-700); }

  /* sizes */
  .caju-pts--sm .caju-pts__seed { width: 20px; height: 20px; }
  .caju-pts--sm .caju-pts__val { font-size: 13px; }
  .caju-pts--md .caju-pts__seed { width: 26px; height: 26px; }
  .caju-pts--md .caju-pts__val { font-size: 15px; }
  .caju-pts--lg .caju-pts__seed { width: 40px; height: 40px; }
  .caju-pts--lg .caju-pts__val { font-size: 26px; letter-spacing: -0.02em; }

  .caju-pts__delta { color: var(--leaf-600); font-family: var(--font-mono); font-size: var(--t-xs); font-weight: var(--w-medium); }
  `;
  document.head.appendChild(el);
}
const Seed = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "#fff",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M12 2.5c.5 3.7 2.3 5.5 6 6-3.7.5-5.5 2.3-6 6-.5-3.7-2.3-5.5-6-6 3.7-.5 5.5-2.3 6-6Z"
}));

/**
 * Caju Points — knowledge contributed to the Brain, never vanity.
 * `+N` delta appears after a contribution (feedback, quiz, photo).
 */
function CajuPoints({
  value,
  delta = null,
  unit = null,
  size = 'md',
  chip = false,
  className = '',
  ...rest
}) {
  ensureStyles();
  const cls = ['caju-pts', `caju-pts--${size}`, chip ? 'caju-pts--chip' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "caju-pts__seed"
  }, /*#__PURE__*/React.createElement(Seed, null)), /*#__PURE__*/React.createElement("span", {
    className: "caju-pts__val"
  }, typeof value === 'number' ? value.toLocaleString('es-AR') : value), unit && /*#__PURE__*/React.createElement("span", {
    className: "caju-pts__unit"
  }, unit), delta != null && /*#__PURE__*/React.createElement("span", {
    className: "caju-pts__delta"
  }, "+", delta));
}
Object.assign(__ds_scope, { CajuPoints });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/discovery/CajuPoints.jsx", error: String((e && e.message) || e) }); }

// components/discovery/MapPin.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'caju-pin-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .caju-pin {
    position: relative; display: inline-flex; align-items: center; gap: 7px;
    height: 34px; padding: 0 12px 0 8px; border: 0; cursor: pointer;
    background: var(--surface); border-radius: var(--r-full);
    box-shadow: var(--elev-pin), var(--ring-hairline);
    font-family: var(--font-sans); font-size: var(--t-xs); font-weight: var(--w-semibold);
    color: var(--ink-800); white-space: nowrap; -webkit-tap-highlight-color: transparent;
    transition: transform var(--motion-card), box-shadow var(--motion-card);
  }
  .caju-pin__dot { width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0;
    display: grid; place-items: center; color: #fff; }
  .caju-pin__dot svg { width: 10px; height: 10px; }
  .caju-pin:active { transform: scale(.95); }

  /* dot-only (secondary / discovery pins) */
  .caju-pin--dot { padding: 0; width: 26px; height: 26px; justify-content: center; }
  .caju-pin--dot .caju-pin__dot { width: 14px; height: 14px; }
  .caju-pin--dot .caju-pin__label { display: none; }

  /* selected — grows, caju ring, lifts (SPEC-001 "pin crece") */
  .caju-pin--selected { transform: scale(1.06); box-shadow: var(--shadow-lg), 0 0 0 3px var(--focus-ring); }
  .caju-pin--selected:active { transform: scale(1.02); }

  /* novelty — amber content ring (SPEC-024: new Instagram activity) */
  .caju-pin--novelty { box-shadow: var(--elev-pin), var(--ring-hairline), 0 0 0 2px var(--amber-500); }
  .caju-pin__novelty { position: absolute; inset: -5px; border-radius: var(--r-full);
    border: 2px solid var(--amber-500); opacity: .55; pointer-events: none;
    animation: caju-pin-nov 2.4s var(--ease-out) infinite; }
  @keyframes caju-pin-nov {
    0% { transform: scale(1); opacity: .55; }
    70% { opacity: 0; } 100% { transform: scale(1.5); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) { .caju-pin__novelty { animation: none; opacity: .55; } }

  /* type colors on the dot */
  .caju-pin--recommended .caju-pin__dot { background: var(--pin-recommended); }
  .caju-pin--new         .caju-pin__dot { background: var(--pin-new); }
  .caju-pin--saved       .caju-pin__dot { background: var(--pin-saved); }
  .caju-pin--visited     .caju-pin__dot { background: var(--pin-visited); }
  .caju-pin--event       .caju-pin__dot { background: var(--pin-event); }
  .caju-pin--collection  .caju-pin__dot { background: var(--pin-collection); }
  `;
  document.head.appendChild(el);
}
const GLYPH = {
  recommended: /*#__PURE__*/React.createElement("path", {
    d: "M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5L12 3Z"
  }),
  new: /*#__PURE__*/React.createElement("path", {
    d: "M12 4v16M4 12h16"
  }),
  saved: /*#__PURE__*/React.createElement("path", {
    d: "M7 4h10v16l-5-3-5 3V4Z"
  }),
  visited: /*#__PURE__*/React.createElement("path", {
    d: "M4 12l5 5L20 6"
  }),
  event: /*#__PURE__*/React.createElement("path", {
    d: "M8 3v4M16 3v4M4 9h16M5 6h14v14H5z"
  }),
  collection: /*#__PURE__*/React.createElement("path", {
    d: "M4 7h16M4 12h16M4 17h10"
  })
};

/**
 * Map Pin — a typed marker. Not all pins are equal: the Brain's
 * main pick shows a label; secondary/discovery pins are dot-only
 * (SPEC-001). Types map to the contained pin palette.
 */
function MapPin({
  type = 'recommended',
  label = null,
  selected = false,
  dotOnly = false,
  novelty = false,
  onClick,
  className = '',
  ...rest
}) {
  ensureStyles();
  const compact = dotOnly || !label;
  const cls = ['caju-pin', `caju-pin--${type}`, compact ? 'caju-pin--dot' : '', selected ? 'caju-pin--selected' : '', novelty ? 'caju-pin--novelty' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    onClick: onClick,
    "aria-label": label || type
  }, rest), novelty && /*#__PURE__*/React.createElement("span", {
    className: "caju-pin__novelty",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "caju-pin__dot"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, GLYPH[type])), !compact && /*#__PURE__*/React.createElement("span", {
    className: "caju-pin__label"
  }, label));
}
Object.assign(__ds_scope, { MapPin });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/discovery/MapPin.jsx", error: String((e && e.message) || e) }); }

// components/discovery/RestaurantCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
const Utensils = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.6",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 2v7a3 3 0 0 0 6 0V2M6 9v13M18 2c-2 0-3 2-3 5s1 4 3 4 3 0 3 0V2Z"
}), /*#__PURE__*/React.createElement("path", {
  d: "M18 11v11"
}));
const Bookmark = ({
  filled
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: filled ? 'currentColor' : 'none',
  stroke: "currentColor",
  strokeWidth: "1.8",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"
}));

/**
 * Restaurant Card — a decision, not a directory row. Leads with the
 * Brain's one-line "why", not stars. Compact form is used on the map
 * peek and inside chat; full form in lists and collections.
 */
function RestaurantCard({
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
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `caju-rest ${compact ? 'caju-rest--compact' : ''} ${className}`,
    role: "button",
    tabIndex: 0,
    onClick: onClick
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: `caju-rest__media ${image ? '' : 'caju-rest__media--ph'}`,
    style: image ? {
      backgroundImage: `url(${image})`
    } : undefined
  }, !image && /*#__PURE__*/React.createElement("div", {
    className: "caju-rest__ph"
  }, /*#__PURE__*/React.createElement(Utensils, null)), badge && /*#__PURE__*/React.createElement("div", {
    className: "caju-rest__badges"
  }, badge), !compact && /*#__PURE__*/React.createElement("button", {
    className: `caju-rest__save ${saved ? 'on' : ''}`,
    type: "button",
    "aria-label": saved ? 'Guardado' : 'Guardar',
    onClick: e => {
      e.stopPropagation();
      onSave && onSave(!saved);
    }
  }, /*#__PURE__*/React.createElement(Bookmark, {
    filled: saved
  }))), /*#__PURE__*/React.createElement("div", {
    className: "caju-rest__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "caju-rest__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "caju-rest__name"
  }, name), /*#__PURE__*/React.createElement("span", {
    className: "caju-rest__price"
  }, price)), meta && /*#__PURE__*/React.createElement("div", {
    className: "caju-rest__meta"
  }, meta), why && !compact && /*#__PURE__*/React.createElement("div", {
    className: "caju-rest__why"
  }, why), /*#__PURE__*/React.createElement("div", {
    className: "caju-rest__foot"
  }, tags.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "caju-rest__tags"
  }, tags.slice(0, 3).map((t, i) => /*#__PURE__*/React.createElement("span", {
    className: "caju-rest__tag",
    key: i
  }, t))) : /*#__PURE__*/React.createElement("span", null), trust && /*#__PURE__*/React.createElement(__ds_scope.TrustMeter, {
    level: trust
  }))));
}
Object.assign(__ds_scope, { RestaurantCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/discovery/RestaurantCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pwa/CheckIn.jsx
try { (() => {
/* Screen 7 — QR Check-in (SPEC-020) + Points redemption (SPEC-023).
   Full-screen in-app camera. Verifies a REAL visit via signed QR
   token + real geolocation + server timestamp. The check-in is the
   evidence that unlocks reviews, the passport (SPEC-021) and
   redeeming points as credit (SPEC-023).

   mode: 'checkin'  → scan → validating → success (check-in + points)
   mode: 'redeem'   → scan → validating → choose points → redeemed
*/

function CheckIn({
  mode = 'checkin',
  restaurantId,
  onClose,
  onDone
}) {
  const NS = window.CajuEatDesignSystem_dbeea0;
  const {
    Button,
    CajuPoints,
    Badge,
    TrustMeter
  } = NS;
  const D = window.CAJU_DATA;
  const r = D.restaurants.find(x => x.id === restaurantId) || D.restaurants[0];

  // scan | validating | choose | success | error
  const [stage, setStage] = React.useState('scan');
  const [vStep, setVStep] = React.useState(0);
  const [pts, setPts] = React.useState(2); // redeem: number of 100-pt credits

  const runValidate = fail => {
    setStage('validating');
    setVStep(0);
    setTimeout(() => setVStep(1), 620); // restaurante
    setTimeout(() => setVStep(2), 1240); // geolocalización
    setTimeout(() => {
      if (fail) {
        setStage('error');
        return;
      }
      setStage(mode === 'redeem' ? 'choose' : 'success');
    }, 1900);
  };
  const creditArs = pts * 100 * 5; // 100 pts = $500 (demo rate)

  // Self-stateful screen: convert Lucide icons after every stage change
  // (Shell's effect only fires on navigation, not our internal setState).
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "cj-scan"
  }, (stage === 'scan' || stage === 'validating') && /*#__PURE__*/React.createElement("div", {
    className: "cj-scan__cam"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-scan__feed"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cj-scan__vignette"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cj-scan__top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cj-scan__close",
    onClick: onClose,
    "aria-label": "Cerrar"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "x",
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    className: "cj-scan__title"
  }, mode === 'redeem' ? 'Usar puntos' : 'Check-in'), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: `cj-scan__frame ${stage === 'validating' ? 'is-locked' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "cj-corner tl"
  }), /*#__PURE__*/React.createElement("span", {
    className: "cj-corner tr"
  }), /*#__PURE__*/React.createElement("span", {
    className: "cj-corner bl"
  }), /*#__PURE__*/React.createElement("span", {
    className: "cj-corner br"
  }), stage === 'scan' && /*#__PURE__*/React.createElement("span", {
    className: "cj-scan__line"
  }), stage === 'validating' && /*#__PURE__*/React.createElement("div", {
    className: "cj-scan__lock"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "qr-code",
    size: 40
  })), stage === 'scan' && /*#__PURE__*/React.createElement("div", {
    className: "cj-scan__qr",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(QrGlyph, null))), stage === 'scan' && /*#__PURE__*/React.createElement("div", {
    className: "cj-scan__hint"
  }, /*#__PURE__*/React.createElement("p", {
    className: "cj-scan__place"
  }, r.name, " \xB7 ", r.neighborhood), /*#__PURE__*/React.createElement("p", null, "Apunt\xE1 al c\xF3digo QR que est\xE1 en el mostrador"), /*#__PURE__*/React.createElement("button", {
    className: "cj-scan__sim",
    onClick: () => runValidate(false)
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "scan-line",
    size: 16
  }), " Simular escaneo"), /*#__PURE__*/React.createElement("button", {
    className: "cj-scan__simfail",
    onClick: () => runValidate(true)
  }, "Simular fuera de rango")), stage === 'validating' && /*#__PURE__*/React.createElement("div", {
    className: "cj-scan__valid"
  }, [['Restaurante verificado', 'shield-check'], ['Estás en el lugar', 'map-pin'], ['Registrando visita', 'clock']].map(([label, icon], i) => {
    const done = vStep > i,
      active = vStep === i;
    return /*#__PURE__*/React.createElement("div", {
      className: `cj-vrow ${done ? 'done' : ''} ${active ? 'active' : ''}`,
      key: i
    }, done ? /*#__PURE__*/React.createElement(window.Icon, {
      name: "check",
      size: 15
    }) : /*#__PURE__*/React.createElement("span", {
      className: `cj-vdot ${active ? 'spin' : ''}`
    }), /*#__PURE__*/React.createElement("span", null, label));
  }))), stage !== 'scan' && stage !== 'validating' && /*#__PURE__*/React.createElement("div", {
    className: "cj-scan__result"
  }, stage === 'success' && /*#__PURE__*/React.createElement("div", {
    className: "cj-res"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-res__mark cj-res__mark--ok"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "check",
    size: 30
  })), /*#__PURE__*/React.createElement("h2", null, "\xA1Estuviste en ", r.name, "!"), /*#__PURE__*/React.createElement("p", {
    className: "cj-res__sub"
  }, "Check-in verificado \xB7 ", new Date().toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long'
  })), /*#__PURE__*/React.createElement("div", {
    className: "cj-res__row"
  }, /*#__PURE__*/React.createElement("span", null, "Ganaste por descubrir este lugar"), /*#__PURE__*/React.createElement(CajuPoints, {
    value: 50,
    delta: 50,
    chip: true,
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    className: "cj-res__unlock"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "unlock",
    size: 16
  }), "Ya pod\xE9s dejar tu rese\xF1a de este lugar"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    onClick: () => onDone && onDone('success', r.id)
  }, "Listo")), stage === 'choose' && /*#__PURE__*/React.createElement("div", {
    className: "cj-res cj-res--choose"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-res__mark cj-res__mark--brand"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "wallet",
    size: 26
  })), /*#__PURE__*/React.createElement("h2", null, "Usar tus puntos ac\xE1"), /*#__PURE__*/React.createElement("p", {
    className: "cj-res__sub"
  }, "Ten\xE9s ", /*#__PURE__*/React.createElement("b", null, D.user.points.toLocaleString('es-AR')), " Caju Points \xB7 100 pts = $500"), /*#__PURE__*/React.createElement("div", {
    className: "cj-stepper"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPts(p => Math.max(1, p - 1)),
    "aria-label": "Menos",
    disabled: pts <= 1
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "minus",
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    className: "cj-stepper__val"
  }, /*#__PURE__*/React.createElement("b", null, pts * 100), /*#__PURE__*/React.createElement("span", null, "puntos")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPts(p => Math.min(12, p + 1)),
    "aria-label": "M\xE1s",
    disabled: pts >= 12
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "plus",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cj-credit"
  }, "Descuento ", /*#__PURE__*/React.createElement("b", null, "$", creditArs.toLocaleString('es-AR'))), /*#__PURE__*/React.createElement("p", {
    className: "cj-res__fine"
  }, "Mostrale la confirmaci\xF3n al local. Pod\xE9s volver a usar puntos ac\xE1 dentro de 15 d\xEDas."), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    onClick: () => setStage('redeemed')
  }, "Canjear $", creditArs.toLocaleString('es-AR'))), stage === 'redeemed' && /*#__PURE__*/React.createElement("div", {
    className: "cj-res"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-res__mark cj-res__mark--ok"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "check",
    size: 30
  })), /*#__PURE__*/React.createElement("h2", null, "Canje confirmado"), /*#__PURE__*/React.createElement("p", {
    className: "cj-res__sub"
  }, "Mostrale esta pantalla en ", r.name), /*#__PURE__*/React.createElement("div", {
    className: "cj-voucher"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-voucher__amt"
  }, "$", creditArs.toLocaleString('es-AR')), /*#__PURE__*/React.createElement("div", {
    className: "cj-voucher__meta"
  }, /*#__PURE__*/React.createElement("span", null, r.name), /*#__PURE__*/React.createElement("span", null, new Date().toLocaleString('es-AR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cj-voucher__code"
  }, "CJ-", r.id.toUpperCase().slice(0, 3), "-4827")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    onClick: () => onDone && onDone('redeemed', r.id)
  }, "Listo")), stage === 'error' && /*#__PURE__*/React.createElement("div", {
    className: "cj-res"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-res__mark cj-res__mark--err"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "map-pin-off",
    size: 28
  })), /*#__PURE__*/React.createElement("h2", null, "Todav\xEDa no est\xE1s en el lugar"), /*#__PURE__*/React.createElement("p", {
    className: "cj-res__sub"
  }, "El check-in necesita que est\xE9s f\xEDsicamente en ", r.name, ". Acercate al mostrador y volv\xE9 a escanear."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    block: true,
    onClick: () => setStage('scan')
  }, "Reintentar"), /*#__PURE__*/React.createElement("button", {
    className: "cj-res__ghost",
    onClick: onClose
  }, "Ahora no"))));
}

// A decorative QR glyph (CSS grid of cells) — never a real code.
function QrGlyph() {
  const P = ['1111111 0110 1111111', '1000001 1001 1000001', '1011101 0100 1011101', '1011101 1011 1011101', '1011101 0010 1011101', '1000001 1100 1000001', '1111111 0101 1111111', '0000000 1001 0000000', '1101011 0110 1010110', '0110010 1101 0101101', '1011101 0011 1100011', '0000000 1010 1011101', '1111111 0101 1001011', '1000001 1100 1110010', '1011101 0110 1011101', '1011101 1001 0100110', '1011101 0101 1101011', '1000001 1010 0110100', '1111111 0110 1011101'].map(s => s.replace(/ /g, ''));
  return /*#__PURE__*/React.createElement("div", {
    className: "cj-qr"
  }, P.map((row, y) => row.split('').map((c, x) => c === '1' ? /*#__PURE__*/React.createElement("span", {
    key: y + '-' + x,
    style: {
      gridRow: y + 1,
      gridColumn: x + 1
    }
  }) : null)));
}
const CJ_SCAN_CSS = `
.cj-scan { position: absolute; inset: 0; z-index: 70; display: flex; flex-direction: column;
  background: #141210; animation: cjFade var(--dur-base) var(--ease-out); }
.cj-scan__cam { position: absolute; inset: 0; overflow: hidden; background: #0E0C0A; }
.cj-scan__feed { position: absolute; inset: 0; background:
  radial-gradient(80% 60% at 50% 38%, #3A322B 0%, #211C18 55%, #141210 100%); }
.cj-scan__vignette { position: absolute; inset: 0; box-shadow: inset 0 0 160px 40px rgba(0,0,0,.6); }
.cj-scan__top { position: absolute; top: 50px; left: 0; right: 0; z-index: 3;
  display: flex; align-items: center; justify-content: space-between; padding: 0 14px; }
.cj-scan__close { width: 40px; height: 40px; border-radius: 50%; border: 0; cursor: pointer;
  background: rgba(255,255,255,.14); color: #fff; display: grid; place-items: center; backdrop-filter: blur(6px); }
.cj-scan__title { color: #fff; font-family: var(--font-sans); font-weight: 600; font-size: 16px; }

.cj-scan__frame { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -54%);
  width: 236px; height: 236px; border-radius: 28px; z-index: 2;
  transition: box-shadow var(--motion-card), border-color var(--motion-card); }
.cj-scan__frame.is-locked { box-shadow: 0 0 0 2px var(--caju-400), 0 0 44px 4px rgba(239,90,34,.35); }
.cj-corner { position: absolute; width: 30px; height: 30px; border: 3px solid #fff; }
.cj-corner.tl { top: 0; left: 0; border-right: 0; border-bottom: 0; border-radius: 14px 0 0 0; }
.cj-corner.tr { top: 0; right: 0; border-left: 0; border-bottom: 0; border-radius: 0 14px 0 0; }
.cj-corner.bl { bottom: 0; left: 0; border-right: 0; border-top: 0; border-radius: 0 0 0 14px; }
.cj-corner.br { bottom: 0; right: 0; border-left: 0; border-top: 0; border-radius: 0 0 14px 0; }
.cj-scan__frame.is-locked .cj-corner { border-color: var(--caju-400); }
.cj-scan__line { position: absolute; left: 12px; right: 12px; height: 2px; top: 12px;
  background: linear-gradient(90deg, transparent, var(--caju-400), transparent);
  box-shadow: 0 0 12px 2px rgba(248,122,69,.7); animation: cjScanLine 2.2s var(--ease-in-out) infinite; }
@keyframes cjScanLine { 0%,100% { top: 14px; } 50% { top: 218px; } }
.cj-scan__qr { position: absolute; inset: 40px; display: grid; place-items: center; opacity: .5; }
.cj-scan__lock { position: absolute; inset: 0; display: grid; place-items: center; color: var(--caju-300); }

.cj-qr { display: grid; grid-template-columns: repeat(19, 1fr); grid-template-rows: repeat(19, 1fr);
  width: 118px; height: 118px; }
.cj-qr span { background: #fff; border-radius: 1px; }

.cj-scan__hint { position: absolute; left: 0; right: 0; bottom: 60px; z-index: 3; text-align: center;
  color: rgba(255,255,255,.78); font-family: var(--font-sans); font-size: 14px; padding: 0 32px;
  display: flex; flex-direction: column; align-items: center; }
.cj-scan__hint p { margin: 3px 0 0; }
.cj-scan__place { color: #fff; font-weight: 600; font-size: 15px; margin-bottom: 2px; }
.cj-scan__sim { margin-top: 16px; display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 22px; border-radius: var(--r-full); border: 0; cursor: pointer;
  background: var(--caju-500); color: #fff; font-family: var(--font-sans); font-weight: 600; font-size: 15px;
  box-shadow: 0 10px 24px -8px rgba(239,90,34,.8); }
.cj-scan__simfail { margin-top: 4px; background: none; border: 0; color: rgba(255,255,255,.5);
  font-family: var(--font-sans); font-size: 12px; cursor: pointer; text-decoration: underline; padding: 6px; }

.cj-scan__valid { position: absolute; left: 0; right: 0; bottom: 76px; z-index: 3;
  display: flex; flex-direction: column; align-items: center; gap: 14px; }
.cj-vrow { display: flex; align-items: center; gap: 10px; color: rgba(255,255,255,.4);
  font-family: var(--font-sans); font-size: 15px; transition: color var(--motion-control); }
.cj-vrow.active { color: #fff; } .cj-vrow.done { color: var(--leaf-500); }
.cj-vrow i { color: var(--leaf-500); }
.cj-vdot { width: 15px; height: 15px; border-radius: 50%; border: 2px solid rgba(255,255,255,.3); }
.cj-vdot.spin { border-top-color: var(--caju-400); animation: cjSpin .7s linear infinite; }

.cj-scan__result { position: absolute; inset: 0; background: var(--scrim); display: flex; align-items: flex-end; }
.cj-res { position: relative; width: 100%; background: var(--surface); border-radius: var(--r-2xl) var(--r-2xl) 0 0;
  box-shadow: var(--elev-sheet); padding: 26px 22px calc(24px + var(--safe-bottom));
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px;
  animation: cjSheetUp var(--dur-slow) var(--ease-spring); }
.cj-res__mark { width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; color: #fff;
  margin-bottom: 4px; animation: cjPop var(--dur-slow) var(--ease-spring); }
.cj-res__mark--ok { background: var(--leaf-500); box-shadow: 0 10px 24px -8px rgba(38,160,107,.7); }
.cj-res__mark--brand { background: var(--caju-500); box-shadow: 0 10px 24px -8px rgba(239,90,34,.7); }
.cj-res__mark--err { background: var(--clay-500); }
.cj-res h2 { font-size: 22px; font-weight: 600; color: var(--ink-900); }
.cj-res__sub { font-size: 14px; color: var(--ink-500); line-height: 1.45; max-width: 300px; }
.cj-res__row { display: flex; align-items: center; gap: 12px; margin: 12px 0 4px; font-size: 14px; color: var(--ink-600); }
.cj-res__unlock { display: flex; align-items: center; gap: 8px; margin: 8px 0 18px; padding: 10px 14px;
  background: var(--leaf-050); color: var(--leaf-700); border-radius: var(--r-md); font-size: 13px; font-weight: 500; }
.cj-res__unlock i { color: var(--leaf-600); }
.cj-res__ghost { margin-top: 10px; background: none; border: 0; color: var(--ink-400);
  font-family: var(--font-sans); font-size: 14px; cursor: pointer; padding: 6px; }
.cj-res__fine { font-size: 12px; color: var(--ink-400); line-height: 1.5; margin: 6px 0 16px; max-width: 300px; }

.cj-res--choose h2 { margin-top: 2px; }
.cj-stepper { display: flex; align-items: center; gap: 18px; margin: 18px 0 6px; }
.cj-stepper button { width: 48px; height: 48px; border-radius: 50%; border: 1px solid var(--line-strong);
  background: var(--surface); color: var(--ink-800); cursor: pointer; display: grid; place-items: center;
  transition: transform var(--motion-press), background var(--motion-control); }
.cj-stepper button:active { transform: scale(.92); }
.cj-stepper button:disabled { opacity: .35; cursor: not-allowed; }
.cj-stepper__val { min-width: 96px; display: flex; flex-direction: column; }
.cj-stepper__val b { font-family: var(--font-mono); font-size: 30px; color: var(--ink-900); line-height: 1; }
.cj-stepper__val span { font-size: 12px; color: var(--ink-400); margin-top: 3px; }
.cj-credit { font-size: 15px; color: var(--ink-600); margin-bottom: 4px; }
.cj-credit b { font-family: var(--font-mono); color: var(--caju-600); font-size: 17px; }

.cj-voucher { align-self: stretch; margin: 14px 0 18px; padding: 20px; border-radius: var(--r-lg);
  background: var(--ink-900); color: #fff; position: relative; overflow: hidden; }
.cj-voucher::before { content: ''; position: absolute; right: -30px; top: -30px; width: 120px; height: 120px;
  border-radius: 50%; background: radial-gradient(circle, rgba(248,122,69,.35), transparent 70%); }
.cj-voucher__amt { font-family: var(--font-mono); font-size: 40px; font-weight: 500; letter-spacing: -0.02em; }
.cj-voucher__meta { display: flex; justify-content: space-between; margin-top: 6px; font-size: 13px; color: rgba(255,255,255,.7); }
.cj-voucher__code { margin-top: 14px; font-family: var(--font-mono); font-size: 15px; letter-spacing: .12em;
  color: var(--caju-300); border-top: 1px dashed rgba(255,255,255,.2); padding-top: 12px; }
`;
Object.assign(window, {
  CheckIn,
  CJ_SCAN_CSS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pwa/CheckIn.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pwa/Conversation.jsx
try { (() => {
/* Screen 2 — Conversation. Chat as a way to navigate the product,
   not a support bot. Brain replies with text + rich cards. */

function Conversation({
  initialQuery,
  onBack,
  onOpenRestaurant
}) {
  const NS = window.CajuEatDesignSystem_dbeea0;
  const {
    ChatBubble,
    PromptBar,
    RestaurantCard,
    Chip
  } = NS;
  const D = window.CAJU_DATA;
  const [q, setQ] = React.useState('');
  const [turns, setTurns] = React.useState([]);
  const [thinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef(null);
  const respond = userText => {
    setTurns(t => [...t, {
      from: 'user',
      text: userText
    }]);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setTurns(t => [...t, {
        from: 'brain',
        text: /*#__PURE__*/React.createElement(React.Fragment, null, "Tres lugares con ", /*#__PURE__*/React.createElement("b", null, "buena mesa para hablar"), " cerca tuyo. Ninguno necesita reserva un martes:"),
        cards: ['osaka', 'anafe', 'cuervo'],
        chips: ['¿Cuál es más tranquilo?', 'Algo más barato', 'Para 4 personas']
      }]);
    }, 1100);
  };
  React.useEffect(() => {
    if (initialQuery) respond(initialQuery); /* eslint-disable-next-line */
  }, []);
  React.useEffect(() => {
    const s = scrollRef.current;
    if (s) s.scrollTop = s.scrollHeight;
  }, [turns, thinking]);
  return /*#__PURE__*/React.createElement("div", {
    className: "cj-screen cj-convo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-convo__head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cj-iconback",
    onClick: onBack,
    "aria-label": "Volver"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "chevron-left",
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    className: "cj-convo__title"
  }, /*#__PURE__*/React.createElement(window.BrainMarkMini, null), /*#__PURE__*/React.createElement("div", {
    className: "cj-convo__titletext"
  }, /*#__PURE__*/React.createElement("b", null, "Caju"), /*#__PURE__*/React.createElement("span", null, "Concierge gastron\xF3mico"))), /*#__PURE__*/React.createElement("button", {
    className: "cj-iconback",
    "aria-label": "Mapa",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "map",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cj-convo__scroll",
    ref: scrollRef
  }, turns.length === 0 && !thinking && /*#__PURE__*/React.createElement("div", {
    className: "cj-convo__empty"
  }, /*#__PURE__*/React.createElement(NS.BrainMark, {
    size: 44,
    radius: 14
  }), /*#__PURE__*/React.createElement("p", {
    className: "cj-convo__hi"
  }, "Soy Caju.", /*#__PURE__*/React.createElement("br", null), "Contame qu\xE9 se te antoja y te ayudo a decidir."), /*#__PURE__*/React.createElement("div", {
    className: "cj-convo__starters"
  }, ['Cerca y tranquilo para hablar', 'Buena barra para ir solo', 'Para una cita, sin ruido'].map((s, i) => /*#__PURE__*/React.createElement(Chip, {
    key: i,
    onClick: () => respond(s)
  }, s)))), turns.map((t, i) => /*#__PURE__*/React.createElement("div", {
    className: "cj-turn",
    key: i
  }, /*#__PURE__*/React.createElement(ChatBubble, {
    from: t.from
  }, t.text, t.cards && /*#__PURE__*/React.createElement("div", {
    className: "cj-turn__cards"
  }, t.cards.map(id => {
    const r = D.restaurants.find(x => x.id === id);
    return /*#__PURE__*/React.createElement(RestaurantCard, {
      key: id,
      compact: true,
      name: r.name,
      cuisine: r.cuisine,
      neighborhood: r.neighborhood,
      price: r.price,
      tags: r.tags,
      trust: r.trust,
      onClick: () => onOpenRestaurant(id)
    });
  }))), t.chips && !thinking && i === turns.length - 1 && /*#__PURE__*/React.createElement("div", {
    className: "cj-turn__chips"
  }, t.chips.map((c, j) => /*#__PURE__*/React.createElement(Chip, {
    key: j,
    onClick: () => respond(c)
  }, c))))), thinking && /*#__PURE__*/React.createElement(ChatBubble, {
    from: "brain",
    thinking: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "cj-convo__prompt"
  }, /*#__PURE__*/React.createElement(PromptBar, {
    value: q,
    onChange: setQ,
    showMark: false,
    onSend: v => {
      respond(v);
      setQ('');
    },
    placeholder: "Escrib\xED o habl\xE1\u2026"
  })));
}

// tiny inline brain mark for the title
function BrainMarkMini() {
  const NS = window.CajuEatDesignSystem_dbeea0;
  return /*#__PURE__*/React.createElement(NS.BrainMark, {
    size: 22,
    radius: 7
  });
}
const CJ_CONVO_CSS = `
.cj-convo { display: flex; flex-direction: column; background: var(--paper); }
.cj-convo__head { position: relative; z-index: 10; flex-shrink: 0; padding-top: 44px;
  height: 92px; display: flex; align-items: center; justify-content: space-between; padding-left: 8px; padding-right: 8px;
  background: rgba(252,251,248,.9); backdrop-filter: blur(12px); border-bottom: 1px solid var(--line-soft); }
.cj-convo__title { display: flex; align-items: center; gap: 8px; font-family: var(--font-sans);
  font-weight: 600; font-size: 17px; color: var(--ink-900); }
.cj-iconback { width: 40px; height: 40px; border: 0; background: transparent; border-radius: 50%;
  display: grid; place-items: center; color: var(--ink-700); cursor: pointer; }
.cj-iconback:active { background: var(--paper-sunk); }
.cj-convo__scroll { flex: 1; overflow-y: auto; padding: 18px 16px 8px; display: flex; flex-direction: column; gap: 16px;
  scrollbar-width: none; }
.cj-convo__scroll::-webkit-scrollbar { display: none; }
.cj-convo__titletext { display: flex; flex-direction: column; line-height: 1.1; }
.cj-convo__titletext b { font-weight: 600; font-size: 16px; color: var(--ink-900); }
.cj-convo__titletext span { font-size: 11px; color: var(--ink-400); font-weight: 500; }
.cj-convo__empty { display: flex; flex-direction: column; align-items: flex-start; gap: 14px;
  padding: 24px 6px 8px; animation: cjTurnIn var(--dur-base) var(--ease-out); }
.cj-convo__hi { font-family: var(--font-serif); font-size: 26px; line-height: 1.2; color: var(--ink-900);
  letter-spacing: -0.01em; }
.cj-convo__starters { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
.cj-turn { display: flex; flex-direction: column; gap: 10px; animation: cjTurnIn var(--dur-base) var(--ease-out); }
@keyframes cjTurnIn { from { opacity: 0; transform: translateY(8px); } }
.cj-turn__cards { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
.cj-turn__chips { display: flex; flex-wrap: wrap; gap: 8px; padding-left: 38px; }
.cj-convo__prompt { flex-shrink: 0; padding: 10px 14px calc(10px + var(--safe-bottom));
  background: rgba(252,251,248,.92); backdrop-filter: blur(12px); border-top: 1px solid var(--line-soft); }
`;
Object.assign(window, {
  Conversation,
  BrainMarkMini,
  CJ_CONVO_CSS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pwa/Conversation.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pwa/Feedback.jsx
try { (() => {
/* Screen 5 — Post-visit Feedback. Not a review: a 3-question
   conversation that feeds the Brain, then Caju Points. */

function Feedback({
  onClose
}) {
  const NS = window.CajuEatDesignSystem_dbeea0;
  const {
    Chip,
    CajuPoints,
    Badge,
    Button
  } = NS;
  const D = window.CAJU_DATA;
  const r = D.restaurants[0];
  const questions = [{
    q: '¿Cómo estuvo tu visita a ' + r.name + '?',
    a: ['Excelente', 'Estuvo bien', 'Floja']
  }, {
    q: '¿Esperaste mucho por mesa?',
    a: ['Nada', '10–20 min', 'Más de 30']
  }, {
    q: '¿La barra estaba abierta?',
    a: ['Sí', 'No', 'No sé']
  }, {
    q: '¿Con quién lo recomendarías?',
    a: ['En pareja', 'Amigos', 'Solo', 'Familia']
  }];
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState([]);
  const [picked, setPicked] = React.useState(null);
  const done = step >= questions.length;
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const pick = a => {
    setPicked(a);
    setAnswers(prev => [...prev, a]);
    setTimeout(() => {
      setStep(s => s + 1);
      setPicked(null);
    }, 280);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "cj-overlay"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-ov-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "cj-ov-sheet cj-fb"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-ov-grip"
  }), !done ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "cj-fb-progress"
  }, questions.map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: i <= step ? 'on' : ''
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cj-fb-head"
  }, /*#__PURE__*/React.createElement(NS.BrainMark, {
    size: 30,
    radius: 9
  }), /*#__PURE__*/React.createElement("span", null, "Contame en 20 segundos. Ayud\xE1s al Brain, no complet\xE1s una encuesta.")), /*#__PURE__*/React.createElement("div", {
    className: "cj-fb-q",
    key: step
  }, /*#__PURE__*/React.createElement("h2", null, questions[step].q), /*#__PURE__*/React.createElement("div", {
    className: "cj-fb-answers"
  }, questions[step].a.map((a, i) => /*#__PURE__*/React.createElement(Chip, {
    key: i,
    selected: picked === a,
    onClick: () => pick(a)
  }, a))))) : /*#__PURE__*/React.createElement("div", {
    className: "cj-cap-done"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-cap-done__seed"
  }, /*#__PURE__*/React.createElement(NS.BrainMark, {
    size: 52,
    radius: 16
  })), /*#__PURE__*/React.createElement("h2", null, "\xA1Gracias, ", D.user.name, "!"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--ink-500)',
      fontSize: 14
    }
  }, "El Brain va a recomendar mejor gracias a esto."), /*#__PURE__*/React.createElement("div", {
    className: "cj-cap-learn",
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "over"
  }, "Lo que aprend\xED de vos"), /*#__PURE__*/React.createElement("p", null, "\u201C", D.user.name, " prefiere la barra y valora la espera corta.\u201D")), /*#__PURE__*/React.createElement("div", {
    className: "cj-cap-award"
  }, /*#__PURE__*/React.createElement("span", null, "Ganaste"), /*#__PURE__*/React.createElement(CajuPoints, {
    value: 45,
    delta: 45,
    chip: true,
    size: "sm"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    onClick: onClose
  }, "Volver al mapa"))));
}
const CJ_FB_CSS = `
.cj-fb { min-height: 340px; }
.cj-fb-progress { display: flex; gap: 6px; margin-bottom: 18px; }
.cj-fb-progress span { flex: 1; height: 4px; border-radius: 2px; background: var(--line);
  transition: background var(--motion-control); }
.cj-fb-progress span.on { background: var(--caju-500); }
.cj-fb-head { display: flex; gap: 10px; align-items: flex-start; color: var(--ink-400); font-size: 13px;
  margin-bottom: 22px; }
.cj-fb-q { animation: cjQ var(--dur-base) var(--ease-out); }
@keyframes cjQ { from { opacity: 0; transform: translateY(8px); } }
.cj-fb-q h2 { font-family: var(--font-serif); font-size: 26px; line-height: 1.15; color: var(--ink-900);
  font-weight: 400; margin-bottom: 18px; letter-spacing: -0.01em; }
.cj-fb-answers { display: flex; flex-wrap: wrap; gap: 10px; }
.cj-fb-answers .caju-chip { height: 44px; padding: 0 18px; font-size: 15px; }
`;
Object.assign(window, {
  Feedback,
  CJ_FB_CSS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pwa/Feedback.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pwa/KnowledgeCapture.jsx
try { (() => {
/* Screen 4 — Knowledge Capture. Aportar conocimiento en < 30s.
   Voz / foto / link → el Brain analiza → aprende. Overlay sheet. */

function KnowledgeCapture({
  onClose
}) {
  const NS = window.CajuEatDesignSystem_dbeea0;
  const {
    Button,
    CajuPoints,
    Badge
  } = NS;
  const [stage, setStage] = React.useState('pick'); // pick | analyzing | done
  const [link, setLink] = React.useState('');
  const [aStep, setAStep] = React.useState(0);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const start = () => {
    setStage('analyzing');
    setAStep(0);
    setTimeout(() => setAStep(1), 650);
    setTimeout(() => setAStep(2), 1300);
    setTimeout(() => setStage('done'), 2050);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "cj-overlay"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-ov-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "cj-ov-sheet"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-ov-grip"
  }), stage === 'pick' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "cj-ov-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Aportar conocimiento"), /*#__PURE__*/React.createElement("p", null, "Compart\xED lo que sepas y el Brain aprende. Menos de 30 segundos.")), /*#__PURE__*/React.createElement("div", {
    className: "cj-cap-grid"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cj-cap",
    onClick: start
  }, /*#__PURE__*/React.createElement("span", {
    className: "cj-cap__ic cj-cap__ic--caju"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "mic",
    size: 22
  })), /*#__PURE__*/React.createElement("span", {
    className: "cj-cap__t"
  }, "Voz"), /*#__PURE__*/React.createElement("span", {
    className: "cj-cap__s"
  }, "Cont\xE1 una experiencia")), /*#__PURE__*/React.createElement("button", {
    className: "cj-cap",
    onClick: start
  }, /*#__PURE__*/React.createElement("span", {
    className: "cj-cap__ic cj-cap__ic--amber"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "camera",
    size: 22
  })), /*#__PURE__*/React.createElement("span", {
    className: "cj-cap__t"
  }, "Foto"), /*#__PURE__*/React.createElement("span", {
    className: "cj-cap__s"
  }, "Plato, men\xFA o ticket")), /*#__PURE__*/React.createElement("button", {
    className: "cj-cap",
    onClick: start
  }, /*#__PURE__*/React.createElement("span", {
    className: "cj-cap__ic cj-cap__ic--leaf"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "instagram",
    size: 22
  })), /*#__PURE__*/React.createElement("span", {
    className: "cj-cap__t"
  }, "Reel / TikTok"), /*#__PURE__*/React.createElement("span", {
    className: "cj-cap__s"
  }, "Peg\xE1 un link")), /*#__PURE__*/React.createElement("button", {
    className: "cj-cap",
    onClick: start
  }, /*#__PURE__*/React.createElement("span", {
    className: "cj-cap__ic cj-cap__ic--slate"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "file-text",
    size: 22
  })), /*#__PURE__*/React.createElement("span", {
    className: "cj-cap__t"
  }, "Nota"), /*#__PURE__*/React.createElement("span", {
    className: "cj-cap__s"
  }, "Escrib\xED algo corto"))), /*#__PURE__*/React.createElement("div", {
    className: "cj-cap-link"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "link",
    size: 18
  }), /*#__PURE__*/React.createElement("input", {
    value: link,
    onChange: e => setLink(e.target.value),
    placeholder: "o peg\xE1 un link de Instagram, YouTube\u2026"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "primary",
    onClick: start,
    disabled: !link.trim()
  }, "Enviar"))), stage === 'analyzing' && /*#__PURE__*/React.createElement("div", {
    className: "cj-cap-analyze"
  }, /*#__PURE__*/React.createElement(NS.BrainMark, {
    size: 52,
    radius: 16,
    thinking: true
  }), /*#__PURE__*/React.createElement("h2", null, "El Brain est\xE1 analizando\u2026"), /*#__PURE__*/React.createElement("p", null, "Extrayendo restaurantes, platos y se\xF1ales."), /*#__PURE__*/React.createElement("div", {
    className: "cj-cap-steps"
  }, ['Detectando lugar', 'Identificando platos', 'Ponderando confianza'].map((s, i) => {
    const done = aStep > i;
    return /*#__PURE__*/React.createElement("div", {
      className: `cj-cap-step ${done || aStep === i ? 'on' : ''}`,
      key: i
    }, done ? /*#__PURE__*/React.createElement(window.Icon, {
      name: "check",
      size: 14
    }) : /*#__PURE__*/React.createElement("span", {
      className: "cj-dot"
    }), " ", s);
  }))), stage === 'done' && /*#__PURE__*/React.createElement("div", {
    className: "cj-cap-done"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-cap-done__seed"
  }, /*#__PURE__*/React.createElement(NS.BrainMark, {
    size: 52,
    radius: 16
  })), /*#__PURE__*/React.createElement("h2", null, "\xA1Gracias! El Brain aprendi\xF3 algo nuevo."), /*#__PURE__*/React.createElement("div", {
    className: "cj-cap-learn"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "over"
  }, "Lo que guard\xE9"), /*#__PURE__*/React.createElement("p", null, "\u201CEn ", /*#__PURE__*/React.createElement("b", null, "Anafe"), " la pesca del d\xEDa cambia cada semana y vale la pena preguntarla.\u201D")), /*#__PURE__*/React.createElement("div", {
    className: "cj-cap-award"
  }, /*#__PURE__*/React.createElement("span", null, "Ganaste"), /*#__PURE__*/React.createElement(CajuPoints, {
    value: 30,
    delta: 30,
    chip: true,
    size: "sm"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    onClick: onClose
  }, "Listo"))));
}
const CJ_CAP_CSS = `
.cj-overlay { position: absolute; inset: 0; z-index: 60; display: flex; align-items: flex-end; }
.cj-ov-scrim { position: absolute; inset: 0; background: var(--scrim); animation: cjFade var(--dur-base) var(--ease-out); }
.cj-ov-sheet { position: relative; width: 100%; background: var(--surface);
  border-radius: var(--r-2xl) var(--r-2xl) 0 0; box-shadow: var(--elev-sheet);
  padding: 8px 20px calc(22px + var(--safe-bottom)); animation: cjSheetUp var(--dur-slow) var(--ease-spring); }
.cj-ov-grip { width: 36px; height: 5px; border-radius: 3px; background: var(--line-strong); margin: 3px auto 14px; }
@keyframes cjFade { from { opacity: 0; } }
@keyframes cjSheetUp { from { transform: translateY(100%); } }
.cj-ov-head h2 { font-size: 22px; font-weight: 600; color: var(--ink-900); }
.cj-ov-head p { font-size: 14px; color: var(--ink-500); margin-top: 5px; }
.cj-cap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 18px 0 14px; }
.cj-cap { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; padding: 16px; cursor: pointer;
  background: var(--surface-2); border: 1px solid var(--line); border-radius: var(--r-lg); text-align: left;
  transition: transform var(--motion-press), border-color var(--motion-control), background var(--motion-control); }
.cj-cap:active { transform: scale(.97); }
.cj-cap:hover { border-color: var(--ink-300); }
.cj-cap__ic { width: 44px; height: 44px; border-radius: 13px; display: grid; place-items: center; color: #fff; margin-bottom: 8px; }
.cj-cap__ic--caju { background: var(--caju-500); }
.cj-cap__ic--amber { background: var(--amber-500); }
.cj-cap__ic--leaf { background: var(--leaf-500); }
.cj-cap__ic--slate { background: #4E7A93; }
.cj-cap__t { font-size: 15px; font-weight: 600; color: var(--ink-900); }
.cj-cap__s { font-size: 12.5px; color: var(--ink-500); }
.cj-cap-link { display: flex; align-items: center; gap: 10px; padding: 8px 8px 8px 14px;
  background: var(--surface-2); border: 1px solid var(--line); border-radius: var(--r-full); color: var(--ink-400); }
.cj-cap-link input { flex: 1; border: 0; background: transparent; outline: 0; font-family: var(--font-sans);
  font-size: 14px; color: var(--ink-900); min-width: 0; }
.cj-cap-analyze, .cj-cap-done { display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 16px 0 6px; gap: 6px; }
.cj-cap-analyze h2, .cj-cap-done h2 { font-size: 20px; font-weight: 600; color: var(--ink-900); margin-top: 8px; }
.cj-cap-analyze p { font-size: 14px; color: var(--ink-500); }
.cj-cap-steps { margin-top: 16px; display: flex; flex-direction: column; gap: 10px; align-self: stretch; }
.cj-cap-step { display: flex; align-items: center; gap: 9px; font-size: 14px; color: var(--ink-400); }
.cj-cap-step.on { color: var(--ink-800); }
.cj-cap-step.on i { color: var(--leaf-600); }
.cj-dot { width: 14px; height: 14px; border-radius: 50%; border: 2px solid var(--line-strong);
  border-top-color: var(--caju-500); animation: cjSpin .7s linear infinite; }
@keyframes cjSpin { to { transform: rotate(360deg); } }
.cj-cap-done__seed { animation: cjPop var(--dur-slow) var(--ease-spring); }
@keyframes cjPop { from { transform: scale(.6); opacity: 0; } }
.cj-cap-learn { align-self: stretch; margin: 14px 0; padding: 14px 16px; background: var(--caju-050);
  border-radius: var(--r-lg); }
.cj-cap-learn p { font-family: var(--font-serif); font-size: 18px; line-height: 1.32; color: var(--ink-900); margin-top: 6px; }
.cj-cap-award { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; font-size: 14px; color: var(--ink-600); }
`;
Object.assign(window, {
  KnowledgeCapture,
  CJ_CAP_CSS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pwa/KnowledgeCapture.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pwa/LivingMap.jsx
try { (() => {
/* Screen 1 — Living Map (Home). Map-first: pins, one Brain card,
   context chips, always-present prompt bar. */

function LivingMap({
  onOpenRestaurant,
  onOpenChat,
  onOpenCapture,
  saved,
  toggleSave
}) {
  const NS = window.CajuEatDesignSystem_dbeea0;
  const {
    BrainCard,
    PromptBar,
    MapPin,
    Chip,
    RestaurantCard,
    IconButton,
    CajuPoints,
    Button,
    Wordmark
  } = NS;
  const D = window.CAJU_DATA;
  const [ctx, setCtx] = React.useState('open');
  const [sel, setSel] = React.useState(null);
  const [q, setQ] = React.useState('');
  const selRest = D.restaurants.find(r => r.id === sel);
  return /*#__PURE__*/React.createElement("div", {
    className: "cj-screen"
  }, /*#__PURE__*/React.createElement(window.MapCanvas, null, D.restaurants.map(r => /*#__PURE__*/React.createElement("span", {
    key: r.id,
    className: "cj-pin-at",
    style: r.pos
  }, r.type === 'recommended' && r.id !== sel && /*#__PURE__*/React.createElement("span", {
    className: "cj-pin-halo"
  }), /*#__PURE__*/React.createElement(MapPin, {
    type: r.type,
    label: r.id === sel ? r.name : r.type === 'recommended' ? r.name : null,
    selected: r.id === sel,
    novelty: r.type === 'new',
    onClick: () => setSel(r.id)
  }))), D.events.map(e => /*#__PURE__*/React.createElement("span", {
    key: e.id,
    className: "cj-pin-at",
    style: e.pos
  }, /*#__PURE__*/React.createElement(MapPin, {
    type: "event",
    label: `${e.name.split(' ')[0]} · ${e.when}`
  })))), /*#__PURE__*/React.createElement("div", {
    className: "cj-map-head"
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 19
  }), /*#__PURE__*/React.createElement("div", {
    className: "cj-map-head__right"
  }, /*#__PURE__*/React.createElement(CajuPoints, {
    value: D.user.points,
    size: "sm",
    chip: true
  }), /*#__PURE__*/React.createElement("button", {
    className: "cj-avatar",
    "aria-label": "Perfil"
  }, D.user.initials))), /*#__PURE__*/React.createElement("div", {
    className: "cj-chips"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cj-loc"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "map-pin",
    size: 14
  }), " Palermo ", /*#__PURE__*/React.createElement(window.Icon, {
    name: "chevron-down",
    size: 13
  })), /*#__PURE__*/React.createElement("span", {
    className: "cj-chips__div"
  }), /*#__PURE__*/React.createElement(Chip, {
    selected: ctx === 'near',
    icon: /*#__PURE__*/React.createElement(window.Icon, {
      name: "map-pin",
      size: 15
    }),
    onClick: () => setCtx('near')
  }, "Cerca"), /*#__PURE__*/React.createElement(Chip, {
    selected: ctx === 'open',
    icon: /*#__PURE__*/React.createElement(window.Icon, {
      name: "clock",
      size: 15
    }),
    onClick: () => setCtx('open')
  }, "Abierto ahora"), /*#__PURE__*/React.createElement(Chip, {
    selected: ctx === 'date',
    icon: /*#__PURE__*/React.createElement(window.Icon, {
      name: "heart",
      size: 15
    }),
    onClick: () => setCtx('date')
  }, "Para una cita"), /*#__PURE__*/React.createElement(Chip, {
    selected: ctx === 'work',
    icon: /*#__PURE__*/React.createElement(window.Icon, {
      name: "laptop",
      size: 15
    }),
    onClick: () => setCtx('work')
  }, "Trabajar"), /*#__PURE__*/React.createElement(Chip, {
    selected: ctx === 'saved',
    brand: true,
    icon: /*#__PURE__*/React.createElement(window.Icon, {
      name: "bookmark",
      size: 15
    }),
    onClick: () => setCtx('saved')
  }, "Guardados")), /*#__PURE__*/React.createElement("div", {
    className: "cj-map-fabs"
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: /*#__PURE__*/React.createElement(window.Icon, {
      name: "layers",
      size: 20
    }),
    label: "Capas",
    variant: "float",
    size: "md"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: /*#__PURE__*/React.createElement(window.Icon, {
      name: "locate-fixed",
      size: 20
    }),
    label: "Mi ubicaci\xF3n",
    variant: "float",
    size: "md"
  })), /*#__PURE__*/React.createElement("div", {
    className: "cj-bottom"
  }, selRest ? /*#__PURE__*/React.createElement("div", {
    className: "cj-peek",
    onClick: () => onOpenRestaurant(selRest.id)
  }, /*#__PURE__*/React.createElement(RestaurantCard, {
    compact: true,
    name: selRest.name,
    cuisine: selRest.cuisine,
    neighborhood: selRest.neighborhood,
    price: selRest.price,
    tags: selRest.tags,
    trust: selRest.trust
  }), /*#__PURE__*/React.createElement("div", {
    className: "cj-peek__go"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "chevron-up",
    size: 18
  }))) : /*#__PURE__*/React.createElement(BrainCard, {
    eyebrow: "CAJU \xB7 PARA VOS",
    message: /*#__PURE__*/React.createElement(React.Fragment, null, "Cerca tuyo hay una ", /*#__PURE__*/React.createElement("b", null, "barra nikkei"), " que encaja con lo que te gust\xF3 anoche."),
    sub: "Osaka \xB7 a 2 cuadras \xB7 reserva recomendada",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "primary",
      onClick: () => onOpenRestaurant('osaka')
    }, "Ver lugar"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      onClick: () => onOpenChat('mostrame más opciones')
    }, "M\xE1s opciones"))
  }), /*#__PURE__*/React.createElement("div", {
    className: "cj-prompt-wrap"
  }, /*#__PURE__*/React.createElement(PromptBar, {
    value: q,
    onChange: setQ,
    onSend: v => {
      onOpenChat(v);
      setQ('');
    },
    onVoice: onOpenCapture,
    placeholder: "Pregunt\xE1 d\xF3nde comer\u2026"
  }))));
}
const CJ_MAP_SCREEN_CSS = `
.cj-pin-at { position: absolute; transform: translate(-50%, -50%); }
.cj-map-head { position: absolute; top: 50px; left: 0; right: 0; z-index: 20;
  display: flex; align-items: center; justify-content: space-between; padding: 0 14px; }
.cj-loc { display: inline-flex; align-items: center; gap: 4px; height: 36px; padding: 0 12px;
  background: rgba(255,255,255,.9); backdrop-filter: blur(8px); border: 0; border-radius: var(--r-full);
  box-shadow: var(--shadow-md); font-family: var(--font-sans); font-weight: 600; font-size: 13px;
  color: var(--ink-800); cursor: pointer; flex-shrink: 0; }
.cj-chips__div { width: 1px; height: 20px; background: var(--line-strong); align-self: center;
  flex-shrink: 0; margin: 0 2px; }
.cj-map-head__right { display: flex; align-items: center; gap: 8px; }
.cj-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--ink-800); color: #fff;
  display: grid; place-items: center; font-family: var(--font-mono); font-size: 13px; font-weight: 500;
  box-shadow: var(--shadow-md); border: 0; cursor: pointer; }
.cj-pin-halo { position: absolute; left: 17px; top: 50%; width: 16px; height: 16px;
  transform: translate(-50%, -50%); border-radius: 50%; background: var(--caju-500); z-index: -1;
  animation: cjPinPulse 2.6s var(--ease-out) infinite; }
@keyframes cjPinPulse {
  0% { transform: translate(-50%,-50%) scale(1); opacity: .5; }
  70% { opacity: 0; }
  100% { transform: translate(-50%,-50%) scale(3.6); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) { .cj-pin-halo { animation: none; opacity: 0; } }
.cj-chips { position: absolute; top: 96px; left: 0; right: 0; z-index: 20;
  display: flex; gap: 8px; padding: 4px 14px; overflow-x: auto; scrollbar-width: none; }
.cj-chips::-webkit-scrollbar { display: none; }
.cj-map-fabs { position: absolute; right: 14px; bottom: 250px; z-index: 20;
  display: flex; flex-direction: column; gap: 10px; }
.cj-bottom { position: absolute; left: 0; right: 0; bottom: 0; z-index: 25;
  padding: 0 14px calc(var(--tabbar-h) + 12px); display: flex; flex-direction: column; gap: 12px; }
.cj-prompt-wrap { }
.cj-peek { position: relative; cursor: pointer; }
.cj-peek__go { position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
  color: var(--ink-300); }
`;
Object.assign(window, {
  LivingMap,
  CJ_MAP_SCREEN_CSS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pwa/LivingMap.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pwa/MapCanvas.jsx
try { (() => {
/* Stylized, calm map backdrop for the Living Map. This is UI
   scaffolding — the real PWA renders a live map library. Kept
   abstract and muted (Apple-Maps-light character), never a
   dump of streets. */

function MapCanvas({
  children,
  dim = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "cj-map"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-map__base"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cj-map__water"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cj-map__park cj-map__park--a"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cj-map__park cj-map__park--b"
  }), /*#__PURE__*/React.createElement("svg", {
    className: "cj-map__streets",
    viewBox: "0 0 390 780",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("g", {
    stroke: "#fff",
    strokeWidth: "7",
    fill: "none",
    opacity: "0.9",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M-20 150 H420"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-20 340 H420"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-20 560 H420"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M70 -20 V800"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M210 -20 V800"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M320 -20 V800"
  })), /*#__PURE__*/React.createElement("g", {
    stroke: "#fff",
    strokeWidth: "3",
    fill: "none",
    opacity: "0.75"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M-20 250 H420"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-20 450 H420"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-20 660 H420"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M140 -20 V800"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M270 -20 V800"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-20 30 L200 120 L420 60"
  }))), dim && /*#__PURE__*/React.createElement("div", {
    className: "cj-map__dim"
  }), children);
}
const CJ_MAP_CSS = `
.cj-map { position: absolute; inset: 0; overflow: hidden; }
.cj-map__base { position: absolute; inset: 0;
  background: linear-gradient(160deg, #F3F0E9 0%, #ECE8DF 100%); }
.cj-map__water { position: absolute; right: -12%; top: 44%; width: 70%; height: 60%;
  background: linear-gradient(140deg, #CFE1E6, #BBD4DC);
  transform: rotate(-14deg); border-radius: 40% 60% 50% 50%; opacity: .9; }
.cj-map__park { position: absolute; border-radius: 42% 58% 55% 45%; }
.cj-map__park--a { top: 8%; right: 10%; width: 40%; height: 20%;
  background: radial-gradient(circle at 40% 40%, #D6E6CF, #C6DCC0); }
.cj-map__park--b { bottom: 12%; left: -6%; width: 34%; height: 18%;
  background: radial-gradient(circle at 60% 40%, #D6E6CF, #C6DCC0); }
.cj-map__streets { position: absolute; inset: 0; width: 100%; height: 100%; }
.cj-map__dim { position: absolute; inset: 0; background: rgba(24,20,16,.28);
  backdrop-filter: blur(1.5px); transition: opacity var(--dur-base) var(--ease-out); }
`;
Object.assign(window, {
  MapCanvas,
  CJ_MAP_CSS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pwa/MapCanvas.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pwa/Passport.jsx
try { (() => {
/* Screen 8 — Mi Pasaporte de Cafés (SPEC-021). An album of real
   progress: cafés visited (via real check-ins, SPEC-020) with the
   first-visit date, and cafés por visitar grouped by barrio.
   Progress is measured against the REAL catalog size — never an
   invented goal. NO streaks, NO leaderboards, NO FOMO
   (respects gamification.md). Private to the user.  */

function Passport({
  onBack,
  onOpenRestaurant,
  onCheckIn
}) {
  const NS = window.CajuEatDesignSystem_dbeea0;
  const {
    Badge,
    CajuPoints,
    Button
  } = NS;
  const D = window.CAJU_DATA;
  const cafes = D.cafes;
  const visited = cafes.filter(c => c.visited);
  const pending = cafes.filter(c => !c.visited);

  // group "por visitar" by barrio
  const byBarrio = {};
  pending.forEach(c => {
    (byBarrio[c.neighborhood] = byBarrio[c.neighborhood] || []).push(c);
  });
  const barrios = Object.keys(byBarrio).sort((a, b) => byBarrio[b].length - byBarrio[a].length);
  const fmt = d => new Date(d + 'T12:00').toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short'
  });
  const pct = Math.round(visited.length / cafes.length * 100);
  return /*#__PURE__*/React.createElement("div", {
    className: "cj-screen cj-pass"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-pass__head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cj-iconback",
    onClick: onBack,
    "aria-label": "Volver"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "chevron-left",
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    className: "cj-pass__htitle"
  }, "Mi Pasaporte"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "cj-pass__scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-pass__hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-pass__ring",
    style: {
      '--p': pct
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-pass__ringin"
  }, /*#__PURE__*/React.createElement("b", null, visited.length), /*#__PURE__*/React.createElement("span", null, "de ", cafes.length))), /*#__PURE__*/React.createElement("div", {
    className: "cj-pass__herotxt"
  }, /*#__PURE__*/React.createElement("p", {
    className: "cj-pass__lead"
  }, "Vas conociendo la ciudad, caf\xE9 por caf\xE9."), /*#__PURE__*/React.createElement("p", {
    className: "cj-pass__sub"
  }, cafes.length - visited.length, " lugares del cat\xE1logo te esperan. Sum\xE1s uno cada vez que hac\xE9s check-in real en un lugar nuevo."))), /*#__PURE__*/React.createElement("section", {
    className: "cj-pass__sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-pass__sech"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "over"
  }, "Visitados"), /*#__PURE__*/React.createElement("span", {
    className: "cj-pass__count"
  }, visited.length)), /*#__PURE__*/React.createElement("div", {
    className: "cj-stamps"
  }, visited.map(c => /*#__PURE__*/React.createElement("button", {
    className: "cj-stamp",
    key: c.id,
    onClick: () => onOpenRestaurant && onOpenRestaurant(c.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "cj-stamp__seal"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "check",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    className: "cj-stamp__name"
  }, c.name), /*#__PURE__*/React.createElement("span", {
    className: "cj-stamp__meta"
  }, c.neighborhood, " \xB7 ", fmt(c.visited)))))), /*#__PURE__*/React.createElement("section", {
    className: "cj-pass__sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-pass__sech"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "over"
  }, "Por visitar"), /*#__PURE__*/React.createElement("span", {
    className: "cj-pass__count"
  }, pending.length)), barrios.map(b => /*#__PURE__*/React.createElement("div", {
    className: "cj-barrio",
    key: b
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-barrio__h"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "map-pin",
    size: 14
  }), " ", b, /*#__PURE__*/React.createElement("span", {
    className: "cj-barrio__n"
  }, byBarrio[b].length)), /*#__PURE__*/React.createElement("div", {
    className: "cj-barrio__list"
  }, byBarrio[b].map(c => /*#__PURE__*/React.createElement("button", {
    className: "cj-todo",
    key: c.id,
    onClick: () => onOpenRestaurant && onOpenRestaurant(c.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "cj-todo__dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "cj-todo__name"
  }, c.name), c.isNew && /*#__PURE__*/React.createElement("span", {
    className: "cj-todo__new"
  }, "Nuevo"), /*#__PURE__*/React.createElement(window.Icon, {
    name: "chevron-right",
    size: 16
  }))))))), /*#__PURE__*/React.createElement("div", {
    className: "cj-pass__cta"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "brandGhost",
    size: "lg",
    block: true,
    iconLeft: /*#__PURE__*/React.createElement(window.Icon, {
      name: "qr-code",
      size: 18
    }),
    onClick: onCheckIn
  }, "Hacer check-in en un lugar"), /*#__PURE__*/React.createElement("p", {
    className: "cj-pass__note"
  }, "Sin rachas ni competencia. Tu pasaporte es tuyo y va a tu ritmo."))));
}
const CJ_PASS_CSS = `
.cj-pass { display: flex; flex-direction: column; background: var(--paper); }
.cj-pass__head { position: relative; z-index: 10; flex-shrink: 0; padding: 44px 8px 0;
  height: 92px; display: flex; align-items: center; justify-content: space-between;
  background: rgba(252,251,248,.9); backdrop-filter: blur(12px); border-bottom: 1px solid var(--line-soft); }
.cj-pass__htitle { font-family: var(--font-sans); font-weight: 600; font-size: 17px; color: var(--ink-900); }
.cj-pass__scroll { flex: 1; overflow-y: auto; padding: 18px 18px calc(var(--tabbar-h) + 20px); scrollbar-width: none; }
.cj-pass__scroll::-webkit-scrollbar { display: none; }

.cj-pass__hero { display: flex; gap: 16px; align-items: center; padding: 6px 2px 20px; }
.cj-pass__ring { --p: 25; width: 92px; height: 92px; border-radius: 50%; flex-shrink: 0;
  background: conic-gradient(var(--caju-500) calc(var(--p) * 1%), var(--paper-sunk) 0);
  display: grid; place-items: center; }
.cj-pass__ringin { width: 74px; height: 74px; border-radius: 50%; background: var(--surface);
  box-shadow: var(--shadow-sm); display: flex; flex-direction: column; align-items: center; justify-content: center; }
.cj-pass__ringin b { font-family: var(--font-mono); font-size: 26px; color: var(--ink-900); line-height: 1; }
.cj-pass__ringin span { font-size: 11px; color: var(--ink-400); margin-top: 2px; }
.cj-pass__lead { font-family: var(--font-serif); font-size: 21px; line-height: 1.22; color: var(--ink-900); letter-spacing: -0.01em; }
.cj-pass__sub { font-size: 13px; color: var(--ink-500); line-height: 1.5; margin-top: 6px; }

.cj-pass__sec { padding: 18px 0; border-top: 1px solid var(--line-soft); }
.cj-pass__sech { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
.cj-pass__count { font-family: var(--font-mono); font-size: 12px; color: var(--ink-400); }

.cj-stamps { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.cj-stamp { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; padding: 14px;
  border-radius: var(--r-lg); border: 1px solid var(--leaf-100); background: var(--leaf-050); cursor: pointer;
  text-align: left; transition: transform var(--motion-press); }
.cj-stamp:active { transform: scale(.98); }
.cj-stamp__seal { width: 30px; height: 30px; border-radius: 50%; background: var(--leaf-500); color: #fff;
  display: grid; place-items: center; margin-bottom: 6px; }
.cj-stamp__name { font-size: 15px; font-weight: 600; color: var(--ink-900); }
.cj-stamp__meta { font-size: 12px; color: var(--ink-500); }

.cj-barrio { margin-bottom: 14px; }
.cj-barrio__h { display: flex; align-items: center; gap: 6px; font-family: var(--font-sans);
  font-size: 13px; font-weight: 600; color: var(--ink-700); margin-bottom: 6px; }
.cj-barrio__h i { color: var(--ink-400); }
.cj-barrio__n { font-family: var(--font-mono); font-size: 11px; color: var(--ink-400); margin-left: 2px; }
.cj-barrio__list { display: flex; flex-direction: column; }
.cj-todo { display: flex; align-items: center; gap: 11px; padding: 11px 4px; cursor: pointer;
  border: 0; background: none; border-bottom: 1px solid var(--line-soft); text-align: left; width: 100%; }
.cj-todo:last-child { border-bottom: 0; }
.cj-todo__dot { width: 9px; height: 9px; border-radius: 50%; border: 2px dashed var(--line-strong); flex-shrink: 0; }
.cj-todo__name { flex: 1; font-size: 15px; color: var(--ink-800); font-family: var(--font-sans); }
.cj-todo__new { font-family: var(--font-sans); font-size: 11px; font-weight: 600; color: var(--amber-600);
  background: var(--amber-100); padding: 2px 8px; border-radius: var(--r-full); }
.cj-todo i { color: var(--ink-300); }

.cj-pass__cta { padding: 20px 0 8px; border-top: 1px solid var(--line-soft); }
.cj-pass__note { text-align: center; font-size: 12px; color: var(--ink-400); margin-top: 12px; line-height: 1.5; }
`;
Object.assign(window, {
  Passport,
  CJ_PASS_CSS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pwa/Passport.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pwa/Profile.jsx
try { (() => {
/* Screen 6 — Profile / Memory. How the Brain understands you.
   Not a social profile: gastronomic DNA, points, saved, feedback. */

function Profile({
  saved,
  onOpenRestaurant,
  onFeedback,
  onCapture,
  onPassport
}) {
  const NS = window.CajuEatDesignSystem_dbeea0;
  const {
    CajuPoints,
    Badge,
    Chip,
    RestaurantCard,
    Button
  } = NS;
  const D = window.CAJU_DATA;
  const savedList = D.restaurants.filter(r => saved[r.id]);
  const [editing, setEditing] = React.useState(false);
  const [dna, setDna] = React.useState(['Sushi tradicional', 'Barras de chef', 'Pescado', 'Café de especialidad', 'Poco ruido', 'Palermo · Chacarita']);
  return /*#__PURE__*/React.createElement("div", {
    className: "cj-screen cj-prof"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-prof-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-prof-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-prof-av"
  }, D.user.initials), /*#__PURE__*/React.createElement("h1", null, D.user.name), /*#__PURE__*/React.createElement(CajuPoints, {
    value: D.user.points,
    size: "lg",
    unit: "Caju Points"
  })), /*#__PURE__*/React.createElement("button", {
    className: "cj-prof-passport",
    onClick: onPassport
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-prof-passport__ring"
  }, /*#__PURE__*/React.createElement("b", null, D.cafes.filter(c => c.visited).length), /*#__PURE__*/React.createElement("span", null, "/", D.cafes.length)), /*#__PURE__*/React.createElement("div", {
    className: "cj-prof-passport__t"
  }, /*#__PURE__*/React.createElement("b", null, "Mi Pasaporte de Caf\xE9s"), /*#__PURE__*/React.createElement("span", null, "Vas conociendo la ciudad, caf\xE9 por caf\xE9.")), /*#__PURE__*/React.createElement("div", {
    className: "cj-prof-passport__stamps"
  }, D.cafes.filter(c => c.visited).slice(0, 3).map(c => /*#__PURE__*/React.createElement("span", {
    className: "cj-prof-passport__seal",
    key: c.id
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "check",
    size: 12
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "cj-prof-nudge",
    onClick: onFeedback
  }, /*#__PURE__*/React.createElement(NS.BrainMark, {
    size: 34,
    radius: 11
  }), /*#__PURE__*/React.createElement("div", {
    className: "cj-prof-nudge__t"
  }, /*#__PURE__*/React.createElement("b", null, "\xBFC\xF3mo estuvo Osaka?"), /*#__PURE__*/React.createElement("span", null, "Contame en 20s y mejor\xE1s tus pr\xF3ximas recomendaciones.")), /*#__PURE__*/React.createElement(window.Icon, {
    name: "chevron-right",
    size: 20
  })), /*#__PURE__*/React.createElement("section", {
    className: "cj-prof-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-prof-sech"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "over"
  }, "Tu ADN gastron\xF3mico"), /*#__PURE__*/React.createElement("button", {
    className: "cj-prof-edit",
    onClick: () => setEditing(e => !e)
  }, editing ? 'Listo' : 'Editar')), /*#__PURE__*/React.createElement("p", {
    className: "cj-prof-lead"
  }, "As\xED te entiende el Brain hoy. Edit\xE1 lo que no cuadre."), /*#__PURE__*/React.createElement("div", {
    className: "cj-dna"
  }, dna.map(d => /*#__PURE__*/React.createElement(Chip, {
    key: d,
    as: editing ? 'button' : 'span',
    icon: editing ? /*#__PURE__*/React.createElement(window.Icon, {
      name: "x",
      size: 13
    }) : null,
    onClick: editing ? () => setDna(list => list.filter(x => x !== d)) : undefined
  }, d)), editing && /*#__PURE__*/React.createElement(Chip, {
    as: "button",
    brand: true,
    selected: true,
    icon: /*#__PURE__*/React.createElement(window.Icon, {
      name: "plus",
      size: 13
    })
  }, "Agregar"))), /*#__PURE__*/React.createElement("section", {
    className: "cj-prof-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-prof-sech"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "over"
  }, "Guardados"), /*#__PURE__*/React.createElement("span", {
    className: "cj-prof-count"
  }, savedList.length)), /*#__PURE__*/React.createElement("div", {
    className: "cj-prof-saved"
  }, savedList.length ? savedList.map(r => /*#__PURE__*/React.createElement(RestaurantCard, {
    key: r.id,
    compact: true,
    name: r.name,
    cuisine: r.cuisine,
    neighborhood: r.neighborhood,
    price: r.price,
    tags: r.tags,
    trust: r.trust,
    onClick: () => onOpenRestaurant(r.id)
  })) : /*#__PURE__*/React.createElement("p", {
    className: "cj-empty"
  }, "Todav\xEDa no guardaste lugares. Toc\xE1 el marcador en cualquier ficha."))), /*#__PURE__*/React.createElement("section", {
    className: "cj-prof-sec"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "over"
  }, "Tus aportes"), /*#__PURE__*/React.createElement("div", {
    className: "cj-timeline"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-tl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cj-tl__dot"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Confirmaste horarios de Anafe"), /*#__PURE__*/React.createElement("span", null, "hace 2 d\xEDas \xB7 +15"))), /*#__PURE__*/React.createElement("div", {
    className: "cj-tl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cj-tl__dot"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Subiste una foto del omakase"), /*#__PURE__*/React.createElement("span", null, "hace 1 semana \xB7 +20"))), /*#__PURE__*/React.createElement("div", {
    className: "cj-tl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cj-tl__dot"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Respondiste un quiz de ambiente"), /*#__PURE__*/React.createElement("span", null, "hace 2 semanas \xB7 +10")))), /*#__PURE__*/React.createElement(Button, {
    variant: "brandGhost",
    size: "md",
    block: true,
    iconLeft: /*#__PURE__*/React.createElement(window.Icon, {
      name: "plus",
      size: 18
    }),
    onClick: onCapture
  }, "Aportar conocimiento"))));
}
const CJ_PROF_CSS = `
.cj-prof { background: var(--paper); }
.cj-prof-scroll { height: 100%; overflow-y: auto; padding: 56px 20px calc(var(--tabbar-h) + 20px); scrollbar-width: none; }
.cj-prof-scroll::-webkit-scrollbar { display: none; }
.cj-prof-head { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 12px 0 22px; }
.cj-prof-av { width: 76px; height: 76px; border-radius: 50%; background: var(--ink-800); color: #fff;
  display: grid; place-items: center; font-family: var(--font-mono); font-size: 28px; box-shadow: var(--shadow-md); }
.cj-prof-head h1 { font-size: 24px; font-weight: 600; }
.cj-prof-nudge { display: flex; align-items: center; gap: 12px; padding: 14px; margin-bottom: 8px; cursor: pointer;
  background: var(--caju-050); border: 1px solid var(--caju-100); border-radius: var(--r-lg); }
.cj-prof-nudge__t { flex: 1; display: flex; flex-direction: column; }
.cj-prof-nudge__t b { font-size: 15px; color: var(--ink-900); }
.cj-prof-nudge__t span { font-size: 13px; color: var(--ink-500); }
.cj-prof-nudge i { color: var(--caju-400); }
.cj-prof-passport { width: 100%; display: flex; align-items: center; gap: 13px; padding: 15px; margin-bottom: 8px;
  cursor: pointer; border: 0; text-align: left; border-radius: var(--r-lg);
  background: var(--ink-900); color: #fff; position: relative; overflow: hidden; }
.cj-prof-passport::before { content: ''; position: absolute; right: -24px; bottom: -30px; width: 110px; height: 110px;
  border-radius: 50%; background: radial-gradient(circle, rgba(248,122,69,.34), transparent 70%); }
.cj-prof-passport__ring { width: 46px; height: 46px; border-radius: 50%; flex-shrink: 0;
  background: conic-gradient(var(--caju-500) 33%, rgba(255,255,255,.14) 0);
  display: grid; place-items: center; }
.cj-prof-passport__ring b { font-family: var(--font-mono); font-size: 15px; line-height: 1; }
.cj-prof-passport__ring span { display: none; }
.cj-prof-passport__t { flex: 1; display: flex; flex-direction: column; gap: 2px; z-index: 1; }
.cj-prof-passport__t b { font-size: 15px; font-weight: 600; }
.cj-prof-passport__t span { font-size: 12.5px; color: rgba(255,255,255,.65); }
.cj-prof-passport__stamps { display: flex; gap: -4px; z-index: 1; }
.cj-prof-passport__seal { width: 24px; height: 24px; border-radius: 50%; background: var(--leaf-500); color: #fff;
  display: grid; place-items: center; margin-left: -6px; border: 2px solid var(--ink-900); }
.cj-prof-sec { padding: 20px 0; border-top: 1px solid var(--line-soft); }
.cj-prof-lead { font-size: 13px; color: var(--ink-500); margin: 8px 0 12px; }
.cj-dna { display: flex; flex-wrap: wrap; gap: 8px; }
.cj-prof-sech { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
.cj-prof-edit { border: 0; background: transparent; color: var(--caju-600); font-family: var(--font-sans);
  font-size: 13px; font-weight: 600; cursor: pointer; padding: 4px 2px; }
.cj-prof-count { font-family: var(--font-mono); font-size: 12px; color: var(--ink-400); }
.cj-prof-saved { display: flex; flex-direction: column; gap: 10px; }
.cj-empty { font-size: 14px; color: var(--ink-400); line-height: 1.5; }
.cj-timeline { display: flex; flex-direction: column; gap: 4px; margin: 6px 0 16px; }
.cj-tl { display: flex; gap: 12px; padding: 8px 0; }
.cj-tl__dot { width: 9px; height: 9px; border-radius: 50%; background: var(--caju-400); margin-top: 5px; flex-shrink: 0;
  box-shadow: 0 0 0 4px var(--caju-050); }
.cj-tl div { display: flex; flex-direction: column; }
.cj-tl b { font-size: 14px; color: var(--ink-800); font-weight: 500; }
.cj-tl span { font-size: 12px; color: var(--ink-400); font-family: var(--font-mono); }
`;
Object.assign(window, {
  Profile,
  CJ_PROF_CSS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pwa/Profile.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pwa/Restaurant.jsx
try { (() => {
/* Screen 3 — Restaurant Experience (ficha). Editorial, not a
   directory. Answers "¿vale la pena ir?" before the first scroll. */

function Restaurant({
  id,
  onBack,
  onOpenChat,
  onOpenRestaurant,
  onCheckIn,
  onRedeem,
  saved,
  toggleSave
}) {
  const NS = window.CajuEatDesignSystem_dbeea0;
  const {
    TrustMeter,
    SourceChip,
    Badge,
    Button,
    IconButton,
    Chip,
    RestaurantCard
  } = NS;
  const D = window.CAJU_DATA;
  const r = D.restaurants.find(x => x.id === id) || D.restaurants[0];
  const isSaved = !!saved[r.id];
  return /*#__PURE__*/React.createElement("div", {
    className: "cj-screen cj-rest-scr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-rest-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-hero__img"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-hero__ph"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "utensils-crossed",
    size: 40
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cj-hero__grad"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cj-hero__top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cj-round",
    onClick: onBack,
    "aria-label": "Volver"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "chevron-left",
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    className: "cj-hero__top-r"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cj-round",
    "aria-label": "Compartir"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "share",
    size: 18
  })), /*#__PURE__*/React.createElement("button", {
    className: `cj-round ${isSaved ? 'on' : ''}`,
    onClick: () => toggleSave(r.id),
    "aria-label": "Guardar"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "bookmark",
    size: 18
  })))), /*#__PURE__*/React.createElement("div", {
    className: "cj-hero__info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-hero__meta"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "brand"
  }, "Recomendado"), /*#__PURE__*/React.createElement("span", null, r.cuisine, " \xB7 ", r.neighborhood)), /*#__PURE__*/React.createElement("h1", {
    className: "cj-hero__name"
  }, r.name), /*#__PURE__*/React.createElement("div", {
    className: "cj-hero__row"
  }, /*#__PURE__*/React.createElement(TrustMeter, {
    level: r.trust,
    pill: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "cj-hero__price"
  }, r.price)))), /*#__PURE__*/React.createElement("div", {
    className: "cj-rest-body"
  }, /*#__PURE__*/React.createElement("section", {
    className: "cj-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-brainlead"
  }, /*#__PURE__*/React.createElement(NS.BrainMark, {
    size: 28,
    radius: 9
  }), /*#__PURE__*/React.createElement("p", {
    className: "cj-brainlead__txt"
  }, r.summary))), /*#__PURE__*/React.createElement("section", {
    className: "cj-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-facts"
  }, r.quickFacts.map((f, i) => /*#__PURE__*/React.createElement("div", {
    className: "cj-fact",
    key: i
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: f.icon,
    size: 17
  }), " ", f.label)))), /*#__PURE__*/React.createElement("section", {
    className: "cj-sec"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "over"
  }, "As\xED es este lugar"), /*#__PURE__*/React.createElement("div", {
    className: "cj-personality"
  }, r.personality.map((p, i) => /*#__PURE__*/React.createElement(Chip, {
    key: i,
    as: "span"
  }, p)))), /*#__PURE__*/React.createElement("section", {
    className: "cj-sec"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "over"
  }, "Qu\xE9 pedir"), /*#__PURE__*/React.createElement("div", {
    className: "cj-order"
  }, r.order.map((o, i) => /*#__PURE__*/React.createElement("div", {
    className: "cj-order__row",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "cj-order__when"
  }, o.when), /*#__PURE__*/React.createElement("span", {
    className: "cj-order__dish"
  }, o.dish))))), /*#__PURE__*/React.createElement("section", {
    className: "cj-sec"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "over"
  }, "Brain Tips"), /*#__PURE__*/React.createElement("div", {
    className: "cj-tips"
  }, r.tips.map((t, i) => /*#__PURE__*/React.createElement("div", {
    className: "cj-tip",
    key: i
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "check",
    size: 15
  }), " ", t)))), /*#__PURE__*/React.createElement("section", {
    className: "cj-sec"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "over"
  }, "\xBFPor qu\xE9 te lo recomend\xE9?"), /*#__PURE__*/React.createElement("p", {
    className: "cj-why"
  }, "Coincide con tu gusto por el pescado bien tratado, y lo respaldan fuentes en las que confi\xE1s:"), /*#__PURE__*/React.createElement("div", {
    className: "cj-sources"
  }, r.sources.map((s, i) => /*#__PURE__*/React.createElement(SourceChip, {
    key: i,
    name: s.name,
    kind: s.kind,
    weight: s.weight
  })))), /*#__PURE__*/React.createElement("section", {
    className: "cj-sec cj-idealgrid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-ideal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-ideal__h cj-ideal__h--yes"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "thumbs-up",
    size: 15
  }), " Ideal para"), r.idealFor.map((x, i) => /*#__PURE__*/React.createElement("div", {
    className: "cj-ideal__row",
    key: i
  }, x))), /*#__PURE__*/React.createElement("div", {
    className: "cj-ideal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-ideal__h cj-ideal__h--no"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "circle-minus",
    size: 15
  }), " No ideal para"), r.notFor.map((x, i) => /*#__PURE__*/React.createElement("div", {
    className: "cj-ideal__row",
    key: i
  }, x)))), /*#__PURE__*/React.createElement("section", {
    className: "cj-sec"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "over"
  }, "Cerca de ac\xE1"), /*#__PURE__*/React.createElement("p", {
    className: "cj-why"
  }, "Si ven\xEDs hasta ac\xE1, a pocas cuadras ten\xE9s:"), /*#__PURE__*/React.createElement("div", {
    className: "cj-nearby"
  }, D.restaurants.filter(x => x.id !== r.id).slice(0, 2).map(n => /*#__PURE__*/React.createElement(RestaurantCard, {
    key: n.id,
    compact: true,
    name: n.name,
    cuisine: n.cuisine,
    neighborhood: n.neighborhood,
    price: n.price,
    tags: n.tags,
    trust: n.trust,
    onClick: () => onOpenRestaurant && onOpenRestaurant(n.id)
  })))), /*#__PURE__*/React.createElement("section", {
    className: "cj-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-ig__h"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "over"
  }, "En Instagram"), /*#__PURE__*/React.createElement("a", {
    className: "cj-ig__handle",
    href: "#",
    onClick: e => e.preventDefault()
  }, "@", r.id, ".bsas ", /*#__PURE__*/React.createElement(window.Icon, {
    name: "external-link",
    size: 13
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cj-ig__strip"
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    className: `cj-ig__cell cj-ig__cell--${i % 4}`,
    key: i
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: ['image', 'utensils', 'coffee', 'image'][i],
    size: 20
  }), i === 0 && /*#__PURE__*/React.createElement("span", {
    className: "cj-ig__reel"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "play",
    size: 11
  }))))), /*#__PURE__*/React.createElement("p", {
    className: "cj-ig__note"
  }, "El Brain ley\xF3 sus \xFAltimos posteos para mantener el men\xFA y las novedades al d\xEDa.")), /*#__PURE__*/React.createElement("section", {
    className: "cj-sec"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cj-checkin",
    onClick: () => onCheckIn && onCheckIn(r.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "cj-checkin__ic"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "qr-code",
    size: 22
  })), /*#__PURE__*/React.createElement("span", {
    className: "cj-checkin__tx"
  }, /*#__PURE__*/React.createElement("b", null, "Hac\xE9 check-in ac\xE1"), /*#__PURE__*/React.createElement("span", null, "Escane\xE1 el QR del mostrador para sumar la visita y poder dejar tu rese\xF1a.")), /*#__PURE__*/React.createElement(window.Icon, {
    name: "chevron-right",
    size: 18
  }))), /*#__PURE__*/React.createElement("section", {
    className: "cj-sec"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cj-ask",
    onClick: () => onOpenChat(`¿Vale la pena ${r.name} para una cita?`)
  }, /*#__PURE__*/React.createElement(NS.BrainMark, {
    size: 26,
    radius: 8
  }), /*#__PURE__*/React.createElement("span", null, "Preguntale a Caju sobre este lugar"), /*#__PURE__*/React.createElement(window.Icon, {
    name: "arrow-right",
    size: 18
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "cj-rest-cta"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    iconLeft: /*#__PURE__*/React.createElement(window.Icon, {
      name: "wallet",
      size: 18
    }),
    "aria-label": "Usar puntos",
    onClick: () => onRedeem && onRedeem(r.id)
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    iconLeft: /*#__PURE__*/React.createElement(window.Icon, {
      name: "navigation",
      size: 18
    })
  }, "C\xF3mo llegar")));
}
const CJ_REST_CSS = `
.cj-rest-scr { display: flex; flex-direction: column; background: var(--paper); }
.cj-rest-scroll { flex: 1; overflow-y: auto; scrollbar-width: none; }
.cj-rest-scroll::-webkit-scrollbar { display: none; }
.cj-hero { position: relative; height: 380px; }
.cj-hero__img { position: absolute; inset: 0; background:
  radial-gradient(120% 100% at 20% 0%, var(--caju-200), transparent 55%),
  radial-gradient(120% 120% at 100% 100%, var(--amber-100), var(--caju-100)); }
.cj-hero__ph { position: absolute; inset: 0; display: grid; place-items: center; color: var(--caju-300); }
.cj-hero__grad { position: absolute; inset: 0; background:
  linear-gradient(to top, rgba(24,20,16,.72) 0%, rgba(24,20,16,.1) 42%, rgba(24,20,16,.15) 100%); }
.cj-hero__top { position: absolute; top: 50px; left: 12px; right: 12px; display: flex; justify-content: space-between; }
.cj-hero__top-r { display: flex; gap: 8px; }
.cj-round { width: 40px; height: 40px; border-radius: 50%; border: 0; cursor: pointer;
  background: rgba(255,255,255,.9); backdrop-filter: blur(8px); color: var(--ink-800);
  display: grid; place-items: center; box-shadow: var(--shadow-sm); }
.cj-round.on { background: var(--caju-500); color: #fff; }
.cj-hero__info { position: absolute; left: 20px; right: 20px; bottom: 20px; color: #fff; }
.cj-hero__meta { display: flex; align-items: center; gap: 10px; font-size: 13px; font-family: var(--font-sans);
  color: rgba(255,255,255,.92); margin-bottom: 8px; }
.cj-hero__name { font-family: var(--font-serif); font-size: 46px; line-height: 1; color: #fff;
  letter-spacing: -0.01em; font-weight: 400; }
.cj-hero__row { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
.cj-hero__price { font-family: var(--font-mono); font-size: 13px; color: rgba(255,255,255,.9); }

.cj-rest-body { position: relative; margin-top: -18px; background: var(--paper);
  border-radius: 22px 22px 0 0; padding: 8px 20px 24px; }
.cj-sec { padding: 16px 0; border-bottom: 1px solid var(--line-soft); }
.cj-sec:last-child { border-bottom: 0; }
.cj-brainlead { display: flex; gap: 12px; align-items: flex-start; }
.cj-brainlead__txt { font-family: var(--font-serif); font-size: 21px; line-height: 1.32; color: var(--ink-900);
  letter-spacing: -0.005em; }
.cj-facts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; }
.cj-fact { display: flex; align-items: center; gap: 9px; font-size: 14px; color: var(--ink-700); font-family: var(--font-sans); }
.cj-fact i { color: var(--caju-500); flex-shrink: 0; }
.cj-order { margin-top: 12px; display: flex; flex-direction: column; gap: 12px; }
.cj-order__row { display: flex; flex-direction: column; gap: 2px; }
.cj-order__when { font-family: var(--font-mono); font-size: 11px; letter-spacing: .03em; text-transform: uppercase; color: var(--caju-600); }
.cj-order__dish { font-size: 15px; color: var(--ink-800); font-family: var(--font-sans); }
.cj-tips { margin-top: 12px; display: flex; flex-direction: column; gap: 9px; }
.cj-tip { display: flex; align-items: center; gap: 9px; font-size: 14px; color: var(--ink-700); }
.cj-tip i { color: var(--leaf-600); flex-shrink: 0; }
.cj-personality { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.cj-nearby { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
.cj-why { margin-top: 10px; margin-bottom: 12px; font-size: 14px; color: var(--ink-600); line-height: 1.5; }
.cj-sources { display: flex; flex-wrap: wrap; gap: 8px; }
.cj-idealgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.cj-ideal__h { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; margin-bottom: 10px; }
.cj-ideal__h--yes { color: var(--leaf-700); }
.cj-ideal__h--no { color: var(--ink-400); }
.cj-ideal__row { font-size: 14px; color: var(--ink-700); padding: 5px 0; border-top: 1px solid var(--line-soft); }
.cj-ask { width: 100%; display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer;
  background: var(--caju-050); border: 1px solid var(--caju-100); border-radius: var(--r-lg);
  font-family: var(--font-sans); font-size: 15px; font-weight: 500; color: var(--caju-700); }
.cj-ask span { flex: 1; text-align: left; }
.cj-ig__h { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.cj-ig__handle { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 600;
  color: var(--caju-600); font-family: var(--font-sans); }
.cj-ig__strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
.cj-ig__cell { position: relative; aspect-ratio: 1; border-radius: var(--r-sm); display: grid; place-items: center;
  color: rgba(255,255,255,.85); }
.cj-ig__cell--0 { background: linear-gradient(140deg, var(--caju-300), var(--caju-500)); }
.cj-ig__cell--1 { background: linear-gradient(140deg, var(--amber-500), var(--caju-400)); }
.cj-ig__cell--2 { background: linear-gradient(140deg, #B98A5E, #8A6248); }
.cj-ig__cell--3 { background: linear-gradient(140deg, var(--caju-400), var(--amber-500)); }
.cj-ig__reel { position: absolute; top: 5px; right: 5px; width: 18px; height: 18px; border-radius: 50%;
  background: rgba(0,0,0,.35); display: grid; place-items: center; }
.cj-ig__note { font-size: 12px; color: var(--ink-400); line-height: 1.5; margin-top: 10px; }
.cj-checkin { width: 100%; display: flex; align-items: center; gap: 13px; padding: 15px 16px; cursor: pointer;
  background: var(--surface); border: 1px solid var(--line-strong); border-radius: var(--r-lg); text-align: left; }
.cj-checkin:active { transform: scale(.99); }
.cj-checkin__ic { width: 44px; height: 44px; border-radius: 13px; background: var(--ink-900); color: #fff;
  display: grid; place-items: center; flex-shrink: 0; }
.cj-checkin__tx { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.cj-checkin__tx b { font-size: 15px; color: var(--ink-900); font-weight: 600; }
.cj-checkin__tx span { font-size: 12.5px; color: var(--ink-500); line-height: 1.4; }
.cj-checkin i { color: var(--ink-300); }
.cj-rest-cta { flex-shrink: 0; display: flex; gap: 10px; padding: 12px 16px calc(12px + var(--safe-bottom));
  background: rgba(252,251,248,.94); backdrop-filter: blur(12px); border-top: 1px solid var(--line-soft); }
`;
Object.assign(window, {
  Restaurant,
  CJ_REST_CSS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pwa/Restaurant.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pwa/Shell.jsx
try { (() => {
/* App shell — phone frame, navigation state, tab bar, overlays.
   Re-runs lucide.createIcons() after every render so icons paint. */

function TabBar({
  tab,
  onTab,
  onCapture
}) {
  const item = (id, icon, label) => /*#__PURE__*/React.createElement("button", {
    className: `cj-tab ${tab === id ? 'on' : ''}`,
    onClick: () => onTab(id)
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: icon,
    size: 22,
    stroke: tab === id ? 2.3 : 1.8
  }), /*#__PURE__*/React.createElement("span", null, label));
  return /*#__PURE__*/React.createElement("div", {
    className: "cj-tabbar"
  }, item('map', 'map', 'Mapa'), item('convo', 'sparkles', 'Explorar'), /*#__PURE__*/React.createElement("button", {
    className: "cj-tab-fab",
    onClick: onCapture,
    "aria-label": "Aportar conocimiento"
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "plus",
    size: 26,
    stroke: 2.2
  })), item('saved', 'bookmark', 'Guardados'), item('profile', 'user', 'Perfil'));
}
function App() {
  const [tab, setTab] = React.useState('map');
  const [route, setRoute] = React.useState({
    name: 'map'
  });
  const [overlay, setOverlay] = React.useState(null); // 'capture' | 'feedback'
  const [scan, setScan] = React.useState(null); // { mode, restaurantId } | null
  const [query, setQuery] = React.useState('');
  const [saved, setSaved] = React.useState({
    osaka: true,
    cuervo: true
  });
  const openCheckIn = (restaurantId, mode = 'checkin') => setScan({
    mode,
    restaurantId
  });
  const toggleSave = id => setSaved(s => ({
    ...s,
    [id]: !s[id]
  }));

  // keep lucide icons rendered after every React update
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const goMap = () => {
    setTab('map');
    setRoute({
      name: 'map'
    });
  };
  const openRestaurant = id => setRoute({
    name: 'restaurant',
    id
  });
  const openChat = q => {
    setQuery(q || '');
    setTab('convo');
    setRoute({
      name: 'convo'
    });
  };
  const onTab = t => {
    setTab(t);
    if (t === 'map') setRoute({
      name: 'map'
    });else if (t === 'convo') {
      setQuery('');
      setRoute({
        name: 'convo'
      });
    } else if (t === 'saved' || t === 'profile') setRoute({
      name: 'profile'
    });
  };
  let screen;
  if (route.name === 'map') screen = /*#__PURE__*/React.createElement(window.LivingMap, {
    onOpenRestaurant: openRestaurant,
    onOpenChat: openChat,
    onOpenCapture: () => setOverlay('capture'),
    saved: saved,
    toggleSave: toggleSave
  });else if (route.name === 'convo') screen = /*#__PURE__*/React.createElement(window.Conversation, {
    initialQuery: query,
    onBack: goMap,
    onOpenRestaurant: openRestaurant
  });else if (route.name === 'restaurant') screen = /*#__PURE__*/React.createElement(window.Restaurant, {
    id: route.id,
    onBack: goMap,
    onOpenChat: openChat,
    onOpenRestaurant: openRestaurant,
    onCheckIn: id => openCheckIn(id, 'checkin'),
    onRedeem: id => openCheckIn(id, 'redeem'),
    saved: saved,
    toggleSave: toggleSave
  });else if (route.name === 'profile') screen = /*#__PURE__*/React.createElement(window.Profile, {
    saved: saved,
    onOpenRestaurant: openRestaurant,
    onFeedback: () => setOverlay('feedback'),
    onCapture: () => setOverlay('capture'),
    onPassport: () => setRoute({
      name: 'passport'
    })
  });else if (route.name === 'passport') screen = /*#__PURE__*/React.createElement(window.Passport, {
    onBack: () => {
      setTab('profile');
      setRoute({
        name: 'profile'
      });
    },
    onOpenRestaurant: openRestaurant,
    onCheckIn: () => openCheckIn('osaka', 'checkin')
  });
  const darkStatus = route.name === 'restaurant';
  const hideTabs = route.name === 'convo' || route.name === 'restaurant' || route.name === 'passport';
  return /*#__PURE__*/React.createElement("div", {
    className: "cj-desk"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-phone"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cj-notch"
  }), /*#__PURE__*/React.createElement(window.StatusBar, {
    dark: darkStatus
  }), /*#__PURE__*/React.createElement("div", {
    className: "cj-viewport"
  }, screen, !hideTabs && /*#__PURE__*/React.createElement(TabBar, {
    tab: tab,
    onTab: onTab,
    onCapture: () => setOverlay('capture')
  }), overlay === 'capture' && /*#__PURE__*/React.createElement(window.KnowledgeCapture, {
    onClose: () => setOverlay(null)
  }), overlay === 'feedback' && /*#__PURE__*/React.createElement(window.Feedback, {
    onClose: () => {
      setOverlay(null);
      goMap();
    }
  }), scan && /*#__PURE__*/React.createElement(window.CheckIn, {
    mode: scan.mode,
    restaurantId: scan.restaurantId,
    onClose: () => setScan(null),
    onDone: () => setScan(null)
  })), /*#__PURE__*/React.createElement("div", {
    className: "cj-homebar"
  })), /*#__PURE__*/React.createElement("p", {
    class: "cj-hint"
  }, "Prototipo interactivo \xB7 toc\xE1 pines, chips, el mapa y la barra de conversaci\xF3n"));
}
const CJ_SHELL_CSS = `
.cj-desk { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 18px; padding: 32px 16px; background:
  radial-gradient(120% 90% at 50% 0%, #F3EFE7, #E7E1D6); }
.cj-phone { position: relative; width: 390px; height: 844px; background: #000; border-radius: 52px;
  padding: 5px; box-shadow: 0 40px 90px -30px rgba(24,20,16,.5), 0 0 0 2px rgba(0,0,0,.85), inset 0 0 0 6px #1a1a1a; }
.cj-notch { position: absolute; top: 12px; left: 50%; transform: translateX(-50%); width: 120px; height: 30px;
  background: #000; border-radius: 18px; z-index: 50; }
.cj-viewport { position: relative; width: 100%; height: 100%; background: var(--paper);
  border-radius: 47px; overflow: hidden; }
.cj-homebar { position: absolute; bottom: 9px; left: 50%; transform: translateX(-50%); width: 134px; height: 5px;
  border-radius: 3px; background: rgba(0,0,0,.28); z-index: 50; pointer-events: none; }
.cj-screen { position: absolute; inset: 0; }

.cj-tabbar { position: absolute; left: 0; right: 0; bottom: 0; height: var(--tabbar-h); z-index: 30;
  display: flex; align-items: center; justify-content: space-around; padding: 0 8px calc(var(--safe-bottom));
  background: rgba(252,251,248,.92); backdrop-filter: saturate(1.3) blur(16px); border-top: 1px solid var(--line-soft); }
.cj-tab { display: flex; flex-direction: column; align-items: center; gap: 3px; border: 0; background: transparent;
  color: var(--ink-400); cursor: pointer; font-family: var(--font-sans); font-size: 10px; font-weight: 500;
  width: 60px; padding: 6px 0; transition: color var(--motion-control); }
.cj-tab.on { color: var(--caju-600); }
.cj-tab-fab { width: 52px; height: 52px; border-radius: 18px; border: 0; cursor: pointer; margin-top: -14px;
  background: var(--caju-500); color: #fff; display: grid; place-items: center;
  box-shadow: 0 10px 22px -8px rgba(219,67,26,.8); transition: transform var(--motion-press); }
.cj-tab-fab:active { transform: scale(.94); }
.cj-hint { font-size: 12.5px; color: var(--ink-400); font-family: var(--font-sans); }
@media (max-width: 430px) { .cj-phone { transform: scale(.92); } }
`;
Object.assign(window, {
  App,
  TabBar,
  CJ_SHELL_CSS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pwa/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pwa/data.js
try { (() => {
/* Sample data for the CajuEat PWA UI kit. Buenos Aires restaurants.
   Fictional copy in the Brain's voice — not real listings. */
window.CAJU_DATA = {
  user: {
    name: 'Lucas',
    points: 1240,
    initials: 'L'
  },
  restaurants: [{
    id: 'osaka',
    name: 'Osaka',
    cuisine: 'Nikkei',
    neighborhood: 'Palermo',
    price: '$$$',
    trust: 'high',
    type: 'recommended',
    why: 'Barra japonesa clásica, con foco total en el producto.',
    tags: ['En pareja', 'Reserva', '40 min'],
    personality: ['Elegante', 'Minimalista', 'Íntimo', 'Tradicional'],
    pos: {
      top: '22%',
      left: '16%'
    },
    summary: 'Una barra nikkei donde el foco está completamente puesto en el producto. Ideal para quienes buscan pescado impecable sin fusiones ruidosas.',
    quickFacts: [{
      icon: 'wallet',
      label: '$$$'
    }, {
      icon: 'heart',
      label: 'Ideal en pareja'
    }, {
      icon: 'armchair',
      label: 'Excelente barra'
    }, {
      icon: 'calendar-check',
      label: 'Reserva recomendada'
    }, {
      icon: 'clock',
      label: '40 min promedio'
    }, {
      icon: 'circle-check',
      label: 'Abierto ahora'
    }],
    order: [{
      when: 'Si vas por primera vez',
      dish: 'Pedí el omakase corto de la barra.'
    }, {
      when: 'Si te gusta el atún',
      dish: 'No te pierdas el tiradito de toro.'
    }, {
      when: 'Si buscás algo liviano',
      dish: 'Probá los niguiris de pesca del día.'
    }],
    tips: ['Sentate en la barra', 'No vayas sin reserva', 'El postre vale la pena'],
    idealFor: ['Primera cita', 'Ocasión especial', 'Solo en la barra'],
    notFor: ['Grupos grandes', 'Ir con chicos'],
    sources: [{
      name: '@buenospaladaires',
      kind: 'curator',
      weight: 'strong'
    }, {
      name: 'Tu visita',
      kind: 'visit',
      weight: 'strong'
    }, {
      name: '42 personas',
      kind: 'community',
      weight: 'medium'
    }]
  }, {
    id: 'anafe',
    name: 'Anafe',
    cuisine: 'Bodegón moderno',
    neighborhood: 'Chacarita',
    price: '$$',
    trust: 'mid',
    type: 'new',
    why: 'Cocina de estación en un salón chico y cálido. Cambia seguido.',
    tags: ['Grupos', 'Sin reserva', 'Ruidoso'],
    personality: ['Cálido', 'Animado', 'De barrio', 'Sin vueltas'],
    pos: {
      top: '54%',
      left: '40%'
    },
    summary: 'Un bodegón reinterpretado: pocos platos, muy de estación, en un salón cálido y algo ruidoso. Va bien para una salida relajada entre amigos.',
    quickFacts: [{
      icon: 'wallet',
      label: '$$'
    }, {
      icon: 'users',
      label: 'Bueno en grupo'
    }, {
      icon: 'volume-2',
      label: 'Ambiente animado'
    }, {
      icon: 'clock',
      label: 'Sin reserva'
    }],
    order: [{
      when: 'Para compartir',
      dish: 'Arrancá con las entradas del día.'
    }, {
      when: 'Si hay pesca',
      dish: 'Pedila, cambia todas las semanas.'
    }],
    tips: ['Andá temprano', 'Preguntá el fuera de carta'],
    idealFor: ['Amigos', 'Después del trabajo'],
    notFor: ['Charla tranquila', 'Reuniones de negocios'],
    sources: [{
      name: '@salt_argentina',
      kind: 'curator',
      weight: 'medium'
    }, {
      name: '18 personas',
      kind: 'community',
      weight: 'medium'
    }]
  }, {
    id: 'cuervo',
    name: 'Cuervo Café',
    cuisine: 'Café de especialidad',
    neighborhood: 'Villa Crespo',
    price: '$',
    trust: 'high',
    type: 'saved',
    why: 'De los mejores espresso del oeste. Tranquilo para trabajar de mañana.',
    tags: ['Para trabajar', 'Mañanas', 'Wifi'],
    personality: ['Tranquilo', 'Luminoso', 'Chico', 'De especialidad'],
    pos: {
      top: '70%',
      left: '20%'
    },
    summary: 'Café chico de especialidad, callado y luminoso. El mejor momento es antes del mediodía.',
    quickFacts: [{
      icon: 'wallet',
      label: '$'
    }, {
      icon: 'laptop',
      label: 'Bueno para trabajar'
    }, {
      icon: 'sun',
      label: 'Mejor de mañana'
    }],
    order: [{
      when: 'Si te gusta el café',
      dish: 'Pedí el filtrado del día.'
    }],
    tips: ['Andá temprano', 'Probá la medialuna'],
    idealFor: ['Trabajar solo', 'Café tranquilo'],
    notFor: ['Cena', 'Grupos'],
    sources: [{
      name: 'Tu visita',
      kind: 'visit',
      weight: 'strong'
    }, {
      name: '9 personas',
      kind: 'community',
      weight: 'weak'
    }]
  }],
  /* Wider café catalog for the Passport (SPEC-021) — grouped by barrio.
     visited: first real check-in date (SPEC-020) or null = por visitar.
     `isNew` flags a novelty pin (SPEC-024). */
  cafes: [{
    id: 'osaka',
    name: 'Osaka',
    neighborhood: 'Palermo',
    visited: '2026-06-12'
  }, {
    id: 'cuervo',
    name: 'Cuervo Café',
    neighborhood: 'Villa Crespo',
    visited: '2026-06-28'
  }, {
    id: 'anafe',
    name: 'Anafe',
    neighborhood: 'Chacarita',
    visited: null,
    isNew: true
  }, {
    id: 'lab',
    name: 'LAB Tostadores',
    neighborhood: 'Palermo',
    visited: '2026-05-30'
  }, {
    id: 'felix',
    name: 'Félix Felicis',
    neighborhood: 'Palermo',
    visited: null
  }, {
    id: 'birkin',
    name: 'Birkin',
    neighborhood: 'Palermo',
    visited: null
  }, {
    id: 'rondo',
    name: 'Rondó',
    neighborhood: 'Villa Crespo',
    visited: null,
    isNew: true
  }, {
    id: 'salvaje',
    name: 'Salvaje Bakery',
    neighborhood: 'Villa Crespo',
    visited: null
  }, {
    id: 'coco',
    name: 'Coco Espresso',
    neighborhood: 'Chacarita',
    visited: null
  }, {
    id: 'toro',
    name: 'Toro Café',
    neighborhood: 'Chacarita',
    visited: null
  }, {
    id: 'nucha',
    name: 'Nucha',
    neighborhood: 'Colegiales',
    visited: null
  }, {
    id: 'ninina',
    name: 'Ninina',
    neighborhood: 'Colegiales',
    visited: null,
    isNew: true
  }],
  events: [{
    id: 'feria',
    name: 'Feria gastronómica',
    when: 'sáb',
    pos: {
      top: '30%',
      left: '66%'
    }
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pwa/data.js", error: String((e && e.message) || e) }); }

// ui_kits/pwa/kit.jsx
try { (() => {
/* Shared helpers for the PWA UI kit. */

// Lucide icon. lucide.createIcons() is re-run by Shell after each render.
function Icon({
  name,
  size = 20,
  stroke = 2,
  className = '',
  style = {}
}) {
  return /*#__PURE__*/React.createElement("i", {
    "data-lucide": name,
    className: className,
    style: {
      width: size,
      height: size,
      display: 'inline-flex',
      strokeWidth: stroke,
      ...style
    }
  });
}

// iOS-style status bar for the phone frame.
function StatusBar({
  dark = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `cj-status ${dark ? 'cj-status--dark' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "cj-status__time"
  }, "9:41"), /*#__PURE__*/React.createElement("div", {
    className: "cj-status__right"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "signal",
    size: 16
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "wifi",
    size: 16
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "battery-full",
    size: 20
  })));
}
const CJ_KIT_CSS = `
.cj-status { position: absolute; top: 0; left: 0; right: 0; height: 44px; z-index: 40;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 22px 0 26px; color: var(--ink-900); pointer-events: none; }
.cj-status--dark { color: #fff; }
.cj-status__time { font-family: var(--font-sans); font-weight: 600; font-size: 15px; letter-spacing: .01em; }
.cj-status__right { display: flex; align-items: center; gap: 6px; }
`;
Object.assign(window, {
  Icon,
  StatusBar,
  CJ_KIT_CSS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pwa/kit.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BrainMark = __ds_scope.BrainMark;

__ds_ns.BrainCard = __ds_scope.BrainCard;

__ds_ns.ChatBubble = __ds_scope.ChatBubble;

__ds_ns.PromptBar = __ds_scope.PromptBar;

__ds_ns.SourceChip = __ds_scope.SourceChip;

__ds_ns.TrustMeter = __ds_scope.TrustMeter;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.BottomSheet = __ds_scope.BottomSheet;

__ds_ns.CajuPoints = __ds_scope.CajuPoints;

__ds_ns.MapPin = __ds_scope.MapPin;

__ds_ns.RestaurantCard = __ds_scope.RestaurantCard;

})();
