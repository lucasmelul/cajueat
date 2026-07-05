import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Armchair,
  ArrowRight,
  Bookmark,
  CalendarCheck,
  Check,
  ChevronLeft,
  CircleCheck,
  CircleMinus,
  Clock,
  FolderPlus,
  Heart,
  Laptop,
  Navigation,
  Share2,
  Sun,
  ThumbsUp,
  UtensilsCrossed,
  Users,
  Volume2,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { Badge, Button, Chip } from '../../components/core';
import { RestaurantCard } from '../../components/discovery';
import { BrainMark, SourceChip, TrustMeter } from '../../components/brain';
import { brain } from '../../lib/brain';
import { useAppStore } from '../../lib/store/useAppStore';
import type { Restaurant as RestaurantData } from '../../types';
import './Restaurant.css';

const FACT_ICONS: Record<string, LucideIcon> = {
  wallet: Wallet,
  heart: Heart,
  armchair: Armchair,
  'calendar-check': CalendarCheck,
  clock: Clock,
  'circle-check': CircleCheck,
  users: Users,
  'volume-2': Volume2,
  laptop: Laptop,
  sun: Sun,
};

/** External deep link only — no in-app navigation (CP-070 Maps Strategy, SPEC-003). */
function directionsUrl(r: RestaurantData) {
  return `https://www.google.com/maps/dir/?api=1&destination=${r.position.lat},${r.position.lng}`;
}

async function shareRestaurant(r: RestaurantData) {
  const shareData = { title: r.name, text: r.why, url: window.location.href };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch {
      // user cancelled — nothing to do
    }
  } else {
    await navigator.clipboard.writeText(shareData.url);
  }
}

export function Restaurant() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { saved, toggleSaved, setPendingQuery, hydrateMemory, addToCollectionByName } = useAppStore();

  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [similar, setSimilar] = useState<RestaurantData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    setLoading(true);
    hydrateMemory();
    Promise.all([brain.getRestaurant(id), brain.getSimilarRestaurants(id, 2)]).then(([r, sim]) => {
      if (!alive) return;
      setRestaurant(r ?? null);
      setSimilar(sim);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [id]);

  const askCaju = () => {
    if (!restaurant) return;
    setPendingQuery(`¿Vale la pena ${restaurant.name} para una cita?`);
    navigate('/conversation');
  };

  const addToCollection = () => {
    if (!restaurant) return;
    const name = window.prompt('¿A qué colección lo agregamos? (nueva o existente)')?.trim();
    if (name) addToCollectionByName(name, restaurant.id);
  };

  if (loading || !restaurant) {
    return (
      <div className="cj-rest-scr">
        <div className="cj-rest-skel">
          <div className="cj-skel" style={{ height: 260, borderRadius: 18 }} />
          <div className="cj-skel" style={{ width: '60%', height: 28 }} />
          <div className="cj-skel" style={{ width: '90%', height: 60 }} />
        </div>
      </div>
    );
  }

  const isSaved = !!saved[restaurant.id];

  return (
    <div className="cj-rest-scr">
      <div className="cj-rest-scroll">
        {/* HERO */}
        <div className="cj-hero">
          <div className="cj-hero__img">
            <div className="cj-hero__ph">
              <UtensilsCrossed size={40} />
            </div>
          </div>
          <div className="cj-hero__grad" />
          <div className="cj-hero__top">
            <button className="cj-round" onClick={() => navigate(-1)} aria-label="Volver">
              <ChevronLeft size={22} />
            </button>
            <div className="cj-hero__top-r">
              <button className="cj-round" aria-label="Compartir" onClick={() => shareRestaurant(restaurant)}>
                <Share2 size={18} />
              </button>
              <button className="cj-round" aria-label="Agregar a colección" onClick={addToCollection}>
                <FolderPlus size={18} />
              </button>
              <button className={`cj-round ${isSaved ? 'on' : ''}`} onClick={() => toggleSaved(restaurant.id)} aria-label="Guardar">
                <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
          <div className="cj-hero__info">
            <div className="cj-hero__meta">
              <Badge tone="brand">Recomendado</Badge>
              <span>
                {restaurant.cuisine} · {restaurant.neighborhood}
              </span>
            </div>
            <h1 className="cj-hero__name">{restaurant.name}</h1>
            <div className="cj-hero__row">
              <TrustMeter level={restaurant.trust} pill />
              <span className="cj-hero__price">{restaurant.price}</span>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="cj-rest-body">
          {/* Brain summary — the decisive info, before any scroll */}
          <section className="cj-sec">
            <div className="cj-brainlead">
              <BrainMark size={28} radius={9} />
              <p className="cj-brainlead__txt">{restaurant.summary}</p>
            </div>
          </section>

          {/* Quick facts */}
          <section className="cj-sec">
            <div className="cj-facts">
              {restaurant.quickFacts.map((f) => {
                const Icon = FACT_ICONS[f.icon] ?? CircleCheck;
                return (
                  <div className="cj-fact" key={f.label}>
                    <Icon size={17} /> {f.label}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Personality */}
          <section className="cj-sec">
            <Badge tone="over">Así es este lugar</Badge>
            <div className="cj-personality">
              {restaurant.personality.map((p) => (
                <Chip key={p} as="span">
                  {p}
                </Chip>
              ))}
            </div>
          </section>

          {/* Qué pedir */}
          <section className="cj-sec">
            <Badge tone="over">Qué pedir</Badge>
            <div className="cj-order">
              {restaurant.order.map((o) => (
                <div className="cj-order__row" key={o.when}>
                  <span className="cj-order__when">{o.when}</span>
                  <span className="cj-order__dish">{o.dish}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Brain tips */}
          <section className="cj-sec">
            <Badge tone="over">Brain Tips</Badge>
            <div className="cj-tips">
              {restaurant.tips.map((t) => (
                <div className="cj-tip" key={t}>
                  <Check size={15} /> {t}
                </div>
              ))}
            </div>
          </section>

          {/* Why / sources — evidence, never bare confidence (SPEC-007) */}
          <section className="cj-sec">
            <Badge tone="over">¿Por qué te lo recomendé?</Badge>
            <p className="cj-why">{restaurant.why}</p>
            <div className="cj-sources">
              {restaurant.sources.map((s) => (
                <SourceChip key={s.name} name={s.name} kind={s.kind} weight={s.weight} />
              ))}
            </div>
          </section>

          {/* Ideal / no ideal */}
          <section className="cj-sec cj-idealgrid">
            <div className="cj-ideal">
              <div className="cj-ideal__h cj-ideal__h--yes">
                <ThumbsUp size={15} /> Ideal para
              </div>
              {restaurant.idealFor.map((x) => (
                <div className="cj-ideal__row" key={x}>
                  {x}
                </div>
              ))}
            </div>
            <div className="cj-ideal">
              <div className="cj-ideal__h cj-ideal__h--no">
                <CircleMinus size={15} /> No ideal para
              </div>
              {restaurant.notFor.map((x) => (
                <div className="cj-ideal__row" key={x}>
                  {x}
                </div>
              ))}
            </div>
          </section>

          {/* Nearby */}
          {similar.length > 0 && (
            <section className="cj-sec">
              <Badge tone="over">Cerca de acá</Badge>
              <p className="cj-why">Si venís hasta acá, a pocas cuadras tenés:</p>
              <div className="cj-nearby">
                {similar.map((n) => (
                  <RestaurantCard
                    key={n.id}
                    compact
                    name={n.name}
                    cuisine={n.cuisine}
                    neighborhood={n.neighborhood}
                    price={n.price}
                    tags={n.tags}
                    trust={n.trust}
                    onClick={() => navigate(`/restaurant/${n.id}`)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Ask */}
          <section className="cj-sec">
            <button className="cj-ask" onClick={askCaju}>
              <BrainMark size={26} radius={8} />
              <span>Preguntale a Caju sobre este lugar</span>
              <ArrowRight size={18} />
            </button>
          </section>
        </div>
      </div>

      {/* Sticky primary CTA — one action, external deep link (never in-app navigation) */}
      <div className="cj-rest-cta">
        <Button
          variant="primary"
          size="lg"
          block
          iconLeft={<Navigation size={18} />}
          onClick={() => window.open(directionsUrl(restaurant), '_blank', 'noopener')}
        >
          Cómo llegar
        </Button>
      </div>
    </div>
  );
}
