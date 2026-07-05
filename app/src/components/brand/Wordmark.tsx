import type { ElementType } from 'react';
import './Wordmark.css';

export type WordmarkTone = 'ink' | 'inverse' | 'mono';

export interface WordmarkProps {
  size?: number;
  tone?: WordmarkTone;
  accent?: boolean;
  as?: 'span' | 'div';
  className?: string;
}

/**
 * CajuEat wordmark — the typographic brand lockup (no logo mark). "Caju" in
 * ink, "Eat" in caju, with a small caju seed accent. This IS the identity
 * until a real mark exists (design/HANDOFF_CLAUDE_CODE.md: "No logo").
 */
export function Wordmark({ size = 28, tone = 'ink', accent = true, as = 'span', className = '' }: WordmarkProps) {
  const Tag = as as ElementType;
  const cls = ['caju-wm', tone !== 'ink' ? `caju-wm--${tone}` : '', className].filter(Boolean).join(' ');
  return (
    <Tag className={cls} style={{ fontSize: size }} aria-label="CajuEat" role="img">
      <span className="caju-wm__a">Caju</span>
      <span className="caju-wm__b">Eat</span>
      {accent && (
        <svg className="caju-wm__seed" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.5c.5 3.7 2.3 5.5 6 6-3.7.5-5.5 2.3-6 6-.5-3.7-2.3-5.5-6-6 3.7-.5 5.5-2.3 6-6Z" />
        </svg>
      )}
    </Tag>
  );
}
