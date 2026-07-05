import { useEffect, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import maplibregl, { Map as MapLibreMap, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin } from '../components/discovery/MapPin';
import type { GeoPoint, MapEvent, Restaurant } from '../types';
import './LivingMapCanvas.css';

/**
 * Free, no-API-key vector basemap (CP-070 Maps Strategy: OSS-first, reduce
 * Google Maps dependency; Google/Apple Maps are only used for the external
 * "Cómo llegar" deep link, never in-app navigation). "positron" is the
 * calm/muted style closest to the product's Apple-Maps-light character.
 */
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron';

export interface LivingMapCanvasProps {
  center: GeoPoint;
  restaurants: Restaurant[];
  events: MapEvent[];
  selectedId: string | null;
  onSelectRestaurant: (id: string) => void;
  /** Fired when the map itself (not a pin) is tapped — closes any open selection (SPEC-001). */
  onMapClick?: () => void;
}

interface MarkerEntry {
  marker: Marker;
  root: Root;
}

export function LivingMapCanvas({ center, restaurants, events, selectedId, onSelectRestaurant, onMapClick }: LivingMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Map<string, MarkerEntry>>(new Map());
  const onMapClickRef = useRef(onMapClick);
  onMapClickRef.current = onMapClick;
  const hasFitBoundsRef = useRef(false);

  // Map instance: created once.
  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [center.lng, center.lat],
      zoom: 14,
      attributionControl: false,
    });
    mapRef.current = map;
    // Fires on the canvas only — marker DOM elements sit outside it, so pin taps don't reach here.
    map.on('click', () => onMapClickRef.current?.());

    return () => {
      markersRef.current.forEach(({ marker, root }) => {
        // Defer unmount to avoid "synchronous unmount during render" React warnings.
        setTimeout(() => root.unmount(), 0);
        marker.remove();
      });
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
    // Only re-create the map if it doesn't exist yet — center changes shouldn't reset the view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restaurant + event markers: React components mounted into MapLibre Markers,
  // kept in sync with props without recreating the map.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const nextIds = new Set<string>();

    const upsertMarker = (id: string, position: GeoPoint, node: React.ReactNode) => {
      nextIds.add(id);
      let entry = markersRef.current.get(id);
      if (!entry) {
        const el = document.createElement('div');
        // MapLibre's click listener is bound on the canvas *container*, which
        // is an ancestor of marker elements too — without this, tapping a pin
        // both selects it and bubbles into onMapClick, which immediately
        // clears the selection again.
        el.addEventListener('click', (e) => e.stopPropagation());
        const root = createRoot(el);
        const marker = new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([position.lng, position.lat]).addTo(map);
        entry = { marker, root };
        markersRef.current.set(id, entry);
      }
      entry.root.render(node);
    };

    restaurants.forEach((r) => {
      upsertMarker(
        r.id,
        r.position,
        <MapPin type={r.type} label={r.id === selectedId || r.type === 'recommended' ? r.name : undefined} selected={r.id === selectedId} onClick={() => onSelectRestaurant(r.id)} />,
      );
    });

    events.forEach((e) => {
      upsertMarker(`event-${e.id}`, e.position, <MapPin type="event" label={`${e.name.split(' ')[0]} · ${e.when}`} dotOnly={false} />);
    });

    // Remove markers no longer present.
    markersRef.current.forEach((entry, id) => {
      if (!nextIds.has(id)) {
        setTimeout(() => entry.root.unmount(), 0);
        entry.marker.remove();
        markersRef.current.delete(id);
      }
    });

    // First load: frame every pin (Palermo/Chacarita/Villa Crespo are a few km
    // apart — a fixed zoom would leave most of them off-screen). Never re-fit
    // after that so panning/zooming the user does isn't fought.
    const points = [...restaurants.map((r) => r.position), ...events.map((e) => e.position)];
    if (!hasFitBoundsRef.current && points.length > 0) {
      hasFitBoundsRef.current = true;
      const bounds = points.reduce(
        (b, p) => b.extend([p.lng, p.lat]),
        new maplibregl.LngLatBounds([points[0].lng, points[0].lat], [points[0].lng, points[0].lat]),
      );
      map.fitBounds(bounds, { padding: { top: 140, bottom: 260, left: 60, right: 60 }, maxZoom: 15, duration: 0 });
    }
  }, [restaurants, events, selectedId, onSelectRestaurant]);

  return <div ref={containerRef} className="cj-maplibre" aria-label="Mapa de restaurantes recomendados" />;
}
