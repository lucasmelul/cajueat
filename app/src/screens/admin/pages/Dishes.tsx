import { useState } from 'react';
import { Badge, Button } from '../../../components/core';
import { adminClient } from '../../../lib/admin/adminClient';
import type { Dish } from '../../../types';
import { useAdminData } from '../AdminDataContext';

const TRUST_TONE: Record<Dish['trust'], 'success' | 'brand' | 'danger'> = { high: 'success', mid: 'brand', low: 'danger' };
const KIND_OPTIONS = ['curator', 'community', 'visit', 'press', 'menu'] as const;
const WEIGHT_OPTIONS = ['strong', 'medium', 'weak'] as const;

/** SPEC-025: platos como entidad propia, misma disciplina de fuentes/confianza que ya existe para restaurantes — nunca un plato sin al menos una fuente real. */
export function Dishes() {
  const { catalog, dishes, setDishes, loadAll } = useAdminData();
  const realRestaurants = catalog.filter((r) => !r.isDemo);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [restaurantId, setRestaurantId] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [kind, setKind] = useState<(typeof KIND_OPTIONS)[number]>('curator');
  const [weight, setWeight] = useState<(typeof WEIGHT_OPTIONS)[number]>('medium');
  const [claim, setClaim] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const [addSourceId, setAddSourceId] = useState<string | null>(null);
  const [addSourceName, setAddSourceName] = useState('');
  const [addSourceKind, setAddSourceKind] = useState<(typeof KIND_OPTIONS)[number]>('community');
  const [addSourceWeight, setAddSourceWeight] = useState<(typeof WEIGHT_OPTIONS)[number]>('weak');
  const [addSourceClaim, setAddSourceClaim] = useState('');
  const [addSourceBusy, setAddSourceBusy] = useState(false);

  const canCreate = !!name.trim() && !!category.trim() && !!restaurantId && !!sourceName.trim();

  const create = async () => {
    if (!canCreate) return;
    setCreating(true);
    setCreateError('');
    try {
      const created = await adminClient.createDish({
        name: name.trim(),
        category: category.trim(),
        restaurantId,
        source: { name: sourceName.trim(), kind, weight, ...(claim.trim() ? { claim: claim.trim() } : {}) },
      });
      setDishes((prev) => [created, ...prev]);
      setName('');
      setCategory('');
      setSourceName('');
      setClaim('');
      loadAll();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'No se pudo crear el plato.');
    } finally {
      setCreating(false);
    }
  };

  const startAddSource = (dishId: string) => {
    setAddSourceId(dishId);
    setAddSourceName('');
    setAddSourceClaim('');
  };

  const submitAddSource = async (dishId: string) => {
    if (!addSourceName.trim()) return;
    setAddSourceBusy(true);
    try {
      const updated = await adminClient.addDishSource(dishId, {
        name: addSourceName.trim(),
        kind: addSourceKind,
        weight: addSourceWeight,
        ...(addSourceClaim.trim() ? { claim: addSourceClaim.trim() } : {}),
      });
      setDishes((prev) => prev.map((d) => (d.id === dishId ? updated : d)));
      setAddSourceId(null);
    } finally {
      setAddSourceBusy(false);
    }
  };

  const restaurantName = (id: string) => catalog.find((r) => r.id === id)?.name ?? '(restaurante desconocido)';

  return (
    <div>
      <h1 className="cj-admin-page-title">Platos</h1>
      <p className="cj-admin-lead">
        Un plato es una entidad propia con su propia confianza (SPEC-025) — nunca se muestra en Conversation sin al
        menos una fuente real que lo respalde. Se agrupan por categoría para responder "¿dónde está el mejor X?"
        entre restaurantes.
      </p>

      <section className="cj-admin-sec" id="cj-admin-create-dish">
        <Badge tone="over">Agregar plato</Badge>
        <div className="cj-admin-form">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del plato (ej: Chirashi de salmón)" />
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Categoría (ej: sushi, torta vasca, brunch)" />
          <select value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)}>
            <option value="">Restaurante…</option>
            {realRestaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <input value={sourceName} onChange={(e) => setSourceName(e.target.value)} placeholder="Nombre de la fuente (ej: Operador Caju)" />
          <select value={kind} onChange={(e) => setKind(e.target.value as (typeof KIND_OPTIONS)[number])}>
            {KIND_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          <select value={weight} onChange={(e) => setWeight(e.target.value as (typeof WEIGHT_OPTIONS)[number])}>
            {WEIGHT_OPTIONS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
          <input value={claim} onChange={(e) => setClaim(e.target.value)} placeholder="Afirmación concreta (opcional)" />
          {createError && <p className="cj-admin-gate__error">{createError}</p>}
          <Button variant="primary" onClick={create} loading={creating} disabled={!canCreate}>
            Crear plato
          </Button>
        </div>
      </section>

      <section className="cj-admin-sec">
        <Badge tone="over">Catálogo de platos</Badge>
        {dishes.length === 0 && <p className="cj-admin-lead">Todavía no hay platos cargados.</p>}
        <div className="cj-admin-table">
          {dishes.map((d) => (
            <div className="cj-admin-row" key={d.id}>
              <div className="cj-admin-row__head">
                <div className="cj-admin-row__main">
                  <b>{d.name}</b>
                  <span>
                    {d.category} · {restaurantName(d.restaurantId)}
                  </span>
                </div>
                <Badge tone={TRUST_TONE[d.trust]}>{d.trust}</Badge>
              </div>
              <p className="cj-admin-row__rationale">{d.trustRationale}</p>
              {addSourceId === d.id ? (
                <div className="cj-admin-form">
                  <input value={addSourceName} onChange={(e) => setAddSourceName(e.target.value)} placeholder="Nombre de la fuente" />
                  <select value={addSourceKind} onChange={(e) => setAddSourceKind(e.target.value as (typeof KIND_OPTIONS)[number])}>
                    {KIND_OPTIONS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                  <select value={addSourceWeight} onChange={(e) => setAddSourceWeight(e.target.value as (typeof WEIGHT_OPTIONS)[number])}>
                    {WEIGHT_OPTIONS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                  <input value={addSourceClaim} onChange={(e) => setAddSourceClaim(e.target.value)} placeholder="Afirmación concreta (opcional)" />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button size="sm" variant="primary" loading={addSourceBusy} disabled={!addSourceName.trim()} onClick={() => submitAddSource(d.id)}>
                      Agregar fuente
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setAddSourceId(null)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <Button size="sm" variant="secondary" onClick={() => startAddSource(d.id)}>
                  Agregar fuente
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
