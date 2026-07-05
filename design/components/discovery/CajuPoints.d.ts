import * as React from 'react';

export type CajuPointsSize = 'sm' | 'md' | 'lg';

/** Caju Points — value contributed to the Brain (knowledge, not vanity). */
export interface CajuPointsProps {
  value: number | string;
  /** Positive delta shown as "+N" after a contribution. */
  delta?: number | null;
  /** Unit label, e.g. "puntos". */
  unit?: string | null;
  size?: CajuPointsSize;
  /** Render inside a caju-wash chip. */
  chip?: boolean;
  className?: string;
}

export declare function CajuPoints(props: CajuPointsProps): React.JSX.Element;
