import { useState } from 'react';
import { Badge, Button } from '../../../components/core';
import { adminClient, GooglePlacesNotConfiguredError } from '../../../lib/admin/adminClient';
import type { GooglePlaceCandidate } from '../../../lib/admin/adminClient';
import type { Restaurant } from '../../../types';
import { useAdminData } from '../AdminDataContext';

const TRUST_TONE: Record<Restaurant['trust'], 'success' | 'brand' | 'danger'> = { high: 'success', mid: 'brand', low: 'danger' };

export function Catalog() {
  const { catalog, loadAll } = useAdminData();

  const [linkingId, setLinkingId] = useState<string | null>(null);
  const [googleQuery, setGoogleQuery] = useState('');
  const [googleCandidates, setGoogleCandidates] = useState<GooglePlaceCandidate[]>([]);
  const [googleSearching, setGoogleSearching] = useState(false);
  const [googleBusyId, setGoogleBusyId] = useState<string | null>(null);
  const [googleStatusById, setGoogleStatusById] = useState<Record<string, string>>({});

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
      loadAll();
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
      loadAll();
    } catch (err) {
      setGoogleStatusById((prev) => ({ ...prev, [id]: googleErrorMessage(err) }));
    } finally {
      setGoogleBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="cj-admin-page-title">Catálogo · confianza</h1>
      <p className="cj-admin-lead">
        "Demo" marca lugares ficticios de las fixtures originales — nunca se muestran a un usuario real, solo acá
        para que sepas que existen.
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
    </div>
  );
}
