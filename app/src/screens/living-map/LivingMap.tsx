import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Clock, Heart, Laptop, Layers, LocateFixed, MapPin as MapPinIcon, Search } from 'lucide-react';
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
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [brainCard, setBrainCard] = useState<BrainCardData | null>(null);
  const [events, setEvents] = useState<MapEvent[]>([]);
  const [activeChip, setActiveChip] = useState<ContextChip>('open');
  const [cuisineFilter, setCuisineFilter] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [sheetState, setSheetState] = useState<SheetState | null>(null);
  const mapRef = useRef<LivingMapCanvasHandle>(null);

  // Never an empty map: fetch recommendations as soon as the screen mounts (SPEC-001).
  // The user is hydrated once into the shared store — re-fetching it here on a later
  // visit would stomp any Caju Points earned via Feedback/Knowledge Capture meanwhile.
  useEffect(() => {
    let alive = true;
    hydrateMemory();
    Promise.all([brain.getEvents(), user ? null : brain.getUser()]).then(([evts, u]) => {
      if (!alive) return;
      setEvents(evts);
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
      setRestaurants(recs.restaurants);
      setBrainCard(recs.brainCard);
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

  const selectNear = () => {
    setActiveChip('near');
    if (!userLocation) requestLocation();
  };

  // Cuisine pills: purely client-side over whatever the Recommendation Engine already returned
  // for the active context chip — never a second backend round-trip for what's just a narrower
  // view of the same set. Derived, never hardcoded, so it always matches what's actually on the map.
  // Falls back to no filter if the active chip's results no longer include the selected cuisine.
  const cuisines = Array.from(new Set(restaurants.map((r) => r.cuisine))).sort();
  const activeCuisineFilter = cuisineFilter && cuisines.includes(cuisineFilter) ? cuisineFilter : null;
  const visibleRestaurants = activeCuisineFilter ? restaurants.filter((r) => r.cuisine === activeCuisineFilter) : restaurants;

  const selected = visibleRestaurants.find((r) => r.id === selectedRestaurantId) ?? null;

  const handleSelectPin = (id: string) => {
    setSelectedRestaurantId(id);
    setSheetState('peek');
  };

  const handleMapClick = () => {
    setSelectedRestaurantId(null);
    setSheetState(null);
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
    userLocation && restaurants.length > 0
      ? restaurants.reduce((closest, r) => (haversineKm(userLocation, r.position) < haversineKm(userLocation, closest.position) ? r : closest)).neighborhood
      : null;

  return (
    <div className="cj-screen">
      <LivingMapCanvas
        ref={mapRef}
        center={DEFAULT_MAP_CENTER}
        restaurants={visibleRestaurants}
        events={events}
        selectedId={selectedRestaurantId}
        onSelectRestaurant={handleSelectPin}
        onMapClick={handleMapClick}
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

      <div className="cj-chips">
        <span className="cj-loc">
          <MapPinIcon size={14} /> {nearestNeighborhood ?? 'Buenos Aires'}
        </span>
        <span className="cj-chips__div" />
        {!userLocation && (
          <Chip icon={<LocateFixed size={15} />} onClick={requestLocation}>
            Usar mi ubicación
          </Chip>
        )}
        <Chip selected={activeChip === 'near'} icon={<MapPinIcon size={15} />} onClick={selectNear}>
          Cerca
        </Chip>
        <Chip selected={activeChip === 'open'} icon={<Clock size={15} />} onClick={() => setActiveChip('open')}>
          Abierto ahora
        </Chip>
        <Chip selected={activeChip === 'date'} icon={<Heart size={15} />} onClick={() => setActiveChip('date')}>
          Para una cita
        </Chip>
        <Chip selected={activeChip === 'work'} icon={<Laptop size={15} />} onClick={() => setActiveChip('work')}>
          Trabajar
        </Chip>
        <Chip selected={activeChip === 'saved'} brand icon={<Bookmark size={15} />} onClick={() => setActiveChip('saved')}>
          Guardados
        </Chip>
      </div>

      {cuisines.length > 1 && (
        <div className="cj-chips cj-chips--cuisine">
          <Chip selected={!activeCuisineFilter} onClick={() => setCuisineFilter(null)}>
            Todos
          </Chip>
          {cuisines.map((c) => (
            <Chip key={c} selected={activeCuisineFilter === c} onClick={() => setCuisineFilter(c)}>
              {c}
            </Chip>
          ))}
        </div>
      )}

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

      <div className="cj-bottom">
        {!selected &&
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
              eyebrow="CAJU · PARA VOS"
              message={highlightText(brainCard.message)}
              sub={brainCard.sub ? highlightText(brainCard.sub) : undefined}
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
    </div>
  );
}
