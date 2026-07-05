import type { SourceKind, SignalWeight } from '../../types';
import './SourceChip.css';

export interface SourceChipProps {
  name: string;
  kind?: SourceKind;
  weight?: SignalWeight;
  avatar?: string;
  className?: string;
}

const KIND_LABEL: Record<SourceKind, string> = {
  curator: 'Curador',
  community: 'Comunidad',
  visit: 'Tu visita',
  press: 'Prensa',
  menu: 'Menú',
};

/** One signal behind a recommendation. Dot = Trust Engine weight (SPEC-007). */
export function SourceChip({ name, kind = 'curator', weight = 'medium', avatar, className = '' }: SourceChipProps) {
  const initials = (name || '?').replace('@', '').slice(0, 2);
  return (
    <span className={`caju-source ${className}`}>
      <span className="caju-source__av" style={avatar ? { backgroundImage: `url(${avatar})` } : undefined}>
        {!avatar && initials}
      </span>
      <span className="caju-source__meta">
        <span className="caju-source__name">{name}</span>
        <span className="caju-source__kind">{KIND_LABEL[kind] ?? kind}</span>
      </span>
      <span className={`caju-source__weight caju-source__weight--${weight}`} title={`Señal ${weight}`} aria-hidden="true" />
    </span>
  );
}
