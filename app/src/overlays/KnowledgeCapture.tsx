import { useState } from 'react';
import { Camera, Check, Clapperboard, FileText, Link2, Mic } from 'lucide-react';
import { Badge, Button } from '../components/core';
import { CajuPoints } from '../components/discovery';
import { BrainMark } from '../components/brain';
import { useAppStore } from '../lib/store/useAppStore';
import './KnowledgeCapture.css';

type Stage = 'pick' | 'analyzing' | 'done';

const ANALYSIS_STEPS = ['Detectando lugar', 'Identificando platos', 'Ponderando confianza'];

export interface KnowledgeCaptureProps {
  onClose: () => void;
}

/** Overlay sheet to teach the Brain something new in under 30s — no forms (SPEC-004, PRD-004). */
export function KnowledgeCapture({ onClose }: KnowledgeCaptureProps) {
  const addCajuPoints = useAppStore((s) => s.addCajuPoints);
  const [stage, setStage] = useState<Stage>('pick');
  const [link, setLink] = useState('');
  const [step, setStep] = useState(0);

  const start = () => {
    setStage('analyzing');
    setStep(0);
    setTimeout(() => setStep(1), 650);
    setTimeout(() => setStep(2), 1300);
    setTimeout(() => {
      setStage('done');
      addCajuPoints(30);
    }, 2050);
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
                <span className="cj-cap__ic cj-cap__ic--caju">
                  <Mic size={22} />
                </span>
                <span className="cj-cap__t">Voz</span>
                <span className="cj-cap__s">Contá una experiencia</span>
              </button>
              <button className="cj-cap" onClick={start}>
                <span className="cj-cap__ic cj-cap__ic--amber">
                  <Camera size={22} />
                </span>
                <span className="cj-cap__t">Foto</span>
                <span className="cj-cap__s">Plato, menú o ticket</span>
              </button>
              <button className="cj-cap" onClick={start}>
                <span className="cj-cap__ic cj-cap__ic--leaf">
                  <Clapperboard size={22} />
                </span>
                <span className="cj-cap__t">Reel / TikTok</span>
                <span className="cj-cap__s">Pegá un link</span>
              </button>
              <button className="cj-cap" onClick={start}>
                <span className="cj-cap__ic cj-cap__ic--slate">
                  <FileText size={22} />
                </span>
                <span className="cj-cap__t">Nota</span>
                <span className="cj-cap__s">Escribí algo corto</span>
              </button>
            </div>
            <div className="cj-cap-link">
              <Link2 size={18} />
              <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="o pegá un link de Instagram, YouTube…" />
              <Button size="sm" variant="primary" onClick={start} disabled={!link.trim()}>
                Enviar
              </Button>
            </div>
          </>
        )}

        {stage === 'analyzing' && (
          <div className="cj-cap-analyze">
            <BrainMark size={52} radius={16} thinking />
            <h2>El Brain está analizando…</h2>
            <p>Extrayendo restaurantes, platos y señales.</p>
            <div className="cj-cap-steps">
              {ANALYSIS_STEPS.map((s, i) => {
                const done = step > i;
                return (
                  <div className={`cj-cap-step ${done || step === i ? 'on' : ''}`} key={s}>
                    {done ? <Check size={14} /> : <span className="cj-dot" />} {s}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {stage === 'done' && (
          <div className="cj-cap-done">
            <div className="cj-cap-done__seed">
              <BrainMark size={52} radius={16} />
            </div>
            <h2>¡Gracias! El Brain aprendió algo nuevo.</h2>
            <div className="cj-cap-learn">
              <Badge tone="over">Lo que guardé</Badge>
              <p>
                "En <b>Anafe</b> la pesca del día cambia cada semana y vale la pena preguntarla."
              </p>
            </div>
            <div className="cj-cap-award">
              <span>Ganaste</span>
              <CajuPoints value={30} delta={30} chip size="sm" />
            </div>
            <Button variant="primary" size="lg" block onClick={onClose}>
              Listo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
