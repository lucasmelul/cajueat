import * as React from 'react';

export type SourceKind = 'curator' | 'community' | 'visit' | 'press' | 'menu';
export type SignalWeight = 'strong' | 'medium' | 'weak';

/** One signal behind a recommendation. Dot = Trust Engine weight. */
export interface SourceChipProps {
  /** Display name, e.g. "@buenospaladaires". */
  name: string;
  kind?: SourceKind;
  weight?: SignalWeight;
  /** Optional avatar image URL. */
  avatar?: string;
  className?: string;
}

export declare function SourceChip(props: SourceChipProps): React.JSX.Element;
