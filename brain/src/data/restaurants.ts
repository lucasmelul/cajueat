export { getCatalog, getRestaurantById, createRestaurant, updateRestaurant, addSourceToRestaurant } from './catalogStore.js';
export type { RestaurantInput } from './catalogStore.js';

/** Roughly centers the three fixture neighborhoods (Palermo/Chacarita/Villa Crespo). */
export const DEFAULT_MAP_CENTER = { lat: -34.592, lng: -58.439 };
