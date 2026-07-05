import * as React from 'react';

/**
 * Brain Card — the single floating card over the Living Map.
 *
 * @startingPoint section="Brain" subtitle="The floating Brain message over the map" viewport="700x260"
 */
export interface BrainCardProps {
  /** Mono eyebrow, e.g. "CAJU · RECOMENDACIÓN". */
  eyebrow?: React.ReactNode;
  /** The Brain's message. Wrap key phrases in <b> for a caju highlight. */
  message: React.ReactNode;
  /** Optional supporting line (sans, secondary). */
  sub?: React.ReactNode;
  /** Animate the mark while the Brain is reasoning. */
  thinking?: boolean;
  /** Action buttons row. */
  actions?: React.ReactNode;
  /** Small icon in the eyebrow. */
  icon?: React.ReactNode;
  className?: string;
}

export declare function BrainCard(props: BrainCardProps): React.JSX.Element;

export interface BrainMarkProps {
  size?: number;
  radius?: number;
  thinking?: boolean;
}
/** CajuEat's identity motif — a sparkle/seed mark for the Brain. */
export declare function BrainMark(props: BrainMarkProps): React.JSX.Element;
