import type { ReactNode } from 'react';
import { Bookmark, Utensils } from 'lucide-react';
import { TrustMeter } from '../brain/TrustMeter';
import type { TrustLevel } from '../../types';
import './RestaurantCard.css';

export interface RestaurantCardProps {
  name: string;
  cuisine?: string;
  neighborhood?: string;
  price?: string;
  why?: ReactNode;
  image?: string;
  tags?: string[];
  badge?: ReactNode;
  trust?: TrustLevel | null;
  saved?: boolean;
  onSave?: (next: boolean) => void;
  onClick?: () => void;
  /** Row layout for map peek / chat. */
  compact?: boolean;
  className?: string;
}

/**
 * Restaurant Card — a decision surface. Leads with the Brain's one-line
 * "why", never stars/reviews (SPEC-003). Compact form is used on the map
 * peek and inside chat; full form in lists and collections.
 */
export function RestaurantCard({
  name,
  cuisine,
  neighborhood,
  price = '$$',
  why,
  image,
  tags = [],
  badge,
  trust = 'high',
  saved = false,
  onSave,
  onClick,
  compact = false,
  className = '',
}: RestaurantCardProps) {
  const meta = [cuisine, neighborhood].filter(Boolean).join(' · ');
  return (
    <div
      className={`caju-rest ${compact ? 'caju-rest--compact' : ''} ${className}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
    >
      <div className={`caju-rest__media ${image ? '' : 'caju-rest__media--ph'}`} style={image ? { backgroundImage: `url(${image})` } : undefined}>
        {!image && (
          <div className="caju-rest__ph">
            <Utensils />
          </div>
        )}
        {badge && <div className="caju-rest__badges">{badge}</div>}
        {!compact && (
          <button
            className={`caju-rest__save ${saved ? 'on' : ''}`}
            type="button"
            aria-label={saved ? 'Guardado' : 'Guardar'}
            onClick={(e) => {
              e.stopPropagation();
              onSave?.(!saved);
            }}
          >
            <Bookmark fill={saved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>
      <div className="caju-rest__body">
        <div className="caju-rest__top">
          <span className="caju-rest__name">{name}</span>
          <span className="caju-rest__price">{price}</span>
        </div>
        {meta && <div className="caju-rest__meta">{meta}</div>}
        {why && !compact && <div className="caju-rest__why">{why}</div>}
        <div className="caju-rest__foot">
          {tags.length > 0 ? (
            <div className="caju-rest__tags">
              {tags.slice(0, 3).map((t) => (
                <span className="caju-rest__tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <span />
          )}
          {trust && <TrustMeter level={trust} />}
        </div>
      </div>
    </div>
  );
}
