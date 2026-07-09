import { useState } from 'react';
import { Button } from '../../../components/core';
import { adminClient, type EventImageSuggestion } from '../../../lib/admin/adminClient';
import { useAdminData } from '../AdminDataContext';
import { GooglePlacePicker, type PickedPlace } from '../GooglePlacePicker';

/** For a `datetime-local` input's value attribute — local time, no timezone suffix. */
function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface EditableSuggestion extends EventImageSuggestion {
  editedWhenAt: string;
  editedName: string;
  place: PickedPlace | null;
}

export function Events() {
  const { events, setEvents } = useAdminData();
  const [newEventName, setNewEventName] = useState('');
  const [newEventWhenAt, setNewEventWhenAt] = useState('');
  const [newEventPlace, setNewEventPlace] = useState<PickedPlace | null>(null);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  // SPEC-027: bulk import from an image — ephemeral suggestions, never persisted until confirmed one by one.
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMediaType, setImageMediaType] = useState<string | null>(null);
  const [referenceDate, setReferenceDate] = useState(() => toLocalInputValue(new Date().toISOString()));
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState('');
  const [suggestions, setSuggestions] = useState<EditableSuggestion[] | null>(null);
  const [confirmingIndex, setConfirmingIndex] = useState<number | null>(null);

  const onPickImage = (file: File) => {
    setSuggestions(null);
    setAnalyzeError('');
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const [header, base64] = dataUrl.split(',');
      setImageBase64(base64);
      setImageMediaType(header.match(/data:(.*);base64/)?.[1] ?? file.type);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!imageBase64 || !imageMediaType) return;
    setAnalyzing(true);
    setAnalyzeError('');
    try {
      const referenceIso = new Date(referenceDate).toISOString();
      const { suggestions: raw } = await adminClient.extractEventsFromImage(imageBase64, imageMediaType, referenceIso);
      setSuggestions(
        raw.map((s) => ({
          ...s,
          editedName: s.name,
          editedWhenAt: s.whenAt ? toLocalInputValue(s.whenAt) : '',
          place: null,
        })),
      );
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : 'No se pudo analizar la imagen.');
    } finally {
      setAnalyzing(false);
    }
  };

  const updateSuggestion = (index: number, patch: Partial<EditableSuggestion>) => {
    setSuggestions((prev) => prev?.map((s, i) => (i === index ? { ...s, ...patch } : s)) ?? null);
  };

  const confirmSuggestion = async (index: number) => {
    const s = suggestions?.[index];
    if (!s || !s.place) return;
    setConfirmingIndex(index);
    try {
      // Confirming reuses createEvent exactly as it already exists — a confirmed suggestion is indistinguishable from one typed by hand.
      await adminClient.createEvent({
        name: s.editedName.trim(),
        whenAt: new Date(s.editedWhenAt).toISOString(),
        position: s.place.position,
        address: s.place.address,
        googlePlaceId: s.place.placeId,
      });
      setEvents(await adminClient.getEvents());
      setSuggestions((prev) => prev?.filter((_, i) => i !== index) ?? null);
    } finally {
      setConfirmingIndex(null);
    }
  };

  const rejectSuggestion = (index: number) => {
    setSuggestions((prev) => prev?.filter((_, i) => i !== index) ?? null);
  };

  const createEvent = async () => {
    if (!newEventName.trim() || !newEventWhenAt || !newEventPlace) return;
    setCreatingEvent(true);
    try {
      await adminClient.createEvent({
        name: newEventName.trim(),
        whenAt: new Date(newEventWhenAt).toISOString(),
        position: newEventPlace.position,
        address: newEventPlace.address,
        googlePlaceId: newEventPlace.placeId,
      });
      setNewEventName('');
      setNewEventWhenAt('');
      setNewEventPlace(null);
      setEvents(await adminClient.getEvents());
    } finally {
      setCreatingEvent(false);
    }
  };

  const removeEvent = async (id: string) => {
    setDeletingEventId(id);
    try {
      await adminClient.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } finally {
      setDeletingEventId(null);
    }
  };

  return (
    <div>
      <h1 className="cj-admin-page-title">Eventos</h1>
      <p className="cj-admin-lead">
        Antes solo existía un evento fijo en el código, sin forma de cargar uno real — esto es un CRUD real, igual
        que restaurantes.
      </p>
      {events.length === 0 && <p className="cj-admin-lead">No hay eventos cargados.</p>}
      <div className="cj-admin-table">
        {events.map((e) => (
          <div className="cj-admin-row" key={e.id}>
            <div className="cj-admin-row__head">
              <div className="cj-admin-row__main">
                <b>{e.name}</b>
                <span>
                  {new Date(e.whenAt).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })}
                  {e.address ? ` · ${e.address}` : ''}
                </span>
              </div>
              <Button size="sm" variant="secondary" disabled={deletingEventId === e.id} onClick={() => removeEvent(e.id)}>
                Borrar
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="cj-admin-form">
        <input value={newEventName} onChange={(ev) => setNewEventName(ev.target.value)} placeholder="Nombre del evento" />
        <input type="datetime-local" value={newEventWhenAt} onChange={(ev) => setNewEventWhenAt(ev.target.value)} />
        <GooglePlacePicker value={newEventPlace} onChange={setNewEventPlace} />
        <Button variant="primary" onClick={createEvent} loading={creatingEvent} disabled={!newEventName.trim() || !newEventWhenAt || !newEventPlace}>
          Crear evento
        </Button>
      </div>

      <h2 className="cj-admin-page-subtitle">Cargar eventos desde imagen</h2>
      <p className="cj-admin-lead">
        Subí una captura real (historia, flyer, cronograma). El Brain nunca inventa un evento, fecha o handle que la
        imagen no muestre — las fechas relativas ("este sábado") se resuelven por cálculo real contra la fecha de
        referencia de abajo, nunca adivinando (SPEC-027).
      </p>
      <div className="cj-admin-form">
        <input type="file" accept="image/*" onChange={(ev) => ev.target.files?.[0] && onPickImage(ev.target.files[0])} />
        <label className="cj-admin-promo-row">
          <span style={{ fontSize: 12, color: 'var(--ink-500)' }}>Fecha de referencia (cuándo se subió/posteó realmente)</span>
          <input type="datetime-local" value={referenceDate} onChange={(ev) => setReferenceDate(ev.target.value)} />
        </label>
        {analyzeError && <p className="cj-admin-gate__error">{analyzeError}</p>}
        <Button variant="primary" onClick={analyzeImage} loading={analyzing} disabled={!imageBase64}>
          Analizar imagen
        </Button>
      </div>

      {suggestions && (
        <div className="cj-admin-table">
          {suggestions.length === 0 && <p className="cj-admin-lead">No se identificó ningún evento en esta imagen.</p>}
          {suggestions.map((s, i) => (
            <div className="cj-admin-row" key={i}>
              <div className="cj-admin-row__main">
                <input value={s.editedName} onChange={(ev) => updateSuggestion(i, { editedName: ev.target.value })} placeholder="Nombre del evento" />
                <span>
                  Texto original: "{s.whenRaw}"{s.instagramHandle && ` · ${s.instagramHandle}`}
                </span>
                {s.claim && <span>{s.claim}</span>}
              </div>
              <input type="datetime-local" value={s.editedWhenAt} onChange={(ev) => updateSuggestion(i, { editedWhenAt: ev.target.value })} />
              {!s.editedWhenAt && <span className="cj-admin-gate__error">No se pudo resolver la fecha — completala a mano.</span>}
              <GooglePlacePicker value={s.place} onChange={(place) => updateSuggestion(i, { place })} initialQuery={s.editedName} />
              <div style={{ display: 'flex', gap: 8 }}>
                <Button size="sm" variant="primary" loading={confirmingIndex === i} disabled={!s.place} onClick={() => confirmSuggestion(i)}>
                  Confirmar y crear
                </Button>
                <Button size="sm" variant="ghost" onClick={() => rejectSuggestion(i)}>
                  Rechazar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
