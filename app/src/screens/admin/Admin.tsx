import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, LogOut } from 'lucide-react';
import { Badge, Button } from '../../components/core';
import { adminClient, AdminAuthError, clearOperatorToken, getOperatorToken, setOperatorToken } from '../../lib/admin/adminClient';
import type { CuratorAnalysis, CuratorRecord, PendingContribution } from '../../lib/admin/adminClient';
import type { MapEvent, Restaurant } from '../../types';
import './Admin.css';

const TRUST_TONE: Record<Restaurant['trust'], 'success' | 'brand' | 'danger'> = { high: 'success', mid: 'brand', low: 'danger' };
const SOURCE_LABEL: Record<PendingContribution['source'], string> = { note: 'Nota', photo: 'Foto', voice: 'Voz', conversation: 'Conversación' };

/** SPEC-018 Admin CMS: another client of the Brain — never a login for regular users, gated by an operator shared secret (SPEC-018 §Acceso). */
export function Admin() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [gateError, setGateError] = useState('');
  const [gateLoading, setGateLoading] = useState(false);
  const [catalog, setCatalog] = useState<Restaurant[]>([]);
  const [curators, setCurators] = useState<CuratorRecord[]>([]);
  const [pendingContributions, setPendingContributions] = useState<PendingContribution[]>([]);
  const [pendingBusyId, setPendingBusyId] = useState<string | null>(null);
  const [events, setEvents] = useState<MapEvent[]>([]);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  const [curatorHandle, setCuratorHandle] = useState('');
  const [curatorText, setCuratorText] = useState('');
  const [analysis, setAnalysis] = useState<CuratorAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [confirmedIdx, setConfirmedIdx] = useState<Set<number>>(new Set());

  const [newName, setNewName] = useState('');
  const [newCuisine, setNewCuisine] = useState('');
  const [newNeighborhood, setNewNeighborhood] = useState('');
  const [newWhy, setNewWhy] = useState('');
  const [creating, setCreating] = useState(false);
  const [createdMsg, setCreatedMsg] = useState('');

  const [newEventName, setNewEventName] = useState('');
  const [newEventWhenAt, setNewEventWhenAt] = useState('');
  const [newEventLat, setNewEventLat] = useState('');
  const [newEventLng, setNewEventLng] = useState('');
  const [creatingEvent, setCreatingEvent] = useState(false);

  const loadCatalog = async () => {
    setGateLoading(true);
    try {
      const [data, curatorData, pending, evts] = await Promise.all([
        adminClient.getCatalog(),
        adminClient.getCurators(),
        adminClient.getPendingContributions(),
        adminClient.getEvents(),
      ]);
      setCatalog(data);
      setCurators(curatorData);
      setPendingContributions(pending);
      setEvents(evts);
      setAuthed(true);
      setGateError('');
    } catch (err) {
      clearOperatorToken();
      setAuthed(false);
      setGateError(err instanceof AdminAuthError ? 'Token incorrecto.' : 'No se pudo conectar con el Brain.');
    } finally {
      setGateLoading(false);
    }
  };

  useEffect(() => {
    if (getOperatorToken()) loadCatalog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enter = () => {
    if (!tokenInput.trim()) return;
    setOperatorToken(tokenInput.trim());
    loadCatalog();
  };

  const logout = () => {
    clearOperatorToken();
    setAuthed(false);
    setCatalog([]);
    setTokenInput('');
  };

  const runAnalysis = async () => {
    if (!curatorText.trim() || !curatorHandle.trim()) return;
    setAnalyzing(true);
    setAnalysis(null);
    setConfirmedIdx(new Set());
    try {
      setAnalysis(await adminClient.analyze(curatorText.trim()));
    } finally {
      setAnalyzing(false);
    }
  };

  // Nunca se escribe sola — el operador confirma cada sugerencia una por una (Confirmación Inteligente, CP-009).
  // El handle real del curador (no un placeholder genérico) es lo que hace que su reputación por dominio
  // se acumule bajo su propia identidad en vez de mezclarse con la de cualquier otro (SPEC-017).
  const confirmMatch = async (index: number) => {
    if (!analysis || !curatorHandle.trim()) return;
    const match = analysis.matches[index];
    await adminClient.addSource(match.restaurantId, {
      name: curatorHandle.trim(),
      kind: 'curator',
      weight: match.suggestedWeight,
      claim: match.claim,
    });
    setConfirmedIdx((prev) => new Set(prev).add(index));
    loadCatalog();
  };

  // SPEC-019: same "nunca se aplica sola" discipline — un tap por aporte, siempre el operador de por medio.
  const confirmPending = async (id: string) => {
    setPendingBusyId(id);
    try {
      await adminClient.confirmPendingContribution(id);
      setPendingContributions((prev) => prev.filter((c) => c.id !== id));
      loadCatalog();
    } finally {
      setPendingBusyId(null);
    }
  };

  const rejectPending = async (id: string) => {
    setPendingBusyId(id);
    try {
      await adminClient.rejectPendingContribution(id);
      setPendingContributions((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setPendingBusyId(null);
    }
  };

  const createRestaurant = async () => {
    if (!newName.trim() || !newCuisine.trim() || !newNeighborhood.trim()) return;
    setCreating(true);
    setCreatedMsg('');
    try {
      const created = await adminClient.createRestaurant({
        name: newName.trim(),
        cuisine: newCuisine.trim(),
        neighborhood: newNeighborhood.trim(),
        why: newWhy.trim(),
      });
      setCreatedMsg(`Creado: ${created.name}`);
      setNewName('');
      setNewCuisine('');
      setNewNeighborhood('');
      setNewWhy('');
      loadCatalog();
    } finally {
      setCreating(false);
    }
  };

  const createEvent = async () => {
    const lat = Number(newEventLat);
    const lng = Number(newEventLng);
    if (!newEventName.trim() || !newEventWhenAt || Number.isNaN(lat) || Number.isNaN(lng)) return;
    setCreatingEvent(true);
    try {
      await adminClient.createEvent({ name: newEventName.trim(), whenAt: new Date(newEventWhenAt).toISOString(), position: { lat, lng } });
      setNewEventName('');
      setNewEventWhenAt('');
      setNewEventLat('');
      setNewEventLng('');
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

  if (!authed) {
    return (
      <div className="cj-admin cj-admin--gate">
        <div className="cj-admin-gate">
          <h1>Admin CMS</h1>
          <p>Acceso de operador — separado de la identidad de usuario final (SPEC-013).</p>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Token de operador"
            onKeyDown={(e) => e.key === 'Enter' && enter()}
          />
          <Button variant="primary" block onClick={enter} loading={gateLoading}>
            Entrar
          </Button>
          {gateError && <p className="cj-admin-gate__error">{gateError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="cj-admin">
      <div className="cj-admin__head">
        <button className="cj-admin-iconback" onClick={() => navigate('/')} aria-label="Volver">
          <ChevronLeft size={22} />
        </button>
        <h1>Admin CMS</h1>
        <button className="cj-admin-iconback" onClick={logout} aria-label="Salir">
          <LogOut size={18} />
        </button>
      </div>

      <div className="cj-admin__scroll">
        <section className="cj-admin-sec">
          <Badge tone="over">Catálogo · confianza</Badge>
          <div className="cj-admin-table">
            {catalog.map((r) => (
              <div className="cj-admin-row" key={r.id}>
                <div className="cj-admin-row__head">
                  <div className="cj-admin-row__main">
                    <b>{r.name}</b>
                    <span>
                      {r.cuisine} · {r.neighborhood}
                    </span>
                  </div>
                  <Badge tone={TRUST_TONE[r.trust]}>{r.trust}</Badge>
                </div>
                <p className="cj-admin-row__rationale">{r.trustRationale}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cj-admin-sec">
          <Badge tone="over">Curadores · reputación</Badge>
          <p className="cj-admin-lead">
            Por dominio (cocina) — nunca un score único global. Se mueve solo con evidencia real confirmada acá abajo.
          </p>
          {curators.length === 0 && <p className="cj-admin-lead">Todavía no hay curadores con historial registrado.</p>}
          <div className="cj-admin-table">
            {curators.map((c) => (
              <div className="cj-admin-row" key={c.handle}>
                <b>{c.handle}</b>
                <div className="cj-admin-curator__domains">
                  {Object.entries(c.domains).map(([domain, rec]) => (
                    <span className="cj-admin-curator__domain" key={domain}>
                      {domain}: +{rec.sustained} / -{rec.contradicted}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="cj-admin-sec">
          <Badge tone="over">Eventos</Badge>
          <p className="cj-admin-lead">
            Antes solo existía un evento fijo en el código, sin forma de cargar uno real — esto reemplaza esa
            simulación por un CRUD real, igual que restaurantes.
          </p>
          {events.length === 0 && <p className="cj-admin-lead">No hay eventos cargados.</p>}
          <div className="cj-admin-table">
            {events.map((e) => (
              <div className="cj-admin-row" key={e.id}>
                <div className="cj-admin-row__head">
                  <div className="cj-admin-row__main">
                    <b>{e.name}</b>
                    <span>{new Date(e.whenAt).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })}</span>
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
            <input value={newEventLat} onChange={(ev) => setNewEventLat(ev.target.value)} placeholder="Latitud (ej: -34.6)" />
            <input value={newEventLng} onChange={(ev) => setNewEventLng(ev.target.value)} placeholder="Longitud (ej: -58.43)" />
            <Button
              variant="primary"
              onClick={createEvent}
              loading={creatingEvent}
              disabled={!newEventName.trim() || !newEventWhenAt || !newEventLat.trim() || !newEventLng.trim()}
            >
              Crear evento
            </Button>
          </div>
        </section>

        <section className="cj-admin-sec">
          <Badge tone="over">Aportes de usuarios · pendientes</Badge>
          <p className="cj-admin-lead">
            Lo que un usuario le enseñó al Brain sobre un lugar real (Nota, Foto, Voz, o de paso en una conversación) —
            nunca llega al catálogo compartido sin que lo confirmes acá (SPEC-019).
          </p>
          {pendingContributions.length === 0 && <p className="cj-admin-lead">No hay aportes pendientes de revisión.</p>}
          <div className="cj-admin-analysis">
            {pendingContributions.map((c) => (
              <div className="cj-admin-match" key={c.id}>
                <div className="cj-admin-match__head">
                  <b>{c.restaurantName}</b>
                  <Badge tone="brand">{SOURCE_LABEL[c.source]}</Badge>
                </div>
                <p>{c.claim}</p>
                <div className="cj-admin-pending__actions">
                  <Button size="sm" variant="primary" disabled={pendingBusyId === c.id} onClick={() => confirmPending(c.id)}>
                    Confirmar y agregar como fuente
                  </Button>
                  <Button size="sm" variant="secondary" disabled={pendingBusyId === c.id} onClick={() => rejectPending(c.id)}>
                    Rechazar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="cj-admin-sec">
          <Badge tone="over">Analizar contenido de curador</Badge>
          <p className="cj-admin-lead">
            Pegá texto real que ya leíste (caption, comentario, lista) — nunca se lee la plataforma directamente.
          </p>
          <input
            className="cj-admin-curator-handle"
            value={curatorHandle}
            onChange={(e) => setCuratorHandle(e.target.value)}
            placeholder="Handle del curador (ej: @buenospaladaires)"
          />
          <textarea
            value={curatorText}
            onChange={(e) => setCuratorText(e.target.value)}
            placeholder="Ej: fui a Osaka de nuevo, la barra sigue espectacular…"
          />
          <Button variant="primary" onClick={runAnalysis} loading={analyzing} disabled={!curatorText.trim() || !curatorHandle.trim()}>
            Analizar
          </Button>

          {analysis && (
            <div className="cj-admin-analysis">
              {analysis.matches.map((m, i) => (
                <div className={`cj-admin-match ${confirmedIdx.has(i) ? 'is-confirmed' : ''}`} key={`${m.restaurantId}-${i}`}>
                  <div className="cj-admin-match__head">
                    <b>{m.restaurantName}</b>
                    <Badge tone="brand">{m.suggestedWeight}</Badge>
                  </div>
                  <p>{m.claim}</p>
                  <Button
                    size="sm"
                    variant={confirmedIdx.has(i) ? 'secondary' : 'primary'}
                    disabled={confirmedIdx.has(i) || !curatorHandle.trim()}
                    onClick={() => confirmMatch(i)}
                  >
                    {confirmedIdx.has(i) ? 'Agregado' : 'Confirmar y agregar como fuente'}
                  </Button>
                </div>
              ))}
              {analysis.unmatchedMentions.length > 0 && (
                <p className="cj-admin-unmatched">No reconocido en el catálogo: {analysis.unmatchedMentions.join(', ')}</p>
              )}
              {analysis.matches.length === 0 && analysis.unmatchedMentions.length === 0 && (
                <p className="cj-admin-lead">No se identificó ningún restaurante real en el texto.</p>
              )}
            </div>
          )}
        </section>

        <section className="cj-admin-sec">
          <Badge tone="over">Agregar restaurante</Badge>
          <div className="cj-admin-form">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nombre" />
            <input value={newCuisine} onChange={(e) => setNewCuisine(e.target.value)} placeholder="Cocina" />
            <input value={newNeighborhood} onChange={(e) => setNewNeighborhood(e.target.value)} placeholder="Barrio" />
            <input value={newWhy} onChange={(e) => setNewWhy(e.target.value)} placeholder="Por qué ir (una línea)" />
            <Button
              variant="primary"
              onClick={createRestaurant}
              loading={creating}
              disabled={!newName.trim() || !newCuisine.trim() || !newNeighborhood.trim()}
            >
              Crear
            </Button>
            {createdMsg && <p className="cj-admin-created">{createdMsg}</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
