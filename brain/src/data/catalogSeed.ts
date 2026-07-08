import type { Restaurant, Source } from '../types.js';

/** Seed data materialized into brain/data/catalog.json the first time the service boots with no catalog file yet (SPEC-018 — the source of truth moves to that JSON, this only bootstraps it). */
export type RawRestaurant = Omit<Restaurant, 'trust' | 'trustRationale'>;

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

const src = (name: string, kind: Source['kind'], weight: Source['weight'], capturedDaysAgo: number, claim?: string): Source => ({
  name,
  kind,
  weight,
  capturedAt: daysAgo(capturedDaysAgo),
  ...(claim ? { claim } : {}),
});

export const CATALOG_SEED: RawRestaurant[] = [
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
      src('@buenospaladaires', 'curator', 'strong', 40, 'Excelente para una primera cita'),
      src('Tu visita', 'visit', 'strong', 10, 'Ideal para ir en pareja'),
      src('Comunidad', 'community', 'medium', 20, 'Buen lugar para ir de a dos'),
    ],
    // Barra nikkei de cena — cierra los lunes, como la mayoría de sus pares en Palermo.
    openHours: [{ days: [2, 3, 4, 5, 6, 0], from: '20:00', to: '00:00' }],
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
    sources: [
      src('@salt_argentina', 'curator', 'medium', 200, 'Ambiente tranquilo, bueno para charlar'),
      src('Comunidad', 'community', 'medium', 15, 'Bastante ruidoso los fines de semana'),
    ],
    // Bodegón de cena, martes a domingo — cierra los lunes.
    openHours: [{ days: [2, 3, 4, 5, 6, 0], from: '20:00', to: '00:30' }],
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
      src('Comunidad', 'community', 'weak', 30),
      src('@buenospaladaires', 'curator', 'medium', 60),
    ],
    // Café de mañana, todos los días — "el mejor momento es antes del mediodía".
    openHours: [{ days: [0, 1, 2, 3, 4, 5, 6], from: '08:00', to: '18:00' }],
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
      src('Comunidad', 'community', 'medium', 10),
    ],
    // Trattoria de cena romántica, miércoles a domingo.
    openHours: [{ days: [3, 4, 5, 6, 0], from: '20:00', to: '00:00' }],
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
    ],
    order: [
      { when: 'Para compartir', dish: 'El asado de tira para el medio de la mesa.' },
      { when: 'Si sos vegetariano', dish: 'La provoleta y las verduras a las brasas.' },
    ],
    tips: ['Andá con hambre', 'Pedí mesa en la terraza si el clima acompaña'],
    idealFor: ['Grupos grandes', 'Cumpleaños', 'Después del trabajo'],
    notFor: ['Charla tranquila', 'Primera cita'],
    sources: [src('@salt_argentina', 'curator', 'weak', 90), src('Comunidad', 'community', 'medium', 10)],
    // Parrilla con terraza — almuerzo y cena, jueves a domingo (el resto de la semana, cerrada).
    openHours: [
      { days: [4, 5, 6, 0], from: '12:00', to: '16:00' },
      { days: [4, 5, 6, 0], from: '20:00', to: '00:30' },
    ],
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
    ],
    order: [
      { when: 'Para almorzar liviano', dish: 'El bowl de garbanzos y vegetales asados.' },
      { when: 'Si tenés apuro', dish: 'El sándwich de portobello para llevar.' },
    ],
    tips: ['Las mesas del fondo tienen mejor luz', 'Pedí el wifi en la barra'],
    idealFor: ['Trabajar solo', 'Reuniones cortas', 'Almuerzo liviano'],
    notFor: ['Cena', 'Grupos grandes'],
    sources: [src('Comunidad', 'community', 'weak', 8)],
    // Café/almuerzo de días de semana — pensado para trabajar, no abre fines de semana.
    openHours: [{ days: [1, 2, 3, 4, 5], from: '08:00', to: '17:00' }],
  },
];
