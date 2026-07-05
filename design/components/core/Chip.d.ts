import * as React from 'react';

/**
 * Context Chip — selectable pill for switching map/query context.
 *
 * @startingPoint section="Core" subtitle="Selectable context pills over the map" viewport="700x140"
 */
export interface ChipProps {
  children: React.ReactNode;
  /** Selected (filled) state. */
  selected?: boolean;
  /** Use caju fill instead of ink when selected. */
  brand?: boolean;
  /** Leading icon (15px). */
  icon?: React.ReactNode;
  /** Render as a non-interactive tag. */
  as?: 'button' | 'span';
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export declare function Chip(props: ChipProps): React.JSX.Element;
