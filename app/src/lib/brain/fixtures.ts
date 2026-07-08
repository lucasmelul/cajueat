import type { Restaurant, User, MapEvent } from '../../types';

/**
 * Sample data for local development, in the Brain's voice — not real
 * listings. Typed port of design/ui_kits/pwa/data.js, with real Buenos
 * Aires coordinates instead of the prototype's top/left percentages.
 */

export const FIXTURE_USER: User = { id: 'u1', name: 'Lucas', cajuPoints: 1240, initials: 'L', onboarded: false };

export const FIXTURE_RESTAURANTS: Restaurant[] = [
  {
    id: 'osaka',
    name: 'Osaka',
    cuisine: 'Nikkei',
    neighborhood: 'Palermo',
    price: '$$$',
    trust: 'high',
    trustRationale: 'Confianza alta: coincide tu visita, un curador de confianza y decenas de personas.',
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
      { name: '@buenospaladaires', kind: 'curator', weight: 'strong', capturedAt: '2026-06-01T00:00:00.000Z', claim: 'Excelente para una primera cita' },
      { name: 'Tu visita', kind: 'visit', weight: 'strong', capturedAt: '2026-06-01T00:00:00.000Z', claim: 'Ideal para ir en pareja' },
      { name: '42 personas', kind: 'community', weight: 'medium', capturedAt: '2026-06-01T00:00:00.000Z', claim: 'Buen lugar para ir de a dos' },
    ],
  },
  {
    id: 'anafe',
    name: 'Anafe',
    cuisine: 'Bodegón moderno',
    neighborhood: 'Chacarita',
    price: '$$',
    trust: 'low',
    trustRationale:
      'Señales en conflicto: un curador dice que es tranquilo, pero la comunidad dice que es ruidoso los fines de semana. Todavía no es concluyente.',
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
      { name: '@salt_argentina', kind: 'curator', weight: 'medium', capturedAt: '2026-06-01T00:00:00.000Z', claim: 'Ambiente tranquilo, bueno para charlar' },
      { name: '18 personas', kind: 'community', weight: 'medium', capturedAt: '2026-06-01T00:00:00.000Z', claim: 'Bastante ruidoso los fines de semana' },
    ],
  },
  {
    id: 'cuervo',
    name: 'Cuervo Café',
    cuisine: 'Café de especialidad',
    neighborhood: 'Villa Crespo',
    price: '$',
    trust: 'mid',
    trustRationale: 'Confianza media: respaldado por tu visita y algunas personas de la comunidad.',
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
      { name: 'Tu visita', kind: 'visit', weight: 'strong', capturedAt: '2026-06-01T00:00:00.000Z' },
      { name: '9 personas', kind: 'community', weight: 'weak', capturedAt: '2026-06-01T00:00:00.000Z' },
    ],
  },
  {
    id: 'nonna',
    name: 'Nonna Emma',
    cuisine: 'Trattoria italiana',
    neighborhood: 'San Telmo',
    price: '$$',
    trust: 'high',
    trustRationale: 'Confianza alta: coincide tu visita, un curador de confianza y varias personas.',
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
      { name: '@buenospaladaires', kind: 'curator', weight: 'strong', capturedAt: '2026-06-01T00:00:00.000Z' },
      { name: 'Tu visita', kind: 'visit', weight: 'strong', capturedAt: '2026-06-01T00:00:00.000Z' },
      { name: '21 personas', kind: 'community', weight: 'medium', capturedAt: '2026-06-01T00:00:00.000Z' },
    ],
  },
  {
    id: 'terraza',
    name: 'Terraza Norte',
    cuisine: 'Parrilla',
    neighborhood: 'Belgrano',
    price: '$$$',
    trust: 'low',
    trustRationale: 'Confianza baja: la evidencia todavía es escasa — solo un curador y un grupo chico de la comunidad.',
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
    sources: [
      { name: '@salt_argentina', kind: 'curator', weight: 'weak', capturedAt: '2026-06-01T00:00:00.000Z' },
      { name: '27 personas', kind: 'community', weight: 'medium', capturedAt: '2026-06-01T00:00:00.000Z' },
    ],
  },
  {
    id: 'brote',
    name: 'Brote',
    cuisine: 'Vegetariana',
    neighborhood: 'Colegiales',
    price: '$$',
    trust: 'low',
    trustRationale: 'Confianza baja: todavía no tenemos evidencia suficiente, solo un puñado de opiniones.',
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
    sources: [{ name: '12 personas', kind: 'community', weight: 'weak', capturedAt: '2026-06-01T00:00:00.000Z' }],
  },
];

export const FIXTURE_EVENTS: MapEvent[] = [
  { id: 'feria', name: 'Feria gastronómica', when: 'sáb', whenAt: '2026-07-11T18:00:00-03:00', position: { lat: -34.585, lng: -58.43 } },
];

/** Roughly centers the three fixture neighborhoods (Palermo/Chacarita/Villa Crespo). */
export const DEFAULT_MAP_CENTER = { lat: -34.592, lng: -58.439 };
