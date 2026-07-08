import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, LogOut } from 'lucide-react';
import { Badge, Button } from '../../components/core';
import { adminClient, AdminAuthError, clearOperatorToken, getOperatorToken, GooglePlacesNotConfiguredError, setOperatorToken } from '../../lib/admin/adminClient';
import type {
  CuratorAnalysis,
  CuratorRecord,
  GooglePlaceCandidate,
  NewPlaceSuggestion,
  NewRestaurantMention,
  PendingContribution,
} from '../../lib/admin/adminClient';
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
  const [pendingNewPlaces, setPendingNewPlaces] = useState<NewPlaceSuggestion[]>([]);
  const [newPlaceBusyId, setNewPlaceBusyId] = useState<string | null>(null);
  const [newPlaceDrafts, setNewPlaceDrafts] = useState<Record<string, { name: string; cuisine: string; neighborhood: string; address: string }>>({});
  const [events, setEvents] = useState<MapEvent[]>([]);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  const [linkingId, setLinkingId] = useState<string | null>(null);
  const [googleQuery, setGoogleQuery] = useState('');
  const [googleCandidates, setGoogleCandidates] = useState<GooglePlaceCandidate[]>([]);
  const [googleSearching, setGoogleSearching] = useState(false);
  const [googleBusyId, setGoogleBusyId] = useState<string | null>(null);
  const [googleStatusById, setGoogleStatusById] = useState<Record<string, string>>({});

  const [curatorHandle, setCuratorHandle] = useState('');
  const [curatorText, setCuratorText] = useState('');
  const [analysis, setAnalysis] = useState<CuratorAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [confirmedIdx, setConfirmedIdx] = useState<Set<number>>(new Set());

  const [newName, setNewName] = useState('');
  const [newCuisine, setNewCuisine] = useState('');
  const [newNeighborhood, setNewNeighborhood] = useState('');
  const [newAddress, setNewAddress] = useState('');
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
      const [data, curatorData, pending, newPlaces, evts] = await Promise.all([
        adminClient.getCatalog(),
        adminClient.getCurators(),
        adminClient.getPendingContributions(),
        adminClient.getPendingNewPlaces(),
        adminClient.getEvents(),
      ]);
      setCatalog(data);
      setCurators(curatorData);
      setPendingContributions(pending);
      setPendingNewPlaces(newPlaces);
      setNewPlaceDrafts((prev) => {
        const next = { ...prev };
        for (const p of newPlaces) {
          if (!next[p.id]) next[p.id] = { name: p.name, cuisine: p.cuisine, neighborhood: p.neighborhood, address: p.address ?? '' };
        }
        return next;
      });
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

  const updateNewPlaceDraft = (id: string, patch: Partial<{ name: string; cuisine: string; neighborhood: string; address: string }>) => {
    setNewPlaceDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  // Antes esto se perdía en silencio (un aporte sobre un lugar que no estaba en el catálogo no tenía
  // dónde ir) — el borrador es editable porque la extracción puede dejar cocina/barrio vacíos, nunca
  // inventados, y el operador los completa acá antes de confirmar.
  const confirmNewPlace = async (id: string) => {
    const draft = newPlaceDrafts[id];
    if (!draft?.name.trim() || !draft?.cuisine.trim() || !draft?.neighborhood.trim()) return;
    setNewPlaceBusyId(id);
    try {
      await adminClient.confirmNewPlace(id, {
        name: draft.name.trim(),
        cuisine: draft.cuisine.trim(),
        neighborhood: draft.neighborhood.trim(),
        address: draft.address.trim() || undefined,
      });
      setPendingNewPlaces((prev) => prev.filter((p) => p.id !== id));
      loadCatalog();
    } finally {
      setNewPlaceBusyId(null);
    }
  };

  const rejectNewPlace = async (id: string) => {
    setNewPlaceBusyId(id);
    try {
      await adminClient.rejectNewPlace(id);
      setPendingNewPlaces((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setNewPlaceBusyId(null);
    }
  };

  // "Analizá contenido de curador" puede encontrar lugares reales que el texto menciona pero que no
  // están en el catálogo — en vez de un flujo de creación paralelo, precarga el mismo formulario de
  // "Agregar restaurante" de más abajo, para no duplicar lógica.
  const prefillNewRestaurant = (nr: NewRestaurantMention) => {
    setNewName(nr.name);
    setNewCuisine(nr.cuisine);
    setNewNeighborhood(nr.neighborhood);
    setNewWhy(nr.claim);
    document.getElementById('cj-admin-create-restaurant')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        ...(newAddress.trim() ? { address: newAddress.trim() } : {}),
        why: newWhy.trim(),
      });
      setCreatedMsg(`Creado: ${created.name}`);
      setNewName('');
      setNewCuisine('');
      setNewNeighborhood('');
      setNewAddress('');
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

  const googleErrorMessage = (err: unknown) => (err instanceof GooglePlacesNotConfiguredError ? err.message : 'No se pudo conectar con Google Places.');

  const startGoogleLink = (id: string) => {
    setLinkingId(id);
    setGoogleQuery('');
    setGoogleCandidates([]);
  };

  const searchGoogle = async () => {
    if (!googleQuery.trim() || !linkingId) return;
    setGoogleSearching(true);
    try {
      setGoogleCandidates(await adminClient.searchGooglePlaces(googleQuery.trim()));
    } catch (err) {
      setGoogleStatusById((prev) => ({ ...prev, [linkingId]: googleErrorMessage(err) }));
    } finally {
      setGoogleSearching(false);
    }
  };

  const linkGoogle = async (id: string, placeId: string) => {
    setGoogleBusyId(id);
    try {
      const { businessStatus } = await adminClient.linkGooglePlace(id, placeId);
      setGoogleStatusById((prev) => ({
        ...prev,
        [id]: businessStatus === 'CLOSED_PERMANENTLY' ? 'Vinculado — Google lo marca cerrado permanentemente.' : 'Vinculado y actualizado desde Google.',
      }));
      setLinkingId(null);
      loadCatalog();
    } catch (err) {
      setGoogleStatusById((prev) => ({ ...prev, [id]: googleErrorMessage(err) }));
    } finally {
      setGoogleBusyId(null);
    }
  };

  const refreshFromGoogle = async (id: string) => {
    setGoogleBusyId(id);
    try {
      const { businessStatus } = await adminClient.refreshFromGoogle(id);
      setGoogleStatusById((prev) => ({
        ...prev,
        [id]:
          businessStatus === 'CLOSED_PERMANENTLY'
            ? 'Google dice que este lugar cerró permanentemente.'
            : businessStatus === 'CLOSED_TEMPORARILY'
              ? 'Google dice que está cerrado temporalmente.'
              : 'Actualizado desde Google.',
      }));
      loadCatalog();
    } catch (err) {
      setGoogleStatusById((prev) => ({ ...prev, [id]: googleErrorMessage(err) }));
    } finally {
      setGoogleBusyId(null);
    }
  };

  // Radar de desactualizados: nada nuevo del backend — el catálogo ya trae sources[] con
  // capturedAt real, así que la antigüedad de la señal más fresca se deriva acá mismo. "Sin
  // fuentes" se trata como el caso más urgente (ni un solo dato real todavía), no como "sin info".
  const DAY_MS = 24 * 60 * 60 * 1000;
  const staleRestaurants = catalog
    .filter((r) => !r.isDemo)
    .map((r) => {
      const freshestMs = r.sources.reduce((max, s) => Math.max(max, new Date(s.capturedAt).getTime()), 0);
      const daysSinceFresh = freshestMs === 0 ? null : Math.floor((Date.now() - freshestMs) / DAY_MS);
      return { restaurant: r, daysSinceFresh };
    })
    .sort((a, b) => {
      if (a.daysSinceFresh === null) return -1;
      if (b.daysSinceFresh === null) return 1;
      return b.daysSinceFresh - a.daysSinceFresh;
    });

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
          <p className="cj-admin-lead">
            "Demo" marca lugares ficticios de las fixtures originales — nunca se muestran a un usuario real, solo
            acá para que sepas que existen.
          </p>
          <div className="cj-admin-table">
            {catalog.map((r) => (
              <div className="cj-admin-row" key={r.id}>
                <div className="cj-admin-row__head">
                  <div className="cj-admin-row__main">
                    <b>{r.name}</b>
                    <span>
                      {r.cuisine} · {r.neighborhood}
                      {r.address ? ` · ${r.address}` : ''}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {r.isDemo && <Badge tone="danger">Demo</Badge>}
                    <Badge tone={TRUST_TONE[r.trust]}>{r.trust}</Badge>
                  </div>
                </div>
                <p className="cj-admin-row__rationale">{r.trustRationale}</p>
                {!r.isDemo && (
                  <div className="cj-admin-google">
                    {r.googlePlaceId ? (
                      <Button size="sm" variant="secondary" disabled={googleBusyId === r.id} onClick={() => refreshFromGoogle(r.id)}>
                        Refrescar desde Google
                      </Button>
                    ) : linkingId === r.id ? (
                      <div className="cj-admin-form">
                        <input
                          value={googleQuery}
                          onChange={(e) => setGoogleQuery(e.target.value)}
                          placeholder="Buscar en Google Places…"
                          onKeyDown={(e) => e.key === 'Enter' && searchGoogle()}
                        />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Button size="sm" variant="secondary" loading={googleSearching} onClick={searchGoogle} disabled={!googleQuery.trim()}>
                            Buscar
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setLinkingId(null)}>
                            Cancelar
                          </Button>
                        </div>
                        {googleCandidates.map((c) => (
                          <div className="cj-admin-google__candidate" key={c.placeId}>
                            <span>
                              {c.name} — {c.address}
                            </span>
                            <Button size="sm" variant="primary" disabled={googleBusyId === r.id} onClick={() => linkGoogle(r.id, c.placeId)}>
                              Vincular
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => startGoogleLink(r.id)}>
                        Vincular con Google
                      </Button>
                    )}
                    {googleStatusById[r.id] && <p className="cj-admin-google__status">{googleStatusById[r.id]}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="cj-admin-sec">
          <Badge tone="over">Radar de desactualizados</Badge>
          <p className="cj-admin-lead">
            Ordenado por antigüedad de la señal más reciente — nada te avisa solo, pero acá ves dónde conviene
            reverificar primero. La confianza ya baja sola con el tiempo (semivida de 270 días); esto es para que
            vos decidas dónde poner el esfuerzo.
          </p>
          {staleRestaurants.length === 0 && <p className="cj-admin-lead">Todavía no hay restaurantes reales cargados.</p>}
          <div className="cj-admin-table">
            {staleRestaurants.map(({ restaurant: r, daysSinceFresh }) => (
              <div className="cj-admin-row" key={r.id}>
                <div className="cj-admin-row__head">
                  <div className="cj-admin-row__main">
                    <b>{r.name}</b>
                    <span>
                      {r.cuisine} · {r.neighborhood}
                    </span>
                  </div>
                  <Badge tone={daysSinceFresh === null || daysSinceFresh > 180 ? 'danger' : daysSinceFresh > 60 ? 'brand' : 'success'}>
                    {daysSinceFresh === null ? 'Sin fuentes' : `Hace ${daysSinceFresh} días`}
                  </Badge>
                </div>
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
          <Badge tone="over">Lugares nuevos sugeridos</Badge>
          <p className="cj-admin-lead">
            Un usuario recomendó un lugar que todavía no está en el catálogo — antes esto se perdía sin dejar rastro.
            Completá lo que falte (la extracción nunca inventa cocina o barrio si el texto no lo decía) y confirmá
            para crearlo como restaurante real.
          </p>
          {pendingNewPlaces.length === 0 && <p className="cj-admin-lead">No hay lugares nuevos pendientes de revisión.</p>}
          <div className="cj-admin-analysis">
            {pendingNewPlaces.map((p) => {
              const draft = newPlaceDrafts[p.id] ?? { name: p.name, cuisine: p.cuisine, neighborhood: p.neighborhood, address: p.address ?? '' };
              const canConfirm = !!draft.name.trim() && !!draft.cuisine.trim() && !!draft.neighborhood.trim();
              return (
                <div className="cj-admin-match" key={p.id}>
                  <div className="cj-admin-match__head">
                    <Badge tone="brand">{SOURCE_LABEL[p.source]}</Badge>
                  </div>
                  <p>{p.claim}</p>
                  <div className="cj-admin-form">
                    <input value={draft.name} onChange={(e) => updateNewPlaceDraft(p.id, { name: e.target.value })} placeholder="Nombre" />
                    <input value={draft.cuisine} onChange={(e) => updateNewPlaceDraft(p.id, { cuisine: e.target.value })} placeholder="Cocina" />
                    <input
                      value={draft.neighborhood}
                      onChange={(e) => updateNewPlaceDraft(p.id, { neighborhood: e.target.value })}
                      placeholder="Barrio"
                    />
                    <input
                      value={draft.address}
                      onChange={(e) => updateNewPlaceDraft(p.id, { address: e.target.value })}
                      placeholder="Dirección (calle y altura, opcional)"
                    />
                  </div>
                  <div className="cj-admin-pending__actions">
                    <Button size="sm" variant="primary" disabled={newPlaceBusyId === p.id || !canConfirm} onClick={() => confirmNewPlace(p.id)}>
                      Confirmar y crear restaurante
                    </Button>
                    <Button size="sm" variant="secondary" disabled={newPlaceBusyId === p.id} onClick={() => rejectNewPlace(p.id)}>
                      Rechazar
                    </Button>
                  </div>
                </div>
              );
            })}
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
              {analysis.newRestaurants.map((nr, i) => (
                <div className="cj-admin-match" key={`new-${nr.name}-${i}`}>
                  <div className="cj-admin-match__head">
                    <b>{nr.name}</b>
                    <Badge tone="danger">No está en el catálogo</Badge>
                  </div>
                  <p>{nr.claim}</p>
                  <Button size="sm" variant="primary" onClick={() => prefillNewRestaurant(nr)}>
                    Crear como restaurante nuevo
                  </Button>
                </div>
              ))}
              {analysis.matches.length === 0 && analysis.newRestaurants.length === 0 && (
                <p className="cj-admin-lead">No se identificó ningún restaurante real en el texto.</p>
              )}
            </div>
          )}
        </section>

        <section className="cj-admin-sec" id="cj-admin-create-restaurant">
          <Badge tone="over">Agregar restaurante</Badge>
          <div className="cj-admin-form">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nombre" />
            <input value={newCuisine} onChange={(e) => setNewCuisine(e.target.value)} placeholder="Cocina" />
            <input value={newNeighborhood} onChange={(e) => setNewNeighborhood(e.target.value)} placeholder="Barrio" />
            <input value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="Dirección (calle y altura, opcional)" />
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
