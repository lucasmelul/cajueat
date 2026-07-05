/* Stylized, calm map backdrop for the Living Map. This is UI
   scaffolding — the real PWA renders a live map library. Kept
   abstract and muted (Apple-Maps-light character), never a
   dump of streets. */

function MapCanvas({ children, dim = false }) {
  return (
    <div className="cj-map">
      <div className="cj-map__base" />
      <div className="cj-map__water" />
      <div className="cj-map__park cj-map__park--a" />
      <div className="cj-map__park cj-map__park--b" />
      <svg className="cj-map__streets" viewBox="0 0 390 780" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g stroke="#fff" strokeWidth="7" fill="none" opacity="0.9" strokeLinecap="round">
          <path d="M-20 150 H420" /><path d="M-20 340 H420" /><path d="M-20 560 H420" />
          <path d="M70 -20 V800" /><path d="M210 -20 V800" /><path d="M320 -20 V800" />
        </g>
        <g stroke="#fff" strokeWidth="3" fill="none" opacity="0.75">
          <path d="M-20 250 H420" /><path d="M-20 450 H420" /><path d="M-20 660 H420" />
          <path d="M140 -20 V800" /><path d="M270 -20 V800" />
          <path d="M-20 30 L200 120 L420 60" />
        </g>
      </svg>
      {dim && <div className="cj-map__dim" />}
      {children}
    </div>
  );
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

Object.assign(window, { MapCanvas, CJ_MAP_CSS });
