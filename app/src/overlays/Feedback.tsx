import { useEffect, useState } from 'react';
import { Badge, Button, Chip } from '../components/core';
import { CajuPoints } from '../components/discovery';
import { BrainMark } from '../components/brain';
import { brain } from '../lib/brain';
import { useAppStore } from '../lib/store/useAppStore';
import type { Restaurant } from '../types';
import './Feedback.css';

interface Question {
  q: string;
  a: string[];
}

export interface FeedbackProps {
  /** Which visit this feedback is about — Profile's nudge always passes the real oldest saved-without-feedback restaurant (SPEC-016). Required: there's no honest fallback restaurant to default to. */
  restaurantId: string;
  onClose: () => void;
}

/** Post-visit feedback: a 3–4 question conversation, not a review (SPEC-011, CP-009). */
export function Feedback({ restaurantId, onClose }: FeedbackProps) {
  const { user, addCajuPoints } = useAppStore();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<{ learned: string; pointsAwarded: number } | null>(null);

  useEffect(() => {
    brain.getRestaurant(restaurantId).then((r) => setRestaurant(r ?? null));
  }, [restaurantId]);

  const questions: Question[] = [
    { q: `¿Cómo estuvo tu visita a ${restaurant?.name ?? 'este lugar'}?`, a: ['Excelente', 'Estuvo bien', 'Floja'] },
    { q: '¿Esperaste mucho por mesa?', a: ['Nada', '10–20 min', 'Más de 30'] },
    { q: '¿La barra estaba abierta?', a: ['Sí', 'No', 'No sé'] },
    { q: '¿Con quién lo recomendarías?', a: ['En pareja', 'Amigos', 'Solo', 'Familia'] },
  ];
  const done = step >= questions.length;

  useEffect(() => {
    if (done && !result) {
      brain.submitFeedback({ restaurantId, answers }).then((r) => {
        setResult(r);
        addCajuPoints(r.pointsAwarded);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const pick = (answer: string) => {
    setPicked(answer);
    setTimeout(() => {
      setAnswers((prev) => [...prev, answer]);
      setStep((s) => s + 1);
      setPicked(null);
    }, 280);
  };

  return (
    <div className="cj-overlay">
      <div className="cj-ov-scrim" onClick={onClose} />
      <div className="cj-ov-sheet cj-fb">
        <div className="cj-ov-grip" />
        {!done ? (
          <>
            <div className="cj-fb-progress">
              {questions.map((_, i) => (
                <span key={i} className={i <= step ? 'on' : ''} />
              ))}
            </div>
            <div className="cj-fb-head">
              <BrainMark size={30} radius={9} />
              <span>Contame en 20 segundos. Ayudás al Brain, no completás una encuesta.</span>
            </div>
            <div className="cj-fb-q" key={step}>
              <h2>{questions[step].q}</h2>
              <div className="cj-fb-answers">
                {questions[step].a.map((a) => (
                  <Chip key={a} selected={picked === a} onClick={() => pick(a)}>
                    {a}
                  </Chip>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="cj-cap-done">
            <div className="cj-cap-done__seed">
              <BrainMark size={52} radius={16} />
            </div>
            <h2>¡Gracias{user?.name ? `, ${user.name}` : ''}!</h2>
            <p className="cj-fb-sub">El Brain va a recomendar mejor gracias a esto.</p>
            {result && (
              <>
                <div className="cj-cap-learn">
                  <Badge tone="over">Lo que aprendí de vos</Badge>
                  <p>{result.learned}</p>
                </div>
                <div className="cj-cap-award">
                  <span>Ganaste</span>
                  <CajuPoints value={result.pointsAwarded} delta={result.pointsAwarded} chip size="sm" />
                </div>
              </>
            )}
            <Button variant="primary" size="lg" block onClick={onClose}>
              Volver al mapa
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
