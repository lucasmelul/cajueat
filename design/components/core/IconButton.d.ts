import * as React from 'react';

export type IconButtonVariant = 'default' | 'plain' | 'float' | 'brand';
export type IconButtonSize = 'sm' | 'md' | 'lg';

/**
 * Circular icon-only control. `float` is the map's lifted-paper
 * button (location, recenter); `brand` is the caju send/action.
 */
export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Icon node (usually a 20px line icon). */
  icon: React.ReactNode;
  /** Accessible label — required (icon-only). */
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

export declare function IconButton(props: IconButtonProps): React.JSX.Element;
