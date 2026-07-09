import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button, Chip } from '../../components/core';
import { BrainMark } from '../../components/brain';
import { brain } from '../../lib/brain';
import { useAppStore } from '../../lib/store/useAppStore';
import './Onboarding.css';

type Stage = 'welcome' | 'quiz';

interface Question {
  q: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  { q: '¿Qué te gusta comer?', options: ['Sushi', 'Parrilla', 'Pastas', 'Café de especialidad', 'Vegetariano'] },
  { q: '¿En qué zona te movés?', options: ['Palermo', 'Villa Crespo', 'Chacarita', 'San Telmo', 'Belgrano', 'Colegiales'] },
  { q: '¿Qué tipo de salidas hacés?', options: ['Citas', 'Con amigos', 'Solo/a', 'Trabajo'] },
];

/** First-run flow (PRD-010, CP-027) — a conversation start, not a registration process. Every question is optional. */
export function Onboarding() {
  const navigate = useNavigate();
  const { user, setUser } = useAppStore();
  const [stage, setStage] = useState<Stage>('welcome');
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [finishing, setFinishing] = useState(false);

  const toggle = (label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const finish = async (labels: Set<string>) => {
    setFinishing(true);
    await Promise.all([...labels].map((label) => brain.addDnaTag(label)));
    await brain.completeOnboarding();
    // Update the shared store before navigating — App.tsx's redirect guard reads this
    // synchronously on route change, and a stale `onboarded: false` would bounce right back here.
    if (user) setUser({ ...user, onboarded: true });
    navigate('/');
  };

  const next = () => {
    if (step + 1 < QUESTIONS.length) setStep((s) => s + 1);
    else finish(selected);
  };

  const skipAll = () => finish(new Set());

  return (
    <div className="cj-onboard">
      {stage === 'welcome' && (
        <div className="cj-onboard__welcome">
          <BrainMark size={64} radius={20} />
          <h1>Soy Lugarcito.</h1>
          <p>Te ayudo a decidir dónde comer — nunca te tiro una lista.</p>
          <Button variant="primary" size="lg" block iconRight={<ArrowRight size={18} />} onClick={() => setStage('quiz')}>
            Empezar
          </Button>
          <button className="cj-onboard__skip" onClick={skipAll}>
            Ir directo al mapa
          </button>
        </div>
      )}

      {stage === 'quiz' && (
        <div className="cj-onboard__quiz">
          <div className="cj-onboard__top">
            <div className="cj-onboard__progress">
              {QUESTIONS.map((_, i) => (
                <span key={i} className={i <= step ? 'on' : ''} />
              ))}
            </div>
            <button className="cj-onboard__skip" onClick={skipAll} disabled={finishing}>
              Saltar todo
            </button>
          </div>

          <div className="cj-onboard__q" key={step}>
            <BrainMark size={30} radius={9} />
            <h2>{QUESTIONS[step].q}</h2>
            <p className="cj-onboard__hint">Opcional — elegí las que quieras.</p>
            <div className="cj-onboard__opts">
              {QUESTIONS[step].options.map((o) => (
                <Chip key={o} selected={selected.has(o)} onClick={() => toggle(o)}>
                  {o}
                </Chip>
              ))}
            </div>
          </div>

          <Button variant="primary" size="lg" block onClick={next} disabled={finishing}>
            {step + 1 < QUESTIONS.length ? 'Siguiente' : 'Terminar'}
          </Button>
        </div>
      )}
    </div>
  );
}
