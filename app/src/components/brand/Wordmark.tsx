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
 * Lugarcito wordmark — the typographic brand lockup (no logo mark). "Lugar" in
 * ink, "cito" in caju, with a map-pin + coffee-cup glyph — the gastronomic
 * "little place" mark. This IS the identity until a real mark exists
 * (design/HANDOFF_CLAUDE_CODE.md: "No logo").
 */
export function Wordmark({ size = 28, tone = 'ink', accent = true, as = 'span', className = '' }: WordmarkProps) {
  const Tag = as as ElementType;
  const cls = ['lg-wm', tone !== 'ink' ? `lg-wm--${tone}` : '', className].filter(Boolean).join(' ');
  return (
    <Tag className={cls} style={{ fontSize: size }} aria-label="Lugarcito" role="img">
      <span className="lg-wm__a">Lugar</span>
      <span className="lg-wm__b">cito</span>
      {accent && (
        <svg className="lg-wm__mark" viewBox="0 0 24 24" aria-hidden="true">
          <path
            className="lg-pin"
            d="M12 21S5 14.8 5 9.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"
            fill="none"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <rect className="lg-cup" x="8.3" y="7.6" width="6.4" height="4.6" rx="1.3" />
          <path className="lg-handle" d="M14.9 8.6c1.1 0 1.9.8 1.9 1.8s-.8 1.8-1.9 1.8" fill="none" strokeWidth="1.1" />
        </svg>
      )}
    </Tag>
  );
}
