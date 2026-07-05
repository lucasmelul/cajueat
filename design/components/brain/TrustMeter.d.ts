import * as React from 'react';

export type TrustLevel = 'high' | 'mid' | 'low';

/**
 * Trust Meter — visual expression of the Trust Engine. `low` =
 * contradictory/insufficient signals (honesty), never "bad place".
 */
export interface TrustMeterProps {
  level?: TrustLevel;
  /** Override the natural-language label. */
  label?: React.ReactNode;
  /** Render inside a tinted pill. */
  pill?: boolean;
  className?: string;
}

export declare function TrustMeter(props: TrustMeterProps): React.JSX.Element;
