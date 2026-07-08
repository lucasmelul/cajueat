import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';
import type { CuratorRecord, NewPlaceSuggestion, PendingContribution } from '../../lib/admin/adminClient';
import type { MapEvent, Restaurant } from '../../types';

/**
 * Shared data for every /admin/* page — fetched once by AdminLayout, not
 * re-fetched per page. Several actions (confirming a source, linking a
 * restaurant to Google) change trust/catalog state that more than one page
 * displays, so `loadAll` is exposed for pages to trigger a full refetch
 * rather than each page owning a parallel copy of the same fetch logic.
 */
export interface AdminData {
  catalog: Restaurant[];
  curators: CuratorRecord[];
  pendingContributions: PendingContribution[];
  pendingNewPlaces: NewPlaceSuggestion[];
  events: MapEvent[];
  loadAll: () => Promise<void>;
  setPendingContributions: Dispatch<SetStateAction<PendingContribution[]>>;
  setPendingNewPlaces: Dispatch<SetStateAction<NewPlaceSuggestion[]>>;
  setEvents: Dispatch<SetStateAction<MapEvent[]>>;
}

export const AdminDataContext = createContext<AdminData | null>(null);

export function useAdminData(): AdminData {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used within AdminLayout');
  return ctx;
}
