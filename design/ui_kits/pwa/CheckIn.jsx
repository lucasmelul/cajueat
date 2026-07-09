/* Screen 7 — QR Check-in (SPEC-020) + Points redemption (SPEC-023).
   Full-screen in-app camera. Verifies a REAL visit via signed QR
   token + real geolocation + server timestamp. The check-in is the
   evidence that unlocks reviews, the passport (SPEC-021) and
   redeeming points as credit (SPEC-023).

   mode: 'checkin'  → scan → validating → success (check-in + points)
   mode: 'redeem'   → scan → validating → choose points → redeemed
*/

function CheckIn({ mode = 'checkin', restaurantId, onClose, onDone }) {
  const NS = window.CajuEatDesignSystem_dbeea0;
  const { Button, CajuPoints, Badge, TrustMeter } = NS;
  const D = window.CAJU_DATA;
  const r = D.restaurants.find(x => x.id === restaurantId) || D.restaurants[0];

  // scan | validating | choose | success | error
  const [stage, setStage] = React.useState('scan');
  const [vStep, setVStep] = React.useState(0);
  const [pts, setPts] = React.useState(2); // redeem: number of 100-pt credits

  const runValidate = (fail) => {
    setStage('validating'); setVStep(0);
    setTimeout(() => setVStep(1), 620);   // restaurante
    setTimeout(() => setVStep(2), 1240);  // geolocalización
    setTimeout(() => {
      if (fail) { setStage('error'); return; }
      setStage(mode === 'redeem' ? 'choose' : 'success');
    }, 1900);
  };

  const creditArs = pts * 100 * 5; // 100 pts = $500 (demo rate)

  // Self-stateful screen: convert Lucide icons after every stage change
  // (Shell's effect only fires on navigation, not our internal setState).
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  return (
    <div className="cj-scan">
      {/* ---- Camera stage (scan + validating) ---- */}
      {(stage === 'scan' || stage === 'validating') && (
        <div className="cj-scan__cam">
          <div className="cj-scan__feed" />
          <div className="cj-scan__vignette" />

          <div className="cj-scan__top">
            <button className="cj-scan__close" onClick={onClose} aria-label="Cerrar">
              <window.Icon name="x" size={22} />
            </button>
            <div className="cj-scan__title">
              {mode === 'redeem' ? 'Usar puntos' : 'Check-in'}
            </div>
            <span style={{ width: 40 }} />
          </div>

          {/* framing reticle */}
          <div className={`cj-scan__frame ${stage === 'validating' ? 'is-locked' : ''}`}>
            <span className="cj-corner tl" /><span className="cj-corner tr" />
            <span className="cj-corner bl" /><span className="cj-corner br" />
            {stage === 'scan' && <span className="cj-scan__line" />}
            {stage === 'validating' && (
              <div className="cj-scan__lock"><window.Icon name="qr-code" size={40} /></div>
            )}
            {/* the QR the operator shows on the counter */}
            {stage === 'scan' && (
              <div className="cj-scan__qr" aria-hidden="true">
                <QrGlyph />
              </div>
            )}
          </div>

          {stage === 'scan' && (
            <div className="cj-scan__hint">
              <p className="cj-scan__place">{r.name} · {r.neighborhood}</p>
              <p>Apuntá al código QR que está en el mostrador</p>
              <button className="cj-scan__sim" onClick={() => runValidate(false)}>
                <window.Icon name="scan-line" size={16} /> Simular escaneo
              </button>
              <button className="cj-scan__simfail" onClick={() => runValidate(true)}>
                Simular fuera de rango
              </button>
            </div>
          )}

          {stage === 'validating' && (
            <div className="cj-scan__valid">
              {[
                ['Restaurante verificado', 'shield-check'],
                ['Estás en el lugar', 'map-pin'],
                ['Registrando visita', 'clock'],
              ].map(([label, icon], i) => {
                const done = vStep > i, active = vStep === i;
                return (
                  <div className={`cj-vrow ${done ? 'done' : ''} ${active ? 'active' : ''}`} key={i}>
                    {done
                      ? <window.Icon name="check" size={15} />
                      : <span className={`cj-vdot ${active ? 'spin' : ''}`} />}
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ---- Result sheet (success / choose / error) ---- */}
      {stage !== 'scan' && stage !== 'validating' && (
        <div className="cj-scan__result">
          {stage === 'success' && (
            <div className="cj-res">
              <div className="cj-res__mark cj-res__mark--ok"><window.Icon name="check" size={30} /></div>
              <h2>¡Estuviste en {r.name}!</h2>
              <p className="cj-res__sub">Check-in verificado · {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</p>
              <div className="cj-res__row">
                <span>Ganaste por descubrir este lugar</span>
                <CajuPoints value={50} delta={50} chip size="sm" />
              </div>
              <div className="cj-res__unlock">
                <window.Icon name="unlock" size={16} />
                Ya podés dejar tu reseña de este lugar
              </div>
              <Button variant="primary" size="lg" block onClick={() => onDone && onDone('success', r.id)}>
                Listo
              </Button>
            </div>
          )}

          {stage === 'choose' && (
            <div className="cj-res cj-res--choose">
              <div className="cj-res__mark cj-res__mark--brand"><window.Icon name="wallet" size={26} /></div>
              <h2>Usar tus puntos acá</h2>
              <p className="cj-res__sub">Tenés <b>{D.user.points.toLocaleString('es-AR')}</b> puntos Lugarcito · 100 pts = $500</p>

              <div className="cj-stepper">
                <button onClick={() => setPts(p => Math.max(1, p - 1))} aria-label="Menos" disabled={pts <= 1}>
                  <window.Icon name="minus" size={20} />
                </button>
                <div className="cj-stepper__val">
                  <b>{pts * 100}</b><span>puntos</span>
                </div>
                <button onClick={() => setPts(p => Math.min(12, p + 1))} aria-label="Más" disabled={pts >= 12}>
                  <window.Icon name="plus" size={20} />
                </button>
              </div>

              <div className="cj-credit">
                Descuento <b>${creditArs.toLocaleString('es-AR')}</b>
              </div>
              <p className="cj-res__fine">Mostrale la confirmación al local. Podés volver a usar puntos acá dentro de 15 días.</p>
              <Button variant="primary" size="lg" block onClick={() => setStage('redeemed')}>
                Canjear ${creditArs.toLocaleString('es-AR')}
              </Button>
            </div>
          )}

          {stage === 'redeemed' && (
            <div className="cj-res">
              <div className="cj-res__mark cj-res__mark--ok"><window.Icon name="check" size={30} /></div>
              <h2>Canje confirmado</h2>
              <p className="cj-res__sub">Mostrale esta pantalla en {r.name}</p>
              <div className="cj-voucher">
                <div className="cj-voucher__amt">${creditArs.toLocaleString('es-AR')}</div>
                <div className="cj-voucher__meta">
                  <span>{r.name}</span>
                  <span>{new Date().toLocaleString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="cj-voucher__code">CJ-{r.id.toUpperCase().slice(0,3)}-4827</div>
              </div>
              <Button variant="primary" size="lg" block onClick={() => onDone && onDone('redeemed', r.id)}>
                Listo
              </Button>
            </div>
          )}

          {stage === 'error' && (
            <div className="cj-res">
              <div className="cj-res__mark cj-res__mark--err"><window.Icon name="map-pin-off" size={28} /></div>
              <h2>Todavía no estás en el lugar</h2>
              <p className="cj-res__sub">
                El check-in necesita que estés físicamente en {r.name}. Acercate al mostrador y volvé a escanear.
              </p>
              <Button variant="secondary" size="lg" block onClick={() => setStage('scan')}>
                Reintentar
              </Button>
              <button className="cj-res__ghost" onClick={onClose}>Ahora no</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// A decorative QR glyph (CSS grid of cells) — never a real code.
function QrGlyph() {
  const P = [
    '1111111 0110 1111111',
    '1000001 1001 1000001',
    '1011101 0100 1011101',
    '1011101 1011 1011101',
    '1011101 0010 1011101',
    '1000001 1100 1000001',
    '1111111 0101 1111111',
    '0000000 1001 0000000',
    '1101011 0110 1010110',
    '0110010 1101 0101101',
    '1011101 0011 1100011',
    '0000000 1010 1011101',
    '1111111 0101 1001011',
    '1000001 1100 1110010',
    '1011101 0110 1011101',
    '1011101 1001 0100110',
    '1011101 0101 1101011',
    '1000001 1010 0110100',
    '1111111 0110 1011101',
  ].map(s => s.replace(/ /g, ''));
  return (
    <div className="cj-qr">
      {P.map((row, y) => row.split('').map((c, x) => (
        c === '1' ? <span key={y + '-' + x} style={{ gridRow: y + 1, gridColumn: x + 1 }} /> : null
      )))}
    </div>
  );
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

Object.assign(window, { CheckIn, CJ_SCAN_CSS });
