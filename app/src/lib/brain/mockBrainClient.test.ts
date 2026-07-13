import { describe, expect, it } from 'vitest';
import { mockBrainClient } from './mockBrainClient';

describe('mockBrainClient', () => {
  it('always returns at least one recommendation with an explanation', async () => {
    const { brainCard, restaurants } = await mockBrainClient.getRecommendations();
    expect(restaurants.length).toBeGreaterThan(0);
    expect(brainCard).not.toBeNull();
    expect(brainCard!.message).toBeTruthy();
    expect(brainCard!.restaurantId).toBe(restaurants[0].id);
  });

  it('resolves a restaurant by id', async () => {
    const restaurant = await mockBrainClient.getRestaurant('osaka');
    expect(restaurant?.name).toBe('Osaka');
  });

  it('never leaves a conversational message without a reply', async () => {
    const turn = await mockBrainClient.sendMessage({ text: 'no sé qué comer', history: [] });
    expect(turn.role).toBe('brain');
    expect(turn.text).toBeTruthy();
    expect(turn.restaurants?.length).toBeGreaterThan(0);
  });
});
