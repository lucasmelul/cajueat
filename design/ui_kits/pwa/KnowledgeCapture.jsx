/* Screen 4 — Knowledge Capture. Aportar conocimiento en < 30s.
   Voz / foto / link → el Brain analiza → aprende. Overlay sheet. */

function KnowledgeCapture({ onClose }) {
  const NS = window.CajuEatDesignSystem_dbeea0;
  const { Button, CajuPoints, Badge } = NS;
  const [stage, setStage] = React.useState('pick'); // pick | analyzing | done
  const [link, setLink] = React.useState('');
  const [aStep, setAStep] = React.useState(0);

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const start = () => {
    setStage('analyzing'); setAStep(0);
    setTimeout(() => setAStep(1), 650);
    setTimeout(() => setAStep(2), 1300);
    setTimeout(() => setStage('done'), 2050);
  };

  return (
    <div className="cj-overlay">
      <div className="cj-ov-scrim" onClick={onClose} />
      <div className="cj-ov-sheet">
        <div className="cj-ov-grip" />
        {stage === 'pick' && (
          <>
            <div className="cj-ov-head">
              <h2>Aportar conocimiento</h2>
              <p>Compartí lo que sepas y el Brain aprende. Menos de 30 segundos.</p>
            </div>
            <div className="cj-cap-grid">
              <button className="cj-cap" onClick={start}>
                <span className="cj-cap__ic cj-cap__ic--caju"><window.Icon name="mic" size={22} /></span>
                <span className="cj-cap__t">Voz</span>
                <span className="cj-cap__s">Contá una experiencia</span>
              </button>
              <button className="cj-cap" onClick={start}>
                <span className="cj-cap__ic cj-cap__ic--amber"><window.Icon name="camera" size={22} /></span>
                <span className="cj-cap__t">Foto</span>
                <span className="cj-cap__s">Plato, menú o ticket</span>
              </button>
              <button className="cj-cap" onClick={start}>
                <span className="cj-cap__ic cj-cap__ic--leaf"><window.Icon name="instagram" size={22} /></span>
                <span className="cj-cap__t">Reel / TikTok</span>
                <span className="cj-cap__s">Pegá un link</span>
              </button>
              <button className="cj-cap" onClick={start}>
                <span className="cj-cap__ic cj-cap__ic--slate"><window.Icon name="file-text" size={22} /></span>
                <span className="cj-cap__t">Nota</span>
                <span className="cj-cap__s">Escribí algo corto</span>
              </button>
            </div>
            <div className="cj-cap-link">
              <window.Icon name="link" size={18} />
              <input value={link} onChange={e => setLink(e.target.value)} placeholder="o pegá un link de Instagram, YouTube…" />
              <Button size="sm" variant="primary" onClick={start} disabled={!link.trim()}>Enviar</Button>
            </div>
          </>
        )}

        {stage === 'analyzing' && (
          <div className="cj-cap-analyze">
            <NS.BrainMark size={52} radius={16} thinking />
            <h2>El Brain está analizando…</h2>
            <p>Extrayendo restaurantes, platos y señales.</p>
            <div className="cj-cap-steps">
              {['Detectando lugar', 'Identificando platos', 'Ponderando confianza'].map((s, i) => {
                const done = aStep > i;
                return (
                  <div className={`cj-cap-step ${done || aStep === i ? 'on' : ''}`} key={i}>
                    {done ? <window.Icon name="check" size={14} /> : <span className="cj-dot" />} {s}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {stage === 'done' && (
          <div className="cj-cap-done">
            <div className="cj-cap-done__seed"><NS.BrainMark size={52} radius={16} /></div>
            <h2>¡Gracias! El Brain aprendió algo nuevo.</h2>
            <div className="cj-cap-learn">
              <Badge tone="over">Lo que guardé</Badge>
              <p>“En <b>Anafe</b> la pesca del día cambia cada semana y vale la pena preguntarla.”</p>
            </div>
            <div className="cj-cap-award">
              <span>Ganaste</span><CajuPoints value={30} delta={30} chip size="sm" />
            </div>
            <Button variant="primary" size="lg" block onClick={onClose}>Listo</Button>
          </div>
        )}
      </div>
    </div>
  );
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

Object.assign(window, { KnowledgeCapture, CJ_CAP_CSS });
