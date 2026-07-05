import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Chip } from '../components/core';
import { RestaurantCard } from '../components/discovery';
import { brain } from '../lib/brain';
import type { Restaurant } from '../types';
import './SearchOverlay.css';

const SUGGESTIONS = ['Sushi', 'Café para trabajar', 'Algo romántico', 'Con terraza', 'Para grupos'];

export interface SearchOverlayProps {
  onClose: () => void;
  onSelectRestaurant: (id: string) => void;
}

/** Spotlight-style search — "otra forma de conversar con el Brain", nunca un buscador de palabras (SPEC-008). */
export function SearchOverlay({ onClose, onSelectRestaurant }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      brain.search(trimmed).then((r) => {
        setResults(r);
        setLoading(false);
      });
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const openResult = (id: string) => {
    onClose();
    onSelectRestaurant(id);
  };

  return (
    <div className="cj-search-ov">
      <div className="cj-search-bar">
        <Search size={19} />
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscá algo, un plato, un barrio…" />
        <button className="cj-search-close" onClick={onClose} aria-label="Cerrar búsqueda">
          <X size={20} />
        </button>
      </div>

      <p className="cj-search-hint">Buscamos por nombre, cocina, barrio o para qué ocasión — no hace falta ser exacto.</p>

      <div className="cj-search-body">
        {!query.trim() && (
          <div className="cj-search-suggest">
            {SUGGESTIONS.map((s) => (
              <Chip key={s} onClick={() => setQuery(s)}>
                {s}
              </Chip>
            ))}
          </div>
        )}

        {query.trim() && (
          <>
            <div className="cj-search-label">{loading ? 'Buscando…' : 'Esto encontramos'}</div>
            <div className="cj-search-results">
              {results.map((r) => (
                <RestaurantCard
                  key={r.id}
                  compact
                  name={r.name}
                  cuisine={r.cuisine}
                  neighborhood={r.neighborhood}
                  price={r.price}
                  tags={r.tags}
                  trust={r.trust}
                  onClick={() => openResult(r.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
