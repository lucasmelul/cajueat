import { useState } from 'react';
import { Button } from '../../components/core';
import { adminClient, GooglePlacesNotConfiguredError } from '../../lib/admin/adminClient';
import type { GooglePlaceCandidate } from '../../lib/admin/adminClient';
import type { GeoPoint } from '../../types';

export interface PickedPlace {
  placeId: string;
  name: string;
  address: string;
  position: GeoPoint;
}

interface Props {
  value: PickedPlace | null;
  onChange: (place: PickedPlace | null) => void;
  initialQuery?: string;
}

/**
 * Reusable everywhere an operator needs to pin something to a real place instead of typing
 * lat/lng by hand — search real Google Places candidates, pick one, get position + address for
 * free from the same Details fetch already used to link a restaurant (SPEC-018).
 */
export function GooglePlacePicker({ value, onChange, initialQuery }: Props) {
  const [query, setQuery] = useState(initialQuery ?? '');
  const [candidates, setCandidates] = useState<GooglePlaceCandidate[]>([]);
  const [searching, setSearching] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const errorMessage = (err: unknown) => (err instanceof GooglePlacesNotConfiguredError ? err.message : 'No se pudo conectar con Google Places.');

  const search = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setError('');
    try {
      setCandidates(await adminClient.searchGooglePlaces(query.trim()));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSearching(false);
    }
  };

  const pick = async (placeId: string) => {
    setResolvingId(placeId);
    try {
      const details = await adminClient.getGooglePlaceDetails(placeId);
      onChange({ placeId: details.placeId, name: details.name, address: details.address, position: details.position });
      setCandidates([]);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setResolvingId(null);
    }
  };

  if (value) {
    return (
      <div className="cj-admin-place-picked">
        <span>
          <b>{value.name}</b> — {value.address}
        </span>
        <Button size="sm" variant="ghost" onClick={() => onChange(null)}>
          Cambiar
        </Button>
      </div>
    );
  }

  return (
    <div className="cj-admin-place-picker">
      <div className="cj-admin-place-picker__search">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar lugar en Google Places…" onKeyDown={(e) => e.key === 'Enter' && search()} />
        <Button size="sm" variant="secondary" loading={searching} disabled={!query.trim()} onClick={search}>
          Buscar
        </Button>
      </div>
      {error && <p className="cj-admin-gate__error">{error}</p>}
      {candidates.map((c) => (
        <div className="cj-admin-google__candidate" key={c.placeId}>
          <span>
            {c.name} — {c.address}
          </span>
          <Button size="sm" variant="primary" loading={resolvingId === c.placeId} onClick={() => pick(c.placeId)}>
            Elegir
          </Button>
        </div>
      ))}
    </div>
  );
}
