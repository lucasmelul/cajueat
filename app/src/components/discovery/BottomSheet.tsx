import type { ReactNode } from 'react';
import './BottomSheet.css';

export type SheetState = 'peek' | 'half' | 'full';

export interface BottomSheetProps {
  state?: SheetState;
  onGrip?: () => void;
  height?: string | null;
  children?: ReactNode;
  className?: string;
}

const HEIGHTS: Record<SheetState, string> = { peek: 'var(--sheet-peek)', half: '52%', full: '92%' };

/**
 * Bottom Sheet — on-demand map surface with peek/half/full snaps (SPEC-001).
 * The map stays visible behind it. Placed inside a `position: relative` map container.
 */
export function BottomSheet({ state = 'half', onGrip, children, height, className = '' }: BottomSheetProps) {
  return (
    <div className={`caju-sheet ${className}`} style={{ height: height || HEIGHTS[state] || HEIGHTS.half }}>
      <div className="caju-sheet__grip" onClick={onGrip} role="button" aria-label="Mover panel" tabIndex={0} />
      <div className="caju-sheet__scroll">{children}</div>
    </div>
  );
}
