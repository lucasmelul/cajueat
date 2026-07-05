/* Screen 5 — Post-visit Feedback. Not a review: a 3-question
   conversation that feeds the Brain, then Caju Points. */

function Feedback({ onClose }) {
  const NS = window.CajuEatDesignSystem_dbeea0;
  const { Chip, CajuPoints, Badge, Button } = NS;
  const D = window.CAJU_DATA;
  const r = D.restaurants[0];
  const questions = [
    { q: '¿Cómo estuvo tu visita a ' + r.name + '?', a: ['Excelente', 'Estuvo bien', 'Floja'] },
    { q: '¿Esperaste mucho por mesa?', a: ['Nada', '10–20 min', 'Más de 30'] },
    { q: '¿La barra estaba abierta?', a: ['Sí', 'No', 'No sé'] },
    { q: '¿Con quién lo recomendarías?', a: ['En pareja', 'Amigos', 'Solo', 'Familia'] },
  ];
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState([]);
  const [picked, setPicked] = React.useState(null);
  const done = step >= questions.length;

  const pick = (a) => {
    setPicked(a);
    setAnswers(prev => [...prev, a]);
    setTimeout(() => { setStep(s => s + 1); setPicked(null); }, 280);
  };

  return (
    <div className="cj-overlay">
      <div className="cj-ov-scrim" onClick={onClose} />
      <div className="cj-ov-sheet cj-fb">
        <div className="cj-ov-grip" />
        {!done ? (
          <>
            <div className="cj-fb-progress">
              {questions.map((_, i) => <span key={i} className={i <= step ? 'on' : ''} />)}
            </div>
            <div className="cj-fb-head">
              <NS.BrainMark size={30} radius={9} />
              <span>Contame en 20 segundos. Ayudás al Brain, no completás una encuesta.</span>
            </div>
            <div className="cj-fb-q" key={step}>
              <h2>{questions[step].q}</h2>
              <div className="cj-fb-answers">
                {questions[step].a.map((a, i) => (
                  <Chip key={i} selected={picked === a} onClick={() => pick(a)}>{a}</Chip>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="cj-cap-done">
            <div className="cj-cap-done__seed"><NS.BrainMark size={52} radius={16} /></div>
            <h2>¡Gracias, {D.user.name}!</h2>
            <p style={{ color: 'var(--ink-500)', fontSize: 14 }}>El Brain va a recomendar mejor gracias a esto.</p>
            <div className="cj-cap-learn" style={{ marginTop: 16 }}>
              <Badge tone="over">Lo que aprendí de vos</Badge>
              <p>“{D.user.name} prefiere la barra y valora la espera corta.”</p>
            </div>
            <div className="cj-cap-award"><span>Ganaste</span><CajuPoints value={45} delta={45} chip size="sm" /></div>
            <Button variant="primary" size="lg" block onClick={onClose}>Volver al mapa</Button>
          </div>
        )}
      </div>
    </div>
  );
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

Object.assign(window, { Feedback, CJ_FB_CSS });
