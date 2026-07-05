import * as React from 'react';

export type BadgeTone = 'neutral' | 'brand' | 'new' | 'success' | 'danger' | 'over';

/** Small status label / eyebrow. Tones follow the trust palette. */
export interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  /** Leading dot in the current color. */
  dot?: boolean;
  className?: string;
}

export declare function Badge(props: BadgeProps): React.JSX.Element;
