import type { MapEvent } from '../types.js';

export { getCatalog, getRestaurantById, createRestaurant, updateRestaurant, addSourceToRestaurant } from './catalogStore.js';
export type { RestaurantInput } from './catalogStore.js';

export const EVENTS: MapEvent[] = [{ id: 'feria', name: 'Feria gastronómica', when: 'sáb', position: { lat: -34.585, lng: -58.43 } }];

/** Roughly centers the three fixture neighborhoods (Palermo/Chacarita/Villa Crespo). */
export const DEFAULT_MAP_CENTER = { lat: -34.592, lng: -58.439 };
