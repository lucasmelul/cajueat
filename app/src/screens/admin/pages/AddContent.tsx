import { useState } from 'react';
import { Badge, Button } from '../../../components/core';
import { adminClient } from '../../../lib/admin/adminClient';
import type { CuratorAnalysis, NewRestaurantMention } from '../../../lib/admin/adminClient';
import { useAdminData } from '../AdminDataContext';

export function AddContent() {
  const { loadAll } = useAdminData();

  const [curatorHandle, setCuratorHandle] = useState('');
  const [curatorText, setCuratorText] = useState('');
  const [analysis, setAnalysis] = useState<CuratorAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [confirmedIdx, setConfirmedIdx] = useState<Set<number>>(new Set());
  const [confirmedDishIdx, setConfirmedDishIdx] = useState<Set<number>>(new Set());

  const [newName, setNewName] = useState('');
  const [newCuisine, setNewCuisine] = useState('');
  const [newNeighborhood, setNewNeighborhood] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newWhy, setNewWhy] = useState('');
  const [creating, setCreating] = useState(false);
  const [createdMsg, setCreatedMsg] = useState('');

  const runAnalysis = async () => {
    if (!curatorText.trim() || !curatorHandle.trim()) return;
    setAnalyzing(true);
    setAnalysis(null);
    setConfirmedIdx(new Set());
    setConfirmedDishIdx(new Set());
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
    loadAll();
  };

  // SPEC-025: same find-or-create discipline — confirming a dish the curator text named for a real, matched restaurant.
  const confirmDishMatch = async (index: number) => {
    if (!analysis || !curatorHandle.trim()) return;
    const match = analysis.dishMatches[index];
    await adminClient.confirmDishMatch({
      restaurantId: match.restaurantId,
      dishName: match.dishName,
      category: match.category,
      name: curatorHandle.trim(),
      kind: 'curator',
      weight: match.suggestedWeight,
      claim: match.claim,
    });
    setConfirmedDishIdx((prev) => new Set(prev).add(index));
    loadAll();
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
      loadAll();
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <h1 className="cj-admin-page-title">Agregar contenido</h1>

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
            {analysis.dishMatches.map((m, i) => (
              <div className={`cj-admin-match ${confirmedDishIdx.has(i) ? 'is-confirmed' : ''}`} key={`dish-${m.restaurantId}-${m.dishName}-${i}`}>
                <div className="cj-admin-match__head">
                  <b>
                    {m.dishName} — {m.restaurantName}
                  </b>
                  <Badge tone="brand">{m.suggestedWeight}</Badge>
                </div>
                <p>
                  {m.category} · {m.claim}
                </p>
                <Button
                  size="sm"
                  variant={confirmedDishIdx.has(i) ? 'secondary' : 'primary'}
                  disabled={confirmedDishIdx.has(i) || !curatorHandle.trim()}
                  onClick={() => confirmDishMatch(i)}
                >
                  {confirmedDishIdx.has(i) ? 'Agregado' : 'Confirmar y agregar como plato'}
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
            {analysis.matches.length === 0 && analysis.newRestaurants.length === 0 && analysis.dishMatches.length === 0 && (
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
  );
}
