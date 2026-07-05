import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'brandGhost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

/** CajuEat primary control. One caju-filled primary per view — never a row of identical buttons (SPEC-003). */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  loading = false,
  iconLeft = null,
  iconRight = null,
  type = 'button',
  className = '',
  ...rest
}: ButtonProps) {
  const cls = ['caju-btn', `caju-btn--${variant}`, `caju-btn--${size}`, block ? 'caju-btn--block' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={cls} disabled={disabled || loading} {...rest}>
      {loading && <span className="caju-btn__spinner" aria-hidden="true" />}
      {!loading && iconLeft && <span className="caju-btn__ico">{iconLeft}</span>}
      {children && <span>{children}</span>}
      {!loading && iconRight && <span className="caju-btn__ico">{iconRight}</span>}
    </button>
  );
}
