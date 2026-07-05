import * as React from 'react';

export type WordmarkTone = 'ink' | 'inverse' | 'mono';

/**
 * CajuEat typographic wordmark (no logo mark). Bricolage Grotesque,
 * two-tone with a caju seed accent — the brand identity for now.
 */
export interface WordmarkProps {
  /** Font size in px (the lockup scales from it). */
  size?: number;
  /** `ink` (on light), `inverse` (on dark), `mono` (single currentColor). */
  tone?: WordmarkTone;
  /** Show the caju seed accent. */
  accent?: boolean;
  as?: 'span' | 'div';
  className?: string;
}

export declare function Wordmark(props: WordmarkProps): React.JSX.Element;
