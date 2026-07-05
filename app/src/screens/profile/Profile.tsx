import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, X } from 'lucide-react';
import { Badge, Button, Chip } from '../../components/core';
import { CajuPoints, RestaurantCard } from '../../components/discovery';
import { BrainMark } from '../../components/brain';
import { brain } from '../../lib/brain';
import { useAppStore } from '../../lib/store/useAppStore';
import type { Restaurant } from '../../types';
import './Profile.css';

const CONTRIBUTIONS = [
  { label: 'Confirmaste horarios de Anafe', when: 'hace 2 días', points: 15 },
  { label: 'Subiste una foto del omakase', when: 'hace 1 semana', points: 20 },
  { label: 'Respondiste un quiz de ambiente', when: 'hace 2 semanas', points: 10 },
];

/** How the Brain understands the user — not a social profile (SPEC-010, CP-011). */
export function Profile() {
  const navigate = useNavigate();
  const { user, setUser, saved, dna, removeDnaTag, addDnaTag, openOverlay, hydrateMemory } = useAppStore();
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!user) brain.getUser().then(setUser);
    hydrateMemory();
    brain.getAllRestaurants().then(setAllRestaurants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const savedList = allRestaurants.filter((r) => saved[r.id]);

  const addTag = () => {
    const label = window.prompt('¿Qué más le enseñamos al Brain sobre vos?')?.trim();
    if (label) addDnaTag(label);
  };

  return (
    <div className="cj-prof">
      <div className="cj-prof-scroll">
        <div className="cj-prof-head">
          <div className="cj-prof-av">{user?.initials ?? '…'}</div>
          <h1>{user?.name ?? 'Vos'}</h1>
          {user && <CajuPoints value={user.cajuPoints} size="lg" unit="Caju Points" />}
        </div>

        <div className="cj-prof-nudge" onClick={() => openOverlay('feedback')}>
          <BrainMark size={34} radius={11} />
          <div className="cj-prof-nudge__t">
            <b>¿Cómo estuvo Osaka?</b>
            <span>Contame en 20s y mejorás tus próximas recomendaciones.</span>
          </div>
          <ChevronRight size={20} />
        </div>

        <section className="cj-prof-sec">
          <div className="cj-prof-sech">
            <Badge tone="over">Tu ADN gastronómico</Badge>
            <button className="cj-prof-edit" onClick={() => setEditing((e) => !e)}>
              {editing ? 'Listo' : 'Editar'}
            </button>
          </div>
          <p className="cj-prof-lead">Así te entiende el Brain hoy. Editá lo que no cuadre.</p>
          <div className="cj-dna">
            {dna.map((d) => (
              <Chip key={d.id} as={editing ? 'button' : 'span'} icon={editing ? <X size={13} /> : null} onClick={editing ? () => removeDnaTag(d.id) : undefined}>
                {d.label}
              </Chip>
            ))}
            {editing && (
              <Chip as="button" brand selected icon={<Plus size={13} />} onClick={addTag}>
                Agregar
              </Chip>
            )}
          </div>
        </section>

        <section className="cj-prof-sec">
          <div className="cj-prof-sech">
            <Badge tone="over">Guardados</Badge>
            <span className="cj-prof-count">{savedList.length}</span>
          </div>
          <div className="cj-prof-saved">
            {savedList.length > 0 ? (
              savedList.map((r) => (
                <RestaurantCard
                  key={r.id}
                  compact
                  name={r.name}
                  cuisine={r.cuisine}
                  neighborhood={r.neighborhood}
                  price={r.price}
                  tags={r.tags}
                  trust={r.trust}
                  onClick={() => navigate(`/restaurant/${r.id}`)}
                />
              ))
            ) : (
              <p className="cj-empty">Todavía no guardaste lugares. Tocá el marcador en cualquier ficha.</p>
            )}
          </div>
        </section>

        <section className="cj-prof-sec">
          <Badge tone="over">Tus aportes</Badge>
          <div className="cj-timeline">
            {CONTRIBUTIONS.map((c) => (
              <div className="cj-tl" key={c.label}>
                <span className="cj-tl__dot" />
                <div>
                  <b>{c.label}</b>
                  <span>
                    {c.when} · +{c.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="brandGhost" size="md" block iconLeft={<Plus size={18} />} onClick={() => openOverlay('capture')}>
            Aportar conocimiento
          </Button>
        </section>
      </div>
    </div>
  );
}
