import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark,
  CalendarDays,
  Clock,
  Coffee,
  Heart,
  Laptop,
  Layers,
  LocateFixed,
  MapPin as MapPinIcon,
  Search,
  SlidersHorizontal,
  Star,
  UtensilsCrossed,
} from 'lucide-react';
import { LivingMapCanvas, type LivingMapCanvasHandle } from '../../map/LivingMapCanvas';
import { Wordmark } from '../../components/brand';
import { Chip, IconButton, Button } from '../../components/core';
import { CajuPoints, RestaurantCard, BottomSheet, type SheetState } from '../../components/discovery';
import { BrainCard, PromptBar, highlightText } from '../../components/brain';
import { brain } from '../../lib/brain';
import { DEFAULT_MAP_CENTER } from '../../lib/brain/fixtures';
import { getCurrentPosition, haversineKm } from '../../lib/geo/geolocation';
import { useAppStore } from '../../lib/store/useAppStore';
import type { BrainCardData, MapEvent, Restaurant } from '../../types';
import './LivingMap.css';

type ContextChip = 'near' | 'open' | 'date' | 'work' | 'saved';

export function LivingMap() {
  const navigate = useNavigate();
  const {
    saved,
    toggleSaved,
    selectedRestaurantId,
    setSelectedRestaurantId,
    setPendingQuery,
    user,
    setUser,
    hydrateMemory,
    openOverlay,
    userLocation,
    setUserLocation,
    setPendingCaptureStage,
  } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [brainCard, setBrainCard] = useState<BrainCardData | null>(null);
  const [events, setEvents] = useState<MapEvent[]>([]);
  const [activeChip, setActiveChip] = useState<ContextChip>('open');
  const [cuisineFilter, setCuisineFilter] = useState<string | null>(null);
  const [michelinOnly, setMichelinOnly] = useState(false);
  const [venueTypeFilter, setVenueTypeFilter] = useState<'restaurant' | 'cafe' | null>(null);
  const [showEvents, setShowEvents] = useState(true);
  const [brainCardDismissed, setBrainCardDismissed] = useState(false);
  const [query, setQuery] = useState('');
  const [sheetState, setSheetState] = useState<SheetState | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftChip, setDraftChip] = useState<ContextChip>('open');
  const [draftCuisine, setDraftCuisine] = useState<string | null>(null);
  const [draftMichelin, setDraftMichelin] = useState(false);
  const [draftVenueType, setDraftVenueType] = useState<'restaurant' | 'cafe' | null>(null);
  const [draftShowEvents, setDraftShowEvents] = useState(true);
  const mapRef = useRef<LivingMapCanvasHandle>(null);

  // Never an empty map: fetch recommendations as soon as the screen mounts (SPEC-001).
  // The user is hydrated once into the shared store — re-fetching it here on a later
  // visit would stomp any Caju Points earned via Feedback/Knowledge Capture meanwhile.
  useEffect(() => {
    let alive = true;
    hydrateMemory();
    Promise.all([brain.getEvents(), brain.getAllRestaurants(), user ? null : brain.getUser()]).then(([evts, all, u]) => {
      if (!alive) return;
      setEvents(evts);
      setAllRestaurants(all);
      if (u) setUser(u);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Context Chips (Cerca, Abierto ahora, Para una cita, Trabajar, Guardados) re-ask the
  // Recommendation Engine with the active filter — all five genuinely narrow the catalog
  // now (idealFor/tags, saved ids, real opening hours, real distance to `near`).
  // The `near` coords only matter while that chip is active — using them as a dependency
  // unconditionally would refetch every time the location updates from an unrelated FAB tap.
  const nearDep = activeChip === 'near' ? userLocation : null;
  useEffect(() => {
    let alive = true;
    setLoading(true);
    const context = nearDep ? { filter: activeChip, near: nearDep } : { filter: activeChip };
    brain.getRecommendations(context).then((recs) => {
      if (!alive) return;
      setBrainCard(recs.brainCard);
      setBrainCardDismissed(false);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChip, nearDep]);

  // SPEC-001: geolocation is only ever requested in context (a CTA, the "Cerca" chip, the
  // "Mi ubicación" FAB) — never automatically on load. Resolves to null on denial/timeout
  // without blocking the map ("el usuario igualmente puede explorar").
  const requestLocation = async () => {
    const point = await getCurrentPosition();
    if (!point) return;
    setUserLocation(point);
    mapRef.current?.recenter(point);
  };

  // SPEC-001 pills-in-modal: every context/cuisine/venue-type/Michelin/events control lives
  // behind one "Filtros" button instead of always-visible pill rows over the map (they got in
  // the way of the map itself). The sheet edits a draft copy and only commits on "Ver lugares" —
  // same draft→apply pattern as the design v3 handoff's CJ_FILTER_GROUPS sheet.
  const openFilters = () => {
    setDraftChip(activeChip);
    setDraftCuisine(activeCuisineFilter);
    setDraftMichelin(michelinOnly);
    setDraftVenueType(venueTypeFilter);
    setDraftShowEvents(showEvents);
    setFilterOpen(true);
  };

  const applyFilters = () => {
    setActiveChip(draftChip);
    setCuisineFilter(draftCuisine);
    setMichelinOnly(draftMichelin);
    setVenueTypeFilter(draftVenueType);
    setShowEvents(draftShowEvents);
    if (draftChip === 'near' && !userLocation) requestLocation();
    setFilterOpen(false);
  };

  const clearFilters = () => {
    setDraftChip('open');
    setDraftCuisine(null);
    setDraftMichelin(false);
    setDraftVenueType(null);
    setDraftShowEvents(true);
  };

  // The map's pins come from the full catalog (`allRestaurants`, fetched once via
  // getAllRestaurants), never from the Recommendation Engine's top-N — that pipeline is
  // deliberately capped (MAX_RESULTS) for the Brain Card's "today's pick" framing, and with a
  // real multi-hundred-restaurant catalog a capped result set meant the map only ever showed a
  // handful of pins. Cuisine/Michelin/venueType pills filter this full set client-side; the
  // context chips (Cerca/Abierto ahora/etc.) still only drive the Brain Card recommendation.
  const cuisines = Array.from(new Set(allRestaurants.map((r) => r.cuisine))).sort();
  const activeCuisineFilter = cuisineFilter && cuisines.includes(cuisineFilter) ? cuisineFilter : null;
  const isMichelin = (r: Restaurant) => !!(r.michelinStars || r.michelinGreenStar || r.michelinBibGourmand);
  const hasMichelinResults = allRestaurants.some(isMichelin);
  const hasCafeResults = allRestaurants.some((r) => r.venueType === 'cafe');
  const hasRestaurantTypeResults = allRestaurants.some((r) => r.venueType === 'restaurant');
  const visibleRestaurants = allRestaurants
    .filter((r) => (activeCuisineFilter ? r.cuisine === activeCuisineFilter : true))
    .filter((r) => (michelinOnly ? isMichelin(r) : true))
    .filter((r) => (venueTypeFilter ? r.venueType === venueTypeFilter : true));

  const activeFilterCount =
    (activeChip !== 'open' ? 1 : 0) +
    (activeCuisineFilter ? 1 : 0) +
    (michelinOnly ? 1 : 0) +
    (venueTypeFilter ? 1 : 0) +
    (!showEvents ? 1 : 0);
  const draftFilterCount =
    (draftChip !== 'open' ? 1 : 0) + (draftCuisine ? 1 : 0) + (draftMichelin ? 1 : 0) + (draftVenueType ? 1 : 0) + (!draftShowEvents ? 1 : 0);

  const selected = allRestaurants.find((r) => r.id === selectedRestaurantId) ?? null;
  const selectedEvent = events.find((e) => e.id === selectedEventId) ?? null;

  const handleSelectPin = (id: string) => {
    setSelectedEventId(null);
    setSelectedRestaurantId(id);
    setSheetState('peek');
  };

  const handleSelectEvent = (id: string) => {
    setSelectedRestaurantId(null);
    setSheetState(null);
    setSelectedEventId(id);
  };

  const handleMapClick = () => {
    setSelectedRestaurantId(null);
    setSheetState(null);
    setSelectedEventId(null);
  };

  const cycleSheet = () => {
    setSheetState((s) => (s === 'peek' ? 'half' : s === 'half' ? 'full' : 'peek'));
  };

  const openRestaurant = (id: string) => navigate(`/restaurant/${id}`);

  const handleSend = (value: string) => {
    setPendingQuery(value);
    setQuery('');
    navigate('/conversation');
  };

  // "Aportar por voz" opens Knowledge Capture straight to its Voice step (SPEC-015,
  // already real) instead of the picker — the mic promises a voice contribution, not a chat.
  const handleVoice = () => {
    setPendingCaptureStage('voiceInput');
    openOverlay('capture');
  };

  // Real neighborhood, never a fixed label: the closest currently-loaded restaurant's
  // neighborhood once we have a real position, honest city-level fallback otherwise —
  // there's no reverse-geocoding here, so a specific barrio is never guessed without one.
  const nearestNeighborhood =
    userLocation && allRestaurants.length > 0
      ? allRestaurants.reduce((closest, r) => (haversineKm(userLocation, r.position) < haversineKm(userLocation, closest.position) ? r : closest)).neighborhood
      : null;

  return (
    <div className="cj-screen">
      <LivingMapCanvas
        ref={mapRef}
        center={DEFAULT_MAP_CENTER}
        restaurants={visibleRestaurants}
        events={showEvents ? events : []}
        selectedId={selectedRestaurantId}
        selectedEventId={selectedEventId}
        onSelectRestaurant={handleSelectPin}
        onSelectEvent={handleSelectEvent}
        onMapClick={handleMapClick}
        userLocation={userLocation}
      />

      <div className="cj-map-head">
        <Wordmark size={19} />
        <div className="cj-map-head__right">
          {user && <CajuPoints value={user.cajuPoints} size="sm" chip />}
          <button className="cj-avatar" aria-label="Perfil" onClick={() => navigate('/profile')}>
            {user?.initials ?? '…'}
          </button>
        </div>
      </div>

      <div className="cj-filterbar">
        <span className="cj-loc">
          <MapPinIcon size={14} /> {nearestNeighborhood ?? 'Buenos Aires'}
        </span>
        <button className={`cj-filterbtn ${activeFilterCount ? 'on' : ''}`} onClick={openFilters}>
          <SlidersHorizontal size={15} />
          Filtros
          {activeFilterCount > 0 && <span className="cj-filterbtn__count">{activeFilterCount}</span>}
        </button>
      </div>

      <div className="cj-map-fabs">
        <IconButton icon={<Search size={20} />} label="Buscar" variant="float" size="md" onClick={() => openOverlay('search')} />
        <IconButton icon={<Layers size={20} />} label="Capas" variant="float" size="md" />
        <IconButton icon={<LocateFixed size={20} />} label="Mi ubicación" variant="float" size="md" onClick={requestLocation} />
      </div>

      {selected && sheetState && (
        <div className="cj-sheet-anchor">
          <BottomSheet state={sheetState} onGrip={cycleSheet}>
            <div className="cj-peek">
              <RestaurantCard
                compact
                name={selected.name}
                cuisine={selected.cuisine}
                neighborhood={selected.neighborhood}
                price={selected.price}
                tags={selected.tags}
                trust={selected.trust}
                saved={!!saved[selected.id]}
                onSave={() => toggleSaved(selected.id)}
                onClick={cycleSheet}
              />
              {sheetState !== 'peek' && (
                <>
                  <div className="cj-peek__why">{selected.why}</div>
                  <div className="cj-peek__facts">
                    {selected.quickFacts.slice(0, 4).map((f) => (
                      <span className="cj-peek__fact" key={f.label}>
                        {f.label}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {sheetState === 'full' && (
                <Button variant="primary" block onClick={() => openRestaurant(selected.id)}>
                  Ver ficha completa
                </Button>
              )}
            </div>
          </BottomSheet>
        </div>
      )}

      {selectedEvent && (
        <div className="cj-sheet-anchor">
          <BottomSheet state="peek" onGrip={() => setSelectedEventId(null)}>
            <div className="cj-peek cj-event-peek">
              <div className="cj-event-peek__head">
                <span className="cj-event-peek__when">
                  {new Date(selectedEvent.whenAt).toLocaleString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
                <b>{selectedEvent.name}</b>
                {selectedEvent.address && <span>{selectedEvent.address}</span>}
              </div>
              <Button
                variant="primary"
                block
                iconLeft={<MapPinIcon size={16} />}
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedEvent.position.lat},${selectedEvent.position.lng}`, '_blank', 'noopener')}
              >
                Cómo llegar
              </Button>
            </div>
          </BottomSheet>
        </div>
      )}

      <div className="cj-bottom">
        {!selected &&
          !selectedEvent &&
          !brainCardDismissed &&
          (loading || !brainCard ? (
            <div className="cj-brain-skeleton">
              <div className="cj-skel" style={{ width: 38, height: 38, borderRadius: 12 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="cj-skel" style={{ width: '40%', height: 10 }} />
                <div className="cj-skel" style={{ width: '90%', height: 20 }} />
                <div className="cj-skel" style={{ width: '60%', height: 14 }} />
              </div>
            </div>
          ) : (
            <BrainCard
              eyebrow="LUGARCITO · PARA VOS"
              message={highlightText(brainCard.message)}
              sub={brainCard.sub ? highlightText(brainCard.sub) : undefined}
              onClose={() => setBrainCardDismissed(true)}
              actions={
                <>
                  {brainCard.restaurantId && (
                    <Button size="sm" variant="primary" onClick={() => openRestaurant(brainCard.restaurantId!)}>
                      Ver lugar
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleSend('mostrame más opciones')}>
                    Más opciones
                  </Button>
                </>
              }
            />
          ))}

        <PromptBar value={query} onChange={setQuery} onSend={handleSend} onVoice={handleVoice} />
      </div>

      {filterOpen && (
        <div className="cj-overlay">
          <div className="cj-ov-scrim" onClick={() => setFilterOpen(false)} />
          <div className="cj-ov-sheet cj-fov__sheet">
            <div className="cj-ov-grip" />
            <div className="cj-ov-head">
              <h2>Filtros</h2>
              <p>Combiná los que quieras — se aplican todos juntos.</p>
            </div>
            <div className="cj-fov__body">
              <div className="cj-fov__group">
                <span className="cj-fov__glabel">Ocasión</span>
                <div className="cj-fov__row">
                  {!userLocation && (
                    <Chip icon={<LocateFixed size={15} />} onClick={requestLocation}>
                      Usar mi ubicación
                    </Chip>
                  )}
                  <Chip selected={draftChip === 'near'} icon={<MapPinIcon size={15} />} onClick={() => setDraftChip('near')}>
                    Cerca
                  </Chip>
                  <Chip selected={draftChip === 'open'} icon={<Clock size={15} />} onClick={() => setDraftChip('open')}>
                    Abierto ahora
                  </Chip>
                  <Chip selected={draftChip === 'date'} icon={<Heart size={15} />} onClick={() => setDraftChip('date')}>
                    Para una cita
                  </Chip>
                  <Chip selected={draftChip === 'work'} icon={<Laptop size={15} />} onClick={() => setDraftChip('work')}>
                    Trabajar
                  </Chip>
                  <Chip selected={draftChip === 'saved'} brand icon={<Bookmark size={15} />} onClick={() => setDraftChip('saved')}>
                    Guardados
                  </Chip>
                </div>
              </div>

              {hasRestaurantTypeResults && hasCafeResults && (
                <div className="cj-fov__group">
                  <span className="cj-fov__glabel">Tipo de lugar</span>
                  <div className="cj-fov__row">
                    <Chip
                      selected={draftVenueType === 'restaurant'}
                      icon={<UtensilsCrossed size={13} />}
                      onClick={() => setDraftVenueType((v) => (v === 'restaurant' ? null : 'restaurant'))}
                    >
                      Restaurantes
                    </Chip>
                    <Chip
                      selected={draftVenueType === 'cafe'}
                      icon={<Coffee size={13} />}
                      onClick={() => setDraftVenueType((v) => (v === 'cafe' ? null : 'cafe'))}
                    >
                      Cafés
                    </Chip>
                  </div>
                </div>
              )}

              {(hasMichelinResults || events.length > 0) && (
                <div className="cj-fov__group">
                  <span className="cj-fov__glabel">Extras</span>
                  <div className="cj-fov__row">
                    {hasMichelinResults && (
                      <Chip selected={draftMichelin} icon={<Star size={13} />} onClick={() => setDraftMichelin((v) => !v)}>
                        Michelin
                      </Chip>
                    )}
                    {events.length > 0 && (
                      <Chip selected={draftShowEvents} brand icon={<CalendarDays size={13} />} onClick={() => setDraftShowEvents((v) => !v)}>
                        Eventos
                      </Chip>
                    )}
                  </div>
                </div>
              )}

              {cuisines.length > 1 && (
                <div className="cj-fov__group">
                  <span className="cj-fov__glabel">Cocina</span>
                  <div className="cj-fov__row">
                    {cuisines.map((c) => (
                      <Chip key={c} selected={draftCuisine === c} onClick={() => setDraftCuisine((v) => (v === c ? null : c))}>
                        {c}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="cj-fov__foot">
              <Button variant="ghost" size="lg" onClick={clearFilters} disabled={draftFilterCount === 0}>
                Limpiar
              </Button>
              <Button variant="primary" size="lg" block onClick={applyFilters}>
                Ver lugares{draftFilterCount > 0 ? ` (${draftFilterCount})` : ''}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
