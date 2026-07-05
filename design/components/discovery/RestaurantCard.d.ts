import * as React from 'react';
import { TrustLevel } from '../brain/TrustMeter';

/**
 * Restaurant Card — a decision surface. Leads with the Brain's
 * one-line "why", never stars/reviews (SPEC-003).
 *
 * @startingPoint section="Discovery" subtitle="Restaurant as a decision, not a directory row" viewport="700x420"
 */
export interface RestaurantCardProps {
  name: string;
  cuisine?: string;
  neighborhood?: string;
  /** Price band, e.g. "$$" / "$$$". */
  price?: string;
  /** The Brain's one-line reason to go (serif). Hidden when compact. */
  why?: React.ReactNode;
  /** Cover image URL. Falls back to a warm caju placeholder. */
  image?: string;
  /** Up to 3 quick-fact tags. */
  tags?: string[];
  /** Corner badge node (e.g. <Badge tone="new">Nuevo</Badge>). */
  badge?: React.ReactNode;
  /** Trust level for the inline meter, or null to hide. */
  trust?: TrustLevel | null;
  saved?: boolean;
  onSave?: (next: boolean) => void;
  onClick?: () => void;
  /** Row layout for map peek / chat. */
  compact?: boolean;
  className?: string;
}

export declare function RestaurantCard(props: RestaurantCardProps): React.JSX.Element;
