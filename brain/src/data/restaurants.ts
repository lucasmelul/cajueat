import { computeTrust } from '../trust/trustEngine.js';
import type { MapEvent, Restaurant, Source } from '../types.js';

/**
 * The Brain's knowledge base — moved here from cajueat/app/src/lib/brain/fixtures.ts.
 * Real ingestion (SPEC-004's full pipeline) doesn't exist yet, so this is
 * still a small hand-authored catalog, but `trust`/`trustRationale` are no
 * longer hardcoded: they're computed from `sources` by the Trust Engine
 * every time the catalog is read (see `getCatalog`).
 */

type RawRestaurant = Omit<Restaurant, 'trust' | 'trustRationale'>;

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

const src = (name: string, kind: Source['kind'], weight: Source['weight'], capturedDaysAgo: number): Source => ({
  name,
  kind,
  weight,
  capturedAt: daysAgo(capturedDaysAgo),
});

const RAW_RESTAURANTS: RawRestaurant[] = [
  {
    id: 'osaka',
    name: 'Osaka',
    cuisine: 'Nikkei',
    neighborhood: 'Palermo',
    price: '$$$',
    type: 'recommended',
    why: 'Barra japonesa clásica, con foco total en el producto.',
    tags: ['En pareja', 'Reserva', '40 min'],
    personality: ['Elegante', 'Minimalista', 'Íntimo', 'Tradicional'],
    position: { lat: -34.5885, lng: -58.4234 },
    summary:
      'Una barra nikkei donde el foco está completamente puesto en el producto. Ideal para quienes buscan pescado impecable sin fusiones ruidosas.',
    quickFacts: [
      { icon: 'wallet', label: '$$$' },
      { icon: 'heart', label: 'Ideal en pareja' },
      { icon: 'armchair', label: 'Excelente barra' },
      { icon: 'calendar-check', label: 'Reserva recomendada' },
      { icon: 'clock', label: '40 min promedio' },
      { icon: 'circle-check', label: 'Abierto ahora' },
    ],
    order: [
      { when: 'Si vas por primera vez', dish: 'Pedí el omakase corto de la barra.' },
      { when: 'Si te gusta el atún', dish: 'No te pierdas el tiradito de toro.' },
      { when: 'Si buscás algo liviano', dish: 'Probá los niguiris de pesca del día.' },
    ],
    tips: ['Sentate en la barra', 'No vayas sin reserva', 'El postre vale la pena'],
    idealFor: ['Primera cita', 'Ocasión especial', 'Solo en la barra'],
    notFor: ['Grupos grandes', 'Ir con chicos'],
    sources: [
      src('@buenospaladaires', 'curator', 'strong', 40),
      src('Tu visita', 'visit', 'strong', 10),
      src('42 personas', 'community', 'medium', 20),
    ],
  },
  {
    id: 'anafe',
    name: 'Anafe',
    cuisine: 'Bodegón moderno',
    neighborhood: 'Chacarita',
    price: '$$',
    type: 'new',
    why: 'Cocina de estación en un salón chico y cálido. Cambia seguido.',
    tags: ['Grupos', 'Sin reserva', 'Ruidoso'],
    personality: ['Cálido', 'Animado', 'De barrio', 'Sin vueltas'],
    position: { lat: -34.5875, lng: -58.4537 },
    summary:
      'Un bodegón reinterpretado: pocos platos, muy de estación, en un salón cálido y algo ruidoso. Va bien para una salida relajada entre amigos.',
    quickFacts: [
      { icon: 'wallet', label: '$$' },
      { icon: 'users', label: 'Bueno en grupo' },
      { icon: 'volume-2', label: 'Ambiente animado' },
      { icon: 'clock', label: 'Sin reserva' },
    ],
    order: [
      { when: 'Para compartir', dish: 'Arrancá con las entradas del día.' },
      { when: 'Si hay pesca', dish: 'Pedila, cambia todas las semanas.' },
    ],
    tips: ['Andá temprano', 'Preguntá el fuera de carta'],
    idealFor: ['Amigos', 'Después del trabajo'],
    notFor: ['Charla tranquila', 'Reuniones de negocios'],
    sources: [src('@salt_argentina', 'curator', 'medium', 200), src('18 personas', 'community', 'medium', 15)],
  },
  {
    id: 'cuervo',
    name: 'Cuervo Café',
    cuisine: 'Café de especialidad',
    neighborhood: 'Villa Crespo',
    price: '$',
    type: 'saved',
    why: 'De los mejores espresso del oeste. Tranquilo para trabajar de mañana.',
    tags: ['Para trabajar', 'Mañanas', 'Wifi'],
    personality: ['Tranquilo', 'Luminoso', 'Chico', 'De especialidad'],
    position: { lat: -34.5998, lng: -58.4396 },
    summary: 'Café chico de especialidad, callado y luminoso. El mejor momento es antes del mediodía.',
    quickFacts: [
      { icon: 'wallet', label: '$' },
      { icon: 'laptop', label: 'Bueno para trabajar' },
      { icon: 'sun', label: 'Mejor de mañana' },
    ],
    order: [{ when: 'Si te gusta el café', dish: 'Pedí el filtrado del día.' }],
    tips: ['Andá temprano', 'Probá la medialuna'],
    idealFor: ['Trabajar solo', 'Café tranquilo'],
    notFor: ['Cena', 'Grupos'],
    sources: [
      src('Tu visita', 'visit', 'strong', 5),
      src('9 personas', 'community', 'weak', 30),
      src('@buenospaladaires', 'curator', 'medium', 60),
    ],
  },
  {
    id: 'nonna',
    name: 'Nonna Emma',
    cuisine: 'Trattoria italiana',
    neighborhood: 'San Telmo',
    price: '$$',
    type: 'new',
    why: 'Pastas caseras y vinos naturales en un salón con historia, ideal para una cena tranquila.',
    tags: ['En pareja', 'Velas', 'Vinos naturales'],
    personality: ['Íntimo', 'Romántico', 'Rústico', 'Con historia'],
    position: { lat: -34.6212, lng: -58.3731 },
    summary:
      'Una trattoria de barrio con pastas hechas a mano y una carta de vinos naturales corta pero cuidada. El salón es chico, con velas, pensado para charlar sin apuro.',
    quickFacts: [
      { icon: 'wallet', label: '$$' },
      { icon: 'heart', label: 'Ideal en pareja' },
      { icon: 'calendar-check', label: 'Reserva recomendada' },
      { icon: 'clock', label: '50 min promedio' },
    ],
    order: [
      { when: 'Para arrancar', dish: 'Pedí la burrata con tomates asados.' },
      { when: 'El plato fuerte', dish: 'Los sorrentinos de jamón crudo son la estrella.' },
    ],
    tips: ['Reservá con anticipación los fines de semana', 'La carta de vinos cambia seguido, preguntale al mozo'],
    idealFor: ['Primera cita', 'Cena romántica', 'Aniversario'],
    notFor: ['Grupos grandes', 'Ir con apuro'],
    sources: [
      src('@buenospaladaires', 'curator', 'strong', 15),
      src('Tu visita', 'visit', 'strong', 3),
      src('21 personas', 'community', 'medium', 10),
    ],
  },
  {
    id: 'terraza',
    name: 'Terraza Norte',
    cuisine: 'Parrilla',
    neighborhood: 'Belgrano',
    price: '$$$',
    type: 'recommended',
    why: 'Parrilla grande con terraza al aire libre, perfecta para grupos numerosos.',
    tags: ['Grupos', 'Terraza', 'Sin reserva'],
    personality: ['Animado', 'Grande', 'Con vista', 'Informal'],
    position: { lat: -34.5627, lng: -58.4583 },
    summary:
      'Una parrilla amplia con terraza al aire libre, pensada para cumpleaños y salidas grandes: mesas largas, buena carne y ambiente ruidoso y divertido.',
    quickFacts: [
      { icon: 'wallet', label: '$$$' },
      { icon: 'users', label: 'Bueno en grupo' },
      { icon: 'volume-2', label: 'Ambiente animado' },
      { icon: 'circle-check', label: 'Abierto ahora' },
    ],
    order: [
      { when: 'Para compartir', dish: 'El asado de tira para el medio de la mesa.' },
      { when: 'Si sos vegetariano', dish: 'La provoleta y las verduras a las brasas.' },
    ],
    tips: ['Andá con hambre', 'Pedí mesa en la terraza si el clima acompaña'],
    idealFor: ['Grupos grandes', 'Cumpleaños', 'Después del trabajo'],
    notFor: ['Charla tranquila', 'Primera cita'],
    sources: [src('@salt_argentina', 'curator', 'weak', 90), src('27 personas', 'community', 'medium', 10)],
  },
  {
    id: 'brote',
    name: 'Brote',
    cuisine: 'Vegetariana',
    neighborhood: 'Colegiales',
    price: '$$',
    type: 'new',
    why: 'Cocina vegetariana liviana, con mesas altas pensadas para laptop y buen wifi.',
    tags: ['Para trabajar', 'Wifi', 'Enchufes'],
    personality: ['Luminoso', 'Moderno', 'Verde', 'Tranquilo'],
    position: { lat: -34.5755, lng: -58.4497 },
    summary:
      'Un local chico de cocina vegetariana con mesas altas, buen wifi y enchufes en cada mesa. Ideal para pasar la mañana trabajando con un café de por medio.',
    quickFacts: [
      { icon: 'wallet', label: '$$' },
      { icon: 'laptop', label: 'Bueno para trabajar' },
      { icon: 'sun', label: 'Mejor de mañana' },
      { icon: 'circle-check', label: 'Abierto ahora' },
    ],
    order: [
      { when: 'Para almorzar liviano', dish: 'El bowl de garbanzos y vegetales asados.' },
      { when: 'Si tenés apuro', dish: 'El sándwich de portobello para llevar.' },
    ],
    tips: ['Las mesas del fondo tienen mejor luz', 'Pedí el wifi en la barra'],
    idealFor: ['Trabajar solo', 'Reuniones cortas', 'Almuerzo liviano'],
    notFor: ['Cena', 'Grupos grandes'],
    sources: [src('12 personas', 'community', 'weak', 8)],
  },
];

export const EVENTS: MapEvent[] = [{ id: 'feria', name: 'Feria gastronómica', when: 'sáb', position: { lat: -34.585, lng: -58.43 } }];

/** Roughly centers the three fixture neighborhoods (Palermo/Chacarita/Villa Crespo). */
export const DEFAULT_MAP_CENTER = { lat: -34.592, lng: -58.439 };

let cachedCatalog: Restaurant[] | null = null;

/** Every restaurant, with trust computed fresh from its sources (not stored). */
export function getCatalog(): Restaurant[] {
  if (!cachedCatalog) {
    cachedCatalog = RAW_RESTAURANTS.map((raw) => {
      const { level, rationale } = computeTrust(raw.sources);
      return { ...raw, trust: level, trustRationale: rationale };
    });
  }
  return cachedCatalog;
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return getCatalog().find((r) => r.id === id);
}
