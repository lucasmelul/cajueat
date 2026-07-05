import * as React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'brandGhost';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * CajuEat primary action control.
 *
 * @startingPoint section="Core" subtitle="Caju-filled primary + secondary/ghost variants" viewport="700x180"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. Only ONE `primary` per view (SPEC-003). */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to container width (common in bottom sheets). */
  block?: boolean;
  /** Show a spinner and disable interaction. */
  loading?: boolean;
  /** Icon node (18px) before the label. */
  iconLeft?: React.ReactNode;
  /** Icon node (18px) after the label. */
  iconRight?: React.ReactNode;
}

export declare function Button(props: ButtonProps): React.JSX.Element;
