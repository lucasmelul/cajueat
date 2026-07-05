import type { Restaurant, User, MapEvent } from '../../types';

/**
 * Sample data for local development, in the Brain's voice — not real
 * listings. Typed port of design/ui_kits/pwa/data.js, with real Buenos
 * Aires coordinates instead of the prototype's top/left percentages.
 */

export const FIXTURE_USER: User = { id: 'u1', name: 'Lucas', cajuPoints: 1240, initials: 'L' };

export const FIXTURE_RESTAURANTS: Restaurant[] = [
  {
    id: 'osaka',
    name: 'Osaka',
    cuisine: 'Nikkei',
    neighborhood: 'Palermo',
    price: '$$$',
    trust: 'high',
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
      { name: '@buenospaladaires', kind: 'curator', weight: 'strong' },
      { name: 'Tu visita', kind: 'visit', weight: 'strong' },
      { name: '42 personas', kind: 'community', weight: 'medium' },
    ],
  },
  {
    id: 'anafe',
    name: 'Anafe',
    cuisine: 'Bodegón moderno',
    neighborhood: 'Chacarita',
    price: '$$',
    trust: 'mid',
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
    sources: [
      { name: '@salt_argentina', kind: 'curator', weight: 'medium' },
      { name: '18 personas', kind: 'community', weight: 'medium' },
    ],
  },
  {
    id: 'cuervo',
    name: 'Cuervo Café',
    cuisine: 'Café de especialidad',
    neighborhood: 'Villa Crespo',
    price: '$',
    trust: 'high',
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
      { name: 'Tu visita', kind: 'visit', weight: 'strong' },
      { name: '9 personas', kind: 'community', weight: 'weak' },
    ],
  },
];

export const FIXTURE_EVENTS: MapEvent[] = [
  { id: 'feria', name: 'Feria gastronómica', when: 'sáb', position: { lat: -34.585, lng: -58.43 } },
];

/** Roughly centers the three fixture neighborhoods (Palermo/Chacarita/Villa Crespo). */
export const DEFAULT_MAP_CENTER = { lat: -34.592, lng: -58.439 };
