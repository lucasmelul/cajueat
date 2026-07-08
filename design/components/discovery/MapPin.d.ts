import * as React from 'react';

export type PinType = 'recommended' | 'new' | 'saved' | 'visited' | 'event' | 'collection';

/** Typed map marker. Labelled = Brain's pick; dot-only = secondary. */
export interface MapPinProps {
  type?: PinType;
  /** Short label (main pins only). */
  label?: string;
  /** Selected → grows + caju ring (SPEC-001 "pin crece"). */
  selected?: boolean;
  /** Force the compact dot form even with a label. */
  dotOnly?: boolean;
  /** Amber content ring — signals new Instagram activity (SPEC-024). */
  novelty?: boolean;
  onClick?: () => void;
  className?: string;
}

export declare function MapPin(props: MapPinProps): React.JSX.Element;
