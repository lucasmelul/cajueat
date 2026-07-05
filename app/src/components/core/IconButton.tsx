import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './IconButton.css';

export type IconButtonVariant = 'default' | 'plain' | 'float' | 'brand';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  icon: ReactNode;
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

/**
 * Circular icon-only control. `float` is the map's lifted-paper button
 * (location, recenter); `brand` is the caju send/action.
 */
export function IconButton({
  icon,
  label,
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
  ...rest
}: IconButtonProps) {
  const variantClass = variant === 'default' ? '' : `caju-iconbtn--${variant}`;
  const cls = ['caju-iconbtn', `caju-iconbtn--${size}`, variantClass, className].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} aria-label={label} title={label} disabled={disabled} {...rest}>
      {icon}
    </button>
  );
}
