import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import jsQR from 'jsqr';
import { Check, Clock, MapPinOff, Minus, Plus, QrCode, Unlock, Wallet, X } from 'lucide-react';
import { Button } from '../../components/core';
import { CajuPoints } from '../../components/discovery';
import { brain } from '../../lib/brain';
import { getCurrentPosition } from '../../lib/geo/geolocation';
import type { CheckinResult, GeoPoint, Restaurant } from '../../types';
import './CheckIn.css';

type Mode = 'checkin' | 'redeem';
type Stage = 'scan' | 'validating' | 'success' | 'choose' | 'redeemed' | 'error';

const POINTS_STEP = 50;

const ERROR_COPY: Record<string, { title: string; sub: string }> = {
  out_of_range: { title: 'Todavía no estás en el lugar', sub: 'El check-in necesita que estés físicamente ahí. Acercate al mostrador y volvé a escanear.' },
  already_checked_in_today: { title: 'Ya hiciste check-in acá hoy', sub: 'Un check-in por local, por día. Volvé a escanear otro día para que cuente como una visita nueva.' },
  invalid_token: { title: 'Ese código no es válido', sub: 'Puede que el QR esté vencido o mal escaneado. Probá de nuevo.' },
  restaurant_not_found: { title: 'No encontramos ese lugar', sub: 'Probá escanear de nuevo o pedile al local que revise su código.' },
  cooldown_active: { title: 'Ya usaste tus puntos acá hace poco', sub: 'Podés volver a usar puntos en este local dentro de 15 días de tu último canje.' },
  no_location: { title: 'No pudimos ver tu ubicación', sub: 'Activá la ubicación del navegador e intentá de nuevo — es lo que confirma que estás ahí de verdad.' },
  no_camera: { title: 'No pudimos abrir la cámara', sub: 'Dale permiso de cámara a CajuEat, o ingresá el código manualmente.' },
};

export function CheckIn() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [searchParams] = useSearchParams();
  const mode: Mode = searchParams.get('mode') === 'redeem' ? 'redeem' : 'checkin';
  const navigate = useNavigate();

  const [hint, setHint] = useState<Restaurant | null>(null);
  const [stage, setStage] = useState<Stage>('scan');
  const [vStep, setVStep] = useState(0);
  const [errorCode, setErrorCode] = useState<string>('out_of_range');
  const [manualToken, setManualToken] = useState('');
  const [showManual, setShowManual] = useState(false);

  const [result, setResult] = useState<CheckinResult | null>(null);
  const [lastToken, setLastToken] = useState<string | null>(null);
  const [lastPosition, setLastPosition] = useState<GeoPoint | null>(null);
  const [pts, setPts] = useState(1);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!restaurantId) return;
    brain.getRestaurant(restaurantId).then((r) => setHint(r ?? null));
  }, [restaurantId]);

  const runValidate = async (token: string) => {
    setStage('validating');
    setVStep(0);
    setLastToken(token);

    const position = await getCurrentPosition();
    if (!position) {
      setErrorCode('no_location');
      setStage('error');
      return;
    }
    setVStep(1);
    setLastPosition(position);

    const outcome = await brain.checkin({ token, position, mode });
    setVStep(2);
    if (!outcome.ok) {
      setErrorCode(outcome.error ?? 'invalid_token');
      setStage('error');
      return;
    }
    setResult(outcome);
    if (mode === 'redeem') {
      const balance = outcome.balance ?? 0;
      setPts(balance >= POINTS_STEP ? 1 : 0);
      setStage('choose');
    } else {
      setStage('success');
    }
  };

  // Real camera + real QR decode — jsQR reads live frames off a hidden canvas, no native
  // BarcodeDetector dependency (not universally supported, e.g. Safari).
  useEffect(() => {
    if (stage !== 'scan') return;
    let active = true;

    function tick() {
      if (!active) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(frame.data, frame.width, frame.height);
          if (code?.data) {
            runValidate(code.data);
            return;
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        rafRef.current = requestAnimationFrame(tick);
      })
      .catch(() => setShowManual(true));

    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const confirmRedeem = async () => {
    if (!lastToken || !lastPosition || pts <= 0) return;
    setConfirming(true);
    setConfirmError(null);
    const outcome = await brain.checkin({ token: lastToken, position: lastPosition, mode: 'redeem', points: pts * POINTS_STEP });
    setConfirming(false);
    if (!outcome.ok) {
      setConfirmError(outcome.error ?? 'insufficient_points');
      return;
    }
    setResult(outcome);
    setStage('redeemed');
  };

  const done = () => {
    if (mode === 'checkin' && result?.restaurant) navigate(`/restaurant/${result.restaurant.id}`, { replace: true });
    else navigate(-1);
  };

  const restaurantName = hint?.name ?? result?.restaurant?.name;
  const balance = result?.balance ?? 0;
  const maxPts = Math.max(1, Math.floor(balance / POINTS_STEP));
  const err = ERROR_COPY[errorCode] ?? ERROR_COPY.invalid_token;

  return (
    <div className="cj-scan">
      {(stage === 'scan' || stage === 'validating') && (
        <div className="cj-scan__cam">
          <video ref={videoRef} className="cj-scan__video" playsInline muted />
          <canvas ref={canvasRef} className="cj-scan__canvas-hidden" />
          <div className="cj-scan__vignette" />

          <div className="cj-scan__top">
            <button className="cj-scan__close" onClick={() => navigate(-1)} aria-label="Cerrar">
              <X size={22} />
            </button>
            <div className="cj-scan__title">{mode === 'redeem' ? 'Usar puntos' : 'Check-in'}</div>
            <span style={{ width: 40 }} />
          </div>

          <div className={`cj-scan__frame ${stage === 'validating' ? 'is-locked' : ''}`}>
            <span className="cj-corner tl" />
            <span className="cj-corner tr" />
            <span className="cj-corner bl" />
            <span className="cj-corner br" />
            {stage === 'scan' && !showManual && <span className="cj-scan__line" />}
            {stage === 'validating' && (
              <div className="cj-scan__lock">
                <QrCode size={40} />
              </div>
            )}
          </div>

          {stage === 'scan' && (
            <div className="cj-scan__hint">
              {restaurantName && <p className="cj-scan__place">{restaurantName}</p>}
              {!showManual && <p>Apuntá al código QR que está en el mostrador</p>}
              {showManual ? (
                <div className="cj-scan__manual">
                  <input
                    className="cj-scan__manual-input"
                    placeholder="Código del local"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                  />
                  <Button size="sm" variant="primary" disabled={!manualToken.trim()} onClick={() => runValidate(manualToken.trim())}>
                    Validar
                  </Button>
                </div>
              ) : (
                <button className="cj-scan__simfail" onClick={() => setShowManual(true)}>
                  ¿No podés escanear? Ingresar código
                </button>
              )}
            </div>
          )}

          {stage === 'validating' && (
            <div className="cj-scan__valid">
              {[
                ['Restaurante verificado', 0],
                ['Estás en el lugar', 1],
                ['Registrando visita', 2],
              ].map(([label, i]) => {
                const idx = i as number;
                const isDone = vStep > idx;
                const isActive = vStep === idx;
                return (
                  <div className={`cj-vrow ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`} key={label as string}>
                    {isDone ? <Check size={15} /> : <span className={`cj-vdot ${isActive ? 'spin' : ''}`} />}
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {stage !== 'scan' && stage !== 'validating' && (
        <div className="cj-scan__result">
          {stage === 'success' && result?.restaurant && (
            <div className="cj-res">
              <div className="cj-res__mark cj-res__mark--ok">
                <Check size={30} />
              </div>
              <h2>¡Estuviste en {result.restaurant.name}!</h2>
              <p className="cj-res__sub">Check-in verificado · {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</p>
              {!!result.pointsAwarded && (
                <div className="cj-res__row">
                  <span>Ganaste por descubrir este lugar</span>
                  <CajuPoints value={result.pointsAwarded} delta={result.pointsAwarded} chip size="sm" />
                </div>
              )}
              <div className="cj-res__unlock">
                <Unlock size={16} />
                Ya podés dejar tu reseña de este lugar
              </div>
              <Button variant="primary" size="lg" block onClick={done}>
                Listo
              </Button>
            </div>
          )}

          {stage === 'choose' && result?.restaurant && (
            <div className="cj-res cj-res--choose">
              <div className="cj-res__mark cj-res__mark--brand">
                <Wallet size={26} />
              </div>
              <h2>Usar tus puntos acá</h2>
              <p className="cj-res__sub">
                Tenés <b>{balance.toLocaleString('es-AR')}</b> Caju Points disponibles
              </p>

              {balance < POINTS_STEP ? (
                <p className="cj-res__fine">No tenés suficientes puntos todavía para usar en {result.restaurant.name}.</p>
              ) : (
                <>
                  <div className="cj-stepper">
                    <button onClick={() => setPts((p) => Math.max(1, p - 1))} aria-label="Menos" disabled={pts <= 1}>
                      <Minus size={20} />
                    </button>
                    <div className="cj-stepper__val">
                      <b>{pts * POINTS_STEP}</b>
                      <span>puntos</span>
                    </div>
                    <button onClick={() => setPts((p) => Math.min(maxPts, p + 1))} aria-label="Más" disabled={pts >= maxPts}>
                      <Plus size={20} />
                    </button>
                  </div>
                  <p className="cj-res__fine">
                    Mostrale la confirmación al local en {result.restaurant.name}. Podés volver a usar puntos acá dentro de 15 días.
                  </p>
                  {confirmError && <p className="cj-scan__error-inline">{ERROR_COPY[confirmError]?.title ?? 'No se pudo confirmar el canje.'}</p>}
                  <Button variant="primary" size="lg" block loading={confirming} onClick={confirmRedeem}>
                    Canjear {pts * POINTS_STEP} puntos
                  </Button>
                </>
              )}
              <button className="cj-res__ghost" onClick={() => navigate(-1)}>
                Ahora no
              </button>
            </div>
          )}

          {stage === 'redeemed' && result?.restaurant && (
            <div className="cj-res">
              <div className="cj-res__mark cj-res__mark--ok">
                <Check size={30} />
              </div>
              <h2>Canje confirmado</h2>
              <p className="cj-res__sub">Mostrale esta pantalla en {result.restaurant.name}</p>
              <div className="cj-voucher">
                <div className="cj-voucher__amt">{result.pointsSpent} puntos</div>
                <div className="cj-voucher__meta">
                  <span>{result.restaurant.name}</span>
                  <span>{new Date().toLocaleString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="cj-voucher__code">CJ-{result.restaurant.id.slice(0, 3).toUpperCase()}-{String(Date.now()).slice(-4)}</div>
              </div>
              <Button variant="primary" size="lg" block onClick={done}>
                Listo
              </Button>
            </div>
          )}

          {stage === 'error' && (
            <div className="cj-res">
              <div className="cj-res__mark cj-res__mark--err">
                {errorCode === 'out_of_range' || errorCode === 'no_location' ? <MapPinOff size={28} /> : <Clock size={28} />}
              </div>
              <h2>{err.title}</h2>
              <p className="cj-res__sub">{err.sub}</p>
              <Button
                variant="secondary"
                size="lg"
                block
                onClick={() => {
                  setStage('scan');
                  setManualToken('');
                }}
              >
                Reintentar
              </Button>
              <button className="cj-res__ghost" onClick={() => navigate(-1)}>
                Ahora no
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
