import './BrainMark.css';

export interface BrainMarkProps {
  size?: number;
  radius?: number;
  thinking?: boolean;
}

/** Lugarcito's identity motif — a sparkle/seed mark for the Brain. No logo exists; this IS it. */
export function BrainMark({ size = 38, thinking = false, radius = 12 }: BrainMarkProps) {
  return (
    <div className={`caju-mark${thinking ? ' caju-mark--thinking' : ''}`} style={{ width: size, height: size, borderRadius: radius }}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2.5c.5 3.7 2.3 5.5 6 6-3.7.5-5.5 2.3-6 6-.5-3.7-2.3-5.5-6-6 3.7-.5 5.5-2.3 6-6Z" fill="#fff" />
        <circle cx="18.5" cy="5.5" r="1.6" fill="#fff" opacity=".85" />
      </svg>
    </div>
  );
}
