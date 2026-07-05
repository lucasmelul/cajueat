/* Shared helpers for the PWA UI kit. */

// Lucide icon. lucide.createIcons() is re-run by Shell after each render.
function Icon({ name, size = 20, stroke = 2, className = '', style = {} }) {
  return <i data-lucide={name} className={className}
            style={{ width: size, height: size, display: 'inline-flex', strokeWidth: stroke, ...style }} />;
}

// iOS-style status bar for the phone frame.
function StatusBar({ dark = false }) {
  return (
    <div className={`cj-status ${dark ? 'cj-status--dark' : ''}`}>
      <span className="cj-status__time">9:41</span>
      <div className="cj-status__right">
        <Icon name="signal" size={16} />
        <Icon name="wifi" size={16} />
        <Icon name="battery-full" size={20} />
      </div>
    </div>
  );
}

const CJ_KIT_CSS = `
.cj-status { position: absolute; top: 0; left: 0; right: 0; height: 44px; z-index: 40;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 22px 0 26px; color: var(--ink-900); pointer-events: none; }
.cj-status--dark { color: #fff; }
.cj-status__time { font-family: var(--font-sans); font-weight: 600; font-size: 15px; letter-spacing: .01em; }
.cj-status__right { display: flex; align-items: center; gap: 6px; }
`;

Object.assign(window, { Icon, StatusBar, CJ_KIT_CSS });
