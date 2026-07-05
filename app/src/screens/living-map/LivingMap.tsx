import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ChevronDown, Clock, Heart, Laptop, Layers, LocateFixed, MapPin as MapPinIcon } from 'lucide-react';
import { LivingMapCanvas } from '../../map/LivingMapCanvas';
import { Wordmark } from '../../components/brand';
import { Chip, IconButton, Button } from '../../components/core';
import { CajuPoints, RestaurantCard, BottomSheet, type SheetState } from '../../components/discovery';
import { BrainCard, PromptBar, highlightText } from '../../components/brain';
import { brain } from '../../lib/brain';
import { DEFAULT_MAP_CENTER } from '../../lib/brain/fixtures';
import { useAppStore } from '../../lib/store/useAppStore';
import type { BrainCardData, MapEvent, Restaurant } from '../../types';
import './LivingMap.css';

type ContextChip = 'near' | 'open' | 'date' | 'work' | 'saved';

export function LivingMap() {
  const navigate = useNavigate();
  const { saved, toggleSaved, selectedRestaurantId, setSelectedRestaurantId, setPendingQuery, user, setUser, hydrateMemory } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [brainCard, setBrainCard] = useState<BrainCardData | null>(null);
  const [events, setEvents] = useState<MapEvent[]>([]);
  const [activeChip, setActiveChip] = useState<ContextChip>('open');
  const [query, setQuery] = useState('');
  const [sheetState, setSheetState] = useState<SheetState | null>(null);

  // Never an empty map: fetch recommendations as soon as the screen mounts (SPEC-001).
  // The user is hydrated once into the shared store — re-fetching it here on a later
  // visit would stomp any Caju Points earned via Feedback/Knowledge Capture meanwhile.
  useEffect(() => {
    let alive = true;
    hydrateMemory();
    Promise.all([brain.getRecommendations(), brain.getEvents(), user ? null : brain.getUser()]).then(([recs, evts, u]) => {
      if (!alive) return;
      setRestaurants(recs.restaurants);
      setBrainCard(recs.brainCard);
      setEvents(evts);
      if (u) setUser(u);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = restaurants.find((r) => r.id === selectedRestaurantId) ?? null;

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

  // Knowledge Capture (voice-first import, SPEC-004) doesn't exist yet — route to
  // Conversation for now rather than leaving the mic as a dead tap.
  const handleVoice = () => navigate('/conversation');

  return (
    <div className="cj-screen">
      <LivingMapCanvas
        center={DEFAULT_MAP_CENTER}
        restaurants={restaurants}
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
        <button className="cj-loc" type="button">
          <MapPinIcon size={14} /> Palermo <ChevronDown size={13} />
        </button>
        <span className="cj-chips__div" />
        <Chip selected={activeChip === 'near'} icon={<MapPinIcon size={15} />} onClick={() => setActiveChip('near')}>
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

      <div className="cj-map-fabs">
        <IconButton icon={<Layers size={20} />} label="Capas" variant="float" size="md" />
        <IconButton icon={<LocateFixed size={20} />} label="Mi ubicación" variant="float" size="md" />
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
              sub={brainCard.sub}
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
