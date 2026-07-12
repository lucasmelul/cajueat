import { useEffect, useRef, useState } from 'react';
import { Camera, Check, Clapperboard, FileText, Link2, Mic, Square } from 'lucide-react';
import { Badge, Button } from '../components/core';
import { CajuPoints } from '../components/discovery';
import { BrainMark } from '../components/brain';
import { brain, BrainSyncRequiredError } from '../lib/brain';
import { useAppStore } from '../lib/store/useAppStore';
import './KnowledgeCapture.css';

type Stage = 'pick' | 'noteInput' | 'photoInput' | 'voiceInput' | 'analyzing' | 'done' | 'error';

const ANALYSIS_STEPS = ['Detectando lugar', 'Identificando platos', 'Ponderando confianza'];

// Web Speech API no está en lib.dom.d.ts (no es estándar) — tipado mínimo de lo que usamos.
interface SpeechRecognitionResultLike {
  0: { transcript: string };
  isFinal: boolean;
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  const w = window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export interface KnowledgeCaptureProps {
  onClose: () => void;
}

/** Overlay sheet to teach the Brain something new in under 30s — no forms (SPEC-004, PRD-004). */
export function KnowledgeCapture({ onClose }: KnowledgeCaptureProps) {
  const addCajuPoints = useAppStore((s) => s.addCajuPoints);
  const pendingShare = useAppStore((s) => s.pendingShare);
  const setPendingShare = useAppStore((s) => s.setPendingShare);
  const pendingCaptureStage = useAppStore((s) => s.pendingCaptureStage);
  const setPendingCaptureStage = useAppStore((s) => s.setPendingCaptureStage);
  const [stage, setStage] = useState<Stage>(() => pendingCaptureStage ?? 'pick');
  const [link, setLink] = useState(() => {
    // SPEC-004 Share Sheet: pre-fill from whatever the OS handed off, never auto-submit —
    // the user still has to tap "Enviar" once they see it, same confirmation step as pasting manually.
    if (!pendingShare) return '';
    return pendingShare.url || pendingShare.text;
  });
  const [note, setNote] = useState('');
  const [voiceText, setVoiceText] = useState('');
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoMediaType, setPhotoMediaType] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [learned, setLearned] = useState('');
  const [points, setPoints] = useState(0);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSpeechSupported(!!getSpeechRecognition());
    if (pendingShare) setPendingShare(null); // consumed once into `link`'s initial value above
    if (pendingCaptureStage) setPendingCaptureStage(null); // consumed once into `stage`'s initial value above
    return () => recognitionRef.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = (kind: string, text?: string, image?: string, mediaType?: string) => {
    setStage('analyzing');
    setStep(0);
    setTimeout(() => setStep(1), 650);
    setTimeout(() => setStep(2), 1300);
    setTimeout(async () => {
      try {
        const result = await brain.submitCapture({ kind, text, image, mediaType });
        setLearned(result.learned);
        setPoints(result.pointsAwarded);
        setPending(!!result.pending);
        addCajuPoints(result.pointsAwarded);
        setStage('done');
      } catch (err) {
        // SPEC-013 abuse gate: anonymous daily limit reached — nudge to sync instead of a silent failure.
        setErrorMessage(
          err instanceof BrainSyncRequiredError
            ? 'Llegaste al límite de aportes de hoy sin un perfil guardado. Sincronizalo desde tu perfil para seguir sin límite.'
            : 'Algo falló de este lado. Probá de nuevo en un momento.',
        );
        setStage('error');
      }
    }, 2050);
  };

  const pickPhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const [header, base64] = dataUrl.split(',');
      setPhotoPreview(dataUrl);
      setPhotoBase64(base64);
      setPhotoMediaType(header.match(/data:(.*);base64/)?.[1] ?? file.type);
    };
    reader.readAsDataURL(file);
  };

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor) return;
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'es-AR';
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      let addition = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) addition += e.results[i][0].transcript;
      }
      if (addition) setVoiceText((prev) => (prev ? `${prev} ${addition}` : addition).trim());
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
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
              <p>Compartí lo que sepas y Lugarcito aprende. Menos de 30 segundos.</p>
            </div>
            <div className="cj-cap-grid">
              <button className="cj-cap" onClick={() => setStage('voiceInput')}>
                <span className="cj-cap__ic cj-cap__ic--caju">
                  <Mic size={22} />
                </span>
                <span className="cj-cap__t">Voz</span>
                <span className="cj-cap__s">Contá una experiencia</span>
              </button>
              <button className="cj-cap" onClick={() => setStage('photoInput')}>
                <span className="cj-cap__ic cj-cap__ic--amber">
                  <Camera size={22} />
                </span>
                <span className="cj-cap__t">Foto</span>
                <span className="cj-cap__s">Plato, menú o ticket</span>
              </button>
              <button className="cj-cap" onClick={() => linkInputRef.current?.focus()}>
                <span className="cj-cap__ic cj-cap__ic--leaf">
                  <Clapperboard size={22} />
                </span>
                <span className="cj-cap__t">Reel / TikTok</span>
                <span className="cj-cap__s">Pegá un link</span>
              </button>
              <button className="cj-cap" onClick={() => setStage('noteInput')}>
                <span className="cj-cap__ic cj-cap__ic--slate">
                  <FileText size={22} />
                </span>
                <span className="cj-cap__t">Nota</span>
                <span className="cj-cap__s">Escribí algo corto</span>
              </button>
            </div>
            <div className="cj-cap-link">
              <Link2 size={18} />
              <input ref={linkInputRef} value={link} onChange={(e) => setLink(e.target.value)} placeholder="o pegá un link de Instagram, YouTube…" />
              <Button size="sm" variant="primary" onClick={() => start('link', link.trim())} disabled={!link.trim()}>
                Enviar
              </Button>
            </div>
          </>
        )}

        {stage === 'noteInput' && (
          <div className="cj-cap-note">
            <div className="cj-ov-head">
              <h2>Contale a Lugarcito</h2>
              <p>Escribí lo que sepas de un lugar — Lugarcito lo entiende y lo suma.</p>
            </div>
            <textarea
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej: en Osaka el omakase de los jueves tiene una lista de espera larga…"
            />
            <Button variant="primary" size="lg" block disabled={!note.trim()} onClick={() => start('note', note.trim())}>
              Analizar
            </Button>
          </div>
        )}

        {stage === 'photoInput' && (
          <div className="cj-cap-photo">
            <div className="cj-ov-head">
              <h2>Mostrale a Lugarcito</h2>
              <p>Un menú, un plato, un ticket — Lugarcito lee lo que realmente se ve.</p>
            </div>
            {photoPreview ? (
              <img className="cj-cap-photo__preview" src={photoPreview} alt="Foto a analizar" />
            ) : (
              <label className="cj-cap-photo__drop">
                <Camera size={28} />
                <span>Tocá para elegir o sacar una foto</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) pickPhoto(file);
                  }}
                />
              </label>
            )}
            <Button
              variant="primary"
              size="lg"
              block
              disabled={!photoBase64}
              onClick={() => start('photo', undefined, photoBase64 ?? undefined, photoMediaType ?? undefined)}
            >
              Analizar
            </Button>
          </div>
        )}

        {stage === 'voiceInput' && (
          <div className="cj-cap-voice">
            <div className="cj-ov-head">
              <h2>Contale a Lugarcito</h2>
              <p>{speechSupported ? 'Grabá y corregí antes de enviar — la transcripción no es perfecta.' : 'Tu navegador no transcribe automático — escribilo directo.'}</p>
            </div>
            {speechSupported && (
              <button className={`cj-cap-voice__mic ${listening ? 'on' : ''}`} onClick={toggleListening} aria-label={listening ? 'Detener grabación' : 'Grabar'}>
                {listening ? <Square size={20} /> : <Mic size={22} />}
              </button>
            )}
            <textarea
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
              placeholder="Ej: en Osaka el omakase de los jueves tiene una lista de espera larga…"
            />
            <Button variant="primary" size="lg" block disabled={!voiceText.trim()} onClick={() => start('voice', voiceText.trim())}>
              Analizar
            </Button>
          </div>
        )}

        {stage === 'analyzing' && (
          <div className="cj-cap-analyze">
            <BrainMark size={52} radius={16} thinking />
            <h2>Lugarcito está analizando…</h2>
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
            <h2>{pending ? 'Gracias, lo vamos a revisar.' : '¡Gracias! Lugarcito aprendió algo nuevo.'}</h2>
            <div className="cj-cap-learn">
              <Badge tone="over">{pending ? 'Queda en revisión' : 'Lo que guardé'}</Badge>
              <p>{learned}</p>
            </div>
            <div className="cj-cap-award">
              <span>Ganaste</span>
              <CajuPoints value={points} delta={points} chip size="sm" />
            </div>
            <Button variant="primary" size="lg" block onClick={onClose}>
              Listo
            </Button>
          </div>
        )}

        {stage === 'error' && (
          <div className="cj-cap-done">
            <div className="cj-cap-done__seed">
              <BrainMark size={52} radius={16} />
            </div>
            <h2>No pudimos guardarlo</h2>
            <div className="cj-cap-learn">
              <p>{errorMessage}</p>
            </div>
            <Button variant="primary" size="lg" block onClick={onClose}>
              Entendido
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
