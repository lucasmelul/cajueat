import { useEffect, useState } from 'react';
import { Badge, Button } from '../../../components/core';
import { adminClient } from '../../../lib/admin/adminClient';
import type { PendingContribution } from '../../../lib/admin/adminClient';
import { useAdminData } from '../AdminDataContext';

const SOURCE_LABEL: Record<PendingContribution['source'], string> = { note: 'Nota', photo: 'Foto', voice: 'Voz', conversation: 'Conversación', link: 'TikTok' };

/** SPEC-019 + su extensión: dos colas de moderación distintas (agregar fuente a un lugar existente vs. crear uno nuevo), mismo "el operador confirma, nunca se aplica solo". */
export function Moderation() {
  const {
    pendingContributions,
    setPendingContributions,
    pendingNewPlaces,
    setPendingNewPlaces,
    pendingDishMentions,
    setPendingDishMentions,
    pendingLinks,
    setPendingLinks,
    loadAll,
  } = useAdminData();

  const [pendingBusyId, setPendingBusyId] = useState<string | null>(null);
  const [newPlaceBusyId, setNewPlaceBusyId] = useState<string | null>(null);
  const [newPlaceDrafts, setNewPlaceDrafts] = useState<Record<string, { name: string; cuisine: string; neighborhood: string; address: string }>>({});
  const [dishMentionBusyId, setDishMentionBusyId] = useState<string | null>(null);
  const [linkBusyId, setLinkBusyId] = useState<string | null>(null);

  // Backfills a draft for any suggestion this page hasn't seen yet — covers both the initial
  // load and a later loadAll() picking up a suggestion that arrived after this page mounted.
  useEffect(() => {
    setNewPlaceDrafts((prev) => {
      const next = { ...prev };
      for (const p of pendingNewPlaces) {
        if (!next[p.id]) next[p.id] = { name: p.name, cuisine: p.cuisine, neighborhood: p.neighborhood, address: p.address ?? '' };
      }
      return next;
    });
  }, [pendingNewPlaces]);

  const confirmPending = async (id: string) => {
    setPendingBusyId(id);
    try {
      await adminClient.confirmPendingContribution(id);
      setPendingContributions((prev) => prev.filter((c) => c.id !== id));
      loadAll();
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
      loadAll();
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

  const confirmDishMention = async (id: string) => {
    setDishMentionBusyId(id);
    try {
      await adminClient.confirmPendingDishMention(id);
      setPendingDishMentions((prev) => prev.filter((d) => d.id !== id));
      loadAll();
    } finally {
      setDishMentionBusyId(null);
    }
  };

  const rejectDishMention = async (id: string) => {
    setDishMentionBusyId(id);
    try {
      await adminClient.rejectPendingDishMention(id);
      setPendingDishMentions((prev) => prev.filter((d) => d.id !== id));
    } finally {
      setDishMentionBusyId(null);
    }
  };

  const markLinkReviewed = async (id: string) => {
    setLinkBusyId(id);
    try {
      await adminClient.markPendingLinkReviewed(id);
      setPendingLinks((prev) => prev.filter((l) => l.id !== id));
    } finally {
      setLinkBusyId(null);
    }
  };

  const rejectLink = async (id: string) => {
    setLinkBusyId(id);
    try {
      await adminClient.rejectPendingLink(id);
      setPendingLinks((prev) => prev.filter((l) => l.id !== id));
    } finally {
      setLinkBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="cj-admin-page-title">Moderación</h1>

      <section className="cj-admin-sec">
        <Badge tone="over">Aportes de usuarios · pendientes</Badge>
        <p className="cj-admin-lead">
          Lo que un usuario le enseñó al Brain sobre un lugar real (Nota, Foto, Voz, o de paso en una conversación) —
          nunca llega al catálogo compartido sin que lo confirmes acá.
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
          Completá lo que falte (la extracción nunca inventa cocina o barrio si el texto no lo decía) y confirmá para
          crearlo como restaurante real.
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
        <Badge tone="over">Platos mencionados · pendientes</Badge>
        <p className="cj-admin-lead">
          Un plato específico que un usuario nombró para un restaurante real (SPEC-025) — se confirma como fuente
          "Un usuario" · community · weak, igual que un aporte a nivel de restaurante.
        </p>
        {pendingDishMentions.length === 0 && <p className="cj-admin-lead">No hay platos pendientes de revisión.</p>}
        <div className="cj-admin-analysis">
          {pendingDishMentions.map((d) => (
            <div className="cj-admin-match" key={d.id}>
              <div className="cj-admin-match__head">
                <b>
                  {d.dishName} — {d.restaurantName}
                </b>
                <Badge tone="brand">{SOURCE_LABEL[d.source]}</Badge>
              </div>
              <p>
                {d.category} · {d.claim}
              </p>
              <div className="cj-admin-pending__actions">
                <Button size="sm" variant="primary" disabled={dishMentionBusyId === d.id} onClick={() => confirmDishMention(d.id)}>
                  Confirmar y agregar como plato
                </Button>
                <Button size="sm" variant="secondary" disabled={dishMentionBusyId === d.id} onClick={() => rejectDishMention(d.id)}>
                  Rechazar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cj-admin-sec">
        <Badge tone="over">Reels / TikTok / links · pendientes</Badge>
        <p className="cj-admin-lead">
          Lugarcito no puede leer el contenido de un Reel o link todavía (SPEC-015) — abrí el link vos mismo y, si
          corresponde, agregá una fuente o creá el lugar a mano con las herramientas de arriba. Esto solo limpia la
          cola una vez que lo revisaste.
        </p>
        {pendingLinks.length === 0 && <p className="cj-admin-lead">No hay links pendientes de revisión.</p>}
        <div className="cj-admin-analysis">
          {pendingLinks.map((l) => (
            <div className="cj-admin-match" key={l.id}>
              <p>
                <a href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.url}
                </a>
              </p>
              <div className="cj-admin-pending__actions">
                <Button size="sm" variant="primary" disabled={linkBusyId === l.id} onClick={() => markLinkReviewed(l.id)}>
                  Marcar como revisado
                </Button>
                <Button size="sm" variant="secondary" disabled={linkBusyId === l.id} onClick={() => rejectLink(l.id)}>
                  Descartar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
